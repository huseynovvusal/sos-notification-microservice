const LogstashTransport = require("winston-logstash/lib/winston-logstash-latest")

const createLogstashTransport = (host: string, port: number) =>
  new LogstashTransport({
    host: host,
    port: port,
  })

export { createLogstashTransport }
