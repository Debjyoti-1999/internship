const json_To_Excel = require('./json_To_EXCEL');
/**
 *
 * @param {Array[Objects]} list_Of_Accounts array of objects containing details of agents
 * @param {String} path path to store the EXCEL file
 */
const store_As_Excel = function (list_Of_Accounts, path) {
  const parsedData = JSON.parse(JSON.stringify(list_Of_Accounts));
  json_To_Excel(parsedData, path); //store as EXCEL sheet
};
module.exports = store_As_Excel;
