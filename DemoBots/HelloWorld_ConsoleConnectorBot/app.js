var builder = require('botbuilder');
var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
bot.dialog('/', function (session) {
    session.send('Hello World, Are you guys having fun at Learning Summit yet?  Wait! It\'s just the beginning.');
});