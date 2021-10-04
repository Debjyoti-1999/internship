const { WebClient } = require('@slack/web-api');
const slackClients = new WebClient(process.env.SLACK_TOKEN);
const fs = require('fs');
const date = require('../utils/getDate');

const upload = async function (channelID, path, typeOfAccount, requester) {
  try {
    await slackClients.files.upload({
      channels: channelID,
      initial_comment: `Account type: ${typeOfAccount}  Date: ${date()} `,
      file: fs.createReadStream(path),
    });
    return true;
  } catch (error) {
    return false;
  }
};
module.exports = upload;
