import React, { Component } from 'react';
import { ScrollView, View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';

import CameraButtons from './CameraButtons';
import AddSpotInfo from './AddSpotInfo';
import Spinner from '../Spinner';

import postSpot from '../../lib/postSpot';

const { width, height } = Dimensions.get('window');

const Platform = require('react-native').Platform; // do we need this separate?
const ImagePicker = require('react-native-image-picker');
// info: https://github.com/marcshilling/react-native-image-picker

export default class UploadPhotoContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      image: null,
      title: '',
      description: '',
      category: null,
      latitude: null,
      longitude: null,
    };
    this.takePhoto = this.takePhoto.bind(this);
    this.chooseImage = this.chooseImage.bind(this);
    this.setImage = this.setImage.bind(this);
  }
  onSubmit() {
    //we take everything we need for the postSpot function and pass it in as an object
    postSpot({ 
      title: this.state.title, 
      description: this.state.description, 
      category: this.state.category, 
      latitude: this.state.latitude, 
      longitude: this.state.longitude,
      uri: this.state.image.uri 
    });
    //set the states to null so we get a blank slate again
    this.setState({ title: '', description: '', image: null });
    Actions.MapContainer();
  }

  onTitleChange(title) {
    this.setState({ title });
  }
  onDescriptionChange(description) {
    this.setState({ description });
  }
  onCategoryChange(category) {
    this.setState({ category });
  }
  setImage(response) {
    console.log('Response = ', response);

    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      //If it is iOS, remove 'file://' prefix
      let source = { uri: response.uri.replace('file://', ''), isStatic: true };

      //If android, don't need to remove the 'file://'' prefix
      if (Platform.OS === 'android') {
        source = { uri: response.uri, isStatic: true };
      }
      this.setState({ 
        image: source, 
        latitude: response.latitude, 
        longitude: response.longitude, 
        loading: false,
        width: response.width,
        height: response.height,
      });
      this.setState({ image: source, latitude: response.latitude, longitude: response.longitude, loading: false });

      //this checks if your photo has geolocation data. If not, it takes your current location
      if (!this.state.latitude || !this.state.longitude) {
        navigator.geolocation.getCurrentPosition((position) => {
        this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        });
      }
    }
  }
  takePhoto() {
    ImagePicker.launchCamera({ noData: true }, this.setImage);
  }
  // chooseImage() {
  //   ImagePicker.launchImageLibrary({ noData: true }, this.setImage);
  //    this.setState({ loading: true });
  // }
   chooseImage() {
    ImagePicker.launchImageLibrary({ noData: true, allowsEditing: true }, (response) => {
      if (response.didCancel) {
        this.setState({
          loading: false,
        });
      } 
      else {
        this.setImage(response); 
      }
    });
     this.setState({ loading: true });
  }
  renderButtonOrPic() {
    if (!this.state.image && !this.state.loading) {
      return (
        <CameraButtons 
        chooseImage={this.chooseImage.bind(this)} 
        takePhoto={this.takePhoto.bind(this)} 
        />
      );
    } else if (this.state.loading) {
        return (
          <Spinner />
        );
      } else if (this.state.image && !this.state.longitude) {
        return (
          <View style={{ flex: 1 }}>
            <Image style={styles.image} source={this.state.image} />
            <Text style={styles.error}>Unfortunately, we can't accept this photo because 
            it does not contain any meta data about the location of where it was taken.
            Our app depends on the accuracy of the photos submitted by users, and without that data,
            we can't verify where this photo was taken. You can change this setting in your phone. 
            In the meantime, why not try a new photo?
            </Text>
            <CameraButtons 
              chooseImage={this.chooseImage.bind(this)} 
              takePhoto={this.takePhoto.bind(this)} 
            />
          </View>
          );
      } else {
        return (
        <ScrollView>
          <Image style={styles.image} source={this.state.image} />
          <AddSpotInfo 
            onTitleChange={this.onTitleChange.bind(this)}
            title={this.state.title}
            onDescriptionChange={this.onDescriptionChange.bind(this)}
            description={this.state.description}
            onCategoryChange={this.onCategoryChange.bind(this)}
            category={this.state.category}
            onSubmit={this.onSubmit.bind(this)}
          />
        </ScrollView>
        );
      } 
    }
  render() {
    return (
      <View style={styles.body}>
        {this.renderButtonOrPic()}
      </View> 
    );
  }
}

const styles = StyleSheet.create({
  body: {
    //alignItems: 'center',
    //flex: 1,
    //backgroundColor: '#006F60',
  },
  image: {
    //later look how to maintain the image's aspect ratio
    marginTop: height * 0.05,
    height: 200,
    flex: 1,
    width: 200,
    alignSelf: 'center',
    justifyContent: 'center',
    resizeMode: 'cover',
    borderRadius: 20
  },
  error: {
    padding: 15,
    fontSize: 18,
    marginBottom: -10
  }
});
