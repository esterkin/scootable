/**
 * Created by Eric Ren on 8/6/16.
 */


import styles from './slider.css';

import React from 'react';
var r = React.createElement;

// TODO disable map scrolling when sliding button

// Invariant:
// - this.props.ts_size has to be >= 2
var Slider = React.createClass({

    getInitialState: function() {

        return {
            value: this.props.ts_size-1
        };
    },

    handleChange: function (event) {
        // TODO update parent state (App)
        var new_idx = event.target.value;

        this.setState({value: new_idx});
        this.props.changeIntervalIdx(new_idx);
    },

    // make this dynamic, and based on locations.length
    stepOptions: (n) => {
        return [...Array(n+1).keys()].map((_,i) => {
          return r('option', {}, (i).toString());
        });
    },

    render: function () {
       return r('div', {className: styles.layout},
           r('label', {htmlFor:"slider-time"}),
           r('input',
               {
                   type: 'range',
                   name: 'slider-time',
                   id: 'slider-time',
                   min: 0,
                   max: this.props.ts_size - 1,
                   step: 1,
                   value: this.state.value,
                   onChange: this.handleChange,
                   list: 'timesteps'
               }
           ),
           r('datalist',
               {
                   id:'timesteps'
               },
               ...this.stepOptions(this.props.ts_size - 1)
           )
       );
    }
});

//<input type="range" name="slider-time" id="slider-time"
//    min="0" max="100" step="10"
//    list="timesteps"
///>
//<datalist id="timesteps">
//<option>0</option>
//<option>20</option>
//<option>40</option>
//<option>60</option>
//<option>80</option>
//<option>100</option>
//</datalist>

export default Slider;
