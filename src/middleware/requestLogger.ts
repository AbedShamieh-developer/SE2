import { NextFunction, Request, Response } from "express";
import logger from "../util/logger";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    let startTime = Date.now();
    res.on('finish', () => {
        let responseTime = Date.now() - startTime;
        let level = 'info';
        const status = res.statusCode;
        if(status >=500){
            level = 'error';
        }
        else if(status >= 400){
            level = 'warn';
        }
        const {method, url} = req;
      logger.log({level, message: `${method} ${url} ${status} (${responseTime} ms)`});
    });
  next();
}
export default requestLogger;