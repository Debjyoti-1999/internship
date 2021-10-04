const checkName = require('../../utils/check_Name');
//const checkId = require('../../utils/check_Id');
const check_Email = require('../../utils/check_Email');
const passwordGenerator = require('../password/generate_Password_proVoice');
/**
 *
 * @param {Array[String]} formData data collected from ProVoice form
 * @returns {Object} containing all the details(filtered) of agent.
 */

const valid = function (formData) {
  const agent = {};
  agent['First Name'] = checkName(formData[0]);
  agent['Last Name'] = checkName(formData[1]);
  agent['Security Group'] = checkName(formData[2]);
  agent.organization = checkName(formData[5]);
  agent.password = passwordGenerator();
  if (formData[3] == null)
    agent.Email = check_Email(
      `${agent['First Name'].toLowerCase()}.${agent[
        'Last Name'
      ].toLowerCase()}@${formData[5].toLowerCase()}.com`,
    );
  else agent.Email = check_Email(formData[3]);
  if (formData[4] !== null) agent['Agent Code'] = formData[4];

  return agent;
};
module.exports = valid;
