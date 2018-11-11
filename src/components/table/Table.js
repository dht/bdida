// @flow
import React, { Component } from "react";
import "./Table.css";
import PropTypes from "prop-types";

type props = {};

export class Table<props> extends Component {
    static defaultProps: props = {
    };

    state = {

    };

    className= (row, col) => {
        const {data} =  this.props,
            {relation, layer}  = data;

        let className = "td";

        const filtered = relation.filter(r => r[0] === row && r[1]===col);
        const layerFiltered = layer.filter(r => r[0] === row && r[1]===col);

        if (filtered.length > 0) {
            className += " selected";
        }

        if (layerFiltered.length > 0) {
            className += " layer";
        }

        return className;
    }

    renderCells(row) {
        const {data} =  this.props,
            {group}  = data;

        return group.map(col => <div key={col} 
            className={this.className(row, col)} 
            onClick={() => this.props.onClick(row, col)}>
        </div>);
    }

    renderRows() {
        const {data} =  this.props,
            {group}  = data;

        return group.map(i => <div key={i} className="tr">
             <div className="th">{i}</div>
            {this.renderCells(i)}
        </div>);
    }
    renderHeader() {
        const {data} =  this.props,
            {group}  = data;

        return group.map(i => <div key={i} className="th">
            {i}
        </div>);
    }

    style = () => {
        const {data} =  this.props,
        {group}  = data;

        return {width: (group.length + 1) * 52};
    }

    render() {
        return (
            <div className="Table-container" style={this.style()}>
            <div className="header">
                <div className="td">-</div>
                {this.renderHeader()}
                </div>
            <div className="body">
                {this.renderRows()}
            </div>
            </div>
        );
    }
}

Table.contextTypes = {
    i18n: PropTypes.object
};

export default Table;
