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

  dragEnd: function(field, e) {
    if (this.over === this.refs.show.getDOMNode()) {
      this.setState({show: this.dragged.innerHTML});
    } else if (this.over == this.refs.where.getDOMNode()) {
      var where = this.state.where;
      where.push(field);
      this.setState({where:  where});
    }
    this.dragged.style.border 
    this.over.style.border = this.prevBorder;
    this.dragged.style.display = "inline";

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
    var listItems = MapStore.getIntegerFields().map((function(field, i) {
      return (
        <span
          data-id={i}
          className="label label-primary field-item"
          key={i}
          draggable="true"
          onDragEnd={this.dragEnd.bind(this, field)}
          onDragStart={this.dragStart}>
          {field.name}
        </span>
      );
    }).bind(this));

    var wheres;
    if (this.state.where.length) {
      var where_items = this.state.where.map((function(item, i) {
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
      wheres = (<ul
              ref="where"
              onDragOver={this.dragOver.bind(this, 'where')}
              className="list-group">{where_items}</ul>);
    } else {
      wheres = (
        <div
          ref="where"
          onDragOver={this.dragOver.bind(this, 'where')}
          className="well well-sm">
          Drop and item here
        </div>);
    }

    return (
      <div className="querier">
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
            {wheres}
          </div>
        </div>
        <div className="qfields">
          <div className="panel panel-primary">
            <div className="panel-heading">Fields</div>
            <div onDragOver={this.dragOver}>
              {listItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Querier;
