/**
 *
 * @param {String} header Header of the message to be displayed
 * @param {Array[String]} textArray Array of text messages to be displayed
 * @returns {Object} Object containing an array of block elements
 */
const cloneDeep = require('clone-deep');
const multipleMessageDisplay = function (header, textArray = []) {
  const block = [];
  const obj = {};
  block.push(setDividerBlock());
  block.push(setHeader(header));
  for (var index in textArray) block.push(setSectionBlock(textArray[index]));

  block.push(setDividerBlock());
  obj.blocks = block;
  return obj;
};

module.exports = multipleMessageDisplay;

const setHeader = function (val) {
  const hb = cloneDeep(headerBlock);
  hb.text.text = val;
  return hb;
};
const setSectionBlock = function (val) {
  const sb = cloneDeep(sectionBlock);
  sb.text.text = val;
  return sb;
};
const setDividerBlock = function () {
  const db = cloneDeep(dividerBlock);
  return db;
};
const headerBlock = {
  type: 'header',
  text: {
    type: 'plain_text',
    text: '#',
    emoji: true,
  },
};
const sectionBlock = {
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: '#',
  },
};
const dividerBlock = {
  type: 'divider',
};
