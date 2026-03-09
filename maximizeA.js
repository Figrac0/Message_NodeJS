function maximizeA(A, B) {
    const aArr = A.split("");
    const bArr = B.split("")
        .map(Number)
        .sort((x, y) => y - x);
    let j = 0;

    for (let i = 0; i < aArr.length && j < bArr.length; i++) {
        if (+aArr[i] < bArr[j]) {
            aArr[i] = String(bArr[j]);
            j++;
        }
    }

    return aArr.join("");
}

// Тесты
const tests2 = [
    { input: ["123", "456"], expected: "654" },
    { input: ["987", "12"], expected: "987" },
    { input: ["908", "321"], expected: "938" },
    { input: ["555", "999"], expected: "999" },
    { input: ["10203", "345"], expected: "54303" },
];

tests2.forEach(({ input, expected }, index) => {
    const [A, B] = input;
    const result = maximizeA(A, B);
    console.log(
        `Test ${index + 1}:`,
        result === expected
            ? "Passed"
            : `Failed (got ${result}, expected ${expected})`,
    );
});
