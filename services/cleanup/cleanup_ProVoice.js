const check_Name = require('../../utils/check_Name');
const generate_Password_proVoice = require('../password/generate_Password_proVoice');
var keys;
/**
 *
 * @param {Object} agent object (of a member) with  details as key-value pair
 * @param {String} organization organization
 * @param {Boolean} valid True if the the current object has all the required details
 * @returns
 */
const clean = function (user, organization, valid) {
  const new_User = {};
  if (user.Email == undefined && valid) new_User.Email = '*';
  // * denotes that this email needs to be created
  else new_User.Email = user.Email;

  if (user['First Name'] !== undefined)
    new_User['First Name'] = check_Name(user['First Name']);
  if (user['Last Name'] !== undefined)
    new_User['Last Name'] = check_Name(user['Last Name']);
  if (user['Security Group'] !== undefined)
    new_User['Security Group'] = user['Security Group'];
  if (user['Agent Code'] !== undefined)
    new_User['Agent Code'] = user['Agent Code'];
  if (valid == true) new_User.password = generate_Password_proVoice(); //if valid user then generate password
  for (keys in user) {
    if (
      keys !== 'Agent Code' &&
      keys !== 'First Name' &&
      keys !== 'Last Name' &&
      keys !== 'Email' &&
      keys !== 'password' &&
      keys !== 'Security Group' &&
      keys !== 'Accounts-Created' &&
      keys !== 'Possible-Error'
    )
      new_User[keys] = user[keys];
  }
  return new_User;
};
module.exports = clean;
