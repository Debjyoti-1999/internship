const ManagementClient = require('auth0').ManagementClient;
const axios = require('axios').default;

const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  scope: 'create:users read:users',
});

const tokenOptions = {
  method: 'post',
  url: 'https://prodigaltech.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  // eslint-disable-next-line max-len
  data: '{"client_id":"eM2nkOiSszKaN8HZCb1WIesjP4cwZ8X5","client_secret":"ttWYf8Ch1cx5-4wWr8J6ZTimUSNaPvvkRW4eGRLdRUv69TC2c3DN4KxS6N9lNFfb","audience":"urn:auth0-authz-api","grant_type":"client_credentials"}',
};

const typeMapping = {
  prodigal_admin_group_id: '95f58371-9836-4891-9ff4-6c7ddb570d2b',
  Admin: 'c663041a-e188-4d58-820d-aad6f542f2d7',
  Manager: 'fb320e6e-b80b-4137-bd78-d9dd80136a4f',
  'Agent-Manager': 'f65ef58a-855c-4e8c-997e-328ea15e35a9',
  Agent: 'eea7f62e-9842-41ef-8370-dff90fecfff3',
};

/**
 *
 * @param {Object} user Object of agent details
 * @param {String} organisation ProNotes ID for the organisation
 *
 * @returns {Promise} Promise object that {resolves} if account is created and {rejected} if creation fails
 */

const createSingleAccount = (user, organisation) => {
  return auth0.createUser({
    email: `${user.Email}`,
    username: `${user.Email.split('.com')[0]}`,
    app_metadata: {
      tenant: organisation,
      appRoles: [user['Agent Code'] || '__all__'],
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
      const agentAccount = await createSingleAccount(
        { ...agent },
        organization,
      );
      return {
        ...agent,
        'Auth Key': agentAccount.user_id,
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
/**
 *
 * @param {Object} agent client object
 * @returns {Object} information of account or error message
 */
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

const addAuthorization = async (listOfAccounts) => {
  const res = await axios(tokenOptions);
  const access_token = res.data.access_token;
  console.log('Updating RBAC');
  Object.keys(listOfAccounts).forEach(async (type) => {
    if (listOfAccounts[type].length) {
      // eslint-disable-next-line max-len
      const reqUrl = `https://prodigaltech.us8.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api/groups/${typeMapping[type]}/members`;
      console.log(type, listOfAccounts[type]);
      try {
        await axios.patch(reqUrl, listOfAccounts[type], {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
        });
      } catch (err) {}
    }
  });
};

module.exports = {
  createSingleAccountFromSheet,
  createSingleAccountFromForm,
  addAuthorization,
};
