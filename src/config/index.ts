import dotenv from "dotenv"
import path from "path"
import { DBMode } from "./types"
import { StringValue } from 'ms'

dotenv.config({path: path.join(__dirname,'../../.env.${process.env.NODE_ENV}')})

export default {
    logDir: process.env.LOG_DIR || process.env.LogDir || "./logs",
    isDev: (process.env.NODE_ENV || process.env.NodeEnv) === "development",
    isProduction: (process.env.NODE_ENV || process.env.NodeEnv) === "production",
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    host: process.env.HOST || "localhost",
    dbMode: DBMode.SQLITE,
    auth: {
        secretKey: process.env.JWT_SECRET_KEY || "secret",
        tokenExpiration: (process.env.JWT_EXPIRES_IN || "15m") as StringValue,
        refreshTokenExpiration: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as StringValue,
    }
}
