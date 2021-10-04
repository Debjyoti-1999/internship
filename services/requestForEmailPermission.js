const postMessage = require('../utils/postMessage');
const requestForProVoiceEmail = async function (requesterId) {
  postMessage(requesterId, [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Send email to the clients',
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
            text: 'Yes',
            emoji: true,
          },
          value: '1',
          action_id: 'provoiceEmailResponse',
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
            text: 'No',
            emoji: true,
          },
          value: '0',
          action_id: 'provoiceEmailResponse',
        },
      ],
    },
  ]);
};
module.exports = { requestForProVoiceEmail };
