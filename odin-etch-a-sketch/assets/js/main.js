const DEFAULT_GRID_CELLS_NUM = 16;
const MIN_GRID_CELLS_NUM = 4;
const MAX_GRID_CELLS_NUM = 128;
const PURE_WHITE = "#ffffff";
const MID_TONE_GRAY = "#7f7f7f";
const DARK_GRAY = "#484848";
const PURE_BLACK = "#000000";
const SELECTED_SWATCH_BORDER = "2px dashed blue";
const EVENT_TYPES = [
  "click",
  "mouseover",
  "pointerover",
  "touchmove",
  "mousedown",
  "mouseup",
  "pointerdown",
  "pointerup",
  "dragstart",
];
let userGridCellsNum;
let penPressed = false;
let eraseMode = false;
const eraseModeBtn = document.querySelector("#pen-eraser-btn");
let dynamicMode = false;
const dynamicModeBtn = document.querySelector("#dynamic-btn");
let chosenColorSwatch = null;

window.addEventListener("load", () => {
  drawGrid();

  addColorSwatches();

  animateAllButtonsOnClick();

  window.addEventListener("resize", () => drawGrid(userGridCellsNum));

  document.querySelector("#grid-cells-num-btn>span").textContent =
    DEFAULT_GRID_CELLS_NUM;

  dynamicModeBtn.style.color = MID_TONE_GRAY;

  document.querySelector("#clear-btn").addEventListener("click", (event) => {
    const CONFIRM_MSG = "Yes";
    const clearConfirmed = window.prompt(
      "Do you want to clear the sketch?",
      CONFIRM_MSG
    );
    if (clearConfirmed && clearConfirmed === CONFIRM_MSG) {
      drawGrid(userGridCellsNum);
    }
    if (event.bubbles) event.stopPropagation();
  });

  const gridCellsNumBtn = document.querySelector("#grid-cells-num-btn");
  gridCellsNumBtn.addEventListener("click", (event) => {
    do {
      userGridCellsNum = window.prompt(
        "Enter a hole number to be used as the number of squares per side (" +
          MIN_GRID_CELLS_NUM +
          "-" +
          MAX_GRID_CELLS_NUM +
          ")? "
      );
      if (userGridCellsNum === null || userGridCellsNum === "") {
        return;
      }
      userGridCellsNum = Number(userGridCellsNum);
    } while (
      Number.isNaN(userGridCellsNum) ||
      !Number.isInteger(userGridCellsNum) ||
      userGridCellsNum < MIN_GRID_CELLS_NUM ||
      userGridCellsNum > MAX_GRID_CELLS_NUM
    );
    drawGrid(userGridCellsNum);
    gridCellsNumBtn.querySelector("span").textContent = userGridCellsNum;
  });

  eraseModeBtn.addEventListener("click", (event) => {
    if (eraseMode) {
      event.target.textContent = "Eraser";
      eraseMode = false;
    } else {
      event.target.textContent = "Pen";
      eraseMode = true;
    }
    if (event.bubbles) event.stopPropagation();
  });

  dynamicModeBtn.addEventListener("click", (event) => {
    if (dynamicMode) {
      event.target.style.color = MID_TONE_GRAY;
      dynamicMode = false;
    } else {
      event.target.style.color = PURE_WHITE;
      dynamicMode = true;
    }
    if (event.bubbles) {
      event.stopPropagation();
    }
  });

  const sketchPadContainer = document.querySelector("#sketch-pad-container");
  EVENT_TYPES.forEach((eventType) =>
    sketchPadContainer.addEventListener(eventType, painter)
  );
});

function animateAllButtonsOnClick() {
  const allButtons = document.querySelectorAll("button");
  if (allButtons && allButtons.length > 0) {
    [...allButtons].forEach((btn) => {
      // Animation effect
      btn.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        btn.style.transform = "scale(0.95)";
        if (event.bubbles) event.stopPropagation();
      });
      btn.addEventListener("pointerup", (event) => {
        event.preventDefault();
        btn.style.transform = "scale(1)";
        if (event.bubbles) event.stopPropagation();
      });
      btn.addEventListener("pointerout", (event) => {
        event.preventDefault();
        btn.style.transform = "scale(1)";
        if (event.bubbles) event.stopPropagation();
      });
      // Hover over effect
      btn.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "mouse") {
          btn.style.backgroundColor = DARK_GRAY;
        }
      });
      btn.addEventListener("pointerout", (event) => {
        if (event.pointerType === "mouse") {
          btn.style.backgroundColor = PURE_BLACK;
        }
      });
    });
  }
}

function addOrSubtractTenPercentMax(rgbColor, subtract = false) {
  rgbColor = Number(rgbColor);
  if (
    Number.isNaN(rgbColor) ||
    rgbColor > 255 ||
    (rgbColor >= 230 && subtract) ||
    (rgbColor <= 25 && !subtract)
  ) {
    return subtract ? 255 : 0;
  }
  return Math.floor(subtract ? rgbColor + 255 * 0.1 : rgbColor - 255 * 0.1);
}

