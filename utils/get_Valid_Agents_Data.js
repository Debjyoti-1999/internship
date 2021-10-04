/**
 *
 * @param {Array[Objects]} validated_Data list of Objects of members whose data has already been verified and is correct.
 * @param {Array[Objects]} invalid_Data list of Objects whose accounts are still invalid.
 * @returns {Object} is an object with 3 lists.
First list has array of Objects of members whose accounts has already been created
Second list has array of Objects of members whose accounts are required to be created.
Third list has array of invalid members.
 *
 */
function get_Valid_Agents_Data(validated_Data, invalid_Data) {
  //extract the previously "YES" rows , "NO" rows ,
  const obj = {};
  const previously_Valid_Data = [];
  const currently_Valid_Data = [];
  let index;
  for (index in validated_Data) {
    if (validated_Data[index]['Accounts-Created'] == 'YES') {
      //previously created valid accounts
      previously_Valid_Data.push(validated_Data[index]);
    } else if (validated_Data[index]['Accounts-Created'] == 'NO') {
      //previously created invalid accounts which are now valid
      currently_Valid_Data.push(validated_Data[index]);
    } else {
      //file being sent for the first time so no "Accounts-Created" field  but the row is valid
      currently_Valid_Data.push(validated_Data[index]);
    }
  }
  obj.previously_Valid_Data = previously_Valid_Data;
  obj.currently_Valid_Data = currently_Valid_Data;
  obj.currently_Invalid_Data = invalid_Data;
  return obj;
} //get_Valid_Agents_Data
module.exports = get_Valid_Agents_Data;
