/**
 * @jsx React.DOM
 */

var MapConstants = require('../MapConstants');
var MapStore = require('../stores/MapStore');
var React = require('react');
var Slider = require('./Slider.react');

var Querier = React.createClass({
  getInitialState: function() {
    return {
      where: [],
      show: 'Drop an item here'
    };
  },

  onWhereDelete: function(key, event) {
    var where = this.state.where;
    where.splice(key, 1);
    this.setState({where:  where});
  },

  dragStart: function(e) {
    this.dragged = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    
    // Firefox requires dataTransfer data to be set
    e.dataTransfer.setData("text/html", e.currentTarget);
  },

  dragEnd: function(e) {
    if (this.over === this.refs.show.getDOMNode()) {
      this.setState({show: this.dragged.innerHTML});
    } else if (this.over == this.refs.where.getDOMNode()) {
      var where = this.state.where;
      where.push({name: this.dragged.innerHTML, range: [0, 100]});
      this.setState({where:  where});
    }
    this.dragged.style.border 
    this.over.style.border = this.prevBorder;
    this.dragged.style.display = "block";

  },

  dragOver: function(target, event) {
    if (!this.refs[target]) {
      return;
    }
    var over = this.refs[target].getDOMNode();

    this.dragged.style.display = "none";
    if (this.over != over) {
      if (this.over) {
        this.over.style.border = this.prevBorder;
      }
      this.over = over;
      this.prevBorder = this.over.style.border;
      this.over.style.border = '3px solid #ccc';
    }
  },

  componentDidMount: function() {
    MapStore.addListener((function(e) {
      this.forceUpdate();
    }).bind(this), MapConstants.QUERIER_CHANGE_EVENT);
  },

  componentDidUpdate: function() {
    MapStore.setFilter((function(d) {
      for (i in this.state.where) {
        var e = this.state.where[i];
        var r = (d[e.name] >= e.range[0]) && (d[e.name] <= e.range[1]);
        if (!r) {
          return false;
        }
      }
      return true;
    }).bind(this));
  },

  onRangeChange: function(key, value) {
    this.state.where[key].range = value;
    this.forceUpdate();
  },

  render: function() {
    var listItems = MapStore.getIntegerFields().map((function(item, i) {
      return (
        <li data-id={i}
          className="list-group-item"
          key={i}
          draggable="true"
          onDragEnd={this.dragEnd}
          onDragStart={this.dragStart}>
          {item}
        </li>
      );
    }).bind(this));

    var wheres;
    if (this.state.where.length) {
      wheres = this.state.where.map((function(item, i) {
        return (
          <li 
            data-id={i}
            key={i}
            className="list-group-item where-item">
            {item.name}
            <div className="slider-container">
              <Slider
                initialValue={item.range}
                onChange={this.onRangeChange.bind(this, i)} />
            </div>
            <button 
              className="close delete-button"
              onClick={this.onWhereDelete.bind(this, i)}>
              &times;
            </button>
          </li>
        );
      }).bind(this));
    } else {
      wheres = <li>Drag item here</li>;
    }

    return (
      <div className="querier">
        <div className="qfields">
          <div className="panel panel-primary">
            <div className="panel-heading">Fields</div>
            <ul onDragOver={this.dragOver} className="list-group">
              {listItems}
            </ul>
          </div>
        </div>
        <div className="qoptions">
          <div>
            Show me:
            <div
              ref="show"
              onDragOver={this.dragOver.bind(this, 'show')}
              className="well well-sm">
              {this.state.show}
            </div>
            Where:
            <ul
              ref="where"
              onDragOver={this.dragOver.bind(this, 'where')}
              className="list-group">
              {wheres}
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Querier;
