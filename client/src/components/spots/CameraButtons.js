import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import Carousel from 'react-native-looped-carousel';

const { width, height } = Dimensions.get('window');

export default class CameraButtons extends Component {

  constructor(props) {
    super(props);

    this.state = {
      size: { width, height },
    };
  }

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width, height: layout.height } });
  }

  render() {
    return (
      <View style={{ flex: 1 }} onLayout={this._onLayoutDidChange}>

        
        <Carousel
          delay={2000}
          style={this.state.size}
          autoplay
          //pageInfo
          onAnimateNextPage={(p) => console.log(p)}
        >
          
          <View style={[{ backgroundColor: 'black' }, this.state.size]}>
            <Image style={styles.imageStyle} source={require('../../images/alley.jpg')} />
          </View>
          <View style={[{ backgroundColor: 'black' }, this.state.size]}>
            <Image style={styles.imageStyle} source={require('../../images/balloon.jpg')} />
          </View>
          <View style={[{ backgroundColor: 'black' }, this.state.size]}>
            <Image style={styles.imageStyle} source={require('../../images/dance.jpg')} />
          </View>
          <View style={[{ backgroundColor: 'black' }, this.state.size]}>
            <Image style={styles.imageStyle} source={require('../../images/dead.jpg')} />
          </View>
          <View style={[{ backgroundColor: 'black' }, this.state.size]}>
            <Image style={styles.imageStyle} source={require('../../images/heart.jpg')} />
          </View>
          <View style={[{ backgroundColor: 'black' }, this.state.size]}>
            <Image style={styles.imageStyle} source={require('../../images/icecream.jpg')} />
          </View>
          <View style={[{ backgroundColor: 'black' }, this.state.size]}>
            <Image style={styles.imageStyle} source={require('../../images/imagine.jpg')} />
          </View>
          <View style={[{ backgroundColor: 'black' }, this.state.size]}>
            <Image style={styles.imageStyle} source={require('../../images/rushmore.jpg')} />
          </View>
          <View style={[{ backgroundColor: 'black' }, this.state.size]}>
            <Image style={styles.imageStyle} source={require('../../images/skull.png')} />
          </View>
          <View style={[{ backgroundColor: 'black' }, this.state.size]}>
            <Image style={styles.imageStyle} source={require('../../images/tree.jpg')} />
          </View>
          <View style={[{ backgroundColor: 'black' }, this.state.size]}>
            <Image style={styles.imageStyle} source={require('../../images/water.jpg')} />
          </View>
        </Carousel>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={this.props.takePhoto}>
            <Text style={styles.buttonText}>Take a picture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.props.chooseImage}>
            <Text style={styles.buttonText}>Choose from gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = {
  buttonContainer: {
    position: 'absolute', 
    top: height - 200, 
    flexDirection: 'row'
  },
  button: {
    backgroundColor: '#00B89C',
    width: 150,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    margin: 15
  },
  buttonText: {
    color: '#EFEFF4',
    fontSize: 18,
    textAlign: 'center'
  },
  imageStyle: {
    height,
    width,
    opacity: 0.6,
    resizeMode: 'cover'
  }
};

