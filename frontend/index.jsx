import "./node_modules/bootstrap/dist/css/bootstrap.min.css";
import styles from './main.css';

import React from 'react';
import ReactDOM from 'react-dom';
import MapGL from 'react-map-gl';
import HeatmapOverlay from 'react-map-gl-heatmap-overlay';

import Slider from './Slider';

import Immutable from 'immutable';

var r = React.createElement;

var default_location = {
    latitude: 37.7577,
    longitude: -122.4376
}
// San Francisco
var default_interval = {
    _id: 1234,
    locations: [default_location]
};


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


class App extends React.Component {

    constructor(props) {
        super(props);
        this.requestData();

        this.state = {
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                latitude: default_location.latitude,
                longitude: default_location.longitude,
                isDragging: true,
                zoom: 12
            },

            intervals: [default_interval],
            interval_idx: 0
        }
        this._onChangeViewport = this._onChangeViewport.bind(this);
        this.requestData = this.requestData.bind(this);
        this.changeIntervalIdx = this.changeIntervalIdx.bind(this);
    }

    requestData() {
        // Grab data
        function handler() {
            // if complete
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // parse json response
                    var resp = JSON.parse(xhr.responseText);
                    if (resp.status === 'success') {

                        var intervals = resp.data;
                        // update component
                        this.setState({
                            intervals: intervals,
                            interval_idx: intervals.length - 1
                        });
                    } else {
                        // handle this
                    }
                }
            }
        }

        var url = "http://localhost:8080/locations";
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onreadystatechange = handler.bind(this);
        xhr.send();
    }

    _onChangeViewport(viewport) {
        this.setState({viewport: Object.assign({}, this.state.viewport, viewport)});
    }


    lngLatAccessor(location) {
        return [parseFloat(location.get('long')), parseFloat(location.get('lat'))];
    }

    // might have to bind 'this'
    changeIntervalIdx(i) {
       this.setState({interval_idx: i});
    }

    render() {
        var sliderComp;

        if (this.state.intervals.length < 2) {
            sliderComp = undefined;
        } else {
            sliderComp = r(Slider, {
                ts_size: this.state.intervals.length,
                changeIntervalIdx: this.changeIntervalIdx
            });
        }

        return r('div', {},
            r(MapGL,
                Object.assign(this.state.viewport, {
                    mapboxApiAccessToken: getAccessToken(),
                    onChangeViewport: this._onChangeViewport
                }),
                r(HeatmapOverlay,
                    Object.assign(this.state.viewport, {
                        locations: Immutable.fromJS(this.state.intervals[this.state.interval_idx].locations),
                        intensityAccessor: (location) => 1 / 4,
                        sizeAccessor: (location) => 20,
                        lngLatAccessor: this.lngLatAccessor
                    })
                )
            ),
            sliderComp
        );
    }
}

ReactDOM.render(<App/>, document.querySelector("#myApp"));
