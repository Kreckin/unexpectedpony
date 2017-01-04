import React, { Component } from 'react';
//If you need any view or text, etc tags, import them below
import { Text, View, Image } from 'react-native';

import { Router, Scene } from 'react-native-router-flux';
import Login from './components/login/Login';
import MapContainer from './components/map/MapContainer';
import LensIcon from './components/map/LensIcon';
import SpotInfo from './components/spots/SpotInfo';
import UploadPhotoContainer from './components/spots/UploadPhotoContainer';
import FlaggedContent from './components/FlaggedContent';
import SavedItem from './components/SavedItem';
import SavedList from './components/SavedList';
import AddPhotoIcon from './components/map/AddPhotoIcon';
import Profile from './components/Profile';

class App extends Component {

 
// Note: if you want to make the app render something different than the map on initial load, 
// use the 'initial' keyword inside that scene
// Just put it back into MapContainer before you push to master
    render() {
      const map = require('./icons/map.png');
      const saved = require('./icons/star.png');
      const profile = require('./icons/profile.png');

      const TabIcon = ({ selected, title }) => {
        const iconMapper = {
          Map: map,
          Saved: saved,
          Profile: profile
        };
        return (
          <View style={{ alignItems: 'center' }}>
            <Image
              source={iconMapper[title]}
              style={{ height: 30, width: 30 }}
            />
            <Text style={{ margin: 3, fontSize: 12, color: selected ? 'black' : '#EFEFF4' }}>{title}</Text>
          </View>
        );
      };
      return (
        <Router
          navigationBarStyle={{backgroundColor: 'transparent', borderBottomColor: 'transparent', borderBottomWidth: 65  }}
          renderRightButton={AddPhotoIcon}
          rightButtonIconStyle={{ height: 50, width: 50 }}
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
                    renderLeftButton={LensIcon}
                  />
                  <Scene 
                    key='SpotInfo'
                    component={SpotInfo}
                    title='SpotInfo'
                  />
                </Scene>
              {/* Saved List Tab and its scenes */}
                <Scene key='SavedListTab' title='Saved' icon={TabIcon}>
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
                  />
                </Scene>
                <Scene 
                  key='UploadPhotoContainer'
                  component={UploadPhotoContainer}
                />
                <Scene 
                  key='FlaggedContent'
                  component={FlaggedContent}
                />  
              </Scene>
          </Router>
        );
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

//Here is the tab bar with (unfinished) saved list and login pages connected
// <Router 
//           hideNavBar
//           //navigationBarStyle={{}}
//           >
//             <Scene key='root'>
//               <Scene 
//                 key='MapContainer'
//                 initial
//                 component={MapContainer}
//               />
//               <Scene 
//                 key='UploadPhotoContainer'
//                 component={UploadPhotoContainer}
//               />
//               <Scene 
//                 key='SpotInfo'
//                 component={SpotInfo}
//                 title='SpotInfo'
//               />
//               <Scene 
//                 key='FlaggedContent'
//                 component={FlaggedContent}
//                 title='Flagged Content'
//               />
//               <Scene 
//                 key='SavedItem'
//                 component={SavedItem}
//                 title='Saved Item'
//               />
//             </Scene>
//           </Router>
