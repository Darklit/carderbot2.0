const fs = require('fs');
const firebase = require('firebase');
const config = require('./config.js');
const request = require('request');
module.exports = {
  addUser: function(userObj){
    return new Promise((fulfill,reject) => {
      var user = {
        displayName: userObj.username,
        permissions: {}
      };
      firebase.database().ref('/users').child(`${userObj.id}`).set(user).then(() => {
        console.log(user);
        firebase.database().ref('/money').child(`${userObj.id}`).set(100).then(()=>{
          fulfill();
        });
      });
    });
  },
  checkPermission: function(member,permission,serverID){
    return new Promise((fulfill,reject) => {
      console.log(member.user.id);
      if(member.user.id == config.ownerid) fulfill(true);
      else{
        firebase.database().ref('permissions').child(serverID).child(member.user.id).child(permission).once('value').then(snap => {
          if(snap.exists()){
            fulfill(snap.val());
          }else{
            fulfill(false);
          }
        });
      }
    });
  },
  findUser: function(displayName, guild){
    var members = guild.members.array();
    for(var i = 0; i < members.length; i++){
      if(members[i].displayName.toLowerCase() == displayName.toLowerCase()) return members[i];
    }
    return null;
  },

  authenticate: function(token,userID){
    console.log(config.spotify.client_secret);
    var authenticate = new Buffer(`${config.spotify.client_id}:${config.spotify.client_secret}`);
    var base64 = authenticate.toString('base64');
    var options = {
      url: `https://accounts.spotify.com/api/token`,
      form: {
        grant_type: 'authorization_code',
        code: token,
        redirect_uri: 'https://carder-bot.firebaseapp.com/callback/'
      },
      headers: {
        'Authorization': 'Basic ' + base64,
      },
      json: true
    };
    request.post(options,(err,res,body) => {
      if(!err && res.statusCode == 200){
        firebase.database().ref('users').child(userID).child('spotify').child('token').set(body.access_token);
        firebase.database().ref('users').child(userID).child('spotify').child('refresh').set(body.refresh_token);
      }else{
        console.log(res);
      }
    });
  },
  refreshToken: function(userID){
    return new Promise((fulfill,reject) => {
      firebase.database().ref('users').child(userID).child('spotify').child('refresh').once('value').then(snap => {
        if(snap.exists()){
          var refresh = snap.val();
          var authenticate = new Buffer(`${config.spotify.client_id}:${config.spotify.client_secret}`);
          var base64 = authenticate.toString('base64');
          var options = {
            url: `https://accounts.spotify.com/api/token`,
            form: {
              grant_type: 'refresh_token',
              refresh_token: refresh
            },
            headers: {
              'Authorization': 'Basic ' + base64,
            },
            json: true
          };
          request.post(options,(err,res,body) => {
            if(!err && (res.statusCode == 200 || res.statusCode == 201)){
              console.log(res.statusCode);
              firebase.database().ref('users').child(userID).child('spotify').child('token').set(body.access_token).then(() => {
                fulfill();
              }).catch(console.error);
            }else{
              reject(res);
            }
          });
        }
      }).catch(console.error);
    });
  }
}
