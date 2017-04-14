var builder = require('botbuilder');
var restify = require('restify');
var weatherClient = require('./wunderground-client');
 
 
 
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || 8080, function () {
    console.log('%s listening to %s', server.name, server.url);
    console.log('on endpoint ', '/v1/messages');
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: '6f24570c-c77c-4702-809b-0ec775a9a603',
    appPassword: 'j3r4bHTwwrvQiBMr1utuE9J'
});
var bot = new builder.UniversalBot(connector);
server.post('/v1/messages', connector.listen());
 
// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
//const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/de6e95aa-d82a-4b6d-bd87-081c9506fd1f?subscription-key=8b04c8a20681463dbd06cff365e5240a';
const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/de6e95aa-d82a-4b6d-bd87-081c9506fd1f?subscription-key=1388292dca3f41acb0a334090131e620'; 
// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
 
 
 
// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
 
bot.dialog('/', new builder.IntentDialog({ recognizers: [recognizer] })
    .matches('GetCurrentWeather', [
        function (session, args, next) {
            session.send('Welcome to the Weather Report! We are analyzing your message: \'%s\'', session.message.text);
 
             var locationEntity = builder.EntityRecognizer.findEntity(args.entities, 'AbsoluteLocation');
             if (locationEntity) {
                return next({ response: locationEntity.entity });
            } else {
                builder.Prompts.text(session, 'What location?');
            }
        },
        (session, results) => {
            weatherClient.getCurrentWeather(results.response, (responseString) => {
                session.send(responseString);
            });
        }
    ])
    .matches('Help', builder.DialogAction.send('Hi! Try asking me things like \'what is weather in Canton,MI \', \'what is weather in Seattle,Washington\' or \'what is weather in Ann Arbor,MI\''))
     .onDefault((session) => {
        session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
    }));