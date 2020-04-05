import React from 'react';
import {Alert} from 'react-native';
import {View, Text, TouchableOpacity} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

import sheet from '../styles/sheet';
import {onSortOptions} from '../utils';


import Page from './common/Page';
import Bubble from './common/Bubble';
import BaseExamplePropTypes from './common/BaseExamplePropTypes';
import TabBarPage from './common/TabBarPage';


// eslint-disable-next-line react/prop-types
const AnnotationContent = ({title}) => (
  <View style={{borderColor: 'black', borderWidth: 1.0, width: 60}}>
    <Text>{title}</Text>
    <TouchableOpacity
      style={{
        backgroundColor: 'blue',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: 'white',
          fontWeight: 'bold',
        }}>
        Btn
      </Text>
    </TouchableOpacity>
  </View>
);


class ShowMap extends React.Component {
  static propTypes = {
    ...BaseExamplePropTypes,
  };

  constructor(props) {
    super(props);

    this._mapOptions = Object.keys(MapboxGL.StyleURL)
      .map(key => {
        return {
          label: key,
          data: MapboxGL.StyleURL[key],
        };
      })
      .sort(onSortOptions);

    this.state = {
      styleURL: this._mapOptions[0].data,
      backgroundColor: 'blue',
      coordinates: [[-73.99155, 40.73581], [-73.99155, 40.73681]],
    };

    this.onMapChange = this.onMapChange.bind(this);
    this.onUserMarkerPress = this.onUserMarkerPress.bind(this);
  }

  componentDidMount() {
    MapboxGL.locationManager.start();
  }

  componentWillUnmount() {
    MapboxGL.locationManager.stop();
  }

  onMapChange(index, styleURL) {
    this.setState({styleURL});
  }

  onUserMarkerPress() {
    Alert.alert('You pressed on the user location annotation');
  }

  render() {
    return (
      <TabBarPage
        {...this.props}
        scrollable
        options={this._mapOptions}
        onOptionPress={this.onMapChange}>
        <MapboxGL.MapView
          // styleURL={this.state.styleURL}
          style={sheet.matchParent}>
          <MapboxGL.Camera followZoomLevel={12} followUserLocation />

          <MapboxGL.UserLocation onPress={this.onUserMarkerPress} />
        </MapboxGL.MapView>
        // <MapboxGL.MapView
        //   ref={c => (this._map = c)}
        //   onPress={this.onPress}
        //   onDidFinishLoadingMap={this.onDidFinishLoadingMap}
        //   styleURL={this.state.styleURL}
        //   style={sheet.matchParent}>
        //   <MapboxGL.Camera
        //     zoomLevel={16}
        //     centerCoordinate={this.state.coordinates[0]}
        //     followZoomLevel={16}
        //     followUserLocation
        //   />
        //   <MapboxGL.UserLocation onPress={this.onUserMarkerPress} />
        //   <MapboxGL.PointAnnotation
        //     coordinate={this.state.coordinates[1]}
        //     id="pt-ann">
        //     <AnnotationContent title={'this is a point annotation'} />
        //   </MapboxGL.PointAnnotation>
        //
        //   <MapboxGL.MarkerView coordinate={this.state.coordinates[0]}>
        //     <AnnotationContent title={'this is a marker view'} />
        //   </MapboxGL.MarkerView>
        // </MapboxGL.MapView>

        <Bubble>
          <Text>Click to add a point annotation</Text>
        </Bubble>
      </TabBarPage>
    );
  }
}

export default ShowMap;
