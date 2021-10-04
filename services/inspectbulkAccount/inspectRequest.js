const inspect = (requestText) => {
  // This is expected to be `@groot <product> <tenant>`
  const requestElements = requestText.text.split(' ');

  if (requestElements.length === 1) {
    // Easter egg
    return {
      isValid: false,
      message: 'I am Groot',
    };
  } else if (requestElements.length !== 3) {
    // Easter egg
    return {
      isValid: false,
      message: 'Invalid formating. Use @Groot <ProNotes|ProVoice> <tenant>',
    };
  } else if (requestText.files == undefined) {
    //missing EXCEL sheet
    return {
      isValid: false,
      message: 'Missing EXCEL sheet',
    };
  } else if (requestText.files[0].filetype !== 'xlsx') {
    return {
      isValid: false,
      message: 'Unrecognised file type. Please upload a excel file',
    };
  } else if (
    requestElements[1].toLowerCase() == 'pronotes' ||
    requestElements[1].toLowerCase() == 'provoice'
  ) {
    return {
      isValid: true,
      message: requestElements,
    };
  } else {
    //invalid request type
    return {
      isValid: false,
      message: 'I am Groot',
    };
  }
};

module.exports = inspect;
