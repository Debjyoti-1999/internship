/**
 *
 * @param {String} fname first name
 * @param {String} lname last name
 * @returns {String} password of a member
 */
function generate_Password(fname, lname) {
  const user = {};
  user.fname = fname.toLowerCase();
  user.lname = lname.toLowerCase();
  return getPassword(user);
} //generates password

const symbolMap = {
  1: '!!!!!!!',
  2: '@@@@@',
  3: '33##',
  4: '4$$',
  5: '%%',
  6: '^',
  7: '&',
  8: '*',
  9: '(',
};

const getPassword = (user) => {
  if (user.fname.length > 4)
    return `${user.fname}${Math.min(user.fname.length, 9)}${
      symbolMap[Math.min(user.fname.length, 9)]
    }`;
  else
    return `${user.lname}${Math.min(user.lname.length, 9)}${
      symbolMap[Math.min(user.lname.length, 9)]
    }`;
};
module.exports = generate_Password;
