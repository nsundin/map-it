/**
 * @jsx React.DOM
 */

var Graph = require('./Graph.react');
var React = require('react');
var Querier = require('./Querier.react');

var MapApplication = React.createClass({
  render: function() {
    return (
      <div>
        <Graph width={640} height={640} />
        <Querier />
      </div>
    );
  }
});

module.exports = MapApplication;
