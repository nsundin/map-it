/**
 * @jsx React.DOM
 */

var MapApplication = require('./components/MapApplication.react');
var MapActions = require('./actions/MapActions');
var React = require('react');

MapActions.loadData('data/cropped_accident.csv');

React.renderComponent(
  <MapApplication />,
  document.getElementById('app')
);

