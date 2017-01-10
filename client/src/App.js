import React, { Component } from 'react';
//If you need any view or text, etc tags, import them below
import { Text, View, Image } from 'react-native';

import { Router, Scene, Actions, ActionConst } from 'react-native-router-flux';
import Login from './components/login/Login';
import MapContainer from './components/map/MapContainer';
import SpotInfo from './components/spots/SpotInfo';
import UploadPhotoContainer from './components/spots/UploadPhotoContainer';
import FlaggedContent from './components/FlaggedContent';
import SavedList from './components/SavedList';
import Profile from './components/profile/Profile';
import Spinner from './components/Spinner';
import NoLocationError from './components/spots/NoLocationError';
import userService from './lib/userService';

const Platform = require('react-native').Platform;

const TabIcon = ({ selected, title }) => {
  const iconMapper = {
    Map: require('./icons/map.png'),
    Add: require('./icons/camera-big.png'),
    Saved: require('./icons/star.png'),
    Profile: require('./icons/profile.png')
  };
  return (
    <View style={{ alignItems: 'center' }}>
      <Image
        source={iconMapper[title]}
        style={{ height: 30, width: 30, tintColor: selected ? 'black' : '#EFEFF4' }}
      />
      <Text style={{ margin: 3, fontSize: 12, color: selected ? 'black' : '#EFEFF4' }}>{title}</Text>
    </View>
  );
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: null,
    };

    this.loginCallback = this.loginCallback.bind(this);
    this.logoutCallback = this.logoutCallback.bind(this);
  }

  componentWillMount() {
    userService.getLoginStatus()
      .then((resolve) => {
        this.setState({
          isLoggedIn: resolve,
        });
      })
      .catch((reject) => {
        console.log('Error in componentWillMount getLoginStatus', reject);
      });
  }

  loginCallback(res) {
    this.setState({
      isLoggedIn: res,
    });
  }

  logoutCallback(res) {
    this.setState({
      isLoggedIn: false,
    });
  }

// Note: if you want to make the app render something different than the map on initial load, 
// use the 'initial' keyword inside that scene
// Just put it back into MapContainer before you push to master
render() {
      if (this.state.isLoggedIn !== null) {
        if (!this.state.isLoggedIn) {
          return (
            <Login loginCallback={this.loginCallback} logoutCallback={this.logoutCallback} />
          );
        } else {
          return (
            <Router
              navigationBarStyle={{ backgroundColor: 'transparent', borderBottomColor: 'transparent', borderBottomWidth: 65 }}
              //NEED TO FIGURE OUT A WAY TO REMOVE THIS FOR ANDROID
              backButtonImage={require('./icons/backButton.png')}
            >
              <Scene
                key="tabBar"
                tabs
                tabBarStyle={{ height: 65, backgroundColor: '#00B89C' }}
              >
                {/* Map Tab and its scenes */}
                <Scene key='Map' title='Map' icon={TabIcon}>
                  <Scene 
                    key='MapContainer'
                    component={MapContainer}
                  />
                  <Scene 
                    key='SpotInfo'
                    component={SpotInfo}
                  />
                  <Scene 
                    key='FlaggedContent'
                    component={FlaggedContent}
                  /> 
                </Scene>
                <Scene key='CameraTab' title='Add' icon={TabIcon}>
                  <Scene 
                    key='UploadPhotoContainer'
                    component={UploadPhotoContainer}
                  />
                </Scene>
                {/* Saved List Tab and its scenes */}
                <Scene 
                  key='SavedListTab' 
                  title='Saved' 
                  icon={TabIcon}
                  onPress={() => {
                      Actions.SavedList({ type: ActionConst.REFRESH });
                  }}
                >
                  <Scene 
                    key='SavedList'
                    component={SavedList}
                  />
                </Scene>
                {/* Profile Tab and its scenes */}
                <Scene key='ProfileTab' title='Profile' icon={TabIcon}>
                  <Scene 
                    key='Profile'
                    component={Profile}
                    logoutCallback={this.logoutCallback}
                    loginCallback={this.loginCallback}
                  />
                  </Scene>
                </Scene>
            </Router>
          );
        }
      } else {
        return (
          <Spinner />
        );
      }
    }
}

export default App;

//  ,  ,.~"""""~~..
//   )\,)\`-,       `~._                                     .--._
//   \  \ | )           `~._                   .-"""""-._   /     `.
//  _/ ('  ( _(\            `~~,__________..-"'          `-<        \
//  )   )   `   )/)   )        \                            \,-.     |
// ') /)`      \` \,-')/\      (                             \ /     |
// (_(\ /7      |.   /'  )'  _(`                              Y      |
//     \       (  `.     ')_/`                                |      /
//      \       \   \         unexpected                      |)    (
//       \ _  /\/   /                                         (      `~.
//        `-._)     |                                        / \        `,
//                  |                          |           .'   )      (`
//                  \                        _,\          /     \_    (`
//                   `.,      /       __..'7"   \         |       )  (
//                   .'     _/`-..--""      `.   `.        \      `._/
//                 .'    _.j     /            `-.  `.       \
//               .'   _.'   \    |               `.  `.      \
//              |   .'       ;   ;               .'  .'`.     \
//              \_  `.       |   \             .'  .'   /    .'
//                `.  `-, __ \   /           .'  .'     |   (
//                  `.  `'` \|  |           /  .-`     /   .'
//                    `-._.--t  ;          |_.-)      /  .'
//                           ; /           \  /      / .'
//                          / /             `'     .' /
//                         /,_\                  .',_(
//                        /___(                 /___(

