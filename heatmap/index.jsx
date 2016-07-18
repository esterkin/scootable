require("./node_modules/bootstrap/dist/css/bootstrap.min.css")
import React from 'react';
import ReactDOM from 'react-dom';
import MapGL from 'react-map-gl';


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


export class App extends React.Component {
	render() {
		return (
		<MapGL
			width={window.innerWidth} height={window.innerHeight}
			latitude={37.7577} longitude={-122.4376}
			zoom={12}
			mapboxApiAccessToken={getAccessToken()}
			onChangeViewport={(viewport) => {
			const {latitude, longitude, zoom} = viewport;
			// Optionally call `setState` and use the state to update the map.
			}}
		/>
		//<div>
		//		This is the app
		//	</div>
		);
	}
}

ReactDOM.render(<App/>, document.querySelector("#myApp"));
