//const { isAdmin } = require('../utils/adminMember');
const { WebClient } = require('@slack/web-api');
const client = new WebClient(process.env.SLACK_TOKEN);
const userLog = require('../utils/userLogs');
const postMessage = require('../utils/postMessage');
const randomMessage = require('../services/displayBlocks/randomMessageDisplay');

var commandType;

var userObj;
/**
 *
 * @param {Object} req req.body contains the payload trigerred when user in slack uses commands
 * @param {Object} res
 * @returns
 */
exports.createAccount = async function (req, res) {
  res.status(200).send();
  userObj = userLog.checkHistoryGeneric(req.body.user_id, req.body.user_name);
  if (!userObj.possible)
    return postMessage(
      req.body.user_id,
      randomMessage('Your previous request is still pending').blocks,
    );
  await client.views.open({
    trigger_id: req.body.trigger_id,
    view: {
      type: 'modal',
      callback_id: 'accountCreationRequest',
      title: {
        type: 'plain_text',
        text: 'Create a custom request',
      },
      submit: {
        type: 'plain_text',
        text: 'Submit',
        emoji: true,
      },
      close: {
        type: 'plain_text',
        text: 'Cancel',
        emoji: true,
      },
      blocks: [
        {
          type: 'input',
          element: {
            type: 'plain_text_input',
            action_id: 'plain_text_input-action',
            placeholder: {
              type: 'plain_text',
              text: 'What is the nature of the request?',
            },
          },
          label: {
            type: 'plain_text',
            text: 'Subject',
          },
          hint: {
            type: 'plain_text',
            text: 'Ex: [Credentials][ProVoice] Access to [tenant name]',
          },
        },
        {
          type: 'input',
          block_id: 'collaborators',
          element: {
            type: 'plain_text_input',
            action_id: 'plain_text_input-action',
            placeholder: {
              type: 'plain_text',
              text: 'Comma seperated list of emails',
            },
          },
          label: {
            type: 'plain_text',
            text: 'Collaborators',
          },
          hint: {
            type: 'plain_text',
            text: 'Who needs to be looped into the request?',
          },
        },
        {
          type: 'input',
          element: {
            type: 'plain_text_input',
            multiline: true,
            action_id: 'plain_text_input-action',
            placeholder: {
              type: 'plain_text',
              text: 'Describe why you need this access',
            },
          },
          label: {
            type: 'plain_text',
            text: 'Reason',
          },
        },
      ],
    },
  });
};

