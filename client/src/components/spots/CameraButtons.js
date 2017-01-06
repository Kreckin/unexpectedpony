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
          
          <View style={[{ backgroundColor: 'red' }, this.state.size]}>
            <Image source={require('../../icons/sad.png')} />
          </View>
          <View style={[{ backgroundColor: 'blue' }, this.state.size]} />

        </Carousel>
        <View style={styles.buttonContainer}>
        <Image source={require('../../icons/sad.png')} style={{ height: 50, width: 50 }} />
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
// const CameraButtons = (props) => {
//   return (
// 	<View style={styles.container}>
// 		
//     </View>
//   );
// };


 

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
};

