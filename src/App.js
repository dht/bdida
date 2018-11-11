import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Table from "./components/table/Table";
import Formulas from "./components/formulas/Formulas";
import formulas from "./constants/formulas";
import Tag from "./components/tag/Tag";
import Term from "./components/term/Term";
import { SetMath } from "./utils/SetMath";

class App extends Component {
    state = {
        input: "I U R U R2 U R3 U R4",
        boardSize: 10,
        boardSizeTransient: 10,
        data1: {
            group: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            relation: [],
            layer: [],
            qualities: {
                reflexive: true,
                symmetric: true,
                transitive: true
            }
        },
        data2: {
            group: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            relation: [],
            layer: [],
            qualities: {
                reflexive: true,
                symmetric: true,
                transitive: true
            }
        },
        selectedFormula: {}
    };

    componentDidMount() {
        this.reset();
    }

    reset = () => {
        let { data1, data2, boardSize, input } = this.state;

        this.m = new SetMath(boardSize);
        const m = this.m;

        data1 = m.reset(data1);
        data2 = m.reset(data2);

        this.setState({ data1, data2 }, () => {
            this.calculate(input);
        });
    };

    complete = () => {
        const m = this.m;
        let { data1 } = this.state;

        data1 = m.complete(data1);

        this.setState({ data1 });
    };

    calculate = () => {
        try {
            const m = this.m;
            let { data1, input } = this.state;

            let data2 = m.calculate(data1, input);

            this.setState({ data2 });
        } catch (e) {
            console.log("e.message ->", e.message);
        }
    };

    onTermChange = value => {
        this.setState({ input: value }, () => {
            this.calculate();
        });
    };

    sort = () => {
        const m = this.m;
        let { data1, data2 } = this.state;

        data1 = m.sort(data1);
        data2.group = data1.group;

        this.setState({ data1, data2 });
    };

    checkLayer = () => {
        const m = this.m;
        let { data1 } = this.state;

        data1 = m.checkLayer(data1);

        this.setState({ data1 });
    };

    refresh = () => {
        this.checkLayer();
        this.calculate();
    };

    onClick = (row, col, which = 1) => {
        const m = this.m;
        let data = this.state[`data${which}`];

        if (which === 2) {
            return;
        }

        data = m.addBlock(data, row, col);

        this.setState({ [`data${which}`]: data });
        this.refresh();
    };

    checkQualities = relation => {
        const m = this.m;

        return m.checkQualities(relation);
    };

    onSelect = selectedFormula => {
        const m = this.m;
        let { data1 } = this.state;
        const { formula } = selectedFormula;

        data1 = m.runFormula(selectedFormula, data1);

        this.setState({ data1, formula });
        this.refresh();
    };

    onSizeChange = size => {
        let { boardSize } = this.state;

        size = parseInt(size, 10) || "";

        if (size) {
            size = Math.min(size, 10);
            boardSize = size;
        }

        this.setState({ boardSizeTransient: size, boardSize }, () => {
            this.reset();
        });
    };

    renderTerm = () => {
        const { input } = this.state;
        return <Term value={input} onChange={this.onTermChange} />;
    };

    renderGroupHeader = () => {
        const { data1 } = this.state;
        const { group } = data1;

        const header = group.join(", ");

        return <h1 className="header">A = &#123;{header}&#125;</h1>;
    };

    render() {
        const { data1, data2, input, boardSizeTransient } = this.state;
        const { qualities } = data1;
        const { reflexive, symmetric, transitive } = qualities;

        return (
            <div className="App">
                <div className="line">
                    <Formulas
                        boardSize={boardSizeTransient}
                        data={data1}
                        formulas={formulas}
                        reset={this.reset}
                        complete={this.complete}
                        sort={this.sort}
                        onSelect={this.onSelect}
                        onSizeChange={this.onSizeChange}
                    />

                    <Table
                        data={data1}
                        onClick={(row, col) => this.onClick(row, col, 1)}
                        renderTop={this.renderGroupHeader}
                    />

                    <Table
                        data={data2}
                        onClick={(row, col) => this.onClick(row, col, 2)}
                        renderTop={this.renderTerm}
                    />
                </div>
            </div>
        );
    }
}

export default App;
