const ManagementClient = require('auth0').ManagementClient;
const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  scope: 'create:users read:users',
});

/**
 *
 * @param {Object} user Object of agent details
 * @param {String} organisation ProNotes ID for the organisation
 *
 * @returns {Promise} Promise object that {resolves} if account is created and {rejected} if creation fails
 */

const createSingleAccount = (user, organisation) => {
  return auth0.createUser({
    email: `${user['E-Mail']}`,
    username: `${user['E-Mail'].split('.com')[0]}`,
    app_metadata: {
      agentDetails: {
        organisation: organisation,
        agentId: user['Agent Id'],
        name: `${user['First Name']} ${user['Last Name']}`,
      },
    },
    name: `${user['First Name']} ${user['Last Name']}`,
    nickname: `${user['First Name']} ${user['Last Name']}`,
    connection: 'VoiceAppLogin',
    password: user.password,
  });
};

/**
 *
 * @param {Array[Object]} Array of agent objects
 *
 * @returns {Array} Array of Promise Objects, resolves to the array of agents
 *  passed as param but with 'created' and 'reason' fields attached
 */

const createSingleAccountFromSheet = async (agents, organization) => {
  // promiseArray is an array of promise which will resolve to
  const promiseArray = agents.map(async (agent) => {
    try {
      await createSingleAccount({ ...agent }, organization);
      return {
        ...agent,
        'Accounts-Created': 'YES',
        'Possible-Error': 'Nil',
      };
    } catch (err) {
      // Account creation failed -> Attach reason for failure
      return {
        ...agent,
        'Accounts-Created': 'NO',
        'Possible-Error': err.message,
      };
    }
  });
  const res = await Promise.all(promiseArray);
  return res;
};
const createSingleAccountFromForm = async (agent) => {
  try {
    const agentAccount = await createSingleAccount(
      { ...agent },
      agent.organisation,
    );
    return {
      validity: true,
      data: { ...agent, 'Auth Key': agentAccount.user_id },
    };
  } catch (err) {
    return {
      validity: false,
      data: err.message,
    };
  }
};
module.exports = { createSingleAccountFromSheet, createSingleAccountFromForm };
