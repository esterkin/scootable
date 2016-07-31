require("./node_modules/bootstrap/dist/css/bootstrap.min.css");
import React from 'react';
import ReactDOM from 'react-dom';
import MapGL from 'react-map-gl';
import ScatterplotOverlay from 'react-map-gl/src/overlays/scatterplot.react';
import Immutable from 'immutable';

var r = React.createElement;

// San Francisco
var location = {
  latitude:37.7577,
  longitude:-122.4376
}

var locations = Immutable.fromJS([
  [-122.4376, 37.7577], 
  [-122.4576, 37.7577], 
  [-122.4276, 37.7577], 
]);


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
  getInitialState: function() {
    return {
      viewport: {
	width: window.innerWidth, 
	height: window.innerHeight,
	latitude: location.latitude,
	longitude: location.longitude,
	isDragging: false,
	zoom: 12,
      }};
  },

  render: function() {
    return r(MapGL, 
	     Object.assign(this.state.viewport, {
		mapboxApiAccessToken: getAccessToken(),
		onChangeViewport: function(viewport) {
		const {latitude, longitude, zoom} = viewport;
		// Optionally call `setState` and use the state to update the map.
	      }}),
	      r(ScatterplotOverlay, 
		Object.assign(this.state.viewport, {
		  locations: locations,
		  dotRadius: 4,
		  dotFill: "#1FBAD6",
		  globalOpacity: 1,
		  compositeOperation: "screen"
		}))
	      );
  }
});

ReactDOM.render(<App/>, document.querySelector("#myApp"));
