const {
  createSingleAccountFromSheet,
} = require('../../data_Access_Layer/create_Account_ProNotes');
const duplicate_Emails_proNotes = require('../../utils/duplicate_Emails.js');
const cleanup = require('../cleanup/cleanup_ProNotes');
const record_Agents_Info = require('../record_Agents_Info/push_Git');
const updateAgentId = require('../record_Agents_Info/recordAgentID');
const message = require('../displayBlocks/messageDisplay');
const postMessage = require('../../utils/postMessage');
const getBranch = require('git-active-branch');
var index;

/**
 *
 * @param {Array[Object]} prevoiusly_Valid_User list of all the members whose account has already been created
 * @param {Array[Object]} valid_User list of allthe members whose account are to be created
 * @param {Array[Object]} invalid_User list of all members whose account cannot be created
 * @param {String} organization organization
 * @param {requesterId} requesterId id of the requester
 * @returns Promise resolves into an array of objects
 */

async function modify(
  prevoiusly_Valid_User, //list of users whose accounts are already created(required for checking duplicate Emails)
  valid_User, //list of new users whose account is yet to be created
  invalid_User, //listof users with some missing data
  organization, //name of organization
  requesterId,
) {
  let objarr = [];
  const successful_Accounts = [];
  //Select the valid users and create their accounts
  for (index in valid_User) {
    const new_User = cleanup(valid_User[index], organization, true); //clean the current member details
    objarr.push(new_User);
  }
  objarr = duplicate_Emails_proNotes(
    prevoiusly_Valid_User,
    objarr,
    organization,
    'E-Mail',
  ); // fix the duplicate emails
  //  create accounts for each user

  postMessage(
    //acknowledge the requester
    requesterId,
    message('Please wait, we are processing your request!!').blocks,
  );
  const agentAccountsArray = await createSingleAccountFromSheet(
    objarr,
    organization,
  );
  for (index in agentAccountsArray) {
    if (agentAccountsArray[index]['Accounts-Created'] == 'YES') {
      //if account is created store the successfuly created accounts in an array
      successful_Accounts.push(agentAccountsArray[index]);
    } else agentAccountsArray[index].password == ''; //if account creation failed remove the password
  }
  await record_Agents_Info(
    //store the member's info in remote repo
    successful_Accounts,
    `${organization}.txt`,
  );

  const updateResult = await updateAgentId(
    successful_Accounts.map(function (clientObj) {
      return clientObj['Agent Id'];
    }),
    organization,
  ); //update the agentIds

  for (index in successful_Accounts)
    successful_Accounts[index]['Agent Id update status'] = updateResult; //show result in sheet

  //Select the invalid user
  for (index in invalid_User) {
    const new_Invalid_User = cleanup(invalid_User[index], organization, false);
    new_Invalid_User['Accounts-Created'] = 'NO';
    new_Invalid_User['Possible-Error'] = invalid_User[index]['Possible-Error'];
    agentAccountsArray.push(new_Invalid_User);
  }
  return agentAccountsArray;
} //modify
module.exports = modify;
