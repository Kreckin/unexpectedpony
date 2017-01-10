import React from 'react';
import { View, Text, Image, TouchableHighlight, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';

const { width } = Dimensions.get('window');

const SavedItem = (props) => {
  return (
    <TouchableHighlight onPress={function () { Actions.SpotInfo(props); }}>
      <View style={styles.itemStyle}>
        <View style={styles.imageContainerStyle}>
          <Image
            style={{ width: 50, height: 50 }}
            source={{ uri: props.spot.img_url }}
          />
        </View>
        <View style={styles.textContainerStyle}>
          <View style={styles.titleBarStyle}>
            <Text
              style={styles.titleStyle}
              numberOfLines={1}
            >
              {props.spot.title}
            </Text>
            <TouchableHighlight onPress={function () { props.removeSavedSpot(props.spot.id); }}>
              <Image
                style={styles.trashStyle}
                source={require('../icons/trash.png')}
              />
            </TouchableHighlight>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={styles.descriptionStyle}
              numberOfLines={2}
            >
              {props.spot.description}
            </Text>
            <Text
              style={styles.distanceStyle}
              numberOfLines={2}
            >
              {Math.round(props.spot.distance * 10) / 10} miles
            </Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};
const styles = {
  itemStyle: {
    alignSelf: 'center',
    flex: 1,
    width: width - 10,
    height: 80,
    borderRadius: 1,
    borderColor: 'grey',
    borderWidth: 1,
    backgroundColor: '#EFEFF4',
    flexDirection: 'row'
  },
  titleStyle: {
    fontSize: 20,
    alignSelf: 'flex-start',
    color: '#006F60',
    width: width - 120

  },
  titleBarStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 5
  },
  distanceStyle: {
    fontSize: 12,
    alignSelf: 'flex-end',
    textAlign: 'center',
    color: '#006F60',
    width: 40,
    fontStyle: 'italic'
  },
  descriptionStyle: {
    fontSize: 12,
    alignSelf: 'flex-start',
    flex: 1,
    color: '#006F60'
  },
  trashStyle: {
    height: 15,
    width: 15,
    alignSelf: 'flex-end'
  },
  imageContainerStyle: {
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  textContainerStyle: {
    width: width - 95
  }
};
export default SavedItem;
