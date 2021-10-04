/**
 * @param {String} route name of the route(ProNotes or ProVoice etc)
 * @param {Object} json converted json object of excel sheet
 * @returns {Object} having keys ['data']( contains error message or validated sheet) and ['validity'] boolean
 */
const is_Valid_ProNotes = require('../validation/is_Valid_ProNotes');
const is_Valid_ProVoice = require('../validation/is_Valid_ProVoice');
const generate_Output = require('../../utils/generate_Output');
const inspect_Sheet = function (route, json) {
  let validated_Obj = {};
  const obj = {};
  if (route == 'pronotes') validated_Obj = is_Valid_ProNotes(json); //validate excel file
  if (route == 'provoice') validated_Obj = is_Valid_ProVoice(json); //validate excel file
  if (validated_Obj.rejected_Rows.length > 0) {
    //erroneous data present
    obj.data = generate_Output(
      validated_Obj.rejected_Rows,
      validated_Obj.rejected_Columns,
    );
    obj.validity = false;
    return obj;
  }
  obj.data = validated_Obj;
  obj.validity = true;
  return obj;
};
module.exports = inspect_Sheet;
