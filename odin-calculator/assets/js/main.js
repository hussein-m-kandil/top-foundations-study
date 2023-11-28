const BLACK = "#000000";
const MID_TONE_GRAY = "#7F7F7F";
const LIGHT_GRAY = "#EFEFEF";
const WHITE = "#FFFFFF";

document.querySelectorAll("button").forEach((btn) => {
  addBtnInteractivityEffects(btn);
});

function addBtnInteractivityEffects(btn) {
  const currentBgColor = btn.style.backgroundColor;
  btn.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") {
      btn.style.backgroundColor = LIGHT_GRAY;
      if (event.bubbles) event.stopPropagation();
    }
  });
  btn.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    btn.style.backgroundColor = LIGHT_GRAY;
    btn.style.transform = "scale(90%)";
    if (event.bubbles) event.stopPropagation();
  });
  btn.addEventListener("pointerup", (event) => {
    event.preventDefault();
    btn.style.transform = "scale(100%)";
    if (event.bubbles) event.stopPropagation();
  });
  btn.addEventListener("pointerleave", (event) => {
    event.preventDefault();
    btn.style.backgroundColor = currentBgColor;
    btn.style.transform = "scale(100%)";
    if (event.bubbles) event.stopPropagation();
  });
}

function Calculator() {
  this["+"] = (x, y) => x + y;
  this["-"] = (x, y) => x - y;
  this["*"] = (x, y) => x * y;
  this["/"] = (x, y) => x / y;

  this.calculate = (opStr) => {
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
  };
}
/* // Test calculator
const testCalc = new Calculator();
console.log("-2 + 5 = ", testCalc.calculate("-2 + 5"));
console.log("5 - 7 = ", testCalc.calculate("5 - 7"));
console.log("5 * 7 = ", testCalc.calculate("5 * 7"));
console.log("-6 / 3 = ", testCalc.calculate("-6 / 3"));
console.log("3 / 5 = ", testCalc.calculate("3 / 5"));
console.log("3 / 7 = ", testCalc.calculate("3 / 7")); */
