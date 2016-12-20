import React, { Component } from 'react';
import { View, Text, Image, TouchableHighlight, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';

const { height, width } = Dimensions.get('window');

const SpotInfo = (props) => {
  return (
    <View style={styles.viewStyle}>
      <View style={styles.cardStyle}>
        <Text style={styles.titleStyle}>
        {props.marker.title}
        </Text>
        <Image 
          style={styles.imageStyle}
          source={{ uri: `${props.marker.img_url}` }} 
        />
        <Text style={styles.categoryStyle}>{props.marker.category}</Text>
        <TouchableHighlight 
          onPress={() => Actions.MapContainer()}
          style={styles.buttonStyle} 
        >
          <Text>Back to map</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = {
	titleStyle: {
    fontSize: 34,
    marginBottom: 3
	},
  categoryStyle: {
    fontSize: 18,
    alignSelf: 'center'
  },
	imageStyle: {
    height: 150,
    width: 150,
    borderWidth: 2,
    borderRadius: 4
  }, 
  buttonStyle: {
    marginTop: 3,
    backgroundColor: '#4286f4',
    padding: 4,
    borderWidth: 2,
    borderRadius: 7
  },
  viewStyle: {
    backgroundColor: 'rgba(255, 255, 255, .65)',
    height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardStyle: {
    alignItems: 'center',
    backgroundColor: 'white',
  }
};
export default SpotInfo;
