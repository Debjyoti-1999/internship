/**
 *
 * @param {Object} json parsed JSON object of payload
 */

const sendPostRequest = require('../../utils/sendPostRequest');
const postMessage = require('../../utils/postMessage');
const randomMessage = require('../displayBlocks/randomMessageDisplay');
const { sendRandomEmail } = require('../../utils/sendEmailAWS');
/**
 *
 * @param {JSON Object} json data of the form sent to requester
 */
const accountApprovalRequest = async function (json, formData) {
  const messageBody = {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `You have a new custom request from:\n*${json.user.name}*`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${json.user.name}* wants to create an account \n *Reason:* _${formData[2]}_`,
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
              text: 'Approve',
              emoji: true,
            },
            value: `1${json.user.id}`,
            action_id: 'accountCreationApproval',
          },
          {
            type: 'button',
            style: 'danger',
            text: {
              type: 'plain_text',
              text: 'Deny',
              emoji: true,
            },
            value: `0${json.user.id}`,
            action_id: 'accountCreationApproval',
          },
        ],
      },
    ],
  };

  sendRandomEmail(
    //send email to an admin
    formData[0],
    formData[2],
    'mayank.agarwal@prodigaltech.com',
    formData[1],
  );

  sendPostRequest(process.env.WEB_HOOK_ADMIN_URL, messageBody); //send request to admins channel
  postMessage(
    json.user.id,
    randomMessage(
      'Your request has been sent, you will get notified when your account gets created',
    ).blocks,
  ); //acknowledge the user
};

module.exports = accountApprovalRequest;
