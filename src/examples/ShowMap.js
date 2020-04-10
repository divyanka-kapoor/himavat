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
// // eslint-disable-next-line react/prop-types
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

    this.state = {
      styleURL: this._mapOptions[0].data,
      featureCollection: featureCollection([]),
      coordinates: [[-73.99155, 40.73581], [-73.99155, 40.73681]],
    };
    this.findCoordinates = this.findCoordinates.bind(this);
    this.onMapChange = this.onMapChange.bind(this);
    this.onUserMarkerPress = this.onUserMarkerPress.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onSourceLayerPress = this.onSourceLayerPress.bind(this);
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

  findCoordinates() {
		navigator.geolocation.getCurrentPosition(
			position => {
				const location = JSON.stringify(position);
        console.log(location);
				this.setState({ location });
			},
			error => Alert.alert(error.message),
			{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
		);
	};

  componentDidMount() {
    MapboxGL.locationManager.start();
    // findCoordinates();
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
          styleURL={this.state.styleURL}
          style={sheet.matchParent}
          logoEnabled={false}
          onPress={this.onPress}
          region={this.state.region}
          onRegionChange={this.onRegionChange}>
          <MapboxGL.Camera
            zoomLevel={9}
            centerCoordinate={[-73.970895, 40.723279]}
          />
          <MapboxGL.UserLocation onPress={this.onUserMarkerPress} />
          <MapboxGL.ShapeSource
            id="symbolLocationSource"
            hitbox={{width: 20, height: 20}}
            onPress={this.onSourceLayerPress}
            shape={this.state.featureCollection}>
            <MapboxGL.SymbolLayer
              id="symbolLocationSymbols"
              minZoomLevel={1}
              style={styles.icon}
            />
          </MapboxGL.ShapeSource>
          </MapboxGL.MapView>
        </TabBarPage>
          // <MapboxGL.PointAnnotation
          //   coordinate={this.state.coordinates[1]}
          //   id="pt-ann">
          //   <AnnotationContent title={'this is a point annotation'} />
          // </MapboxGL.PointAnnotation>

          // <MapboxGL.MarkerView coordinate={this.state.coordinates[0]}>
          //   <AnnotationContent title={'this is a marker view'} />
          // </MapboxGL.MarkerView>

// <MapboxGL.Images images={images} />
          // <MapboxGL.PointAnnotation
          //   coordinate={this.state.coordinates[1]}
          //   id="pt-ann">
          //   <AnnotationContent title={'this is a point annotation'} />
          // </MapboxGL.PointAnnotation>
          //
          // <MapboxGL.MarkerView coordinate={this.state.coordinates[0]}>
          //   <AnnotationContent title={'this is a marker view'} />
          // </MapboxGL.MarkerView>
        // </MapboxGL.MapView>
        // </MapboxGL.MapView>

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

        //
        // <Bubble>
        //   <Text>Click to add a point annotation</Text>
        // </Bubble>
      // </TabBarPage>

    );
  }
}

export default ShowMap;
