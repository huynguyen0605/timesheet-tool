module.exports = {
    url: {
        LOGIN: 'https://ts.fss.com.vn/index.php?a=checklogin',
        PERFORM_ACTION: 'https://ts.fss.com.vn/extensions/ki_timesheets/processor.php',
    },
    info: {
        projectID: '235',
        activityID: '10',
        description: ['test tool ts', 'test 2', 'test 3', 'test'],
        userID: '659776688'
    },
    scheduler: {
        pattern: '*/10 * * 1-31 * 1-5',
    }
};