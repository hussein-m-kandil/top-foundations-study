const calculator = {
  "+": (x, y) => x + y,
  "-": (x, y) => x - y,
  "*": (x, y) => x * y,
  "/": (x, y) => x / y,
  calculate(opStr) {
    const opArr = opStr.split(" ");
    const x = +opArr[0];
    const operator = opArr[1];
    const y = +opArr[2];
    if (!this[operator] || isNaN(x) || isNaN(y)) {
      return NaN;
    } else {
      const result = this[operator](x, y);
      if (result.toString().includes(".")) {
        return result.toFixed(7).toString().replace(/0+$/, "");
      }
      return result;
    }
  },
};
// Test calculator
/* console.log("-2 + 5 = ", calculator.calculate("-2 + 5"));
console.log("5 - 7 = ", calculator.calculate("5 - 7"));
console.log("5 * 7 = ", calculator.calculate("5 * 7"));
console.log("-6 / 3 = ", calculator.calculate("-6 / 3"));
console.log("3 / 5 = ", calculator.calculate("3 / 5"));
console.log("3 / 7 = ", calculator.calculate("3 / 7")); */
