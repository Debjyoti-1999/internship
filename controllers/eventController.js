const fs = require('fs');
const path = require('path');
const postMessage = require('../utils/postMessage');
const messageDisplay = require('../services/displayBlocks/messageDisplay');
const inspectRequest = require('../services/inspectbulkAccount/inspectRequest');
const fetchFile = require('../utils/fetchFile');
const excelToJson = require('../utils/convert_Excel_To__JSON');
const inspectSheet = require('../services/inspectbulkAccount/inspect_Sheet');
const transformProNotes = require('../services/transform/transform_ProNotes');
const transformProVoice = require('../services/transform/transform_ProVoice');
const store_As_Excel = require('../utils/store_As_Excel');
const uploadFile = require('../utils/uploadFile');

exports.parseEvent = async function (req, res) {
  // verification URL (mandatory)
  if (req.body.challenge) return res.status(200).send(req.body.challenge);

  // Send ack
  res.status(200).send();

  const typeOfEvent = req.body.event.type;

  let list_Of_Accounts;
  let destPath;

  if (typeOfEvent == 'app_mention') {
    const parsedRequest = inspectRequest(req.body.event); //inspect the request

    if (!parsedRequest.isValid) {
      // TODO: Clean up
      return postMessage(
        req.body.event.user,
        messageDisplay('Failed to create account', [parsedRequest.message])
          .blocks,
      );
    }

    const requestedProductLine = parsedRequest.message[1];
    const requestedTenant = parsedRequest.message[2];
    destPath = path.join(__dirname, '../response.xlsx');

    // get the file, store in response.xlsx
    try {
      await fetchFile(req.body.event.files[0].url_private_download, destPath);
    } catch (err) {
      console.log(err);
      return postMessage(
        req.body.event.user,
        messageDisplay('Failed to create account', [err.message]).blocks,
      );
    }

    const parsedData = excelToJson(path.join(__dirname, '../response.xlsx')); //convert EXCEL sheet  to json

    const cleanedData = inspectSheet(requestedProductLine, parsedData); //inspect sheet

    if (!cleanedData.validity) {
      //if sheet is invalid post appropriate response to the user
      return postMessage(
        req.body.event.user,
        messageDisplay(
          `Failed to create ${requestedProductLine} account`,
          cleanedData.data,
        ).blocks,
      );
    }

    if (requestedProductLine.toLowerCase() == 'pronotes') {
      list_Of_Accounts = await transformProNotes(
        cleanedData.data,
        requestedTenant,
        req.body.event.user,
      ); //list of accounts with details
      destPath = path.join(
        __dirname,
        `../account_Information/pronotes-${requestedTenant}-${new Date().getFullYear()}${
          new Date().getMonth() + 1
        }${new Date().getDate()}.xlsx`,
      );
    } else if (requestedProductLine.toLowerCase() == 'provoice') {
      list_Of_Accounts = await transformProVoice(
        cleanedData.data,
        requestedTenant,
        req.body.event.user,
      ); //list of accounts with details
      destPath = path.join(
        __dirname,
        `../account_Information/provoice-${requestedTenant}-${new Date().getFullYear()}${
          new Date().getMonth() + 1
        }${new Date().getDate()}.xlsx`,
      );
    }

    store_As_Excel(list_Of_Accounts, destPath); //store the data as excel file

    if (
      !(await uploadFile(req.body.event.user, destPath, requestedProductLine)) //upload the file to requester
    )
      postMessage(
        req.body.event.user,
        messageDisplay(
          'Accounts have been created, unable to upload the excel file in this channel',
        ).blocks,
      );
    if (
      !(await uploadFile(
        process.env.ADMIN_CHANNEL_ID,
        destPath,
        requestedProductLine,
      )) //upload the file in admin  channel
    )
      postMessage(
        req.body.event.user,
        messageDisplay(
          'Accounts have been created, unable to upload the excel file in admins channel',
        ).blocks,
      );

    fs.unlinkSync(destPath); //delete the stored file once sent to slack UI
  } //app_mention
};
