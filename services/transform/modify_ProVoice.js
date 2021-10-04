const {
  createSingleAccountFromSheet,
  addAuthorization,
} = require('../../data_Access_Layer/create_Account_ProVoice');
const duplicate_Emails_proVoice = require('../../utils/duplicate_Emails');
const cleanup = require('../cleanup/cleanup_ProVoice');
const { sendBulkEmail } = require('../../utils/sendEmailAWS');
const { requestForProVoiceEmail } = require('../requestForEmailPermission');
const updateAgentInfo = require('../../data_Access_Layer/updateProVoiceAgentInfo');
const {
  getProVoiceEmailResponse,
} = require('../responseForEmailPermission.js');

/**
 *
 * @param {Array[Object]} prevoiusly_Valid_User list of all the members whose account has already been created
 * @param {Array[Object]} valid_User list of allthe members whose account are to be created
 * @param {Array[Object]} invalid_User list of all members whose account cannot be created
 * @param {String} organization organization
 * @param {String} requesterId id of the requester
 * @returns Promise resolves into an array of objects
 */

async function modify(
  prevoiusly_Valid_User, //(required for checking duplicate Emails)
  valid_User,
  invalid_User,
  organization,
  requesterId,
) {
  let objarr = [];
  const accountsSortedByRBAC = {
    Admin: [],
    Manager: [],
    'Agent-Manager': [],
    Agent: [],
  };
  const successful_Accounts = [];
  //Select the valid users and create their accounts
  objarr = valid_User.map((user) => cleanup(user, organization, true));

  objarr = duplicate_Emails_proVoice(
    prevoiusly_Valid_User,
    objarr,
    organization,
    'Email',
  ); // fix the duplicate emails

  //  create accounts for each user
  const agentAccountsArray = await createSingleAccountFromSheet(
    objarr,
    organization,
  );
  console.log(agentAccountsArray);

  agentAccountsArray.forEach((account) => {
    if (account['Accounts-Created'] == 'YES') {
      successful_Accounts.push(account);
      accountsSortedByRBAC[account['Security Group']].push(account['Auth Key']);
    } else account.password = '';
  });

  updateAgentInfo(successful_Accounts, organization); //update the IDs
  addAuthorization(accountsSortedByRBAC);

  if (successful_Accounts.length > 0) {
    requestForProVoiceEmail(requesterId); //ask for sending email if any

    if (await getProVoiceEmailResponse())
      await sendBulkEmail(successful_Accounts, 'Email', 'password'); //send emails and attach 'Email Status' property
  }

  //Select the invalid user
  for (const index in invalid_User) {
    const new_Invalid_User = cleanup(invalid_User[index], organization, false);
    new_Invalid_User['Accounts-Created'] = 'NO';
    new_Invalid_User['Possible-Error'] = invalid_User[index]['Possible-Error'];
    agentAccountsArray.push(new_Invalid_User);
  }

  return agentAccountsArray; //contains list of Created accounts and uncreated accounts
} //modify
module.exports = modify;
