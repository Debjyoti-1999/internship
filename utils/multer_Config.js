//multer configuration file
const multer = require('multer');
var storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = file.originalname.split('.').pop();
    if (ext !== 'xlsx') {
      return callback(null, false);
    }
    callback(null, true);
  },
}).single('excel-data');

module.exports = upload;
