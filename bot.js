const Commando = require('discord.js-commando');
const config = require('./config.js');
const client = new Commando.Client({
  owner: config.ownerid,
  commandPrefix: '=',
  unknownCommandResponse: false
});
const firebase = require('firebase');

const path = require('path');

const fs = require('fs');

const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1};
var talking = false;
var dispatcher;

client.registry
  .registerGroups([
    ['fun', 'Fun commands'],
    ['chattools', 'Chat moderation'],
    ['admin', 'Tools to help the bot and admins'],
    ['music', "Music commands"],
    ['economy', 'Manage money or do things relating to money']
  ])
  .registerDefaults()

  .registerCommandsIn(path.join(__dirname,'commands'));

  firebase.initializeApp(config.firebase);

  client.login(config.token);

  client.on('ready', () =>{
    console.log('Ready!');
  });
