var EventEmitter = require('events').EventEmitter;
var MapConstants = require('../MapConstants');
var MapDispatcher = require('../MapDispatcher');

var merge = require('react/lib/merge');

var dataFilter = function(d) { return true; };
var dataPoints = [];

var colorField = null;
var fields = [];
var filteredDataCache = null;
var cachedFilter = null;

var MapStore = merge(EventEmitter.prototype, {
  getData: function() {
  	return dataPoints;
  },

  getIntegerFields: function() {
    return fields;
  },

  setColorField: function(fieldName) {
    colorField = fieldName;
    MapStore.emitEvent(MapConstants.GRAPH_CHANGE_EVENT);
  },

  getColorField: function() {
    return colorField;
  },

  generateIntegerFields: function() {
    var intKeys = [];
    if (dataPoints.length) {
      for (key in dataPoints[0]) {
        if (!isNaN(dataPoints[0][key])) {
          intKeys[key] = {name: key, range: [null, null]};
        }
      }
    }
    var val;
    dataPoints.forEach(function(point) {
      for (fieldIndex in intKeys) {
        // Min
        val = Number(point[intKeys[fieldIndex].name]);
        if (val < intKeys[fieldIndex].range[0] || !intKeys[fieldIndex].range[0]) {
          intKeys[fieldIndex].range[0] = val;
        }
        // Max
        if (val > intKeys[fieldIndex].range[1] || !intKeys[fieldIndex].range[1]) {
          intKeys[fieldIndex].range[1] = val;
        }
      }
    });
    for (fieldIndex in intKeys) {
      intKeys[fieldIndex].colorScale = d3.scale.linear()
        .domain(intKeys[fieldIndex].range)
        .range(['blue', 'red']);
    }
    return intKeys;
  },

  getFilteredData: function(forceRecache) {
    if (forceRecache || (cachedFilter != dataFilter)) {
      cachedFilter = dataFilter;
      filteredDataCache = dataPoints.filter(dataFilter);
    }
    return filteredDataCache;
  },

  setFilter: function(newFilter) {
    dataFilter = newFilter;
    MapStore.emitEvent(MapConstants.GRAPH_CHANGE_EVENT);
  },

  emitEvent: function(event) {
    this.emit(event);
  },

  addListener: function(callback, eventType) {
    this.on(eventType, callback);
  },

  removeListener: function(callback, eventType) {
    this.removeListener(eventType, callback);
  }
});

MapDispatcher.register(function(payload) {
  var action = payload.action;
  switch(action.type) {
    case MapConstants.MAP_DATA_LOADED:
      dataPoints = action.data;
      MapStore.getFilteredData(true);
      fields = MapStore.generateIntegerFields();
      MapStore.emitEvent(MapConstants.GRAPH_CHANGE_EVENT);
      MapStore.emitEvent(MapConstants.QUERIER_CHANGE_EVENT);
      break;
  }
});

module.exports = MapStore;
