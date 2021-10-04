const express = require('express');
const app = express.Router();
const payloadController = require('../controllers/payloadController');
app.post('/payloads', payloadController.createAccount);

module.exports = app;
