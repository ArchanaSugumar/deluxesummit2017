var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
   console.log('on endpoint ', '/api/messages');
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: '6f24570c-c77c-4702-809b-0ec775a9a603',
    appPassword: 'j3r4bHTwwrvQiBMr1utuE9J'
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {
    session.send('Hello World, I am version 1.0 of the Microsoft Chatbot. Unfortunately, I\'m not very smart just yet');
});


