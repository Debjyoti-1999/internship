const logs = require('../utils/userLogs');
/**
 *
 * @param {String} accountType Ex 'ProNotes' or 'ProVoice' or 'Generic'
 * @param {String} userId ID of the user
 * @returns {boolean} checks if the payload is valid or not
 */
const validatePayload = function (accountType, userId) {
  if (accountType == 'Generic') {
    if (logs.getDataGeneric[userId] == undefined) return false;
  }
  if (accountType == 'ProNotes') {
    if (logs.getDataProNotes[userId] == undefined) return false;
  }
  if (accountType == 'ProVoice') {
    if (logs.getDataProVoice[userId] == undefined) return false;
  }
  return true;
};
module.exports = validatePayload;
