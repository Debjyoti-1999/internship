/**
 *
 * @param {String} text message to be sent
 * @returns {Object} block format of the message to be sent
 */
const randomMessage = function (text) {
  const message = {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${text}`,
        },
      },
    ],
  };
  return message;
};
module.exports = randomMessage;
