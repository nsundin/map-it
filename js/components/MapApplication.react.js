/**
 * @jsx React.DOM
 */

var Graph = require('./Graph.react');
var React = require('react');
var Querier = require('./Querier.react');

/* touchHandler is from
   http://stackoverflow.com/questions/5186441/javascript-drag-and-drop-for-touch-devices
*/
function touchHandler(event) {
  var touch = event.changedTouches[0];

  var simulatedEvent = document.createEvent('MouseEvent');
    simulatedEvent.initMouseEvent({
    touchstart: 'mousedown',
    touchmove: 'mousemove',
    touchend: 'mouseup'
  }[event.type], true, true, window, 1,
    touch.screenX, touch.screenY,
    touch.clientX, touch.clientY, false,
    false, false, false, 0, null);

  touch.target.dispatchEvent(simulatedEvent);
  if(jQuery(event.target).hasClass('draggable')) {
    event.preventDefault();
  }
}

var MapApplication = React.createClass({
  componentDidMount: function() {
    document.addEventListener('touchstart', touchHandler, true);
    document.addEventListener('touchmove', touchHandler, true);
    document.addEventListener('touchend', touchHandler, true);
    document.addEventListener('touchcancel', touchHandler, true);
  },
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
