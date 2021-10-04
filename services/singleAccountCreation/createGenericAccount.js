/**
 *
 * @param {json} json parsed JSON object of payload
 */
const postMessage = require('../../utils/postMessage');
const sendPostRequest = require('../../utils/sendPostRequest');
const messageDisplay = require('../displayBlocks/messageDisplay');
const userLog = require('../../utils/userLogs');
const date = require('../../utils/getDate');

const createGenericAccount = async function (json) {
  const requesterID = json.actions[0].value.substring(1); //ID of requester
  const requesterObj = userLog.getDataGeneric(requesterID);
  const requester = requesterObj.userName; //name of requester
  userLog.removeDataGeneric(json.user.id);
  if (json.actions[0].value[0] == '1') {
    //create account
    sendPostRequest(
      json.response_url,
      messageDisplay('Request approved', [
        `Requester: _${requester}_`,
        `Date: _${date()}_`,
      ]),
    ); //send conformation message in Admins channel

    postMessage(
      requesterID,
      messageDisplay('Your request has been approved', [`Date: _${date()}_`])
        .blocks,
    ); //acknowledge the user who initiated the request
  } else {
    //reject account creation
    sendPostRequest(
      json.response_url,
      messageDisplay('Request denied', [
        `Requester: _${requester}_`,
        `Rejected by: _${json.user.name}_`,
        `Date: _${date()}_`,
      ]),
    ); //send conformation message in Admins channel
    postMessage(
      requesterID,
      messageDisplay('Your request has been denied', [
        `Rejected by: _${json.user.name}_`,
        `Date: _${date()}_`,
      ]).blocks,
    ); //acknowledge the user who initiated the request
  }
};

module.exports = createGenericAccount;
