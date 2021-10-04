/**
 *
 * @param {Object} req Express request object
 * @param {Object} res Express Response object
 * @param {Function} next
 */
const cors = function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', [
    'http://localhost:3000',
    'https://internal-tools.prodigaltech.com/',
  ]);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'authorization');
  next();
};
module.exports = cors;
