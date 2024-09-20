import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const LOG_DIR = process.env.LOG_DIR || 'logs';

const createLogger = (): winston.Logger => {
  const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
      new DailyRotateFile({
        filename: `${LOG_DIR}/%DATE%-app.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
      }),
    ],
  });

  return logger;
};

const logger = createLogger();

export const log = (level: string, message: string, meta?: object): void => {
  const validLevels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'];
  
  if (!validLevels.includes(level)) {
    level = 'info';
  }

  logger.log(level, message, meta);
};

export default logger;