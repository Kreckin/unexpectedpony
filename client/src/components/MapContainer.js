import React, { Component } from 'react';
import MapView from 'react-native-maps';
import { View, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';

import getSpots from '../lib/getSpots';
import getLatLong from '../lib/getLatLong';

import Spinner from './Spinner.js';
import AddPhotoIcon from './AddPhotoIcon';
import LocateSelfIcon from './LocateSelfIcon';
import ManualTextInput from './ManualTextInput';
//This gets the dimensions from the user's screen
const { height, width } = Dimensions.get('window');

//Here is a map stripped down to it's very basic core
class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showManualLocation: false,
      spots: [],
      manualAddress: '',
      manualLocation: {},
      loading: false,
      region:{
         latitude: 30.2672,
         longitude: -97.7431,
         latitudeDelta: 0.0922,
         longitudeDelta: 0.0421
       }
    };
    //commented out for now because re-rendering does not play nice with this currently

    //this.onRegionChange = this.onRegionChange.bind(this);
  }
  //This changes the region when the user moves around
  componentWillMount() {
    //when the map is first called it will get every spot from our database 
    //and change the spots state to use it
    // this.getUserLocation();
    getSpots((data) => {
      this.setState({ spots: data });
    });
  }
  getUserLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      const region = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
        };
      this.setState({ region, loading: false });
      console.log('Current location is', region);
      });
  }
  selectLocatorIcon() {
    this.setState({ showManualLocation: false });
    Actions.refresh();
  }
  onManualAddressChange(manualAddress) {
    this.setState({ manualAddress });
  }
  handleManualAddressInput() {
    getLatLong({ address: this.state.manualAddress }, (res) => {
      this.setState({ 
        manualLocation: { 
          latitude: res.lat, 
          longitude: res.lng, 
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421 },
        showManualLocation: true,
        manualAddress: '' 
      });
      console.log("The new location is", this.state.manualLocation.latitude, this.state.manualLocation.longitude);
    });
  }
  
  render() {
    return (
      this.state.loading ? <Spinner /> :
      <View>
        <View style={styles.navBar}>
          <LocateSelfIcon selectLocatorIcon={this.selectLocatorIcon.bind(this)}/>
          <ManualTextInput 
            onManualAddressChange={this.onManualAddressChange.bind(this)}
            handleManualAddressInput={this.handleManualAddressInput.bind(this)}
            manualAddress={this.state.manualAddress}
          />
          <AddPhotoIcon />
        </View>
        <MapView 
        style={styles.map}
        showsUserLocation
        region={this.state.showManualLocation ? this.state.manualLocation : this.state.region}
        //this will change the region as the user moves around the map
        //onRegionChange={this.onRegionChange}
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
              image={spot.icon}
              //This adds the mini blurb on the screen
              //onPress={() => { reference[spot.id].showCallout(); }}
              //This changes the scene to the blurb with the spot passed down as props
              onCalloutPress={() => Actions.SpotInfo({ spot })}
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
  },
  navBar: {
    backgroundColor: 'white', 
    marginTop: 30,
    height: 45, 
    borderBottomWidth: 1, 
    flex: 1, 
    justifyContent: 'center', 
    flexDirection: 'row'
  }
};

export default MapContainer;
