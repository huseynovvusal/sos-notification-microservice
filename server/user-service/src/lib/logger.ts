import path from 'path';
import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = combine(
  colorize({ all: true }),
  timestamp(),
  printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(__dirname, '/../../logs/user-service.log'),
      level: 'info',
      format: logFormat
    })
  ]
});

export default logger;
