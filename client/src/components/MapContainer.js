import React, { Component } from 'react';
import MapView from 'react-native-maps';
import {
  View,
  Dimensions
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import getSpots from '../lib/getSpots';
//This gets the dimensions from the user's screen
const { height, width } = Dimensions.get('window');

//This is the work around for the airbnb bug (Casey - go ahead and refactor this)
const reference = {};

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
      markers: []
    };
    //commented out for now because re-rendering does not play nice with this currently

    //this.onRegionChange = this.onRegionChange.bind(this);
  }
  //This changes the region when the user moves around
  componentWillMount() {
    //when the app is first called it will get every spot from our database and change the markers state to use it
    getSpots((data) => {
      this.setState({ markers: data });
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
        {this.state.markers.map(marker => (
            
            <MapView.Marker
            //The ref is the weird workaround to the showCallout issue
              ref={ref => { reference[marker.id] = ref; }}
              key={marker.id}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              title={marker.title}
              description={marker.category}
              //The image currently is hard coded in state
              image={marker.icon}
              //This adds the mini blurb on the screen
              onPress={() => { reference[marker.id].showCallout(); }}
              //This changes the scene to the blurb with the marker passed down as props
              onCalloutPress={() => Actions.SpotInfo({ marker })}
            />
          ))}
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
