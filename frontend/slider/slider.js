/**
 * Created by Eric Ren on 8/6/16.
 */


import styles from './slider.css';

import React from 'react';
var r = React.createElement;


// Invariant:
// - this.props.ts_size has to be >= 1
var Slider = React.createClass({

    getInitialState: function() {

        return {
            value: this.props.ts_size-1
        };
    },

    handleChange: function (event) {
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


export default Slider;
