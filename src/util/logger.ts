import winston, { format } from "winston";
import { inspect } from "util";
import fs from "fs";
const isDev = config.isDev;
import config from "../config/index";
const logFileFormat = winston.format.combine(
    winston.format.splat(),
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json()
);  
const logConsoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack }: any) => {
        const renderedMessage =
            typeof message === "string"
                ? message
                : inspect(message, { depth: null, maxArrayLength: 100, breakLength: 120 });

        return `${timestamp} [${level}]: ${renderedMessage} ${stack ? `\nStack trace: ${stack}` : ''}`;
    })
);

try {
    if (!fs.existsSync(config.logDir)) {
        fs.mkdirSync(config.logDir, { recursive: true });
    }
} catch (error) {
    console.error("Failed to create log directory:", error);
}

const logger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.File({ filename: "error.log", dirname: config.logDir, level: "error", format: logFileFormat }),
        new winston.transports.File({ filename: "all.log", dirname: config.logDir, format: logFileFormat }),
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: "exceptions.log", dirname: config.logDir, format: logFileFormat }),
    ],
});
if(isDev) {
    logger.add(new winston.transports.Console({ format: logConsoleFormat }));
    logger.level = "debug"; // Set to debug for development to capture all logs in console
}
export default logger;
