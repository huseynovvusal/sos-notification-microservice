import winston, { Logger } from "winston"
import { createLogstashTransport } from "./logstash-transport"

function createLogger(
  logstashTransportConfig: {
    host: string
    port: number
  },
  level: string,
  name: string
): Logger {
  const logstashTransport = createLogstashTransport(
    logstashTransportConfig.host,
    logstashTransportConfig.port
  )

  const logger = winston.createLogger({
    level: level,
    defaultMeta: {
      service: name,
    },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`
          })
        ),
      }),
      /*new winston.transports.File({
        format: winston.format.combine(winston.format.json(), winston.format.timestamp()),
        filename: "combined.log",
      }),
      new winston.transports.File({
        format: winston.format.combine(winston.format.json(), winston.format.timestamp()),
        filename: "error.log",
        level: "error",
      }), */
      logstashTransport,
    ],
  })

  return logger
}

export { createLogger }
