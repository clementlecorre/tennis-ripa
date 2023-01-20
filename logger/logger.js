const { format, createLogger, transports } = require('winston');

const {
  combine, timestamp, splat, printf, prettyPrint,
} = format;
//
// const myFormat = printf( ({ level, message, timestamp , ...metadata}) => {
//   let msg = `${timestamp} [${level}] : ${message} `
//   if(metadata) {
// 	msg += JSON.stringify(metadata)
//   }
//   return msg
// });

const logger = createLogger({
  level: 'info',
  format: combine(
    splat(),
    timestamp(),
    // myFormat,
    prettyPrint(),
  ),
  transports: [new transports.Console()],
});

module.exports = logger;
