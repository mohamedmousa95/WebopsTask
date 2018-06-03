'use strict';
//imports the required modules
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  Image,
  FlatList,
  TouchableHighlight,
  Dimensions,
} from 'react-native';

//getting dimensions of the device
const { width, height } = Dimensions.get('window'); 

//setting the size of images according to the device size
const equalWidth = width /2; 
const equalHeight = height /3; 
const equalH = equalHeight/2; 

//url for the json file request
const url = 'https://demo6539122.mockable.io/images'; 

//setting margin between images so there can be some space
const largeMargin = 10; 
const smallMargin = 5;

//array holding the images urls returned from the fetch query
var newArr = [];

//item one in the flatlist is holing three images that are shown in
//a specific orientation layout using flex ratios component, this item 
//is getting its data from newArr variable and each newArr cell (index)
//is holding an array of three images urls that are requested to be displayed
//inside this list item
class ListItem1 extends React.PureComponent {
	  render() {
	    const item = this.props.item;
	    return (
	        <View style={styles.container}>
	          <Image style={styles.imageBox1} source={{ uri: item[0].image }} />
	          <View style={styles.imageBox1}>
	                 <Image style={styles.imageBox2} source={{ uri: item[1].image }} />
	                 <Image style={styles.imageBox2} source={{ uri: item[2].image }} />
	          </View>	         
	        </View>
	    );
	  }
 }

//item two in the flatlist is holing three images that are shown in
//a specific orientation layout using flex ratios component, this item 
//is getting its data from newArr variable and each newArr cell (index)
//is holding an array of three images urls that are requested to be displayed
//inside this list item, this item is different from the previous one in just
//the orientaion of the images so that they are shown in somehow different 
//order (large image in the left instead of the right)
class ListItem2 extends React.PureComponent {
	render() {
		const item = this.props.item;
		return (
		    <View style={styles.container}>
			    <View style={styles.imageBox1}>
			             <Image style={styles.imageBox2} source={{ uri: item[0].image }} />
			             <Image style={styles.imageBox2} source={{ uri: item[1].image }} />
			    </View>
			    <Image style={styles.imageBox1} source={{ uri: item[2].image }} />
		    </View>
		);
	}
}

//item three in the flatlist is holding one image that is filling the screen
//width
class ListItem3 extends React.PureComponent {
  render() {
    const item = this.props.item;
    return (
        <View style={styles.container}>
          <Image style={styles.imageBox3} source={{ uri: item[0].image }} />     
        </View>
    );
  }
}

//defines the component that represents the UI
export default class App extends Component<{}> {

    //class holding three states :- 1) isloading responsible for checking
    //the spinner state. 2) datasource holds the newArr variable data which
    //is passed to the Flatlist's data component. 3) message which shown 
    //if error happens to diplay it.
	constructor(props) {
		super(props);
		 this.state = {
		  isLoading: true,
		  dataSource: [],
		  message:'',
		};
		this._executeQuery(url);
	}

   //changing the response so that it becomes in 2d array instead of 1d array
   //so that an index or cell containg multiple images can be passed as a one
   //item to the list item component, also set the isloading state to false
   //so that the spinner stops 
  _handleResponse = (response) => {
    var i=0;
	while(response.length!=0){
		if(response.length>=3 && (i%3==0 || i%3==1)){
         	newArr.push(response.splice(0,3));
		}
		else {
			newArr.push(response.splice(0,1));
		}
		i++;
	}
    this.setState({ isLoading: false,  dataSource:  newArr});
  };
  
  //fetching the query, parsing it to json and passing it to the _handleResponse
  //method which convert the response to be in 2d array
  _executeQuery = (query) => {
  fetch(query)
  .then(response => response.json())
  .then(responseJson => this._handleResponse(responseJson))
  .catch(error =>
      this.setState({
      isLoading: false,
      message: 'Something bad happened ' + error
      })
   );
  };

  //return index of the flatlist item
  _keyExtractor = (item, index) => index;

  //check for the row index of the flat list item so that
  //different views will be returned accordingly
  _renderItem = ({item, index}) => {
	  	if(index%3==0 && newArr[index].length>=3){
		    return(
		     <ListItem1
		    item={item}
		    index={index} />
		    );
	    }
		if(index%3==1 && newArr[index].length>=3){
			return(
		     <ListItem2
		    item={item}
		    index={index} />
		    );
		}
		if(index%3==2 || newArr[index].length<3){
			return(
		     <ListItem3
		    item={item}
		    index={index} />
		    );
		}
   };

  //shows a spinner while waiting for the request to finish 
  //shows flatlist containg the images requested or a message if 
  //something went wrong
  render() {
	    const spinner = this.state.isLoading ?
	    <View style={styles.spinner}><ActivityIndicator size='large'/></View>: null;
	    return (
	         <View>
				   <FlatList
				        data={this.state.dataSource}
				        keyExtractor={this._keyExtractor}
				        renderItem={this._renderItem}   />
				        {spinner}
				       <Text>{this.state.message}</Text>
	    	</View>
	    );
   }
}

//creates a style object that controls the component’s layout and appearance
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  imageBox1:{
  	flex:0.5,
  	height: equalHeight,
  	margin: largeMargin,
  },
  imageBox2:{
  	flex:0.5,
  	height: equalH,
  	margin: smallMargin,
  },
  imageBox3:{
  	flex:1, 
  	height: equalHeight, 
  	margin: largeMargin
  },
  spinner:{
    flex: 1,
    marginTop:height/2,
    justifyContent: 'center',
    alignItems:'center'
  },
});
 
