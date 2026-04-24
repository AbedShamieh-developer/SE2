import dotenv from "dotenv"
import path from "path"
import { DBMode } from "./dbMode"

dotenv.config({path: path.join(__dirname,'../../.env')})

export default {
    logDir: process.env.LogDir || "./logs",
    isDev: process.env.NodeEnv === "development",
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    host: process.env.HOST || "localhost",
    dbMode: DBMode.SQLITE,
}
