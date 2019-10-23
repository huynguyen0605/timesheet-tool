var express = require('express'),
    cron = require('node-cron'),
    lowdb = require('lowdb'),
    FileSync = require('lowdb/adapters/FileSync'),
    ServiceCaller = require('./callServices'),
    DateTimeUtils = require('./ultils/DateTimeUtils'),
    config = require('./config'),
    logger = require('./ultils/Logger');


var { sendLoginRequest, editTimeSheet } = ServiceCaller;

const LOG_TAG = 'app';
const adapter = new FileSync('db.json');
const db = lowdb(adapter);
require('dotenv').config();
const dbName = 'days';

const app = express();

app.get('/', function (req, res) {
    res.send({
        s: 'done',
    })
});

async function editTs() {
    return new Promise(async function (resolve, reject) {
        try {
            var key = DateTimeUtils.convertTsToDate(Date.now());

            var writedDate = db.get(dbName).value();
            if (writedDate.includes(key)) {
                return resolve();
            };
            logger.log('info', `${LOG_TAG}-editTs-START`);
            var loginResult = await sendLoginRequest();
            logger.log('info', `${LOG_TAG}-editTs-loginResult: ${loginResult}`);
            var moningRes = await editTimeSheet(loginResult.headers['set-cookie'], { isMorning: true });
            var afternRes = await editTimeSheet(loginResult.headers['set-cookie'], { isMorning: false });
            // logger.log('info', 'write success at ' + DateTimeUtils.convertTsToDate(Date.now()));

            if (!moningRes || !moningRes.body || !afternRes || !afternRes.body) {
                logger.log('error', `${LOG_TAG}-editTs-error: No response edit timesheet`);
                return reject(new Error('No response edit timesheet'));
            };
            if ((moningRes.body && JSON.parse(moningRes.body).length > 0) || (afternRes.body && JSON.parse(afternRes.body).length > 0)) {
                logger.log('error', `${LOG_TAG}-editTs-error: No response edit timesheet`);
                return reject(new Error('Login Failed'));
            };

            db.get(dbName)
                .push(key)
                .write();

            return resolve();
        } catch (error) {
            logger.log('error', `${LOG_TAG}-editTs-error: ${error}`);
            return reject(error);
        };
    });
};

app.listen(8000, function () {
    console.log('Running on port 8000!');
    var { pattern } = config.scheduler;
    var dbObj = {};
    dbObj[dbName] = [];
    db.defaults(dbObj).write();
    cron.schedule(pattern, async function () {
        try {
            await editTs();
        } catch (error) {
            await editTs();
        };
    });
});