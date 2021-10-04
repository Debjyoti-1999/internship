const sendPostRequest = require('../../utils/sendPostRequest');
const postMessage = require('../../utils/postMessage');
const userLog = require('../../utils/userLogs');
const { sendSingleEmail } = require('../../utils/sendEmailAWS');
const {
  createSingleAccountFromForm,
} = require('../../data_Access_Layer/create_Account_ProVoice');
const cleanData = require('../cleanup/cleanUpSingleProVoiceData');
const date = require('../../utils/getDate');
const messageDisplay = require('../displayBlocks/messageDisplay');
const updateAgentInfo = require('../../data_Access_Layer/updateProVoiceAgentInfo');
/**
 *
 * @param {JSON Object} json data of the Accept/Reject form (sent in the admins channel)
 * @returns
 */
const createProVoiceAccount = async function (json) {
  const requesterID = json.actions[0].value.substring(1); //ID of requester
  const requesterObj = userLog.getDataProVoice(requesterID);
  const requester = requesterObj.userName; //name of requester
  const formData = requesterObj.data; //form data of requester
  userLog.removeDataProVoice(json.user.id);

  if (json.actions[0].value[0] == '0') {
    //account creation is denied
    postMessage(
      requesterID,
      messageDisplay('Rejected request!!', [
        'Account Type : _ProVoice_',
        `Requester : _${requester}_`,
        `Denied by: _${json.user.name}_`,
        `Date : _${date()}_`,
      ]).blocks,
    );
    sendPostRequest(
      json.response_url,
      messageDisplay('Rejected request!!', [
        'Account Type : _ProVoice_',
        `Requester : _${requester}_`,
        `Denied by: _${json.user.name}_`,
        `Date : _${date()}_`,
      ]),
    ); //acknowledge in admins channel
    return;
  }
  //account creation is approved

  const response = await createSingleAccountFromForm(cleanData(formData));
  if (response.validity) {
    //account has been created
    const clientAccount = response.data;
    updateAgentInfo(
      //update the agent info
      [clientAccount],
      clientAccount.organization,
    );
    // const emailStatus =
    //   (await sendSingleEmail(clientAccount, 'Email', 'password')) ||
    //   'Unknown error occured'; //send Email to client
    postMessage(
      requesterID,
      messageDisplay('Account created successfully!!', [
        `Account type: _ProVoice_   Requester: _${requester}  Date: ${date()}_`,
        `First Name: _${clientAccount['First Name']}_`,
        `Last Name: _${clientAccount['Last Name']}_`,
        `Organization: _${clientAccount.organization}_`,
        `Security Group: _${clientAccount['Security Group']}_`,
        `Email: _${clientAccount.Email}_`,
        `AgentId: _${clientAccount['Agent Code']}_`,
        `Password: _${clientAccount.password}_`,
      ]).blocks,
    ); //post message to the requester
    sendPostRequest(
      json.response_url,
      messageDisplay('Account created successfully!!', [
        `Account type: _ProVoice_   Requester: _${requester}  Date: ${date()}_`,
        `First Name: _${clientAccount['First Name']}_`,
        `Last Name: _${clientAccount['Last Name']}_`,
        `Organization: _${clientAccount.organization}_`,
        `Security Group: _${clientAccount['Security Group']}_`,
        `Email: _${clientAccount.Email}_`,
        `AgentId: _${clientAccount['Agent Code']}_`,
        `Password: _${clientAccount.password}_`,
      ]),
    ); //acknowledge in admins channel
  } else {
    //account creation failed
    const errMessage = response.data;
    postMessage(
      requesterID,
      messageDisplay('Failed to create ProVoice account!!', [
        `Requester: _${requester}_`,
        `Date: _${date()}_`,
        `REASON: _${errMessage}_`,
      ]),
    ); //send message to the requester
    sendPostRequest(
      json.response_url,
      messageDisplay('Failed to create ProVoice account!!', [
        `Requester: _${requester}_`,
        `Date: _${date()}_`,
        `REASON: _${errMessage}_`,
      ]),
    ); //acknowledge in admins channel
  }
};

module.exports = createProVoiceAccount;
