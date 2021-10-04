# GROOT
Slack bot for almost anything 

## Procedure
>Integrate this with your slack UI using the manifest.yml/json file.
*For more info refer this link*:
 [Click Me](https://app.slack.com/app-settings/T027LTGDH3N/A02700K2UQP/app-manifest)
 >
 >
 >run:  **npm run start**

## Commands
* /createAccount (for generic account)
* /createSingleAccount ProNotes (for pronotes account)
* /createSingleAccount ProVoice (for provoice account)

## Event Listeners
* @Groot<type_of_account><name_of_organization><file.xlsx>
Ex: _@Groot pronotes google file.xlsx_

# Adding a new command
* Set up a new  endpoint in slack.
* Add that endpoint in the _routes/commandRoute.js_
* Add controller for the command in _controllers/commandController.js_
* Refer this [link](https://loom.com/share/21ea1a55a4e347dfaa221c1d5d0e1654) for more info.

# Adding a new event listener
* Set up new event listener in slack.
* Add controller for the event in _controllers/eventControllers_ .No requirement for adding new route as slack will be sending all payloads (trigerred from an event) at _routes/eventRoute.js_
* Refer this [link](https://www.loom.com/share/464a1b58b8364233a8215b2921f8294b) for more info.

# Receiving payloads 
* When a user in slack uses ["Interactive component"](https://api.slack.com/messaging/interactivity#components)  (Ex: modals or form or shortcuts), the payload is received in the _controllers/payloadController.js_.So once an interactive component has been setup , just an appropriate controller needs to  be added in _controllers/payloadController.js_ for receiving payloads form it.
* Refer this [link](https://www.loom.com/share/44550f846e7042c28638fa2d6575f211) for more info.

# Adding new features to the existing routes
* ## Single Account route for ProNotes
   * New features can be added in  _services/singleAccountCreation/createSingleProNotesAccount.js_  script. For ex: we can add feature for sending emails for this route by using  _utils/sendEmailAWS.js_ in this script.
* ## Single Account route for ProVoice
   * New features can be added in _services/singleAccountCreation/createSingleProVoiceAccount.js_.
* ## Bulk account route for ProNotes
   * New feature for bulk account can be added in _services/transform/modify_ProNotes.js_.
* ## Bulk account route for ProVoice
  * New feature for bulk account can be added in _services/transform/modify_ProVoice.js_.
