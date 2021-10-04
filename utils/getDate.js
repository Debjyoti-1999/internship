const date = function () {
  return `${new Date().getDate()}-${
    new Date().getMonth() + 1
  }-${new Date().getFullYear()}`;
};
module.exports = date;
