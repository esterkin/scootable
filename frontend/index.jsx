require("./node_modules/bootstrap/dist/css/bootstrap.min.css");
import React from 'react';
import ReactDOM from 'react-dom';
import MapGL from 'react-map-gl';
import ScatterplotOverlay from 'react-map-gl/src/overlays/scatterplot.react';
import HeatmapOverlay from 'react-map-gl-heatmap-overlay';

import Immutable from 'immutable';

var r = React.createElement;

// San Francisco
var location = {
  latitude:37.7577,
  longitude:-122.4376
}





function getAccessToken() {
  const match = window.location.search.match(/access_token=([^&\/]*)/);
  let accessToken = match && match[1];
  if (!accessToken) {
    /* eslint-disable no-process-env */
    /* global process */
    accessToken = process.env.MapboxAccessToken;
    /* eslint-enable no-process-env */
  }
  if (accessToken) {
    window.localStorage.accessToken = accessToken;
  } else {
    accessToken = window.localStorage.accessToken;
  }
  return accessToken;
}


var App =  React.createClass({
  requestData: function() {
    // Grab data
    function handler(){
      // if complete
      if (xhr.readyState === 4) {
	if (xhr.status === 200) {
	  // parse json response
	  var resp = JSON.parse(xhr.responseText);
	  var parked = resp.scooters;
	  // update component
	  this.setState({locations: Immutable.fromJS(parked)});
	}
      }
    }

    var url = "https://crossorigin.me/https://app.scoot.co/api/v1/scooters.json";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = handler.bind(this);
    xhr.send();

  },

  _onChangeViewport: function _onChangeViewport(viewport) {
    this.setState({viewport: Object.assign({}, this.state.viewport, viewport)});
  },


  getInitialState: function() {
    this.requestData();

    
    var state = {
      viewport: {
	width: window.innerWidth, 
	height: window.innerHeight,
	latitude: location.latitude,
	longitude: location.longitude,
	isDragging: true,
	zoom: 12,
      },
      locations: Immutable.fromJS([
	location
      ])
    };

    return state;
  },

  lngLatAccessor: function(location) {
    return [parseFloat(location.get('longitude')), parseFloat(location.get('latitude'))];
  },

  render: function() {
    return r(MapGL, 
	     Object.assign(this.state.viewport, {
		mapboxApiAccessToken: getAccessToken(),
		onChangeViewport: this._onChangeViewport
	      }),
	      r(HeatmapOverlay, 
		Object.assign(this.state.viewport, {
		  locations: this.state.locations,
		  intensityAccessor: (location) => {1 / 10},
		  sizeAccessor: (location) => 30,
		  lngLatAccessor: this.lngLatAccessor
		}))
	      );
  }
});

ReactDOM.render(<App/>, document.querySelector("#myApp"));
