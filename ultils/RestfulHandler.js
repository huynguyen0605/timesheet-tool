var request = require('request');
module.exports = {
    post: function callPost(url, body, options = { headers: {}, withCredentials: true }) {
        return new Promise(function (resolve, reject) {
            try {
                var { headers, withCredentials } = options;
                request({
                    url: url,
                    method: 'POST',
                    form: body,
                    headers: headers,
                    withCredentials: withCredentials,
                }, function (err, res) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res);
                    }

                });
            } catch (err) {
                reject(err);
            }
        });

    },
}