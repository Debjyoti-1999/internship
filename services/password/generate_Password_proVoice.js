const HSXKPasswd = require('hsxkpasswd');

// Custom settings
const customSettings = {
  num_words: 3,
  word_length_min: 4,
  word_length_max: 8,
  case_transform: 'RANDOM',
  separator_character: '-',
  padding_type: 'NONE',
  padding_digits_before: 0,
  padding_digits_after: 1,
  allow_accents: 0,
};
const passwordGenerator = new HSXKPasswd.Generator(customSettings);

/**
 *
 * @returns {String} Password of an agent
 */
function generate_Password_proVoice() {
  return passwordGenerator.passwordSync();
}

module.exports = generate_Password_proVoice;
