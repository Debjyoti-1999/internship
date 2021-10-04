const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
var index;

/**
 *
 * @param {Array[Object]} message list of objects containing account details of each user
 * @param {String} email key for the email
 * @param {String} password key for the password
 */
const send_Mail = async function (message, email, password) {
  for (index in message) {
    const html_String = await ejs.renderFile(
      path.join(__dirname, '../views/email_Template.ejs'),
      {
        username: message[index][email],
        password: message[index][password],
      },
    );
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });
    const data = {
      from: process.env.USER,
      to: message[index][email],
      subject: 'Welcome to Prodigal!!',
      html: html_String,
    };

    await transporter.sendMail(data);
  }
};
module.exports = send_Mail;
