'use strict';
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

const { width, height } = Dimensions.get('window');

const equalWidth = width /2; 
const equalHeight = height /3;
const equalH = equalHeight/2;
const url = 'https://demo6539122.mockable.io/images';
const largeMargin = 10;
const smallMargin = 5;
var newArr = [];


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

export default class App extends Component<{}> {

	constructor(props) {
		super(props);
		 this.state = {
		  isLoading: true,
		  dataSource: [],
		  message:'',
		};
		this._executeQuery(url);
	}

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

  _keyExtractor = (item, index) => index;

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
 
