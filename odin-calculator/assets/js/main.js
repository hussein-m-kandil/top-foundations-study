const BLACK = "#000000";
const MID_TONE_GRAY = "#7F7F7F";
const LIGHT_GRAY = "#EFEFEF";
const WHITE = "#FFFFFF";

let firstOperand = "",
  secondOperand = "",
  operator = "";
operatorEntered = false;
const calculator = new Calculator();

// Get calculator's display
const calcDisplay = document.querySelector("#calc-display");

// Get calculator's buttons
document.querySelectorAll("button").forEach((btn) => {
  btn.value = btn.textContent; // Add value to each button
  addBtnInteractivityEffects(btn);
  btn.addEventListener("click", (event) => {
    switch (event.target.value) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "0":
      case ".":
        if (calcDisplay.textContent.length === 0 || operatorEntered) {
          calcDisplay.textContent = event.target.value;
          operatorEntered = false;
        } else {
          calcDisplay.textContent += event.target.value;
        }
        if (operator) {
          secondOperand += event.target.value;
        } else {
          firstOperand += event.target.value;
        }
        break;
      case "+":
      case "-":
      case "*":
      case "/":
        if (!operator) {
          operator = event.target.value;
        } else {
          firstOperand = calculator.calculate(
            `${firstOperand} ${operator} ${secondOperand}`
          );
          calcDisplay.textContent = firstOperand;
          operator = event.target.value;
          secondOperand = "";
        }
        operatorEntered = true;
        break;
      case "CE":
        if (operatorEntered) {
          operatorEntered = false;
          operator = "";
        } else if (calcDisplay.textContent.length > 0) {
          calcDisplay.textContent = calcDisplay.textContent.trimEnd();
          calcDisplay.textContent = calcDisplay.textContent.slice(
            0,
            calcDisplay.textContent.length - 1
          );
          if (secondOperand) {
            secondOperand = calcDisplay.textContent;
          } else {
            firstOperand = calcDisplay.textContent;
          }
        }
        break;
      case "AC":
        calcDisplay.textContent = "";
        firstOperand = "";
        secondOperand = "";
        operator = "";
        operatorEntered = false;
        break;
      case "=":
        if (!secondOperand) {
          operator = "";
          calcDisplay.textContent = firstOperand ? firstOperand : "";
        } else {
          firstOperand = calculator.calculate(
            `${firstOperand} ${operator} ${secondOperand}`
          );
          calcDisplay.textContent = firstOperand;
          operator = "";
          secondOperand = "";
        }
        operatorEntered = false;
        break;
    }
    if (event.bubbles) event.stopPropagation();
  });
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
