var winston = require('winston'),
    path = require('path'),
    DailyRotateFile = require('winston-daily-rotate-file');

const moment = require('moment');
const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS';

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new DailyRotateFile({
            filename: path.join(__dirname, '../logs', 'common.log'),
            datePattern: 'yyyy-MM-dd.',
            prepend: true,
            timestamp: () => {
                return moment().format(TIMESTAMP_FORMAT);
            },
            json: true,
        }),
        new DailyRotateFile({
            filename: path.join(__dirname, '../logs', 'common.log'),
            datePattern: 'yyyy-MM-dd.',
            level: 'error',
            prepend: true,
            timestamp: () => {
                return moment().format(TIMESTAMP_FORMAT);
            },
            json: true,
        })
    ]
});

module.exports = logger;