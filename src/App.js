import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Table from "./components/table/Table";
import Formulas from "./components/formulas/Formulas";
import formulas from "./constants/formulas";
import Tag from "./components/tag/Tag";

class App extends Component {
    state = {
        boardSize: 5,
        data: {
            group: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            relation: [],
            layer: []
        },
        selectedFormula: {},
        qualities: {
            reflexive: true,
            symmetric: true,
            transitive: true
        }
    };

    componentDidMount() {
        this.reset();
    }

    reset = () => {
        let { data, boardSize } = this.state;

        data.group = [...Array(boardSize + 1).keys()].filter(i => i !== 0);

        this.setState({ data });
    };

    complete = () => {
        const { data, boardSize } = this.state,
            { relation } = data;

        let output = [...relation];

        // add reflexive
        for (let i = 1; i <= boardSize; i++) {
            const exists = output.filter(r => r[0] === i && r[1] === i).length;
            if (!exists) {
                output.push([i, i]);
            }
        }

        // add symmetric
        output.forEach(rel => {
            if (rel[0] !== rel[1]) {
                const exists = output.filter(
                    r => r[0] === rel[1] && r[1] === rel[0]
                ).length;

                if (!exists) {
                    output.push([rel[1], rel[0]]);
                }
            }
        });

        // transitive
        relation.forEach(rel1 => {
            relation.forEach(rel2 => {
                if (rel1[1] === rel2[0]) {
                    const exists = relation.filter(
                        r => r[0] === rel1[0] && r[1] === rel2[1]
                    ).length;
                    if (!exists) {
                        output.push([rel1[0], rel2[1]]);
                    }
                }
            });
        });

        data.relation = output;

        let qualities = this.checkQualities(output);

        this.setState({ qualities, data });
    };

    whoWith = n => {
        const { data, boardSize } = this.state,
            { relation } = data;

        let output = [];

        for (let i = 1; i <= boardSize; i++) {
            if (i !== n) {
                const exists = relation.filter(r => r[0] === n && r[1] === i)
                    .length;
                if (exists) {
                    output.push(i);
                }
            }
        }

        return output;
    };

    addIfDoesNotExist = (arr, add) => {
        let temp = add.filter(i => arr.indexOf(i) === -1);
        return [...arr, ...temp];
    };

    fill = arr => {
        const { boardSize } = this.state;

        let temp = [...arr];

        for (let i = 1; i <= boardSize; i++) {
            if (temp.indexOf(i) === -1) {
                temp.push(i);
            }
        }

        return temp;
    };

    sort = () => {
        let { data, boardSize } = this.state;

        let group = [];

        for (let i = 1; i <= boardSize; i++) {
            const whoWith = this.whoWith(i);
            group = this.addIfDoesNotExist(group, [i, ...whoWith]);
        }

        group = this.fill(group);

        data.group = group;

        this.setState({ data });
    };

    checkLayer = () => {
        let { data, boardSize } = this.state,
            { relation } = data;

        let temp = [...relation];
        let layer = [];

        let qualities = this.checkQualities(temp);

        if (!qualities.transitive) {
            data.layer = [];
            this.setState({ data });
            return;
        }

        for (let row = 1; row <= boardSize; row++) {
            for (let col = 1; col <= boardSize; col++) {
                const exists = relation.filter(
                    r => r[0] === row && r[1] === col
                ).length;
                if (!exists) {
                    const temp2 = [...temp, [row, col]];
                    qualities = this.checkQualities(temp2);
                    if (qualities.transitive) {
                        layer.push([row, col]);
                    }
                }
            }
        }

        data.layer = layer;

        this.setState({ data });
    };

    onClick = (row, col) => {
        let { data } = this.state,
            { relation } = data;

        let output = [...relation];

        const exists = relation.filter(r => r[0] === row && r[1] === col)
            .length;
        if (exists) {
            output = relation.filter(r => !(r[0] === row && r[1] === col));
        } else {
            output.push([row, col]);
        }

        data.relation = output;

        let qualities = this.checkQualities(output);

        this.setState({ qualities, data });

        this.checkLayer();
    };

    checkQualities = relation => {
        const { boardSize } = this.state;

        let reflexive = true,
            symmetric = true,
            transitive = true;

        // reflexive
        for (let i = 1; i <= boardSize; i++) {
            const exists = relation.filter(r => r[0] === i && r[1] === i)
                .length;
            reflexive = reflexive && exists;
        }

        // symmetric
        relation.forEach(rel => {
            const exists = relation.filter(
                r => r[0] === rel[1] && r[1] === rel[0]
            ).length;
            symmetric = symmetric && exists;
        });

        // transitive
        relation.forEach(rel1 => {
            relation.forEach(rel2 => {
                if (rel1[1] === rel2[0]) {
                    const exists = relation.filter(
                        r => r[0] === rel1[0] && r[1] === rel2[1]
                    ).length;
                    transitive = transitive && exists;
                }
            });
        });

        return {
            reflexive,
            symmetric,
            transitive
        };
    };

    onSelect = selectedFormula => {
        let { data, boardSize } = this.state;

        let relation = [],
            qualities;

        const { formula } = selectedFormula;

        for (let a = 1; a <= boardSize; a++) {
            for (let b = 1; b <= boardSize; b++) {
                if (formula(a, b)) {
                    relation.push([a, b]);
                }
            }
        }

        data.relation = relation;
        qualities = this.checkQualities(relation);

        this.setState({ qualities, data, formula });

        this.checkLayer();
    };

    renderGroupHeader = () => {
        const { data } = this.state,
            { group } = data;

        const header = group.join(", ");

        return (
            <div className="header">
                <div className="groupSize">
                    <label>גודל הקבוצה</label>
                    <input placeholder="גודל" />
                </div>
                <h1>A = &#123;{header}&#125;</h1>nvm u
            </div>
        );
    };

    render() {
        const { data, qualities } = this.state;
        const { reflexive, symmetric, transitive } = qualities;

        return (
            <div className="App">
                <div className="line">
                    <Formulas formulas={formulas} onSelect={this.onSelect} />
                    <div>
                        {this.renderGroupHeader()}
                        <Table data={data} onClick={this.onClick} />
                        <div className="line">
                            <Tag on={reflexive}>רפלקסיבי</Tag>
                            <Tag on={symmetric}>סימטרי</Tag>
                            {/* <Tag on="true">אנטי-סימטרי</Tag> */}
                            <Tag on={transitive}>טרנזיטיבי</Tag>
                        </div>
                        <div className="line">
                            <div>
                                <label>נוסחה</label>
                                <input placeholder="חישוב" />
                                <a>דוגמה</a>
                                <a>איפוס</a>
                            </div>
                        </div>
                        <div className="line">
                            <button
                                onClick={this.complete}
                                disabled={reflexive && symmetric && transitive}
                            >
                                השלם לשקילות
                            </button>
                            <button onClick={this.reset}>אפס מיון</button>
                            <button
                                onClick={this.sort}
                                disabled={
                                    !reflexive || !symmetric || !transitive
                                }
                            >
                                מיין לפי קבוצות שקילות
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
