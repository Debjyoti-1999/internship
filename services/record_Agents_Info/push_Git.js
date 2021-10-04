const simple_Git = require('simple-git');
const git = simple_Git();
const fs = require('fs').promises;
const path = require('path');
/**
 *
 * @param {Array[Object]} list array of objects containing informations of members whose accounts has been created
 * @param {String} remote remote name of repo of text file
 * @param {String} branch_Name name of branch
 * @param {String} file_Name name of file
 */

const push_Git = async function (list, file_Name) {
  try {
    const filePath = path.join(
      __dirname,
      `../../account_Information/${file_Name}`,
    );
    const agentIdsOfNewAccounts = list.map((item) => item['Agent Id']);
    await fs.appendFile(filePath, `\n${agentIdsOfNewAccounts.join('\n')}`);
    await git.add(filePath);
    await git.commit(
      `${agentIdsOfNewAccounts.length} agent(s) added to ${
        file_Name.split('.')[0]
      }`,
    );
    await git.push('origin');
  } catch (err) {
    console.log(err);
  }
};

module.exports = push_Git;
