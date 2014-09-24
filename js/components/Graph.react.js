/**
 * @jsx React.DOM
 */

var MapConstants = require('../MapConstants');
var MapStore = require('../stores/MapStore');
var React = require('react');
var topojson = require('topojson');

var d3 = require('d3');
var d3_root = null;

var Graph = React.createClass({
  propTypes: {
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired
  },

  getProjection: function() {
    return d3.geo.albers()
      .rotate([100, -1.1])
      .center([0, 30.2669])
      .parallels([30.2669, -97.7427])
      .scale(3200)
      .translate([this.props.width / 2, this.props.height / 2])
      .precision(.1);
  },

  componentDidMount: function() {
    MapStore.addListener((function(e) {
      this.forceUpdate();
    }).bind(this), MapConstants.GRAPH_CHANGE_EVENT);

    var projection = this.getProjection();

    var path = d3.geo.path()
      .projection(projection);

    var graticule = d3.geo.graticule()
      .extent([[-98 - 45, 38 - 45], [-98 + 45, 38 + 45]])
      .step([5, 5]);

    var svg = d3.select(this.getDOMNode()).append('svg')
      .attr('width', this.props.width)
      .attr('height', this.props.height);

    svg.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', path);

    d3.json('data/us.json', function(error, us) {
      svg.insert('path', '.graticule')
        .datum(topojson.feature(us, us.objects.land))
        .attr('class', 'land')
        .attr('d', path);

    svg.insert('path', '.graticule')
      .datum(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b && !(a.id / 1000 ^ b.id / 1000); }))
      .attr('class', 'county-boundary')
      .attr('d', path);

    svg.insert('path', '.graticule')
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr('class', 'state-boundary')
      .attr('d', path);
    });

    this.renderD3();
  },

  renderD3: function() {
    var filteredData = MapStore.getFilteredData();
    var colorField = MapStore.getColorField();
    var colorFunction = null;
    if (colorField) {
      var fields = MapStore.getIntegerFields();
      if (fields[colorField]) {
        var colorScale = fields[colorField].colorScale;
        colorFunction = function(d) {
          return colorScale(d[colorField]);
        };
      }
    }
    var projection = this.getProjection();
    var svg = d3.select(this.getDOMNode()).select('svg');

    // Enter
    svg.selectAll('circle').data(filteredData).enter()
      .append('circle')
      .attr('r', '1px')
      .attr('cx', function (d) { return projection([d['LONGITUD'], d['LATITUDE']])[0]; })
      .attr('cy', function (d) { return projection([d['LONGITUD'], d['LATITUDE']])[1]; });

    svg.selectAll('circle').data(filteredData)
      .attr('fill', colorFunction);

    svg.selectAll('circle').data(filteredData).exit()
      .transition()
        .duration(10)
          .style('opacity', 0)
          .remove();
  },

  componentDidUpdate: function() {
    this.renderD3();
  },

  render: function() {
    return <div className="graph"></div>;
  }
});

module.exports = Graph;
