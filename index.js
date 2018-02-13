var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId, //"5543f605-7b2b-457a-8a54-4483c67348ed"
    appPassword: process.env.MicrosoftAppPassword //"uquNT447]luvvCYAUT65![)"
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

var inMemoryStorage = new builder.MemoryBotStorage();
var bot = new builder.UniversalBot(connector, [
    //waterfall to control conversation
    function (session) {
        session.say("Welcome"); //to Poke A.P.I.
        session.beginDialog('askForPokemon');
    },

    function (session, results) {
        session.dialogData.pokemon = results.response.toLowerCase();
        session.beginDialog('askForStat');
    },

    function (session, results) {
        session.dialogData.stat = results.response.toLowerCase();
        session.say("looking up " + session.dialogData.stat + " of " + session.dialogData.pokemon);
        //for use in callback
        var data = session.dialogData;
        //do work
        var endpoint = 'https://pokeapi.co/api/v2/pokemon/' + session.dialogData.pokemon;
        request(endpoint, function(err, resp, body){
            if(!err && resp.statusCode == 200){
                var stats = JSON.parse(body).stats;
                var value = 0;
                for (var i = 0; i < stats.length; i++){
                    if (stats[i].stat.name === data.stat){
                        value = stats[i].base_stat;
                    }
                }
    			session.say("The " + data.stat + " of " + data.pokemon + " is "
                    value.toString());
            }
            else{
                session.say("Error");
            }
        });
        session.endDialog();
    }
]).set('storage', inMemoryStorage); //not sure how to use this yet

bot.dialog('askForPokemon',[
    function(session){
        session.say('Which pokemon?');
        builder.Prompts.text(session, 'Which pokemon?');
    },
    function(session, results){
        session.endDialogWithResult(results);
    }
]);

bot.dialog('askForStat',[
    function(session){
        session.say('Which stat?');
        builder.Prompts.text(session, 'Which stat?');
    },
    function(session, results){
        session.endDialogWithResult(results);
    }
]);
