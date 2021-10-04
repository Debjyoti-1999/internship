const check_Id = require('../../utils/check_Id');
/**
 *
 * @param {Object} json is the JSON object returned by convert_Excel_To_Json() function
 * @returns {Object{
 * validated_Data:Array[Objects],
 * invalid_Data:Array[Objects],
 * rejected_Rows:Array[Objects],
 * rejected_Columns:Array[Objects]
 * }
 * }
 */

function is_Valid(json) {
  //validate the excel sheet
  const columns = [];
  const validated_Data = [];
  const invalid_Data = [];
  const rejected_Rows = [];
  const rejected_Columns = [];
  const agent_Id = {};
  let first_Name_Index; // column for 'First Name'
  let last_Name_Index; //column for 'Last Name'
  let id_Index;
  var keys;
  var index;
  let count_Sheets = 0; // counts the no of sheets in Excel file being parsed (to consider only the first sheet)
  let sheets;
  for (sheets in json) {
    count_Sheets++;
    if (count_Sheets == 2) break; //consider only the first sheet
    for (index in json[sheets]) {
      if (index == 0) {
        for (keys in json[sheets][index]) {
          columns.push(keys); //store all the column headers
          if (json[sheets][index][keys] == 'Agent Id') {
            id_Index = keys; //column for Agent Id
          }
          if (json[sheets][index][keys] == 'First Name') {
            first_Name_Index = keys; //column for First Name
          }
          if (json[sheets][index][keys] == 'Last Name') {
            last_Name_Index = keys; //column for Last Name
          }
        }
      } else {
        const obj = {};
        const invalid_Obj = {};
        let validity = true;
        let partial_Validity = true;
        let possible_Error;
        if (json[sheets][index][first_Name_Index] == undefined) {
          validity = false;
          possible_Error = 'Missing First Name';
        }
        if (json[sheets][index][last_Name_Index] == undefined) {
          validity = false;
          possible_Error = 'Missing Last Name';
        }
        if (json[sheets][index][id_Index] == undefined) {
          validity = false;
          possible_Error = 'Missing Agent Id';
        }

        for (keys in json[sheets][index]) {
          if (columns.includes(keys) == false) {
            // incorrectly placed data (reject the entire sheet)
            rejected_Rows.push(parseInt(index) + 1);
            rejected_Columns.push(keys);
            validity = false;
            partial_Validity = false;
            continue;
          }

          if (validity) {
            //valid object (totally valid i.e. no missing data)
            obj[json[sheets][0][keys]] = json[sheets][index][keys];
          }
          if (partial_Validity) {
            //partially valid obj (some missing data)
            invalid_Obj[json[sheets][0][keys]] = json[sheets][index][keys];
          }
        }

        if (
          json[sheets][index][id_Index] &&
          agent_Id[check_Id(json[sheets][index][id_Index])] !== 1
        )
          // record the current agent Id if not repeating
          agent_Id[check_Id(json[sheets][index][id_Index])] = 1;
        else if (
          json[sheets][index][id_Index] &&
          agent_Id[check_Id(json[sheets][index][id_Index])] == 1
        ) {
          //agent Id is repeating
          validity = false;
          possible_Error = 'Duplicate Agent Id';
        }

        if (validity) {
          validated_Data.push(obj);
        }
        if (partial_Validity && !validity) {
          invalid_Obj['Possible-Error'] = possible_Error;
          invalid_Data.push(invalid_Obj);
        }
      } //else
    } //for
  } //for
  const object = {};
  object.validated_Data = validated_Data;
  object.invalid_Data = invalid_Data;
  object.rejected_Rows = rejected_Rows;
  object.rejected_Columns = rejected_Columns;
  return object;
} //is_Valid
module.exports = is_Valid;
