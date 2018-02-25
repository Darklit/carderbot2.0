const fs = require('fs');
const firebase = require('firebase');

module.exports = {
  addUser: function(userObj){
    return new Promise((fulfill,reject) => {
      var user = {
        displayName: userObj.username,
        money: 100,
        permissions: {}
      };
      firebase.database().ref('/users').child(`${userObj.id}`).set(user).then(() => {
        console.log(user);
        fulfill();
      });
    });
  },
  checkPermission: function(member,permission,serverID){
    return new Promise((fulfill,reject) => {
      console.log(member.user.id);
      firebase.database().ref('permissions').child(serverID).child(member.user.id).child(permission).once('value').then(snap => {
        if(snap.exists()){
          fulfill(snap.val());
        }else{
          fulfill(false);
        }
      });
    });
  },
  findUser: function(displayName, guild){
    var members = guild.members.array();
    for(var i = 0; i < members.length; i++){
      if(members[i].displayName == displayName) return members[i];
    }
    return null;
  }
}
