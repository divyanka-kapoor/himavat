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
      // userSelectedUserTrackingMode: this._trackingOptions[3].data,
      currentTrackingMode: MapboxGL.UserTrackingModes.FollowWithCourse,
      showsUserHeadingIndicator: true,
    };
    this.findCoordinates = this.findCoordinates.bind(this);
    this.onMapChange = this.onMapChange.bind(this);
    this.onUserMarkerPress = this.onUserMarkerPress.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onSourceLayerPress = this.onSourceLayerPress.bind(this);
    this.onTrackingChange = this.onTrackingChange.bind(this);
    // this.onUserTrackingModeChange = this.onUserTrackingModeChange.bind(this);
    // this.onToggleUserLocation = this.onToggleUserLocation.bind(this);
    // this.onToggleHeadingIndicator = this.onToggleHeadingIndicator.bind(this);
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

  onTrackingChange(index, userTrackingMode) {
    this.setState({
      userSelectedUserTrackingMode: userTrackingMode,
      currentTrackingMode: userTrackingMode,
    });
  }

  // onUserTrackingModeChange(e) {
  //   const {followUserMode} = e.nativeEvent.payload;
  //   this.setState({currentTrackingMode: followUserMode || 'none'});
  // }

  // onToggleUserLocation() {
  //   this.setState({showUserLocation: !this.state.showUserLocation});
  // }

  // onToggleHeadingIndicator() {
  //   this.setState({
  //     showsUserHeadingIndicator: !this.state.showsUserHeadingIndicator,
  //   });
  // }

  get userTrackingModeText() {
    switch (this.state.currentTrackingMode) {
      case MapboxGL.UserTrackingModes.Follow:
        return 'Follow';
      case MapboxGL.UserTrackingModes.FollowWithCourse:
        return 'FollowWithCourse';
      case MapboxGL.UserTrackingModes.FollowWithHeading:
        return 'FollowWithHeading';
      default:
        return 'None';
    }
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
        // <Bubble onPress={this.onToggleUserLocation} style={{bottom: 150}}>
        //   <Text>
        //     Toggle User Location:{' '}
        //     {this.state.showUserLocation ? 'true' : 'false'}
        //   </Text>
        // </Bubble>

        // <Bubble onPress={this.onToggleHeadingIndicator} style={{bottom: 220}}>
        //   <Text>
        //     Toggle user heading indicator:{' '}
        //     {this.state.showsUserHeadingIndicator ? 'true' : 'false'}
        //   </Text>
        // </Bubble>

        // <MapboxGL.Camera
        //   zoomLevel={9}
        //   centerCoordinate={[-73.970895, 40.723279]}
        //   followUserLocation={true}
        //   followUserMode=
        // />
        // <MapboxGL.UserLocation onPress={this.onUserMarkerPress} />
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
