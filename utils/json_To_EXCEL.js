const xlsx = require('xlsx');
/**
 *
 * @param {Object} parsedData JSON object
 * @param {String} location path to store the converted EXCEL sheet
 */
function json_To_Excel(parsedData, location) {
  const newWorkBook = xlsx.utils.book_new();
  const newWorkSheet = xlsx.utils.json_to_sheet(parsedData);
  xlsx.utils.book_append_sheet(newWorkBook, newWorkSheet);
  xlsx.writeFile(newWorkBook, location);
} //json_To_Excel
module.exports = json_To_Excel;
