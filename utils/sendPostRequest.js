const request = require('request-promise');
/**
 *
 * @param {String} URL location for where to send the address
 * @param {Object} messageBody message to be sent in block format
 */
const sendRequest = async function (URL, messageBody) {
  request({
    //acknowledge in the admin channel
    url: URL,
    method: 'POST',
    body: messageBody,
    json: true,
  });
};

module.exports = sendRequest;
