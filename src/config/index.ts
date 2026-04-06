import dotenv from "dotenv"
import path from "path"

dotenv.config({path: path.join(__dirname,'../../.env')})

export default {
    logDir: process.env.LogDir || "./logs",
    isDev: process.env.NodeEnv === "development",
}
