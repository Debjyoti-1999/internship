const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
var proVoiceResponse;

const setProVoiceEmailResponse = function (json) {
  proVoiceResponse = json.actions[0].value;
  eventEmitter.emit('response'); //emit 'response' once the request is received
};

const getProVoiceEmailResponse = async function () {
  return new Promise(function (resolve, reject) {
    try {
      eventEmitter.on('response', function () {
        if (proVoiceResponse == '0') {
          return resolve(false); //email request denied
        }
        if (proVoiceResponse == '1') {
          return resolve(true); //email request permitted
        }
      });
    } catch (err) {
      return reject(false);
    }
  });
};
module.exports = { getProVoiceEmailResponse, setProVoiceEmailResponse };
