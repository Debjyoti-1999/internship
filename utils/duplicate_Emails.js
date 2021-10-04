const check_Email = require('./check_Email');

/**
 *
 * @param {Array[Object]} previously_Valid_User list of members whose accounts have already been created
 * @param {Array[Object]} currently_Valid_User list of members whose accounts are to be created
 * @param {String} organization organization
 * @param {Sring} email email key of the member
 * @returns
 */
function duplicate_Emails(
  previously_Valid_User,
  currently_Valid_User,
  organization,
  email,
) {
  const map = {};
  //check the previously_Valid_User
  let index;
  for (index in previously_Valid_User) {
    //check for the latest version of email that can be used(Ex: in jason.bourne2@gmail.com, 2 is the version)
    const email_Key = check_Email(
      previously_Valid_User[index]['First Name'].toLowerCase() +
        '.' +
        previously_Valid_User[index]['Last Name'].toLowerCase(),
    );
    if (map[email_Key] == undefined) {
      map[email_Key] = {};
      map[email_Key]['version'] = get_Version(
        previously_Valid_User[index][email],
      ); //get the version of current email
    } else {
      map[email_Key]['version'] = Math.max(
        get_Version(previously_Valid_User[index][email]),
        map[email_Key]['version'],
      ); //take the max version of a Email
    }
  }
  //check the current users
  for (index in currently_Valid_User) {
    if (currently_Valid_User[index][email] == '*') {
      const email_Key = check_Email(
        currently_Valid_User[index]['First Name'].toLowerCase() +
          '.' +
          currently_Valid_User[index]['Last Name'].toLowerCase(),
      ); //email_Key as check_Email(first_Name.last_Name) ,to identify users with similar first and last name
      if (map[email_Key] == undefined) {
        //new email so current version =1
        map[email_Key] = {};
        map[email_Key]['version'] = 1;
        currently_Valid_User[index][email] = `${email_Key}@${organization}.com`;
      } else {
        //similar email
        map[email_Key]['version'] = map[email_Key]['version'] + 1;
        currently_Valid_User[index][
          email
        ] = `${email_Key}${map[email_Key]['version']}@${organization}.com`;
      }
    }
  }
  return currently_Valid_User;
} //duplicate_Email

function get_Version(email) {
  //gives the number added before '@' in email
  const version = parseInt(email[email.indexOf('@') - 1]);
  if (Number.isNaN(version)) {
    return 1;
  }
  return version;
}
module.exports = duplicate_Emails;
