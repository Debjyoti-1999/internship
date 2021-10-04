var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2' });
var lambda = new AWS.Lambda();
const LAMBDA_FUNCTION_NAME = 'OhLambdaProVoiceAccountCreation';

/**
 *
 * @param {Array[Objects]} agentList list of agent objects
 * @param {String} organization tenant name
 */
const updateAgentInfo = async function (agentList, organization) {
  const agentUpdateList = agentList.map(function (agent) {
    return {
      id: agent['Auth Key'],
      email: agent.Email,
      app_roles: [agent['Agent Code'] || '__all__'],
    };
  });
  const lambdaPayload = {
    tenantName: organization,
    accounts: agentUpdateList,
  };
  console.log('Dumping data into the DB', lambdaPayload);
  const params = {
    FunctionName: LAMBDA_FUNCTION_NAME,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(lambdaPayload),
  };
  lambda.invoke(params, function (err, data) {
    if (err) {
      console.log(err);
    }
  });
};

module.exports = updateAgentInfo;
