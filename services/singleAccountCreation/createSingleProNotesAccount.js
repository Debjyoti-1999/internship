const sendPostRequest = require('../../utils/sendPostRequest');
const messageDisplay = require('../displayBlocks/messageDisplay');
const postMessage = require('../../utils/postMessage');
const userLog = require('../../utils/userLogs');
const cleanData = require('../cleanup/cleanUpSingleProNotesData');
const recordAgentsGitFile = require('../record_Agents_Info/push_Git');
const updateAgentId = require('../record_Agents_Info/recordAgentID');
const date = require('../../utils/getDate');
const getBranch = require('git-active-branch');
const {
  createSingleAccountFromForm,
} = require('../../data_Access_Layer/create_Account_ProNotes');
/**
 *
 * @param {JSON Object} json data of the Accept/Reject form (sent in the admins channel)
 *
 */
const createProNotesAccount = async function (json) {
  const requesterID = json.actions[0].value.substring(1); //ID of requester
  const requesterObj = userLog.getDataProNotes(requesterID);
  const requester = requesterObj.userName; //name of requester
  const formData = requesterObj.data; //form data of requester
  userLog.removeDataProNotes(json.user.id);
  if (json.actions[0].value[0] == '0') {
    //account creation is denied
    postMessage(
      requesterID,
      messageDisplay('Rejected request!!', [
        'Account Type : _ProNotes_',
        `Requester : _${requester}_`,
        `Denied by: _${json.user.name}_`,
        `Date : _${date()}_`,
      ]).blocks,
    );
    sendPostRequest(
      json.response_url,
      messageDisplay('Rejected request!!', [
        'Account Type : _ProNotes_',
        `Requester : _${requester}_`,
        `Denied by: _${json.user.name}_`,
        `Date : _${date()}_`,
      ]),
    ); //acknowledge in admins channel
    return;
  } //account creation is approved
  const response = await createSingleAccountFromForm(cleanData(formData));
  if (response.validity) {
    //Account has been created
    const clientAccount = response.data;
    recordAgentsGitFile(
      //record Agent Ids in a remote file
      [clientAccount],
      `${clientAccount.organization}.txt`,
    );
    const updateFile = await updateAgentId(
      [clientAccount['Agent Id']],
      clientAccount.organization,
    ); //update AgentId in remote file

    clientAccount.idUpdateStatus = updateFile;

    postMessage(
      requesterID,
      messageDisplay('Account Created Successfully !!', [
        `Account Type:_Pronotes_   Requester: _${requester}_   Date: _${date()}_`,
        `First Name:  _${clientAccount['First Name']}_`,
        `Last Name:  _${clientAccount['Last Name']}_`,
        `Email:  _${clientAccount['E-Mail']}_`,
        `Agent Id:  _${clientAccount['Agent Id']}_`,
        `Password:  _${clientAccount.password}_`,
        `Organization: _${clientAccount.organization}_`,
        `AgentId update status:  _${clientAccount.idUpdateStatus}_`,
      ]).blocks,
    ); //post message to the requester
    sendPostRequest(
      json.response_url,
      messageDisplay('Account Created Successfully !!', [
        `Account Type: _Pronotes_   Requester: _${requester}_   Date: _${date()}_`,
        `First Name:  _${clientAccount['First Name']}_`,
        `Last Name:  _${clientAccount['Last Name']}_`,
        `Email:  _${clientAccount['E-Mail']}_`,
        `Agent Id:  _${clientAccount['Agent Id']}_`,
        `Password:  _${clientAccount.password}_`,
        `Organization: _${clientAccount.organization}_`,
        `AgentId update status:  _${clientAccount.idUpdateStatus}_`,
      ]),
    ); //acknowledge the result in admins channel
  } else {
    const errMessage = response.data;
    postMessage(
      requesterID,
      messageDisplay('Failed to create ProNotes account!!', [
        `Requester : _${requester}_ `,
        `Date: _${date()}_`,
        `Reason: _${errMessage}_`,
      ]).blocks,
    ); //send message to the requester
    sendPostRequest(
      json.response_url,
      messageDisplay('Failed to create ProNotes account!!', [
        `Requester : _${requester}_ `,
        `Date: _${date()}_`,
        `Reason: _${errMessage}_`,
      ]),
    ); //acknowledge in admins channel
  }
};

module.exports = createProNotesAccount;
