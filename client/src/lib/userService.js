import React from 'react';
import { AsyncStorage } from 'react-native';
import { 
  LoginButton, 
  AccessToken, 
  GraphRequest, 
  GraphRequestManager } from 'react-native-fbsdk';
import { Actions } from 'react-native-router-flux';

const userService = {
  currentUser: {},

  getLoginStatus: () => {
    console.log('getting login status!');
    return new Promise((resolve, reject) => {
      // console.log('lets try something');
      AsyncStorage.getItem('@MySuperStore:user')
        .then((value) => {
          if (value !== null) {
            // We have data!!
            console.log('retreived value from cache', JSON.parse(value));
            userService.currentUser = JSON.parse(value);
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  cacheCurrentUser: () => {
    return new Promise ((resolve, reject) => {
      AsyncStorage.setItem('@MySuperStore:user', JSON.stringify(userService.currentUser))
      .then((data) => {
        console.log('cacheCurrentUser data', data);
        resolve();
      })
      .catch((err) => {
        console.log('err in cacheCurrentUser', err);
        reject(err);
      });
    });
  },

  logOut: () => {
    return new Promise ((resolve, reject) => {
      AsyncStorage.removeItem('@MySuperStore:user')
      .then((data) =>{
        console.log('logout data', data);
        userService.currentUser = {};
        resolve();
      })
      .catch((err) => {
        console.log('err in logout', err);
        reject(err);
      });
    });
  },

  loginHandler: (error, result) => {
    console.log('loginHandler');
    if (error) {
      console.log('error', error);
      // TODO handle error
    } else if (result.isCancelled) {
      console.log('login is cancelled.');
      // TODO when user cancels
    } else {
      // console.log('result', result);
      AccessToken.getCurrentAccessToken().then(
        (data) => {
          // console.log('access token data', data.userID);
          // userService.postLogin(data);
          const photoRequest = new GraphRequest(
            `/${data.userID}/picture?redirect=false`,
            null,
            (err, res) => {
              if (err) console.log('Error from GraphRequest', err);
              if (res) {
                // console.log('result from GraphRequest', res);
                userService.currentUser.profileUrl = res.data.url;
              }
            },
          );
          const infoRequest = new GraphRequest(
            '/me',
            null,
            (err, res) => {
              if (error) console.log('Error from GraphRequest', err);
              if (res) {
                // console.log('result from GraphRequest', res);
                userService.currentUser.displayName = res.name;
                userService.currentUser.userId = res.id;
              }
            },
          );

          new GraphRequestManager()
            .addRequest(photoRequest)
            .addRequest(infoRequest)
            .addBatchCallback((err, res) => {
              if (err) console.log('err in addBatchCallback', err);
              if (res) {
                // console.log('res in addBatchCallback', res);
                // console.log('currentUser', userService.currentUser);
                userService.cacheCurrentUser()
                  .then(() => {
                    Actions.Map();
                  })
                  .catch((err) => {
                    console.log('error caching current user');
                    Actions.Map();
                  });
              }
            })
            .start();
        }
      );
    }
  } 
};

export default userService;