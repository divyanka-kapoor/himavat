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
//
//
// eslint-disable-next-line react/prop-types
const AnnotationContent = ({title}) => (
  <View style={{borderColor: 'white', borderWidth: 1.0, width: 60}}>
    <Text>{title}</Text>
    <TouchableOpacity
      style={{
        backgroundColor: 'green',
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

const styles = {
  icon: {
    iconImage: exampleIcon,
    iconAllowOverlap: true,
  },
};

//
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
      coordinates: [[-73.99155, 40.73581], [-73.99155, 40.73681]],
      showUserLocation: true,
      currentTrackingMode: MapboxGL.UserTrackingModes.FollowWithCourse,
      showsUserHeadingIndicator: true,
    };
    this.onMapChange = this.onMapChange.bind(this);
    this.onUserMarkerPress = this.onUserMarkerPress.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onSourceLayerPress = this.onSourceLayerPress.bind(this);
    this.onTrackingChange = this.onTrackingChange.bind(this);
  }


  async onPress(e) {
    const aFeature = feature(e.geometry);
    aFeature.id = `${Date.now()}`;

    this.setState({
      featureCollection: featureCollection([
        ...this.state.featureCollection.features,
        aFeature,
      ]),
    });
  }

  onSourceLayerPress({features, coordinates, point}) {
    console.log(
      'You pressed a layer here are your features:',
      features,
      coordinates,
      point,
    );
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

  onTrackingChange(index, userTrackingMode) {
    this.setState({
      userSelectedUserTrackingMode: userTrackingMode,
      currentTrackingMode: userTrackingMode,
    });
  }


  render() {
    return (
      <TabBarPage
        {...this.props}
        scrollable
        initialIndex={3}
        options={this._trackingOptions}

        onOptionPress={this.onTrackingChange}>
        <MapboxGL.MapView
          styleURL={this.state.styleURL}
          style={sheet.matchParent}
          logoEnabled={false}
          onPress={this.onPress}
          region={this.state.region}
          onRegionChange={this.onRegionChange}>
          <MapboxGL.UserLocation
           visible={this.state.showUserLocation}

           useNativeDriver={true}
         />
         <MapboxGL.Camera
          defaultSettings={{
            centerCoordinate: [-111.8678, 40.2866],
            zoomLevel: 15,
          }}
          followUserLocation={
            this.state.userSelectedUserTrackingMode !== 'none'
          }
          followUserMode={
            this.state.userSelectedUserTrackingMode !== 'none'
              ? this.state.userSelectedUserTrackingMode
              : 'normal'
          }

        />
          <MapboxGL.ShapeSource
          id="symbolLocationSource"
          hitbox={{width: 20, height: 20}}
          onPress={this.onSourceLayerPress}
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
