var _ = require('lodash');

function formatDM(num) {
    if (num < 10) return '0' + num;
    return num;
};

module.exports = {
    convertTsToDate: function (ts, options = { separator: '.' }) {
        var { separator } = options;
        var date = new Date(ts);
        var day = formatDM(date.getDate());
        var month = formatDM(date.getMonth() + 1);
        var year = date.getFullYear();
        return _.join([day, month, year], separator);
    },
};