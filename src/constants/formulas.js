const names = {
    1: "אחד",
    2: "שתיים",
    3: "שלוש",
    4: "ארבע",
    5: "חמש",
    6: "שש",
    7: "שבע",
    8: "שמונה",
    9: "תשע",
    10: "עשר",
}

const isPrime = (a) =>  [ ...Array(20).keys() ].filter(i => a % i === 0).length === 2;

export const formulas = [
    {
        id: 0.5,
        title: "ריקה",
        formula: () => false
    },
    {
        id: 1,
        title: "שווה לעצמו",
        formula: (a, b) => a === b
    },
    {
        id: 2,
        title: "גדול מ",
        formula: (a, b) => a > b
    },
    {
        id: 3,
        title: "גדול או שווה ל",
        formula: (a, b) => a >= b
    },
    {
        id: 4,
        title: "מחלק של",
        formula: (a, b) => a % b === 0
    },
    {
        id: 5,
        title: "מתחיל באותה אות",
        formula: (a, b) => names[a].substr(0, 1) === names[b].substr(0, 1)
    },
    {
        id: 6,
        title: "אותו מספר אותיות",
        formula: (a, b) => names[a].length === names[b].length
    },
    {
        id: 7,
        title:"הסכום הוא ראשוני",
        formula: (a, b) => isPrime(a + b)
    },
    {
        id: 8,
        title:"הפרש גדול מ-2",
        formula: (a, b) => Math.abs(a - b) > 2
    },
    {
        id: 9,
        title:"זה בחזקת זה גדול מ- 100",
        formula: (a, b) => Math.pow(a, b) > 100
    },
    {
        id: 10,
        title:"מכפלה גדולה מ- 10",
        formula: (a, b) => a * b > 10
    }

]

export default formulas;