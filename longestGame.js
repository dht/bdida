const fs = require("fs");

const boardSize = 15;
/*
1 1
2 4         4            1
3 7         9            
4 12        16      
5 17        25
6 24         36
7 31         
8 40
9 49
10 60
11 71
12 84
13 97
14 112
15 127
*/

const checkTransitive = (relation) => {
    let transitive = true;

    // transitive
    relation.forEach(rel1 => {
      relation.forEach(rel2 => {
        if (rel1[1] === rel2[0]) {
          const exists = relation.filter(r => r[0] === rel1[0] && r[1] === rel2[1]).length;
          transitive = transitive && exists;
        }
      });
    });

    return transitive;
  }


  const checkOptions = (relation) => {
    let transitive;

    let temp = [...relation];
    let options = [];

    for (let row = 1; row <= boardSize; row++) {
      for (let col = 1; col <= boardSize; col++) {
          const exists = relation.filter(r => r[0] === row && r[1] === col).length;
          if (!exists) {
            const temp2 = [...temp, [row, col]];
            transitive  = checkTransitive(temp2);
            if (transitive) {
                options.push([row, col]);
            }
          }
      }
    }

    return options;
  }

const randomMove = (arr) => {
    const index = Math.floor(arr.length * Math.random());
    return arr[index];
}
 
const play = (board, level) => {
    const options = checkOptions(board);
    
    if (options.length > 0) {
        const move = randomMove(options);
        return play([...board, move], level + 1);
    } else {
        return board;
    }
}

console.log("start");

let max = 0, countMax = 0, min = 100, countMin = 0;

while (1==1) {
    const result = play([], 1);

    if (result.length >= max) {
        countMax++;
        // console.log('max, count ->', max, countMax);
    }

    if (result.length > max) {
        countMax = 0;
        max = Math.max(result.length, max);
        // console.log(max);
        fs.writeFileSync("./max.txt", JSON.stringify({length: result.length, moves:result}, null, 4));
    }

    if (result.length <= min) {
        countMin++;
        console.log('min, count ->', min, countMin);
    }

    if (result.length < min) {
        countMin = 0;
        min = Math.min(result.length, min);
        console.log("min -> ", min);
        fs.writeFileSync("./min.txt", JSON.stringify({length: result.length, moves:result}, null, 4));
    }
}

