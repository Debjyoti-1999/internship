const modify_ProNotes = require('./modify_ProNotes');
const get_Valid_Agents_Data = require('../../utils/get_Valid_Agents_Data');
var index;
/**
 *
 * @param {Object} obj has property 'validated_Data' and 'invalid_Data' having list of valid members and invalid members
 * @param {String} organization contains the name of organization (passed in req.body)
 * @returns {Arrray[Objects]} list of objects of all the members with their account details
 */
const transform = async function (obj, organization, requesterId) {
  const extractedJson = get_Valid_Agents_Data(
    obj.validated_Data,
    obj.invalid_Data,
  );

  const parsedData = await modify_ProNotes(
    //will modify the data and create accounts for the appropriate users
    extractedJson.previously_Valid_Data,
    extractedJson.currently_Valid_Data,
    extractedJson.currently_Invalid_Data,
    organization,
    requesterId,
  );

  const finalJsonObj = [];
  for (index in extractedJson.previously_Valid_Data) //add the previously valid members (already created accounts)
    finalJsonObj.push(extractedJson.previously_Valid_Data[index]);
  for (index in parsedData) //add the currently valid members + invlid members
    finalJsonObj.push(parsedData[index]);
  return finalJsonObj;
};
module.exports = transform;
