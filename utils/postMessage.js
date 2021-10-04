const { WebClient } = require('@slack/web-api');
const slackClients = new WebClient(process.env.SLACK_TOKEN);

function publishMessage(id, blockArray) {
  slackClients.chat.postMessage({
    channel: id,
    text: 'Message',
    blocks: blockArray,
  });
}

module.exports = publishMessage;
