var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen for messages
var connector = new builder.ChatConnector({
    appId: '6f24570c-c77c-4702-809b-0ec775a9a603',
    appPassword: 'j3r4bHTwwrvQiBMr1utuE9J'
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector);

var intents = new builder.IntentDialog();
bot.dialog('/', intents);
intents.matches(/^say something else/i, [
    function (session) {
        session.beginDialog('/changesentence');
    },
    function (session, results) {
        session.send('Ok, I will say the following sentence from now on: %s', session.userData.sentence);
    }
]);
intents.onDefault([
    function (session, args, next) {
        if (!session.userData.sentence) {
            session.beginDialog('/changesentence');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send(session.userData.sentence);
    }
]);
bot.dialog('/changesentence', [
    function (session) {
        builder.Prompts.text(session, 'Hi, I am version 2.0 of the Microsoft Chatbot! I am already a lot smarter now! What would you like me to say?');
    },
    function (session, results) {
        session.userData.sentence = results.response;
        session.endDialog();
    }
]);