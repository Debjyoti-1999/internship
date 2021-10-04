var AWS = require('aws-sdk');
const path = require('path');
const ejs = require('ejs');
AWS.config.update({ region: 'us-east-2' });
var lambda = new AWS.Lambda();
const LAMBDA_FUNCTION_NAME = 'OhLambdaEmailHandler';

/**
 *
 * @param {Array[Objects]} message list of objects of clients
 * @param {String} email email key Ex: 'E-Mail' or 'Email'
 * @param {String} password //password key Ex: 'password'
 */

const sendBulkEmail = async function (message, emailKey, passwordKey) {
  const promiseArray = message.map((account) =>
    sendSingleEmail(account, emailKey, passwordKey),
  );
  let res = await Promise.all(promiseArray);
  res = res.map((lambdaResponse) => {
    return lambdaResponse.StatusCode === 200
      ? 'Email sent'
      : 'Error sending email';
  });
  const parsedMessage = message.map((data, idx) => ({
    ...data,
    'Email Status': res[idx],
  }));
  console.log(parsedMessage);
  return parsedMessage;
};

/**
 *
 * @param {Object} clientObj object of a client
 * @param {String} emailKey email key of client
 * @param {String} passwordKey password of client
 */

const sendSingleEmail = async function (clientObj, emailKey, passwordKey) {
  const lambdaPayload = await createPayload(clientObj, emailKey, passwordKey);
  const params = {
    FunctionName: LAMBDA_FUNCTION_NAME,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(lambdaPayload),
  };

  return lambda.invoke(params).promise();
};

/**
 *
 * @param {String} subject subject of email
 * @param {String} message content of email
 * @param {String} to recipient of email
 * @param {String} cc 'cc' of email
 */

const sendRandomEmail = async function (subject, message, to, cc) {
  const lambdaPayload = await createRandomPayload(subject, message, to, cc);
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
/**
 *
 * @param {Object} user client object
 * @param {String} emailKey email key of client
 * @param {String} passwordKey password of client
 * @returns
 */

const createPayload = async function (user, emailKey, passwordKey) {
  const htmlString = await ejs.renderFile(
    path.join(__dirname, '../views/email_Template.ejs'),
    {
      username: user[emailKey],
      password: user[passwordKey],
    },
  );
  const email = {
    email: {
      to: [user[emailKey]], // Required
      cc: [],
      bcc: [],
      reply_to: 'mayank.agarwal@prodigaltech.com',
      subject: 'Welcome to Prodigal!', // Required
      body: {
        type: 'html', // Required
        content: htmlString, // Required
      },
      attachments: [],
    },
    metadata: {
      tenant: 'internal',
    },
  };
  return email;
};

/**
 *
 * @param {String} mailSubject Subject of email
 * @param {String} mailmessage content of email
 * @param {String} recipient recipient of email
 * @param {String} collaborator 'cc' of the mail
 * @returns
 */
const createRandomPayload = async function (
  mailSubject,
  mailmessage,
  recipient,
  collaborator,
) {
  const email = {
    email: {
      to: ['infosec@prodigaltech.com'], // Required
      cc: [collaborator],
      bcc: [],
      reply_to: 'infosec@prodigaltech.com',
      subject: mailSubject, // Required
      body: {
        type: 'plain', // Required
        content: mailmessage, // Required
      },
      attachments: [],
    },
    metadata: {
      tenant: 'internal',
    },
  };
  return email;
};

// const testEmail = async () => {
//   const htmlString = await ejs.renderFile(
//     path.join(__dirname, '../views/email_Template.ejs'),
//     {
//       username: 'test',
//       password: 'test123!',
//     },
//   );
//   const params = {
//     FunctionName: LAMBDA_FUNCTION_NAME,
//     InvocationType: 'RequestResponse',
//     Payload: JSON.stringify({
//       email: {
//         to: ['mayank.agarwal@prodigaltech.com'], // Required
//         cc: [],
//         bcc: [],
//         reply_to: 'mayank.agarwal@prodigaltech.com',
//         subject: 'This is a test', // Required
//         body: {
//           type: 'html', // Required
//           content: htmlString, // Required
//         },
//         attachments: [],
//       },
//       metadata: {
//         tenant: 'internal',
//       },
//     }),
//   };
//   lambda.invoke(params, function (err, data) {
//     if (err) {
//       console.log(err);
//     }
//   });
// };

// testEmail();

module.exports = { sendBulkEmail, sendSingleEmail, sendRandomEmail };
