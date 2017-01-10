import React, { Component } from 'react';
import { View, ScrollView, Text, StatusBar, Dimensions, TouchableHighlight } from 'react-native';
import SavedItem from './SavedItem';
import favorites from '../lib/favorites';
import userService from '../lib/userService';

const { height } = Dimensions.get('window');

class SavedList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      favorites: [],
      displayOrder: 'recent',
    };
    this.recentOrPendingRequest = false;
  }

  componentWillMount() {
    //favorites.add(1, 2);
    this.getFavoriteSpots();
    this.recentOrPendingRequest = true;
  }

  getFavoriteSpots() {
    favorites.get(userService.currentUser.id)
      .then(favoritesArray => {
        console.log('got favs', favoritesArray);
        this.setState({ 
          favorites: favoritesArray,
        });
        setTimeout(() => {
          this.recentOrPendingRequest = false;
        }, 1000);
      })
      .catch(err => {
        console.log('error getting favorites in saved list:', err);
      });
  }

  removeSavedSpot(spotID) {
    favorites.remove(userService.currentUser.id, spotID);
    var newFavorites = this.state.favorites.filter(savedSpot =>
      savedSpot.id !== spotID);
    this.setState({ favorites: newFavorites });
  }

  orderBy(attribute) {
    // if (this.state.displayOrder !== attribute) {
    //   this.setState({ displayOrder: attribute });

    //   //now sort the favorites array in state
    //   var favorites = this.state.favorites.sort

    // }
    this.setState({ favorites: this.state.favorites.reverse });
  }

  render() {
    if (!this.recentOrPendingRequest) {
      this.getFavoriteSpots();
      this.recentOrPendingRequest = true;
    }

    return (
      <View>
        <StatusBar
          barStyle='light-content'
        />
        <View style={styles.titleBarStyle}>
          <TouchableHighlight onPress={function () { this.orderBy('closest'); }}>
            <Text style={styles.titleStyle}>Closest</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={function () { this.orderBy('popular'); }}>
            <Text style={styles.titleStyle}>Popular</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={function () { this.orderBy('recent'); }}>
            <Text style={styles.titleStyle}>Recent</Text>
          </TouchableHighlight>
        </View>
        <ScrollView 
          style={styles.listStyle}
          contentContainerStyle={styles.listContainerStyle}
        >
          {
            this.state.favorites.map(spot => 
            <SavedItem
              key={spot.title}
              removeSavedSpot={this.removeSavedSpot.bind(this)}
              spot={spot}
            />)
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = {
 listStyle: {
  flex: 1,
  paddingTop: 5,
  //height: 500,
  height: height - 140,
  backgroundColor: '#EFEFF4'
 },
 listContainerStyle: {
 },
 titleBarStyle: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  backgroundColor: '#006F60',
  height: 75
 },
 titleStyle: {
  paddingTop: 31,
  paddingBottom: 18,
  fontSize: 18,
  alignSelf: 'center',
  color: '#EFEFF4'
 }
};
export default SavedList;
