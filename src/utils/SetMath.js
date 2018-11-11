import clone from "clone";

let timer_q = 1;

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

        const after = this.removeDuplicates(output);

        return after;
    }

    power(relation, pow) {
        let output = clone(relation);

        if (pow > 1000) {
            pow = 1000;
        }

        if (pow === 0) {
            return [];
        }

        if (pow < 0) {
            pow = Math.abs(pow);
            relation = this.flip(relation);
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
            case "Z":
                return [];
            case "I":
                return this.i();
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
        const after = rel1.filter(i => this.exists(rel2, i));
        console.log("after ->", after);
        return after;
    }

    or(rel1, rel2) {
        const temp = rel2.filter(i => !this.exists(rel1, i));
        return [...rel1, ...temp];
    }

    removeDuplicates(rel) {
        let temp = {};

        rel.forEach(pair => {
            const from = pair[0],
                to = pair[1];

            temp[from] = temp[from] || [];

            if (temp[from].indexOf(to) < 0) {
                temp[from].push(to);
            }
        });

        return Object.keys(temp).reduce((output, from) => {
            const arr = temp[from];

            arr.forEach(to => {
                output.push([parseInt(from, 10), to]);
            });

            return output;
        }, []);
    }

    operation(rel1, rel2, which) {
        let result;

        switch (which) {
            case "^":
                result = this.and(rel1, rel2);
                break;
            case "U":
                result = this.or(rel1, rel2);
                break;
            case "*":
                result = this.multi(rel1, rel2);
                break;
        }

        return this.removeDuplicates(result);
    }

    calculate(data, term) {
        let output = clone(data);
        let { relation } = output;

        console.time("calculation");

        term = term.replace(/ /g, "");

        let regex = new RegExp(/([ZRI]-?\d*)([\^\*U])?/gim);

        let matches, operation, result;

        let i = 0;

        while ((matches = regex.exec(term))) {
            i++;

            if (matches.length === 3) {
                console.time(`operation ${i}`);

                const vr = matches[1];

                const transient = this.calculateOne(vr, relation);
                result = result || transient;

                if (operation) {
                    console.log("result ->", result);
                    result = this.operation(result, transient, operation);
                    console.log("result ->", result);
                }

                operation = matches[2];

                console.timeEnd(`operation ${i}`);
            }
        }

        console.timeEnd("calculation");

        console.log("result ->", result);

        result = this.trim(result);
        output.relation = result;
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

        console.time("checkLayer");

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

        console.timeEnd("checkLayer");

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
        timer_q++;
        console.time(`checkQualities ${timer_q}`);

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

        console.timeEnd(`checkQualities ${timer_q}`);
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

        console.time("runFormula");

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

        console.timeEnd("runFormula");

        return data;
    }
}
