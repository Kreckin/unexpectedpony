import React, { Component } from 'react';
//If you need any view or text, etc tags, import them below
//import { } from 'react-native';

import { Router, Scene } from 'react-native-router-flux';
import MapContainer from './components/MapContainer';
import Blurb from './components/Blurb';
//The following aren't used in our project (yet) so they are commented out
//import Login from './components/Login';
//import SavedList from './components/SavedList';


// This displays a different color depending on whether the tab is selected or not, 
// and it's uncommented out for the time being
// const TabIcon = ({ selected, title }) => {
//   return (
//     <Text style={{ color: selected ? 'red' : 'black' }}>{title}</Text>
//   );
// };

class App extends Component {
  state={
    //This is hard coded in for the time being to practice front end stuff, 
    //but will be cleaned out once the DB is connected
    markers: [{ id: '1', latitude: 30.268800, longitude: -97.740216, title: 'Caseys bat guy', image: require('./icons/tree-small.png'), category: 'nature' },
        { id: '2', latitude: 30.269946, longitude: -97.743531, title: 'An unexpected pony', image: require('./icons/pony.png'), category: 'nature' }]
  }

    render() {
      return (
          <Router>
            <Scene key='root'>
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
// <Router>
//             <Scene key='root'>
//               <Scene
//                 key="tabBar"
//                 tabs
//                 tabBarStyle={{ backgroundColor: '#FFFFFF' }}
//               >
//               {/* Map Tab and its scenes */}
//                 <Scene key='Map' title='Map' icon={TabIcon}>
//                   <Scene 
//                     key='MapContainer'
//                     component={MapContainer}
//                     title='Map'
//                     markers={this.state.markers}
//                     //initial
//                   />
//                   <Scene 
//                     key='Blurb'
//                     component={Blurb}
//                     title='Blurb'
//                   />
//                 </Scene>
//               {/* Login Tab and its scenes */}
//                 <Scene key='LoginTab' title='Log In' icon={TabIcon}>
//                   <Scene 
//                     key='Login'
//                     component={Login}
//                     title='Log In'
//                   />
//                 </Scene>
//               {/* Saved List Tab and its scenes */}
//                 <Scene key='SavedListTab' title='Saved List' icon={TabIcon}>
//                   <Scene 
//                     key='Camera'
//                     component={SavedList}
//                     title='Camera'
//                   />
//                 </Scene>
//               </Scene>
//             </Scene>
//           </Router>
