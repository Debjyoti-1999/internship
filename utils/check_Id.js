/**
 *
 * @param {String} str Agent Id of member
 * @returns {String} filtered Agent Id
 */
function check_Id(str) {
  return str
    .replace(/[\/\\#,+()$~%.'@\/!" ^&:*?\\-\\<>{}]/g, '')
    .replace('-', '')
    .toUpperCase();
} //  Filter the Id by removing special characters
module.exports = check_Id;
