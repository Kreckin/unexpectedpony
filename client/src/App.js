import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { Router, Scene } from 'react-native-router-flux';
import MapContainer from './components/MapContainer';
import Blurb from './components/Blurb';
import Login from './components/Login';
import SavedList from './components/SavedList';
import getSpots from './lib/getSpots';
//This displays a different color depending on whether the tab is selected or not
const TabIcon = ({ selected, title }) => {
  return (
    <Text style={{ color: selected ? 'red' : 'black' }}>{title}</Text>
  );
};

class App extends Component {
  state={
    markers: []
    // markers: [{ id: 1, latitude: 30.268800, longitude: -97.740216, title: 'Caseys bat guy', image: require('./icons/tree-small.png'), category: 'nature' },
    //     { id: 2, latitude: 30.269946, longitude: -97.743531, title: 'An unexpected pony', image: require('./icons/tree-small.png'), category: 'nature' }]
  }
  componentWillMount() {
    getSpots((data) => {
      this.setState({ markers: data });
      console.log('this is the data we\'re getting', this.state.markers);
    });
  }

    render() {

      return !this.state.markers.length ? null : (
          <Router>
            <Scene key='root'>
              <Scene
                key="tabBar"
                tabs
                tabBarStyle={{ backgroundColor: '#FFFFFF' }}
              >
              {/* Map Tab and its scenes */}
                <Scene key='Map' title='Map' icon={TabIcon}>
                  <Scene 
                    key='MapContainer'
                    component={MapContainer}
                    title='Map'
                    markers={this.state.markers}
                    //initial
                  />
                  <Scene 
                    key='Blurb'
                    component={Blurb}
                    title='Blurb'
                  />
                </Scene>
              {/* Login Tab and its scenes */}
                <Scene key='LoginTab' title='Log In' icon={TabIcon}>
                  <Scene 
                    key='Login'
                    component={Login}
                    title='Log In'
                  />
                </Scene>
              {/* Saved List Tab and its scenes */}
                <Scene key='SavedListTab' title='Saved List' icon={TabIcon}>
                  <Scene 
                    key='SavedList'
                    component={SavedList}
                    title='Saved List'
                  />
                </Scene>
              </Scene>
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