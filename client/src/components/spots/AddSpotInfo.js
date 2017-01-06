import React, { Component } from 'react';
import { View, Text, TextInput, TouchableHighlight, Dimensions } from 'react-native';
import CategoryModal from './CategoryModal';

const { width } = Dimensions.get('window');

class AddSpotInfo extends Component {
    render() {
        return (
            <View>
                <Text style={styles.labelStyle}>Title</Text>
                <TextInput 
                style={styles.textInputStyle}
                label='title'
                placeholder='required'
                //autocorrect={false}
                value={this.props.title}
                onChangeText={this.props.onTitleChange}
                />

                <Text style={styles.labelStyle}>Description</Text>
                <TextInput 
                style={styles.textInputStyle}
                label='description'
                placeholder='optional'
                value={this.props.description}
                onChangeText={this.props.onDescriptionChange}
                />

                <Text style={styles.labelStyle}>Categories</Text>
                <CategoryModal 
                onCategoryChange={this.props.onCategoryChange} 
                category={this.props.category}
                />

                <TouchableHighlight 
                style={styles.buttonStyle}
                onPress={this.props.onSubmit}
                >
                    <Text style={styles.buttonTextStyle}>post art</Text>
                </TouchableHighlight>
            </View>
      );
    }
}

const styles = {
  labelStyle: {
    fontSize: 18,
    // paddingBottom: 5,
    paddingTop: 20,
    flex: 1,
    alignSelf: 'center',
    color: '#EFEFF4',
  },
  textInputStyle: {
    alignSelf: 'center', 
    borderWidth: 1, 
    borderRadius: 5,
    borderColor: '#ccc', 
    padding: 10, 
    height: 40,
    width: width - 30,
    color: '#EFEFF4',
  },
  buttonStyle: {
    backgroundColor: 'gray',
    width: width * 0.5,
    height: 40,
    borderRadius: 8,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 30
  },
  buttonTextStyle: {
    color: '#EFEFF4',
    fontSize: 24,
    alignSelf: 'center'
  }
};

export default AddSpotInfo;
