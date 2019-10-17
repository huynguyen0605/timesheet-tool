var express = require('express');
var request = require('request');

require('dotenv').config();

const app = express();

app.get('/test', async function (req, res) {
    request.post('https://ts.fss.com.vn/index.php?a=checklogin', {
        form: {
            name: `${process.env.ts_name}`,
            password: `${process.env.ts_password}`,
        }
    }, function (error, response) {
        if (error) {
            res.send({
                s: 'error',
                d: error,
            });
        } else if (response.headers['set-cookie']) {
            var cookie = `${response.headers['set-cookie'][0]};${response.headers['set-cookie'][1]};`
            var data = {
                id: '',
                axAction: 'add_edit_timeSheetEntry',
                projectID: '235',
                filter: '',
                activityID: '10',
                description: 'Code & support test openapi KBSV',
                start_day: '15.10.2019',
                end_day: '15.10.2019',
                start_time: '13:00:00',
                end_time: '17:30:00',
                duration: '04:30:00',
                location: '',
                trackingNumber: '',
                comment: '',
                commentType: '0',
                budget: '',
                approved: '',
                statusID: '1',
                billable: '0',
                "userID[]": '659776688'
            };
            // var body = 'id=&axAction=add_edit_timeSheetEntry&projectID=235&filter=&activityID=10&filter=&description=test+api&start_day=15.10.2019&end_day=15.10.2019&start_time=13%3A00%3A00&end_time=17%3A30%3A00&duration=04%3A30%3A00&location=&trackingNumber=&comment=&commentType=0&userID=659776688&erase=on&budget=&approved=&statusID=1&billable=0';
            request({
                method: 'POST',
                uri: 'https://ts.fss.com.vn/extensions/ki_timesheets/processor.php',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': cookie,
                },
                form: data,
                withCredentials: true,
            }, function (error, response) {
                if (error) {
                    res.send({
                        s: 'error',
                        d: error
                    });
                } else {
                    res.send({
                        s: 'ok',
                        res: response,
                    });
                };
            })
        } else {
            res.send({
                s: 'error',
                d: 'Login failed',
            });
        }
    });
});

app.listen(8000, function () {
    console.log('Running on port 8000!');
});