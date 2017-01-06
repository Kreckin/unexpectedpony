import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const CameraButtons = (props) => {
  return (
	<View style={styles.container}>
		<TouchableOpacity style={styles.button} onPress={props.takePhoto}>
			<Text style={styles.buttonText}>Take a picture</Text>
		</TouchableOpacity>
		<TouchableOpacity style={styles.button} onPress={props.chooseImage}>
			<Text style={styles.buttonText}>Choose from gallery</Text>
		</TouchableOpacity>
    </View>
  );
};
const styles = {
  container: {
    flex: 1,
    //flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#00B89C',
    width: 220,
    height: 90,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20
  },
  buttonText: {
    color: '#EFEFF4',
    fontSize: 22,
    alignItems: 'center'
  },
};
export default CameraButtons;
