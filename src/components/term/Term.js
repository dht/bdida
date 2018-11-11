// @flow
import React, { Component } from "react";
import "./Term.css";
import PropTypes from "prop-types";

type props = {};

export class Term<props> extends Component {
    static defaultProps: props = {};

    state = {};

    render() {
        const { input } = this.state;

        return (
            <div className="Term-container">
                <div>
                    <input
                        placeholder="חישוב"
                        value={input}
                        onChange={this.calculate}
                    />
                    <a>איפוס</a>
                </div>
            </div>
        );
    }
}

Term.contextTypes = {
    i18n: PropTypes.object
};

export default Term;
