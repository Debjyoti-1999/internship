const express = require('express');
const app = express.Router();
const commandController = require('../controllers/commandController');

app.post('/commands/createAccount', commandController.createAccount);

app.post(
  '/commands/createSingleAccount',
  commandController.createSingleAccount,
);

//app.post('/commands/configure', commandController.configure);

module.exports = app;
