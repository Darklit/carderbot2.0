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
  }
}
