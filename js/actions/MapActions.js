var MapConstants = require('../MapConstants');
var MapDispatcher = require('../MapDispatcher');

var d3 = require('d3');

var MapActions = {
  loadData: function(filePath) {
    d3.csv(filePath, function(data) {
      MapDispatcher.handleViewAction({
        type: MapConstants.MAP_DATA_LOADED,
        data: data
      });
    });
  }
};

module.exports = MapActions;
