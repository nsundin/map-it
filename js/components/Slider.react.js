/**
 * @jsx React.DOM
 */

var React = require('react');
var jslider = require('../../jslider/bin/jquery.slider.all.js');

var Slider = React.createClass({
  propTypes: {
    initialValue: React.PropTypes.array,
    onChange: React.PropTypes.func,
    from: React.PropTypes.number,
    to: React.PropTypes.number,
    heterogeneity: React.PropTypes.array,
    scale: React.PropTypes.array,
    limits: React.PropTypes.bool,
    step: React.PropTypes.number
  },
  
  getDefaultProps: function() {
    return {
      initialValue: [0, 100],
      from: 0,
      to: 100,
      limits: false,
      step: 1
    };
  },
  
  getInitialState: function() {
    return {
      value: this.props.initialValue
    };
  },

  componentDidMount: function() {
    var root = this.getDOMNode();
    jQuery(root).find("input")
      .slider({
        skin: 'plastic',
        from: this.props.from,
        to: this.props.to,
        heterogeneity: this.props.heterogeneity,
        scale: this.props.scale,
        limits: this.props.limits,
        step: this.props.step,
        callback: (function(value) {
          var val = value.split(';').map(function(val) {return Number(val)});
          this.setState({value: val});
          this.props.onChange(val);
        }).bind(this)
      });
  },

  render: function() {
  	return (
      <div>
        <input type="slider" value={this.props.initialValue[0]+';'+this.props.initialValue[1]} />
      </div>
    );
  }
});

module.exports = Slider;
