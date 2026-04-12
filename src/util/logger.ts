import winston, { format } from "winston";
import { inspect } from "util";
import config from "../config";
const dirName = config.logDir;
const isDev = true;
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

const logger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.File({ filename: "logs/error.log", dirname: dirName, level: "error", format: logFileFormat }),
        new winston.transports.File({ filename: "logs/all.log", dirname: dirName, format: logFileFormat }),
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: "logs/exceptions.log", dirname: dirName, format: logFileFormat }),
    ],
});
if(isDev) {
    logger.add(new winston.transports.Console({ format: logConsoleFormat }));
    logger.level = "debug"; // Set to debug for development to capture all logs in console
}
export default logger;
