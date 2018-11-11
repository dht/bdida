// @flow
import React, { Component } from "react";
import "./Term.css";
import PropTypes from "prop-types";

type props = {};

export class Term<props> extends Component {
    static defaultProps: props = {};

    state = {};

    onChange = value => {
        this.props.onChange(value);
    };

    reset = () => {
        this.onChange("R");
    };

    render() {
        const { value } = this.props;

        return (
            <div className="Term-container">
                <div>
                    <input
                        placeholder="חישוב"
                        value={value}
                        onChange={ev => this.onChange(ev.target.value)}
                    />
                    <a onClick={this.reset}>איפוס</a>
                </div>
            </div>
        );
    }
}

Term.contextTypes = {
    i18n: PropTypes.object
};

export default Term;
