//How to get the top part of this to lock without scrolling?
import React, { Component } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  Image, 
  TouchableHighlight, 
  StatusBar, 
  Dimensions 
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Toast, { DURATION } from 'react-native-easy-toast';

import Votes from '../../lib/votes.js';
import Visited from '../../lib/spotVisited.js';
import userService from '../../lib/userService';
import favorites from '../../lib/favorites';

const { width } = Dimensions.get('window');

class SpotInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      upvotes: this.props.spot.upvotes,
      downvotes: this.props.spot.downvotes,
      mehvotes: this.props.spot.mehvotes,
      saved: false,
    };
  }

  componentWillMount() {
    // first see if user has visited spot before
    // (If they've voted, they've visited )
    Visited(userService.currentUser.id, this.props.spot.id)
     //then fetch vote tally
      .then((data) => this.setState({
        visited: data.value,
    }));

    favorites.checkIfFavorite(userService.currentUser.id, this.props.spot.id)
       .then((response) => {
         if (response.length > 0) {
           this.setState({
             saved: true,
           });
         }
       })
       .catch((error) => {
         console.log('Error getting checkIfSavedSpot', error);
       });
  }

  upVote() {
    console.log('SPOT PROPS', this.props.spot);
    Votes.upVote(userService.currentUser.id, this.props.spot.id)
      .then((res) => {
        this.setState({ upvotes: res.upvotes, 
                        downvotes: res.downvotes,
                        mehvotes: res.mehvotes});
    });
  }
  
  downVote() {
    console.log('SPOT PROPS', this.props.spot);
    Votes.downVote(userService.currentUser.id, this.props.spot.id)
      .then((res) => {
        this.setState({ upvotes: res.upvotes, 
                        downvotes: res.downvotes,
                        mehvotes: res.mehvotes});
    });
  }

  mehVote() {
    console.log('SPOT PROPS', this.props.spot);
    Votes.mehVote(userService.currentUser.id, this.props.spot.id)
      .then((res) => {
        this.setState({ upvotes: res.upvotes, 
                        downvotes: res.downvotes,
                        mehvotes: res.mehvotes });
    });
  }
  saveOrUnSaveSpot() {
    // check if already saved
    if (this.state.saved) {
      // unsave
      favorites.remove(userService.currentUser.id, this.props.spot.id)
        .then((resolve) => {
          console.log('saveOrUnSaveSpot remove', resolve);
        })
        .catch((reject) => {
          console.log('saveOrUnSaveSpot remove', reject);
        });
    } else {
      //save
      favorites.add(userService.currentUser.id, this.props.spot.id)
        .then((resolve) => {
          console.log('saveOrUnSaveSpot add', resolve);
        })
        .catch((reject) => {
          console.log('saveOrUnSaveSpot add', reject);
        });
    }
    this.setState({ saved: !this.state.saved });
  }
  renderCategories() {
    const categories = this.props.spot.categories;
    const block = [];
    for (let i = 0; i < categories.length; i += 4) {
      block.push(<View style={styles.categoryContainer}>
        {categories.slice(i, i + 4).map(category => 
          <View style={styles.categoryViewStyle}>
            <Text style={styles.categoryTextStyle}>{category}</Text>
          </View>
          )}
      </View>);
    }
    return block;
  }
  //our toast function, which surprisingingly shows toasts
  toastAlert() {
    //this takes two params, the text to show and for how long to show it
    this.refs.toast.show('Come to this location to vote!', 2000);
  }

  render() {
    let feet = this.props.spot.distance.toFixed(2);
    const disabled = !this.state.visited && ((feet * 5280) > 1000);
    feet = `${feet} miles away`;
    StatusBar.setBarStyle('light-content', true);
    // console.log('userService current', userService.currentUser);
    return (
      <ScrollView >
    {/*Header*/}
        <View style={styles.headerView} scrollEnabled={false}>
          <Text style={styles.headerText} numberOfLines={1}>
            {this.props.spot.title}
          </Text>
        </View>
      {/*Picture
      Note: there is a black background that is currently not in use because 
      I'm not sure how to style it based on image proportions
      */}
        <View style={styles.photoContainer}>
          <Image 
          source={{ uri: `${this.props.spot.img_url}` }} 
          style={styles.imageStyle}
          
          >
          {disabled ? <Image source={require('../../icons/Lock.png')}
          style={styles.lockStyle} 
          /> : null}
          </Image>
        </View>
        <View style={styles.infoContainer}>
      {/*Ratings*/}
          <View style={styles.ratingsContainer}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableHighlight
                onPress={disabled ? this.toastAlert.bind(this) : this.downVote.bind(this)}
              >
                <Image
                  source={require('../../icons/sad.png')}
                  style={styles.iconRating}
                />
              </TouchableHighlight>
              <View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
                <Text style={styles.textRating}>{this.state.downvotes}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <TouchableHighlight
                onPress={disabled ? this.toastAlert.bind(this) : this.mehVote.bind(this)}
              >
                <Image
                  source={require('../../icons/meh.png')}
                  style={styles.iconRating}
                />
              </TouchableHighlight>
              <View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
                <Text style={styles.textRating}>{this.state.mehvotes}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <TouchableHighlight
                onPress={disabled ? this.toastAlert.bind(this) : this.upVote.bind(this)}
              >
                <Image
                  source={require('../../icons/happy.png')}
                  style={styles.iconRating}
                />
              </TouchableHighlight>
              <View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
                <Text style={styles.textRating}>{this.state.upvotes}</Text>
              </View>
            </View>
          </View>
          {/*Distance*/}
          <Text style={styles.distanceStyle}>
          {feet}
          </Text>
          {/*Description*/}
          <Text style={styles.descriptionStyle}>
            {this.props.spot.description ? this.props.spot.description : 
              'No description currently available for this location'}
          </Text>
        {/*Categories*/}
        {this.renderCategories()}

        {/*Save*/}
        <View style={styles.saveFlagContainer}>
            <TouchableHighlight
              onPress={this.saveOrUnSaveSpot.bind(this)}
            >
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={require('../../icons/star.png')}
                  style={styles.saveFlagIcon}
                />
                <View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
                  <Text style={styles.saveFlagText}>Save</Text>
              </View>
            </View>
            </TouchableHighlight>
            
          {/*Flag*/}
          <TouchableHighlight
            onPress={() => Actions.FlaggedContent({ spot: this.props.spot })}
          >
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={require('../../icons/flag.png')}
                style={styles.saveFlagIcon}
              />
              <View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
                <Text style={styles.saveFlagText}>Flag</Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      </View>
        <Toast
          ref="toast"
          style={{ backgroundColor: '#00B89C' }}
          position='top'
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: 'black' }}
        />
      </ScrollView>
    );
  }
}
const styles = {
  headerView: {
    backgroundColor: '#006F60',
    alignItems: 'center',
    height: 65
  },
  headerText: {
    fontSize: 36,
    textAlign: 'center',
    color: '#EFEFF4',
    marginTop: 15,
    marginBottom: 5,
    marginLeft: 20,
    width: width - 50
  },
  //Change this to allow for varying photo types
  photoContainer: {
    backgroundColor: 'black',
    width,
    height: 300
  },
  //Also change this
  imageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: null,
    flex: 1, 
    width,
  },
  infoContainer: {
    backgroundColor: '#006F60',
    width,
    height: 300
  },
  ratingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  iconRating: {
    height: 30,
    width: 30,
    tintColor: '#EFEFF4'
  },
  textRating: {
    paddingLeft: 10,
    color: '#EFEFF4',
    fontSize: 22
  },
  distanceStyle: {
    color: '#EFEFF4',
    fontStyle: 'italic',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 24
  },
  descriptionStyle: {
    color: '#EFEFF4',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 18
  },
  categoryContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  categoryViewStyle: {
    backgroundColor: '#00B89C',
    padding: 5,
    borderRadius: 8,
    margin: 5
  },
  categoryTextStyle: {
    color: '#EFEFF4',
    fontSize: 18,
    fontStyle: 'italic',
  },
  saveFlagContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  saveFlagIcon: {
    height: 40,
    width: 40,
    tintColor: '#EFEFF4'
  },
  saveFlagText: {
    fontSize: 20,
    paddingLeft: 5,
    color: '#EFEFF4'
  }
};
export default SpotInfo;
