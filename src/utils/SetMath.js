import clone from "clone";

export class SetMath {
    constructor(boardSize) {
        this.boardSize = boardSize;
    }

    flip(relation = []) {
        return relation.map(i => [i[1], i[0]]);
    }

    multi(rel1 = [], rel2 = []) {
        let output = [];

        rel1.forEach(r1 => {
            rel2.forEach(r2 => {
                if (r1[1] === r2[0]) {
                    output.push([r1[0], r2[1]]);
                }
            });
        });

        return output;
    }

    power(relation, pow) {
        let output = clone(relation);

        if (pow > 10) {
            pow = 10;
        }

        if (pow < 0) {
            output = this.flip(output);
        }

        for (let i = 1; i < pow; i++) {
            output = this.multi(output, relation);
        }

        return output;
    }

    i() {
        let output = [];

        for (let i = 1; i <= this.boardSize; i++) {
            output.push([i, i]);
        }

        return output;
    }

    calculateOne(one, relation) {
        one = one.trim();
        const prefix = one.substr(0, 1).toUpperCase(),
            pow = parseInt(one.substr(1), 10) || 1;

        let rel;

        switch (prefix) {
            case "I":
                rel = this.i();
                break;
            default:
                rel = relation;
        }

        return this.power(rel, pow);
    }

    trim(relation) {
        return relation.filter(
            r =>
                r[0] >= 0 &&
                r[0] <= this.boardSize &&
                r[1] >= 0 &&
                r[1] <= this.boardSize
        );
    }

    exists(relation = [], pair) {
        return relation.filter(r => r[0] === pair[0] && r[1] === pair[1])
            .length;
    }

    and(rel1 = [], rel2 = []) {
        return rel1.filter(i => this.exists(rel2, i));
    }

    or(rel1, rel2) {
        const temp = rel2.filter(i => !this.exists(rel1, i));
        return [...rel1, ...temp];
    }

    operation(rel1, rel2, which) {
        switch (which) {
            case "^":
                return this.and(rel1, rel2);
            case "U":
                return this.or(rel1, rel2);
            case "*":
                return this.multi(rel1, rel2);
        }
    }

    calculate(data, term) {
        let output = clone(data);
        let { relation } = output;

        term = term.replace(/ /g, "");

        let regex = new RegExp(/([RI]-?\d?)([\^\*U])?/gim);

        let matches, operation, result;

        while ((matches = regex.exec(term))) {
            if (matches.length === 3) {
                const vr = matches[1];
                const transient = this.calculateOne(vr, relation);
                result = result || transient;

                if (operation) {
                    result = this.operation(result, transient, operation);
                }

                operation = matches[2];
            }
        }

        output.relation = this.trim(result);
        output.qualities = this.checkQualities(result);

        return output;
    }

    whoWith(data, n) {
        const { relation } = data;

        let output = [];

        for (let i = 1; i <= this.boardSize; i++) {
            if (i !== n) {
                const exists = relation.filter(r => r[0] === n && r[1] === i)
                    .length;
                if (exists) {
                    output.push(i);
                }
            }
        }

        return output;
    }

    addIfDoesNotExist(arr, add) {
        let temp = add.filter(i => arr.indexOf(i) === -1);
        return [...arr, ...temp];
    }

    fill(arr) {
        let temp = [...arr];

        for (let i = 1; i <= this.boardSize; i++) {
            if (temp.indexOf(i) === -1) {
                temp.push(i);
            }
        }

        return temp;
    }

    sort(data) {
        let group = [];

        for (let i = 1; i <= this.boardSize; i++) {
            const whoWith = this.whoWith(data, i);
            group = this.addIfDoesNotExist(group, [i, ...whoWith]);
        }

        group = this.fill(group);

        data.group = group;

        return data;
    }

    checkLayer(data) {
        let { relation } = data;

        let temp = [...relation];
        let layer = [];

        let qualities = this.checkQualities(temp);

        if (!qualities.transitive) {
            data.layer = [];
            return data;
        }

        for (let row = 1; row <= this.boardSize; row++) {
            for (let col = 1; col <= this.boardSize; col++) {
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

        return data;
    }

    addBlock(data, row, col) {
        const { relation } = data;

        let output = [...relation];

        const exists = relation.filter(r => r[0] === row && r[1] === col)
            .length;
        if (exists) {
            output = relation.filter(r => !(r[0] === row && r[1] === col));
        } else {
            output.push([row, col]);
        }

        data.relation = output;
        data.qualities = this.checkQualities(output);

        return data;
    }

    checkQualities(relation) {
        let reflexive = true,
            symmetric = true,
            transitive = true;

        // reflexive
        for (let i = 1; i <= this.boardSize; i++) {
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
    }

    reset(data) {
        data.group = [...Array(this.boardSize + 1).keys()].filter(i => i !== 0);

        return data;
    }

    complete(data) {
        const { relation } = data;

        let output = [...relation];

        // add reflexive
        for (let i = 1; i <= this.boardSize; i++) {
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
        data.qualities = this.checkQualities(output);

        return data;
    }

    runFormula(selectedFormula, data) {
        let relation = [],
            qualities;

        const { formula } = selectedFormula;

        for (let a = 1; a <= this.boardSize; a++) {
            for (let b = 1; b <= this.boardSize; b++) {
                if (formula(a, b)) {
                    relation.push([a, b]);
                }
            }
        }

        data.relation = relation;
        data.qualities = this.checkQualities(relation);

        return data;
    }
}
