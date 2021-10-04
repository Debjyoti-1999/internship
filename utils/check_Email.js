/**
 *
 * @param {String} str email of member
 * @returns {String} filtered email
 */
function check_Email(str) {
  return str
    .replace(/[\/\\#,+\()$~%' \/_!"^&:*?\\-\\<>{}]/g, '')
    .replace('-', '');
}
module.exports = check_Email;
