/**
 *
 * @param {Array[String]} form data of the form
 * @returns
 */
const valid = function (form) {
  const obj = {};
  obj.validity = true;
  if (form[4] == null) {
    //missing Agent Code check for validity
    if (form[2] == 'Agent' || form[2] == 'Agent-Manager') {
      obj.validity = false;
    }
  }

  obj.data = {
    response_action: 'errors',
    errors: {
      agentCode: 'This field is required',
    },
  }; //resend the form to the requester
  return obj;
};
module.exports = valid;
