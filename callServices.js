var restfulHandler = require('./ultils/RestfulHandler');
var logger = require('./ultils/Logger');

var datetimeUtils = require('./ultils/DateTimeUtils');
var config = require('./config.js');
var urls = config.url;

const LOG_TAG = 'callServices';

module.exports = {
    sendLoginRequest: async function () {
        return new Promise(async function (resolve, reject) {
            try {
                logger.log('info', `${LOG_TAG}-sendLoginRequest-START`);
                var body = {
                    name: `${process.env.ts_name}`,
                    password: `${process.env.ts_password}`,
                };
                var loginResult = await restfulHandler.post(urls.LOGIN, body);
                logger.log('info', `${LOG_TAG}-sendLoginRequest-response: ${loginResult}`);
                return resolve(loginResult);
            } catch (error) {
                logger.log('error', `${LOG_TAG}-sendLoginRequest-error: ${error}`);
                return reject(error);
            };
        });
    },

    editTimeSheet: async function (loginCookie, options = { isMorning: true }) {
        return new Promise(async function (resolve, reject) {
            try {
                logger.log('info', `${LOG_TAG}-editTimeSheet-START`);
                if (loginCookie) {
                    var cookie = `${loginCookie[0]};${loginCookie[1]};`;
                    var { isMorning } = options;
                    var { projectID, activityID, description, userID } = config.info;
                    var day = datetimeUtils.convertTsToDate(Date.now(), { separator: '.' });
                    var data = {
                        id: '',
                        axAction: 'add_edit_timeSheetEntry',
                        projectID: projectID,
                        filter: '',
                        activityID: activityID,
                        description: description[Math.floor(Math.random() * Math.floor(description.length))],
                        start_day: day,
                        end_day: day,
                        start_time: isMorning ? '08:30:00' : '13:00:00',
                        end_time: isMorning ? '12:00:00' : '17:30:00',
                        duration: isMorning ? '03:30:00' : '04:30:00',
                        location: '',
                        trackingNumber: '',
                        comment: '',
                        commentType: '0',
                        budget: '',
                        approved: '',
                        statusID: '1',
                        billable: '0',
                        "userID[]": userID
                    };
                    var res = await restfulHandler.post(urls.PERFORM_ACTION, data, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Cookie': cookie,
                        },
                    });
                    logger.log('info', `${LOG_TAG}-editTimeSheet-response: ${res}`);
                    return resolve(res);
                } else {
                    console.log('huynvq::============>')
                    reject(new Error('Login failed'));
                };
            } catch (error) {
                logger.log('error', `${LOG_TAG}-editTimeSheet-error: ${error}`);
                return reject(error);
            };
        });
    },
}