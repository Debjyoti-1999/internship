var userLogGeneric = {};
var userLogProVoice = {};
var userLogProNotes = {};

const checkHistoryGeneric = function (userId, userName) {
  if (!(userId in userLogGeneric)) {
    userLogGeneric[userId] = {};
    userLogGeneric[userId].userName = userName;
    userLogGeneric[userId].possible = true;
  }
  return userLogGeneric[userId];
};

const checkHistoryProNotes = function (userId, userName) {
  if (!(userId in userLogProNotes)) {
    userLogProNotes[userId] = {};
    userLogProNotes[userId].userName = userName;
    userLogProNotes[userId].possible = true;
  }
  return userLogProNotes[userId];
};
const checkHistoryProVoice = function (userId, userName) {
  if (!(userId in userLogProVoice)) {
    userLogProVoice[userId] = {};
    userLogProVoice[userId].userName = userName;
    userLogProVoice[userId].possible = true;
  }
  return userLogProVoice[userId];
};
const setDataGeneric = function (userId, formData) {
  userLogGeneric[userId].data = formData;
  userLogGeneric[userId].possible = false;
};

const setDataProNotes = function (userId, formData) {
  userLogProNotes[userId].data = formData;
  userLogProNotes[userId].possible = false;
};
const setDataProVoice = function (userId, formData) {
  userLogProVoice[userId].data = formData;
  userLogProVoice[userId].possible = false;
};
const removeDataGeneric = function (userId) {
  userLogGeneric[userId].possible = true;
};

const removeDataProNotes = function (userId) {
  userLogProNotes[userId].possible = true;
};

const removeDataProVoice = function (userId) {
  userLogProVoice[userId].possible = true;
};
const getDataProNotes = function (userId) {
  return userLogProNotes[userId];
};
const getDataProVoice = function (userId) {
  return userLogProVoice[userId];
};
const getDataGeneric = function (userId) {
  return userLogGeneric[userId];
};

module.exports = {
  checkHistoryGeneric,
  checkHistoryProNotes,
  checkHistoryProVoice,
  setDataGeneric,
  setDataProNotes,
  setDataProVoice,
  removeDataGeneric,
  removeDataProNotes,
  removeDataProVoice,
  getDataGeneric,
  getDataProNotes,
  getDataProVoice,
};
