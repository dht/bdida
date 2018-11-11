// @flow
import React, { Component } from "react";
import "./Table.css";
import PropTypes from "prop-types";
import Tag from "../tag/Tag";

type props = {};

export class Table<props> extends Component {
    static defaultProps: props = {};

    state = {};

    className = (row, col) => {
        const { data } = this.props,
            { relation = [], layer } = data;

        let className = "td";

        const filtered = relation.filter(r => r[0] === row && r[1] === col);
        const layerFiltered = layer.filter(r => r[0] === row && r[1] === col);

        if (filtered.length > 0) {
            className += " selected";
        }

        if (layerFiltered.length > 0) {
            className += " layer";
        }

        return className;
    };

    mouseDown = ev => {
        this.down = true;
    };

    mouseUp = ev => {
        this.down = false;
    };

    onMouseOver = (row, col) => {
        if (this.down) {
            this.props.onClick(row, col);
        }
    };

    componentDidMount() {
        document.addEventListener("mousedown", this.mouseDown);
        document.addEventListener("mouseup", this.mouseUp);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.mouseDown);
        document.removeEventListener("mouseup", this.mouseUp);
    }

    renderCells(row) {
        const { data } = this.props,
            { group } = data;

        return group.map(col => (
            <div
                key={col}
                className={this.className(row, col)}
                onMouseOver={() => this.onMouseOver(row, col)}
                onMouseDown={() => this.props.onClick(row, col)}
            />
        ));
    }

    renderRows() {
        const { data } = this.props,
            { group } = data;

        return group.map(i => (
            <div key={i} className="tr">
                <div className="th">{i}</div>
                {this.renderCells(i)}
            </div>
        ));
    }
    renderHeader() {
        const { data } = this.props,
            { group } = data;

        return group.map(i => (
            <div key={i} className="th">
                {i}
            </div>
        ));
    }

    style = () => {
        const { data } = this.props,
            { group } = data;

        return { width: (group.length + 1) * 32 };
    };

    renderQualities() {
        const { data } = this.props;
        const { qualities } = data || {};
        const { reflexive, symmetric, antiSymmetric, transitive } =
            qualities || {};

        return (
            <div>
                <div className="qualities">
                    <Tag on={reflexive}>רפלקסיבי</Tag>
                    <Tag on={symmetric}>סימטרי</Tag>
                    <Tag on={transitive}>טרנזיטיבי</Tag>
                </div>
                <div className="qualities">
                    <Tag on={antiSymmetric}>אנטי-סימטרי</Tag>
                    <Tag on={reflexive && symmetric && transitive}>שקילות</Tag>
                    <Tag on={reflexive && antiSymmetric && transitive}>
                        סדר חלקי
                    </Tag>
                </div>
            </div>
        );
    }

    renderTop() {
        if (!this.props.renderTop) {
            return null;
        }

        return this.props.renderTop();
    }

    render() {
        return (
            <div className="Table-container">
                <div className="top">{this.renderTop()}</div>
                <div className="table" style={this.style()}>
                    <div className="header">
                        <div className="td">-</div>
                        {this.renderHeader()}
                    </div>
                    <div className="body">{this.renderRows()}</div>
                </div>
                <div className="bottom">{this.renderQualities()}</div>
            </div>
        );
    }
}

Table.contextTypes = {
    i18n: PropTypes.object
};

export default Table;
