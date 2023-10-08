const pino = require("pino");
const pretty = require("pino-pretty");

const { NO_LOGS } = require("../../config");

module.exports.logger = pino(
  {
    enabled: !NO_LOGS,
    level: "info",
    useLevelLabels: true,
    timestamp: pino.stdTimeFunctions.isoTime,
    customLevels: {
      system: 45,
    },
  },
  pino.multistream([
    {
      // @ts-ignore
      stream: pretty({
        translateTime: "SYS:dd/mm HH:MM:ss.l",
        ignore: "pid,hostname",
        levelFirst: true,
        customPrettifiers: { name: (v) => `\u001b[35;1m${v}\u001b[0m` },
        customLevels: "info:30,warn:40,system:45,error:50,fatal:60",
        customColors:
          "info:blue,warn:yellow,system:bgBlue,error:red,fatal:bgRed",
      }),
    },
  ])
);
