const check_Email = require('../../utils/check_Email');
//const check_Id = require('./check_Id');

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
  const agent_Code = {};
  const email_Id = {};
  let id_Index; //column for 'Agent Code'
  let security_Group_Index; // column for 'Security Group'
  let first_Name_Index; // column for 'First Name'
  let last_Name_Index; //column for 'Last Name'
  let email_Index; //column for 'Email'
  let count_Sheets = 0; // counts the no of sheets in Excel file being parsed (to consider only the first sheet)
  var sheets;
  var index;
  var keys;
  for (sheets in json) {
    count_Sheets++;
    if (count_Sheets == 2) break; //consider only the first sheet
    for (index in json[sheets]) {
      if (index == 0) {
        for (keys in json[sheets][index]) {
          //index=0 represents the column names object
          columns.push(keys); //store all the column headers
          if (json[sheets][index][keys] == 'Agent Code') id_Index = keys; //column for Agent Code
          if (json[sheets][index][keys] == 'Security Group')
            security_Group_Index = keys; //column for Security Group
          if (json[sheets][index][keys] == 'First Name')
            first_Name_Index = keys; //column for First Name
          if (json[sheets][index][keys] == 'Last Name') last_Name_Index = keys; //column for Last Name
          if (json[sheets][index][keys] == 'Email') email_Index = keys; //column for Email
        }
      } else {
        const obj = {};
        const invalid_Obj = {};
        let validity = true; // is true if agent has all required data
        let partial_Validity = true; //is true if agent has missing data but not erroneous extra data.
        let possible_Error; //stores possible error
        //to get the row and column of missing data (if present)
        if (json[sheets][index][first_Name_Index] == undefined) {
          validity = false;
          possible_Error = 'Missing First Name';
        }
        if (json[sheets][index][last_Name_Index] == undefined) {
          validity = false;
          possible_Error = 'Missing Last Name';
        }
        if (json[sheets][index][security_Group_Index] == undefined) {
          validity = false;
          possible_Error = 'Missing Security Group';
        }

        if (
          json[sheets][index][security_Group_Index] !== 'Admin' &&
          json[sheets][index][security_Group_Index] !== 'Manager' &&
          json[sheets][index][id_Index] == undefined
        ) {
          possible_Error = 'Missing Agent Code';
          validity = false;
        }

        for (keys in json[sheets][index]) {
          //loop checks if there is any unexpected data in columns other than the specified header columns
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
          // record the current Agent Code if not repeating
          json[sheets][index][id_Index] &&
          agent_Code[json[sheets][index][id_Index]] !== 1
        )
          agent_Code[json[sheets][index][id_Index]] = 1;
        else if (
          //invalidate the Agent if 'Security Group' is not 'Admin' or 'Manager' and Agent Code is repeating
          json[sheets][index][id_Index] &&
          agent_Code[json[sheets][index][id_Index]] == 1 &&
          json[sheets][index][security_Group_Index] !== 'Admin' &&
          json[sheets][index][security_Group_Index] !== 'Manager'
        ) {
          validity = false;
          possible_Error = 'Duplicate Agent Code';
        }

        if (
          //record current Email Id
          json[sheets][index][email_Index] &&
          email_Id[check_Email(json[sheets][index][email_Index])] !== 1
        )
          email_Id[check_Email(json[sheets][index][email_Index])] = 1;
        else if (
          //duplicate Email Id
          json[sheets][index][email_Index] &&
          email_Id[check_Email(json[sheets][index][email_Index])] == 1
        ) {
          validity = false;
          possible_Error = 'Duplicate Email';
        }

        if (validity) {
          //totally valid object
          validated_Data.push(obj);
        }
        if (partial_Validity && !validity) {
          //some error in object
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
