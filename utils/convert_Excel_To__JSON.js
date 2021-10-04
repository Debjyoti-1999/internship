//function to return JSON object from EXCEL sheet
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
/**
 *
 * @param {String} dest filename (Ex:sample-file.xlsx)
 * @returns {Object} JSON object of the excel sheet stored in path specified
 */
const convert = function (dest) {
  const json = excelToJson({
    sourceFile: dest,
  });
  fs.unlinkSync(dest); //delete the multer storage file as it is not needed after sending the response
  return json;
};
module.exports = convert;