exports.createSingleAccount = async function (req, res) {
  commandType = req.body.text.toLowerCase();
  if (commandType == 'pronotes') {
    res.status(200).send(); //send the mandatory response (need to respond slack or else slack will throw error)
    userObj = userLog.checkHistoryProNotes(
      req.body.user_id,
      req.body.user_name,
    );
    if (!userObj.possible)
      return postMessage(
        req.body.user_id,
        randomMessage('Your previous request is still pending').blocks,
      );
    await client.views.open({
      trigger_id: req.body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'createSingleProNotesAccountRequest', //Identifier for this modal
        title: {
          type: 'plain_text',
          text: 'GROOT',
          emoji: true,
        },
        submit: {
          type: 'plain_text',
          text: 'Submit',
          emoji: true,
        },
        close: {
          type: 'plain_text',
          text: 'Cancel',
          emoji: true,
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: 'Account details form',
              emoji: true,
            },
          },
          {
            type: 'input',
            element: {
              type: 'plain_text_input',
              action_id: 'plain_text_input-action',
            },
            label: {
              type: 'plain_text',
              text: 'First Name',
              emoji: true,
            },
          },
          {
            type: 'input',
            element: {
              type: 'plain_text_input',
              action_id: 'plain_text_input-action',
            },
            label: {
              type: 'plain_text',
              text: 'Last Name',
              emoji: true,
            },
          },
          {
            type: 'input',
            element: {
              type: 'plain_text_input',
              action_id: 'plain_text_input-action',
            },
            label: {
              type: 'plain_text',
              text: 'Agent Id',
              emoji: true,
            },
          },
          {
            type: 'input',
            optional: true,
            block_id: 'email',
            element: {
              type: 'plain_text_input',
              action_id: 'plain_text_input-action',
            },
            label: {
              type: 'plain_text',
              text: 'Email',
              emoji: true,
            },
          },
          {
            type: 'input',
            block_id: 'tenant',
            element: {
              type: 'static_select',
              placeholder: {
                type: 'plain_text',
                text: 'Select a tenant',
                emoji: true,
              },
              options: [
                {
                  text: {
                    type: 'plain_text',
                    text: 'FFAM',
                    emoji: true,
                  },
                  value: 'ffam',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Sequium',
                    emoji: true,
                  },
                  value: 'sequium',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'State',
                    emoji: true,
                  },
                  value: 'state',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Rashcurtis',
                    emoji: true,
                  },
                  value: '1016371',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Eagle',
                    emoji: true,
                  },
                  value: 'eagle',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'GatestoneUS',
                    emoji: true,
                  },
                  value: 'gatestoneus',
                },
              ],
              action_id: 'static_select-action',
            },
            label: {
              type: 'plain_text',
              text: 'Tenant',
              emoji: true,
            },
          },
        ],
      },
    });
  } else if (commandType == 'provoice') {
    res.status(200).send(); //send the mandatory response (need to respond slack or else slack will throw error)
    userObj = userLog.checkHistoryProVoice(
      req.body.user_id,
      req.body.user_name,
    );
    if (!userObj.possible)
      return postMessage(
        req.body.user_id,
        randomMessage('Your previous request is still pending').blocks,
      );
    await client.views.open({
      trigger_id: req.body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'createSingleProVoiceAccountRequest', //Identifier for this modal
        title: {
          type: 'plain_text',
          text: 'GROOT',
          emoji: true,
        },
        submit: {
          type: 'plain_text',
          text: 'Submit',
          emoji: true,
        },
        close: {
          type: 'plain_text',
          text: 'Cancel',
          emoji: true,
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: 'Account details form',
              emoji: true,
            },
          },
          {
            type: 'input',
            block_id: 'firstName',
            element: {
              type: 'plain_text_input',
              action_id: 'plain_text_input-action',
            },
            label: {
              type: 'plain_text',
              text: 'First Name',
              emoji: true,
            },
          },
          {
            type: 'input',
            block_id: 'lastName',
            element: {
              type: 'plain_text_input',
              action_id: 'plain_text_input-action',
            },
            label: {
              type: 'plain_text',
              text: 'Last Name',
              emoji: true,
            },
          },
          {
            type: 'input',
            block_id: 'securityGroup',
            element: {
              type: 'static_select',
              placeholder: {
                type: 'plain_text',
                text: 'Select security group',
                emoji: true,
              },
              options: [
                {
                  text: {
                    type: 'plain_text',
                    text: 'Admin',
                    emoji: true,
                  },
                  value: 'value-0',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Manager',
                    emoji: true,
                  },
                  value: 'value-1',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Agent-Manager',
                    emoji: true,
                  },
                  value: 'value-2',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Agent',
                    emoji: true,
                  },
                  value: 'value-3',
                },
              ],
              action_id: 'static_select-action',
            },
            label: {
              type: 'plain_text',
              text: 'Security Group',
              emoji: true,
            },
          },
          {
            type: 'input',
            optional: true,
            block_id: 'email',
            element: {
              type: 'plain_text_input',
              action_id: 'plain_text_input-action',
            },
            label: {
              type: 'plain_text',
              text: 'Email',
              emoji: true,
            },
          },
          {
            type: 'input',
            optional: true,
            block_id: 'agentCode',
            element: {
              type: 'plain_text_input',
              action_id: 'plain_text_input-action',
            },
            label: {
              type: 'plain_text',
              text: 'Agent Code',
              emoji: true,
            },
          },
          {
            type: 'input',
            block_id: 'organization',
            element: {
              type: 'plain_text_input',
              action_id: 'plain_text_input-action',
            },
            label: {
              type: 'plain_text',
              text: 'organization',
              emoji: true,
            },
          },
        ],
      },
    });
  } else {
    res.status(200).send('Invalid command');
  }
};
