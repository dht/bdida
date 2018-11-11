// @flow
import React, { Component } from "react";
import "./Formulas.css";
import PropTypes from "prop-types";
import Tag from "../tag/Tag";

type props = {};

export class Formulas<props> extends Component {
    static defaultProps: props = {};

    state = {};

    render() {
        const { formulas, data, boardSize } = this.props;
        const { qualities } = data;
        const { reflexive, symmetric, transitive } = qualities;

        return (
            <div className="Formulas-container">
                <div>
                    <label>גודל הלוח</label>
                    <input
                        onFocus={e => e.target.select()}
                        placeholder="גודל"
                        value={boardSize}
                        onChange={ev =>
                            this.props.onSizeChange(ev.target.value)
                        }
                    />
                </div>
                <h3>רלציות</h3>
                <ul>
                    {formulas.map(formula => (
                        <li index={formula.id}>
                            <a onClick={() => this.props.onSelect(formula)}>
                                {formula.title}
                            </a>
                        </li>
                    ))}
                </ul>

                <button
                    onClick={this.props.sort}
                    disabled={!reflexive || !symmetric || !transitive}
                >
                    מיין לפי קבוצות שקילות
                </button>

                <button onClick={this.props.reset}>אפס מיון</button>

                <button
                    onClick={this.props.complete}
                    disabled={reflexive && symmetric && transitive}
                >
                    השלם לשקילות
                </button>
            </div>
        );
    }
}

Formulas.contextTypes = {
    i18n: PropTypes.object
};

export default Formulas;
