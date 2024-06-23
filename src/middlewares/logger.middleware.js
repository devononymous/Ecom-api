import fs from "fs";
import winston from "winston";
const fsPromise = fs.promises;

const logger = winston.createLogger({
  level:'info',
  format:winston.format.json(),
  defaultMeta:{service:"request-logging"},
  transports: [
    new winston.transports.File({filename:'logs.txt'})
  ]
})

const loggerMiddleware = async (req, res, next) => {
  //1. log request body,
  if(!req.url.includes('signin')){
  const logData = {
    timestamp : new Date().toISOString(),
    method : req.method,
    url: req.url,
    requireBody: req.body
  }
  // await log(logData);
  logger.info(logData)
}
  next();
};
export default loggerMiddleware;
