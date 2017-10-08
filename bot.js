const Commando = require('discord.js-commando');
const config = require('./config.js');
const client = new Commando.Client({
  owner: config.ownerid,
  commandPrefix: '=',
  unknownCommandResponse: false
});

const path = require('path');

const fs = require('fs');

client.registry
  .registerGroups([
    ['fun', 'Fun commands'],
    ['chattools', 'Chat moderation'],
    ['admin', 'Tools to help the bot and admins'],
    ['music', "Music commands"]
  ])
  .registerDefaults()

  .registerCommandsIn(path.join(__dirname,'commands'));


  client.login(config.token);

  client.on('ready', () =>{
    console.log('Ready!');
  });
