const check_Email = require('../../utils/check_Email');
const check_Id = require('../../utils/check_Id');
const check_Name = require('../../utils/check_Name');
const generate_Password = require('../password/generate_Password_proNotes');
var keys;

/**
 *
 * @param {Object} agent object (of a member) with  details as key-value pair
 * @param {String} organization organization
 * @param {Boolean} valid True if the the current object has all the required details
 * @returns
 */
const clean = function (agent, organization, valid) {
  const new_User = {};
  if (agent['Agent Id'] !== undefined)
    new_User['Agent Id'] = check_Id(agent['Agent Id']);
  if (agent['First Name'] !== undefined)
    new_User['First Name'] = check_Name(agent['First Name']);
  if (agent['Last Name'] !== undefined)
    new_User['Last Name'] = check_Name(agent['Last Name']);
  if (valid == true) new_User['E-Mail'] = '*'; // * means this email needs to be generated

  if (valid == true) {
    const password = generate_Password(
      check_Email(new_User['First Name'].toLowerCase()),
      check_Email(new_User['Last Name'].toLowerCase()),
    );
    new_User.password = password;
  }
  for (keys in agent) {
    //add all other data present in the object
    if (
      keys !== 'Agent Id' &&
      keys !== 'First Name' &&
      keys !== 'Last Name' &&
      keys !== 'E-Mail' &&
      keys !== 'password' &&
      keys !== 'Accounts-Created' &&
      keys !== 'Possible-Error'
    )
      new_User[keys] = agent[keys];
  }
  return new_User;
};
module.exports = clean;
