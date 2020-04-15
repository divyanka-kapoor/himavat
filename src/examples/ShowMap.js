import React from 'react';
import {Alert} from 'react-native';
import {View, Text, TouchableOpacity} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

import sheet from '../styles/sheet';
import {onSortOptions} from '../utils';
import exampleIcon from '../assets/example.png';
import {featureCollection, feature} from '@turf/helpers';

import Page from './common/Page';
import Bubble from './common/Bubble';
import BaseExamplePropTypes from './common/BaseExamplePropTypes';
import TabBarPage from './common/TabBarPage';
import Geolocation from '@react-native-community/geolocation';

//
//
// eslint-disable-next-line react/prop-types

const styles = {
  icon: {
    iconImage: exampleIcon,
    iconAllowOverlap: true,
  },
};

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

      this._wasteOptions = [
        {label: 'Paper', data: 'paper'},
        {label: 'Plastic', data: 'plastic'},
        {label: 'Food', data: 'food'},
        {label: 'Misc', data: 'misc'}
      ];

      this._trackingOptions = Object.keys(MapboxGL.UserTrackingModes)
      .map(key => {
        return {
          label: key,
          data: MapboxGL.UserTrackingModes[key],
        };
      })
      .concat([
        {
          label: 'None',
          data: 'none',
        },
      ])
      .sort(onSortOptions);

    this.state = {
      styleURL: this._mapOptions[0].data,
      featureCollection: featureCollection([]),
      currentTrackingMode: MapboxGL.UserTrackingModes.FollowWithCourse,
      wasteOption:'',
      location: {},
    };

    this.onMapChange = this.onMapChange.bind(this);
    this.dropWaste = this.dropWaste.bind(this);
    this.onUpdateUserLocation = this.onUpdateUserLocation.bind(this);
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


  dropWaste(e,waste){
    Geolocation.getCurrentPosition(info => console.log(info));
    var coords = Geolocation.getCurrentPosition(position => {
      const location = JSON.stringify(position);
      this.setState({ location });
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    console.log(this.state.location);
    // var a = {type: 'Point', coordinates: [this.state.location.coords.longitude,this.state.location.coords.latitude]}
    console.log(coords);
    // console.log(a);
  }

  onUpdateUserLocation(location){
    console.log(location);
  }

  render() {
    return (
      <TabBarPage
        {...this.props}
        scrollable
        initialIndex={3}
        options={this._wasteOptions}
        onOptionPress={this.dropWaste}>
        <MapboxGL.MapView
          styleURL={this.state.styleURL}
          style={sheet.matchParent}
          logoEnabled={false}
          region={this.state.region}
          showUserLocation={true}
          onRegionChange={this.onRegionChange}
          onUpdateUserLocation={this.onUpdateUserLocation}>
          <MapboxGL.UserLocation
           visible={true}
           useNativeDriver={true}/>
         <MapboxGL.Camera
            defaultSettings={
              {
                zoomLevel: 15,
              }
            }
          followUserLocation={true}/>
          <MapboxGL.ShapeSource
            id="symbolLocationSource"
            hitbox={{width: 20, height: 20}}
            shape={this.state.featureCollection}>
          <MapboxGL.SymbolLayer
            id="symbolLocationSymbols"
            minZoomLevel={10}
            style={styles.icon}/>
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>
      </TabBarPage>
    );
  }
}

export default ShowMap;
