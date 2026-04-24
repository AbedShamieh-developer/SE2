import express, { request } from "express";
import config from "./config";
import logger from "./util/logger";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from "cors";
import requestLogger from "./middleware/requestLogger";
import routes from "./routes";
import { HTTPException } from "./util/exceptions/http-exceptions/HTTPExceptions";
const app = express();
// config helemt
app.use(helmet());
// config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// config cors
app.use(
  cors({
    origin: "*",
  }),
);
// middlewares
app.use(requestLogger);
// routes
app.use("/", routes);
// config 404 error handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});
// config error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof HTTPException) {
    const httpException = err as HTTPException;
    logger.error(`${httpException.name}: [${httpException.status}] ${httpException.message} ${httpException.details} || {}`)
    res.status(httpException.status).json({
       message: httpException.message,
       details: httpException.details || "No details provided"
      });
  } else {
    logger.error("Unhandeled Error: " + err.message);
    res.status(500).json({ 
      message: "Internal Server Error" 
    });
  }
});


  app.listen(config.port, config.host, () => {
    logger.info(`Server is running on http://${config.host}:${config.port}`);
  });


