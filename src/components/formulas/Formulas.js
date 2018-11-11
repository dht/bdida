// @flow
import React, { Component } from "react";
import "./Formulas.css";
import PropTypes from "prop-types";

type props = {};

export class Formulas<props> extends Component {
    static defaultProps: props = {
    };

    state = {};

    render() {
        const {formulas} = this.props;

        return (
            <div className="Formulas-container">
            <h3>רלציות</h3>
                   <ul>
       {formulas.map(formula =>  <li index={formula.id}>
          <a onClick={() => this.props.onSelect(formula)}>
            {formula.title}
          </a>
        </li>)
       }
      </ul>
            </div>
        );
    }
}

Formulas.contextTypes = {
    i18n: PropTypes.object
};

export default Formulas;
