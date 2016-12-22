import React, { Component } from 'react';
import MapView from 'react-native-maps';
import {
  View,
  Dimensions
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import AddPhotoIcon from './AddPhotoIcon';
import getSpots from '../lib/getSpots';
//This gets the dimensions from the user's screen
const { height, width } = Dimensions.get('window');

//Here is a map stripped down to it's very basic core
class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        //Austin's latitude, hard coded in 
        //(see bottom of thing for how we'd get the actual location on a real phone)
        latitude: 30.2672,
        longitude: -97.7431,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      spots: []
    };
    //commented out for now because re-rendering does not play nice with this currently

    //this.onRegionChange = this.onRegionChange.bind(this);
  }
  //This changes the region when the user moves around
  componentWillMount() {
    //when the map is first called it will get every spot from our database 
    //and change the spots state to use it
    getSpots((data) => {
      this.setState({ spots: data });
    });
  }
  render() {
    return (
      <View>
        <MapView 
        style={styles.map} 
        //this sets the region as Austin
        region={this.state.region}
        //this will change the region as the user moves around the map
        onRegionChange={this.onRegionChange}
        >
        {this.state.spots.map(spot => (
            //This maps all the spots (passed down from app as props)
            <MapView.Marker
            //The ref is the weird workaround to the showCallout issue
              //ref={ref => { reference[spot.id] = ref; }}
              key={spot.id}
              coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
              title={spot.title}
              description={spot.category}
              //The image currently is hard coded in state
              image={spot.icon}
              //This adds the mini blurb on the screen
              //onPress={() => { reference[spot.id].showCallout(); }}
              //This changes the scene to the blurb with the spot passed down as props
              onCalloutPress={() => Actions.SpotInfo({ spot })}
            />
          ))}
            <AddPhotoIcon />
        </MapView>
      </View>
    );
  }
}
// sets the map as the width and heigh of the screen
const styles = {
  map: {
    width,
    height
  }
};
//Right now, getUserLocation keeps telling me we're in SF, so the stuff above puts Austin
// getUserLocation(){
//     navigator.geolocation.getCurrentPosition((position) => {
//           let currentLocation = {
//           latitude: position.coords.latitude,
//             longitude: position.coords.longitude
//             //Do we need latitude and longitude delta?
//             // latitudeDelta: 0.01,
//             // longitudeDelta: 0.01
//           }
//         this.setState({currentLocation: currentLocation})
//         console.log(currentLocation)
//       })
//   }
//   componentDidMount(){
//     this.getUserLocation()
//   }
export default MapContainer;
