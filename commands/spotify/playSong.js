const Commando = require("discord.js-commando");
const firebase = require('firebase');
const methods = require('./../../methods.js');
const request = require('request');
const stringSimilarity = require('string-similarity');

//Change Name
class PlaySongCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'playsong',
      group: 'spotify',
      memberName: 'playsong',
      description: 'Search and play a song from spotify! PREMIUM REQUIRED',
      guildOnly: false,


      args: [
        {
          key: 'song',
          prompt: 'What song are you going to play?',
          type: 'string'
        }
      ]

    });
  }

  run(message,args){
    firebase.database().ref('users').child(message.author.id).child('spotify').child('token').once('value').then(snap => {
      if(snap.exists()){
        var token = snap.val();
        methods.refreshToken(message.author.id).then(() => {
          this.search(args.song,'track',token).then(data => {
            console.log('here');
            var results = data.tracks.items;
            var names = [];
            for(var i = 0; i < results.length; i++){
              names.push(results[i].name);
            }
            var wild = [];
            for(var i = 0; i < names.length; i++){
              wild.push({
                similarity: stringSimilarity.compareTwoStrings(names[i], args.song),
                name: names[i]
              });
            }
            var sortFunction = function(a,b){
              if(a.similarity > b.similarity) return -1;
              if(a.similarity < b.similarity) return 1;
              return 0;
            };
            wild.sort(sortFunction);
            var songName = wild[0].name;
            var song;
            for(var i = 0; i < results.length; i++){
              if(results[i].name == songName){
                song = results[i];
                break;
              }
            }
            this.getPlaying(token).then((useless) => {
              console.log(song);
              var context = song.album.uri
               this.playSong(token,song.uri,context);
            }).catch(console.error);
            message.reply("Song playing!");
          }).catch(console.error);
        }).catch(console.error);
      }else{
        message.reply("You have not authenticated! Please do =spotify to do so.");
      }
    }).catch(console.error);
  }

  search(name,type,token){
      return new Promise((fulfill,reject) => {
        while(name.includes(' ')){
          name = name.replace(' ','+');
        }
        if(token === undefined) throw 'Application did not authenticate';
        var requestOptions = {
          url: `https://api.spotify.com/v1/search?q=${name}&type=${type}`,
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          json: true
        };
        request.get(requestOptions,(err,res,body) => {
          if(!err && (res.statusCode == 200 || res.statusCode == 201)){
            fulfill(body);
          }else{
            reject(res.statusCode);
          }
        });
      });
    }

    getPlaying(token){
      return new Promise((fulfill,reject) => {
        let options = {
          url: 'https://api.spotify.com/v1/me/player',
          headers: {
            'Authorization': 'Bearer ' + token
          },
          json: true
        };
        request.get(options,(err,res,body) => {
          if(!err && (res.statusCode == 200 || res.statusCode == 201)){
            if(body.context !== null) fulfill(body.context.uri);
            else fulfill(undefined);
          }else{
            reject(res);
          }
        });
      });
    }

    playSong(token,songID, context){
      let options;
      if(context !== null && context !== undefined){
        options = {
          url: 'https://api.spotify.com/v1/me/player/play',
          headers: {
            'Authorization': 'Bearer ' + token
          },
          body: {
            context_uri: context,
            offset: {
              uri: songID
            }
          },
          json: true
        };
      }else{
        options = {
          url: 'https://api.spotify.com/v1/me/player/play',
          headers: {
            'Authorization': 'Bearer ' + token
          },
          body: {
            uris: [songID]
          },
          json: true
        };
      }
      request.put(options,(err,res,body)=>{
        if(!err && (res.statusCode == 200 || res.statusCode == 201)){
          console.log(body);
        }else{
          console.log(res);
        }
      });
    }


}

module.exports = PlaySongCommand;
