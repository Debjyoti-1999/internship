const express = require('express');
const app = express();
var expressWinston = require('express-winston');
var WinstonCloudWatch = require('winston-cloudwatch');
var winston = require('winston');
require('dotenv').config();
const commandsRoute = require('./routes/commandRoute');
const payloadRoute = require('./routes/payloadRoute');
const eventRoute = require('./routes/eventRoute');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

expressWinston.requestWhitelist.push('body'); //to print the body of the requst
expressWinston.responseWhitelist.push('body'); //to print the body of the response

var CloudWatchTransport = new WinstonCloudWatch({
  name: 'groot',
  logGroupName: '/applications/internal',
  logStreamName: 'Groot',
  awsRegion: 'us-east-2',
  jsonMessage: true,
});

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console(), CloudWatchTransport],
    ignoredRoutes: ['/healthCheck'],
  }),
);

app.use('/slack', commandsRoute); //route for slash commands
app.use('/slack', payloadRoute); // route for payloads
app.use('/slack', eventRoute); //route for events

app.get('/healthCheck', function (req, res) {
  res.sendStatus(200);
});

app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.prettyPrint()),
  }),
);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
