const request = require('request');
const fs = require('fs');

const sendRequest = function (URL, path) {
  return new Promise(function (resolve, reject) {
    try {
      var req = request({
        url: URL,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + process.env.SLACK_TOKEN,
        },
      });
      req.pipe(fs.createWriteStream(path)).on('finish', function () {
        return resolve(true);
      });
    } catch (err) {
      //for any  errors
      return reject(err);
    }
  });
};

module.exports = sendRequest;
