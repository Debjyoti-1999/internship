const checkName = require('../../utils/check_Name');
//const checkId = require('../../utils/check_Id');
const checkEmail = require('../../utils/check_Email');
const passwordGenerator = require('../password/generate_Password_proNotes');
/**
 *
 * @param {Array[String]} formData data collected from ProNotes form
 * @returns {Object} containing all the details(filtered) of agent.
 */
const valid = function (formData) {
  const agent = {};
  agent['First Name'] = checkName(formData[0]);
  agent['Last Name'] = checkName(formData[1]);
  agent['Agent Id'] = formData[2];
  agent.organization = checkName(formData[4]);
  if (formData[3] == null)
    agent['E-Mail'] = checkEmail(
      `${agent['First Name'].toLowerCase()}.${agent[
        'Last Name'
      ].toLowerCase()}@${agent.organization.toLowerCase()}.com`,
    );
  else agent['E-Mail'] = checkEmail(formData[3]);
  agent.password = passwordGenerator(agent['First Name'], agent['Last Name']);
  return agent;
};
module.exports = valid;
