/**
 *
 * @param {String} str name of member
 * @returns {String} filtered string
 */
function check_Name(str) {
  //Filter the name by removing numbers and special characters
  return str.replace(/([0-9]|[\/\\#,+()$~%.@\/_!"^&:*?<>{}])/g, '');
} //check_Name
module.exports = check_Name;