function addOrSubtractTenPercentBlack(strRGBColor, subtract = false) {
  return strRGBColor.replace(/\d{1,3}/g, (match) =>
    addOrSubtractTenPercentMax(match, subtract)
  );
}

function addColorSwatches() {
  const colorSwatches = document.querySelector("#color-swatches");
  let firstSwatch = null;
  let currentRGBColor = "rgb(0,0,0)";
  for (let i = 0; i < 10; i++) {
    currentRGBColor = addOrSubtractTenPercentBlack(currentRGBColor, true);
    const colorSwatch = document.createElement("div");
    colorSwatch.setAttribute("id", "color-" + (i + 1).toString());
    colorSwatch.style.backgroundColor = currentRGBColor;
    colorSwatch.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") {
        colorSwatch.style.boxShadow = "0px 0px 5px 1px white";
      }
    });
    colorSwatch.addEventListener("pointerout", (event) => {
      if (event.pointerType === "mouse") {
        colorSwatch.style.boxShadow = "none";
      }
    });
    colorSwatches.appendChild(colorSwatch);
    if (i === 0) firstSwatch = colorSwatch;
  }
  chosenColorSwatch = firstSwatch;
  chosenColorSwatch.style.border = SELECTED_SWATCH_BORDER;
  colorSwatches.addEventListener("click", (event) => {
    if (event.target !== colorSwatches) {
      chosenColorSwatch.style.border = "none";
      chosenColorSwatch = event.target;
      chosenColorSwatch.style.border = SELECTED_SWATCH_BORDER;
    }
    if (event.bubbles) event.stopPropagation();
  });
}

function paintOnGridCell(cell) {
  // Make sure that you are interacting with a valid grid cell
  if (cell.classList.contains("grid-cell")) {
    if (eraseMode) {
      cell.style.backgroundColor = dynamicMode
        ? addOrSubtractTenPercentBlack(cell.style.backgroundColor, true)
        : (cell.style.backgroundColor = PURE_WHITE);
    } else {
      cell.style.backgroundColor = dynamicMode
        ? addOrSubtractTenPercentBlack(cell.style.backgroundColor)
        : (cell.style.backgroundColor =
            chosenColorSwatch.style.backgroundColor);
    }
  }
}

function painter(event) {
  switch (event.type) {
    // Is pen pressed?
    case "mousedown":
      (event) => (penPressed = event.button === 0 ? true : penPressed);
      break;
    case "mouseup":
      (event) => (penPressed = event.button === 0 ? false : penPressed);
      break;
    case "pointerdown":
      if (
        (event.pointerType === "mouse" && event.button === 0) ||
        event.pointerType !== "mouse"
      ) {
        penPressed = true;
        // https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent#sect2
        // https://w3c.github.io/pointerevents/#dfn-implicit-pointer-capture
        // https://w3c.github.io/pointerevents/#dom-element-haspointercapture
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/releasePointerCapture
        if (event.target.hasPointerCapture(event.pointerId)) {
          event.target.releasePointerCapture(event.pointerId);
        }
      }
      break;
    case "pointerup":
      if (
        (event.pointerType === "mouse" && event.button === 0) ||
        event.pointerType !== "mouse"
      ) {
        penPressed = false;
      }
      break;
    // Painting events
    case "click":
      paintOnGridCell(event.target);
      break;
    case "mouseover":
    case "pointerover":
    case "touchmove":
      if (penPressed) {
        if (event.type === "touchmove") {
          event.preventDefault();
        } else {
          paintOnGridCell(event.target);
        }
      }
      break;
    // Prevent drags
    case "dragstart":
      event.preventDefault();
      break;
  }
}

function drawGrid(numOfSquares = DEFAULT_GRID_CELLS_NUM) {
  const sketchPadContainer = document.querySelector("#sketch-pad-container");
  const sketchPadWidthNum = sketchPadContainer.clientWidth;
  const sketchPadId = "sketch-pad";
  let sketchPad = document.querySelector("#" + sketchPadId);
  if (sketchPad) {
    sketchPadContainer.removeChild(sketchPad);
  }
  sketchPad = document.createElement("div");
  sketchPad.setAttribute("id", sketchPadId);
  sketchPad.style.width = sketchPadWidthNum + "px";
  const gridCellSideLength = sketchPadWidthNum / numOfSquares;
  for (let i = 0; i < numOfSquares * numOfSquares; i++) {
    const gridCell = document.createElement("div");
    gridCell.classList.add("grid-cell");
    gridCell.style.width = gridCellSideLength + "px";
    gridCell.style.height = gridCellSideLength + "px";
    gridCell.style.background = PURE_WHITE;
    sketchPad.appendChild(gridCell);
  }
  sketchPadContainer.appendChild(sketchPad);
  // Revert back from eraser mode to pen mode
  if (eraseMode) {
    eraseModeBtn.click();
  }
}
