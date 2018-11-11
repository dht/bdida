// @flow
import React, { Component } from "react";
import "./Tag.css";
import PropTypes from "prop-types";

type props = {};

export class Tag<props> extends Component {
    static defaultProps: props = {};

    state = {};

    render() {
        let className = "Tag-container";

        if (this.props.on) {
            className += " on";
        }

        return <div className={className}>{this.props.children}</div>;
    }
}

Tag.contextTypes = {
    i18n: PropTypes.object
};

export default Tag;
