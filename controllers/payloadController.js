const genericAccountRequest = require('../services/singleAccountRequest/genericAccountRequest');
const createGenericAccount = require('../services/singleAccountCreation/createGenericAccount');
const createSingleProNotesAccount = require('../services/singleAccountCreation/createSingleProNotesAccount');
//const config = require('../services/config');
const createSingleProVoiceAccount = require('../services/singleAccountCreation/createSingleProVoiceAccount');
const singleProNotesAccountRequest = require('../services/singleAccountRequest/singleProNotesAccountRequest');
const singleProVoiceAccountRequest = require('../services/singleAccountRequest/singleProVoiceAccountRequest');
const proVoiceFormValidity = require('../services/formValidity/singleProVoiceAccountFormValidity');
const userLog = require('../utils/userLogs');
const {
  setProVoiceEmailResponse,
} = require('../services/responseForEmailPermission');
const sendPostRequst = require('../utils/sendPostRequest');
const messageDisplay = require('../services/displayBlocks/messageDisplay');

var key;
var formDataGeneric;
var formDataProNotes;
var formDataProVoice;

/**
 *
 * @param {Object} req req.body has the payload ,trigerred when user interacts with any interactive component in Slack
 * @param {Object} res
 */
exports.createAccount = async function (req, res) {
  const json = JSON.parse(req.body.payload);
  if (
    //Generic account creation request
    json.type == 'view_submission' &&
    json.view.callback_id == 'accountCreationRequest'
  ) {
    res.status(200).send(); //Immediate response to be sent (as per slack docs)
    formDataGeneric = [];
    for (key in json.view.state.values)
      formDataGeneric.push(
        json.view.state.values[key]['plain_text_input-action'].value,
      );
    userLog.setDataGeneric(json.user.id, formDataGeneric);
    genericAccountRequest(json, formDataGeneric);
  }

  if (
    json.type == 'block_actions' &&
    json.actions[0].action_id == 'accountCreationApproval'
  ) {
    res.status(200).send();
    //generic account creation approval
    createGenericAccount(json);
  }

  if (
    json.type == 'view_submission' &&
    json.view.callback_id == 'createSingleProNotesAccountRequest'
  ) {
    //single ProNotes account creation request
    res.status(200).send();
    formDataProNotes = [];
    for (key in json.view.state.values) {
      if (key == 'tenant') {
        formDataProNotes.push(
          json.view.state.values[key]['static_select-action'].value,
        );
      }
      formDataProNotes.push(
        json.view.state.values[key]['plain_text_input-action'].value,
      );
    }

    userLog.setDataProNotes(json.user.id, formDataProNotes);
    singleProNotesAccountRequest(json, formDataProNotes);
  }

  if (
    json.type == 'block_actions' &&
    json.actions[0].action_id == 'createSingleProNotesAccountResult'
  ) {
    //result (approval/denial) from admins channel
    createSingleProNotesAccount(json);
  }

  if (
    json.type == 'view_submission' &&
    json.view.callback_id == 'createSingleProVoiceAccountRequest'
  ) {
    //single ProVoice account creation request
    formDataProVoice = [];
    for (key in json.view.state.values) {
      if (json.view.state.values[key]['plain_text_input-action'] !== undefined)
        formDataProVoice.push(
          json.view.state.values[key]['plain_text_input-action'].value,
        );
      else if (
        json.view.state.values[key]['static_select-action'].selected_option !==
        null
      ) {
        formDataProVoice.push(
          json.view.state.values[key]['static_select-action'].selected_option
            .text.text,
        );
      } else {
        formDataProVoice.push(null);
      }
    }
    const obj = proVoiceFormValidity(formDataProVoice);

    if (!obj.validity) {
      res.status(200).send(obj.data);
      return;
    } else {
      res.status(200).send();
    }

    userLog.setDataProVoice(json.user.id, formDataProVoice);
    singleProVoiceAccountRequest(json, formDataProVoice);
  }

  if (
    //result (approval/denial) from admins channel
    json.type == 'block_actions' &&
    json.actions[0].action_id == 'createSingleProVoiceAccountResult'
  ) {
    createSingleProVoiceAccount(json);
  }
  if (
    //asking for the permission for sending email to provoice clients
    json.type == 'block_actions' &&
    json.actions[0].action_id == 'provoiceEmailResponse'
  ) {
    res.status(200).send();
    sendPostRequst(
      json.response_url,
      messageDisplay('Please wait, we are processing your request'),
    );
    setProVoiceEmailResponse(json); //set the permission for email
  }
  /*
  if (json.actions !== undefined && json.actions[0].action_id == 'config') {
    config(json);
  }*/
};
