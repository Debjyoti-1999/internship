const express = require('express');
const app = express.Router();
const eventController = require('../controllers/eventController');

app.post('/events', eventController.parseEvent);

module.exports = app;
