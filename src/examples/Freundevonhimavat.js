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

class Freundevonhimavat extends React.Component {
  state = {
            viewport: {
              width: "100vw",
              height: "100vh",
              latitude: 42.430472,
              longitude: -123.334102,
              zoom: 16
            }
          };

   render(){
     return(
          <MapboxGL  {...this.state.viewport} onViewportChange={(viewport => this.setState(viewport))} mapboxApiAccessToken="pk.eyJ1IjoiZGl2eWFua2EiLCJhIjoiY2swb3RqNmw5MDd0bjNqbXhpZGJxY2NuNyJ9.iRP40a17mVtZaadWnR8oBg" />
     );
   }
}

export default Freundevonhimavat;
