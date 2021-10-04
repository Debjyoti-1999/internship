/**
 *
 * @param {Array[String]} rows row number of all cells in EXCEL sheet that contains invalid data
 * @param {Array[String]} columns row number of all cells in EXCEL sheet that contains invalid data
 * @returns array of Strings to be diaplayed in output
 */
function generate_Output(rows, columns) {
  const outputArray = [];
  for (let i = 0; i < rows.length; i++) {
    outputArray.push('Unexpected data at cell ' + rows[i] + ' ' + columns[i]);
  }
  outputArray.push('Resend the excel sheet');
  return outputArray;
} //generate_Output
module.exports = generate_Output;
