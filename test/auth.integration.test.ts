import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { AddressInfo } from "net";

jest.mock("uuid", () => ({
  v4: () => "00000000-0000-4000-8000-000000000001",
}));

import routes from "../src/routes";
import requestLogger from "../src/middleware/requestLogger";
import { HTTPException } from "../src/util/exceptions/http-exceptions/HTTPExceptions";
import { createRepository } from "../src/repository/sqlite/User.repository";
import { ConnectionManager } from "../src/repository/sqlite/ConnectionManager";

function createTestApp() {
  const app = express();
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors({ origin: "*" }));
  app.use(requestLogger);
  app.use(cookieParser());
  app.use("/", routes);

  app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (err instanceof HTTPException) {
        const httpException = err as HTTPException;
        res.status(httpException.status).json({
          message: httpException.message,
          details: httpException.details || "No details provided",
        });
      } else {
        res.status(500).json({
          message: "Internal Server Error",
        });
      }
    },
  );

  return app;
}

type RequestOptions = {
  method: string;
  path: string;
  body?: Record<string, unknown>;
  cookie?: string;
};

function makeRequest(
  port: number,
  options: RequestOptions,
): Promise<{ status: number; body: any; setCookie: string[] }> {
  return new Promise((resolve, reject) => {
    const payload = options.body ? JSON.stringify(options.body) : undefined;
    const req = http.request(
      {
        host: "127.0.0.1",
        port,
        path: options.path,
        method: options.method,
        headers: {
          "Content-Type": "application/json",
          ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
          ...(options.cookie ? { Cookie: options.cookie } : {}),
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk;
        });
        res.on("end", () => {
          const parsed = raw ? JSON.parse(raw) : {};
          const headerCookie = res.headers["set-cookie"];
          const setCookie = Array.isArray(headerCookie)
            ? headerCookie
            : headerCookie
              ? [headerCookie]
              : [];

          resolve({
            status: res.statusCode || 0,
            body: parsed,
            setCookie,
          });
        });
      },
    );

    req.on("error", reject);

    if (payload) {
      req.write(payload);
    }

    req.end();
  });
}

function toCookieHeader(setCookie: string[]): string {
  return setCookie.map((cookie) => cookie.split(";")[0]).join("; ");
}

describe("Auth Integration", () => {
  let server: http.Server;
  let port: number;

  beforeAll(async () => {
    await createRepository();
    const app = createTestApp();
    server = app.listen(0);
    await new Promise<void>((resolve) => {
      server.on("listening", () => resolve());
    });
    port = (server.address() as AddressInfo).port;
  });

  beforeEach(async () => {
    const db = await ConnectionManager.getConnection();
    await db.run("DELETE FROM users");
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    const db = await ConnectionManager.getConnection();
    await db.close();
  });

  it("registers, logs in, accesses /users/me, then logs out", async () => {
    const registerRes = await makeRequest(port, {
      method: "POST",
      path: "/auth/register",
      body: {
        name: "Integration User",
        email: "integration@example.com",
        password: "secret123",
      },
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.user.email).toBe("integration@example.com");

    const loginRes = await makeRequest(port, {
      method: "POST",
      path: "/auth/login",
      body: {
        email: "integration@example.com",
        password: "secret123",
      },
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.message).toBe("Login Successful");
    expect(loginRes.setCookie.length).toBeGreaterThanOrEqual(2);

    const cookieHeader = toCookieHeader(loginRes.setCookie);

    const meRes = await makeRequest(port, {
      method: "GET",
      path: "/users/me",
      cookie: cookieHeader,
    });

    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe("integration@example.com");

    const logoutRes = await makeRequest(port, {
      method: "GET",
      path: "/auth/logout",
      cookie: cookieHeader,
    });

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.message).toBe("Logout Successful");
  });

  it("returns 400 when login payload is missing required fields", async () => {
    const loginRes = await makeRequest(port, {
      method: "POST",
      path: "/auth/login",
      body: {
        email: "",
      },
    });

    expect(loginRes.status).toBe(400);
    expect(loginRes.body.message).toBe("Email and Password are required");
  });

  it("returns 401 for /users/me without authentication cookies", async () => {
    const meRes = await makeRequest(port, {
      method: "GET",
      path: "/users/me",
    });

    expect(meRes.status).toBe(401);
    expect(meRes.body.message).toBe("Authentication Failed");
  });
});
