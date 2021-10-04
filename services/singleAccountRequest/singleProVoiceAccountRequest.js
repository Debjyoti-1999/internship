const sendPostRequest = require('../../utils/sendPostRequest');
const postMessage = require('../../utils/postMessage');
const randomMessage = require('../displayBlocks/randomMessageDisplay');
/**
 *
 * @param {JSON Object} json data of the form sent to requester
 */
const accountApprovalRequest = async function (json, formData) {
  var messageBody = {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: `${json.user.name} has requested for creating a ProVoice account`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: 'Agent Details:',
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: `First Name:${formData[0]}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: `Last Name: ${formData[1]}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: `Security Group: ${formData[2]}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: `Organization: ${formData[5]}`,
          emoji: true,
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            style: 'primary',
            text: {
              type: 'plain_text',
              text: 'Accept',
              emoji: true,
            },
            value: `1${json.user.id}`,
            action_id: 'createSingleProVoiceAccountResult',
          },
        ],
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            style: 'danger',
            text: {
              type: 'plain_text',
              text: 'Reject',
              emoji: true,
            },
            value: `0${json.user.id}`,
            action_id: 'createSingleProVoiceAccountResult',
          },
        ],
      },
    ],
  };
  sendPostRequest(process.env.WEB_HOOK_ADMIN_URL, messageBody); //send the request in admins channel
  postMessage(
    json.user.id,
    randomMessage(
      'Your request has been sent, you will get notified if your account gets created',
    ).blocks,
  ); //acknowledge the user
};

module.exports = accountApprovalRequest;
