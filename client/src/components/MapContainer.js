import React, { Component } from 'react';
import MapView from 'react-native-maps';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TabBarIOS,
  View,
  Dimensions
} from 'react-native';
import Blurb from './Blurb';
import { Actions } from 'react-native-router-flux';
//This gets the dimensions from the user's screen
const { height, width } = Dimensions.get('window');

let reference = {};
//Here is a map stripped down to it's very basic core
class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 30.2672,
        longitude: -97.7431,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
    modalVisible: false,
    selectedMarker: null
    };
    this.onRegionChange = this.onRegionChange.bind(this);
  }
  //This changes the region when the user moves around
  onRegionChange(region) {
    this.setState({ region });
  }
  
  // show(ref) {
  //   newRefFunc = showCallout.bind(ref);
  //   newRefFunc();
  // }
  show(id) {
    console.log(id)
    id.showCallout();
  }
  render() {
    return (
      <View>
        <MapView 
        style={styles.map} 
        region={this.state.region}
        onRegionChange={this.onRegionChange}
        >
        {this.props.markers.map(marker => (
            
            <MapView.Marker
              ref={ref => { reference[marker.id] = ref }}
              key={marker.id}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              title={marker.title}
              description={marker.category}
              image={marker.icon}
              //onPress={() => console.log({marker})}
              //onPress={() => this.show(this.key)}
              onPress={() => {
                reference[marker.id].showCallout();
              }}
              //onPress={() => onSelect}
              //onPress={() => Actions.Blurb({ marker: marker })}
              //onPress={() => this.setState({ modalVisible: true, selectedMarker: marker })}
              //centerOffset={{ x: 20, y: -30 }}
            />
          ))}
        </MapView>
      </View>
    );
  }
}
const styles = {
  map: {
    width: width,
    height: height
  },
  pinImage: {
    width: 50,
    height: 50 
  },
  callout: {
    flex: 1,
    paddingRight: 10,
    paddingBottom: 10,
    marginRight: 10,
    marginBottom: 10
  },
  calloutTitle: {
    fontSize: 16
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
