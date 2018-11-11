export const calculate = (data, term) => {
    data.relation = [[1, 2]];

    return data;
};

export const whoWith = (data, boardSize, n) => {
    const { relation } = data;

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

export const addIfDoesNotExist = (arr, add) => {
    let temp = add.filter(i => arr.indexOf(i) === -1);
    return [...arr, ...temp];
};

export const fill = (arr, boardSize) => {
    let temp = [...arr];

    for (let i = 1; i <= boardSize; i++) {
        if (temp.indexOf(i) === -1) {
            temp.push(i);
        }
    }

    return temp;
};

export const sort = (data, boardSize) => {
    let group = [];

    for (let i = 1; i <= boardSize; i++) {
        const _whoWith = whoWith(data, boardSize, i);
        group = addIfDoesNotExist(group, [i, ..._whoWith]);
    }

    group = fill(group);

    data.group = group;

    return data;
};

export const checkLayer = (data, boardSize) => {
    let { relation } = data;

    let temp = [...relation];
    let layer = [];

    let qualities = checkQualities(temp);

    if (!qualities.transitive) {
        data.layer = [];
        return data;
    }

    for (let row = 1; row <= boardSize; row++) {
        for (let col = 1; col <= boardSize; col++) {
            const exists = relation.filter(r => r[0] === row && r[1] === col)
                .length;
            if (!exists) {
                const temp2 = [...temp, [row, col]];
                qualities = checkQualities(temp2);
                if (qualities.transitive) {
                    layer.push([row, col]);
                }
            }
        }
    }

    data.layer = layer;

    return data;
};

export const addBlock = (data, row, col) => {
    const { relation } = data;

    let output = [...relation];

    const exists = relation.filter(r => r[0] === row && r[1] === col).length;
    if (exists) {
        output = relation.filter(r => !(r[0] === row && r[1] === col));
    } else {
        output.push([row, col]);
    }

    data.relation = output;
    data.qualities = checkQualities(output);

    return data;
};

export const checkQualities = (relation, boardSize) => {
    let reflexive = true,
        symmetric = true,
        transitive = true;

    // reflexive
    for (let i = 1; i <= boardSize; i++) {
        const exists = relation.filter(r => r[0] === i && r[1] === i).length;
        reflexive = reflexive && exists;
    }

    // symmetric
    relation.forEach(rel => {
        const exists = relation.filter(r => r[0] === rel[1] && r[1] === rel[0])
            .length;
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

export const reset = (data, boardSize) => {
    data.group = [...Array(boardSize + 1).keys()].filter(i => i !== 0);

    return data;
};

export const complete = (data, boardSize) => {
    const { relation } = data;

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
    data.qualities = checkQualities(output);

    return data;
};

export const runFormula = (selectedFormula, data, boardSize) => {
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
    data.qualities = checkQualities(relation);

    return data;
};
