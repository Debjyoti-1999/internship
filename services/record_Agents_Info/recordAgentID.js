const fs = require('fs').promises;
const yaml = require('js-yaml');
/**
 *
 * @param {Array[Sring]} agentIdsOfNewAccounts list of AgentIds
 * @param {String} organization Name of organization
 * @returns {String} 'Success' / 'Failed'
 */
const updateAgent = async (agentIdsOfNewAccounts, organization) => {
  try {
    const configFile = await fs.readFile(process.env.AGENT_LIST_PATH, 'utf8');
    const tenantList = yaml.load(configFile);
    const agentListPath = tenantList[organization].AgentFile;
    if (agentListPath) {
      const fileContent = await fs.readFile(agentListPath, 'utf8');
      if (fileContent)
        await fs.appendFile(
          agentListPath,
          `\n${agentIdsOfNewAccounts.join('\n')}`,
        );
      else
        await fs.appendFile(
          agentListPath,
          `${agentIdsOfNewAccounts.join('\n')}`,
        );
    }
    return 'Success';
  } catch (err) {
    console.log(err);
    return 'Failed';
  }
};

module.exports = updateAgent;
