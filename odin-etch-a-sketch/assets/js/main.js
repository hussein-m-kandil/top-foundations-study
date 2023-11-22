const DEFAULT_GRID_CELLS_NUM = 16;
const MIN_GRID_CELLS_NUM = 4;
const MAX_GRID_CELLS_NUM = 128;
const SKETCH_PAD_WIDTH_NUM = 512;
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

document.addEventListener("DOMContentLoaded", () => {
  drawGrid();
  document.querySelector("#grid-cells-num-btn>span").textContent =
    DEFAULT_GRID_CELLS_NUM;
});

document
  .querySelector("#grid-cells-num-btn")
  .addEventListener("click", (event) => {
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
    event.target.querySelector("span").textContent = userGridCellsNum;
  });

const sketchPadContainer = document.querySelector("#sketch-pad-container");
EVENT_TYPES.forEach((eventType) =>
  sketchPadContainer.addEventListener(eventType, painter)
);

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
      event.target.style.backgroundColor = "black";
      break;
    case "mouseover":
    case "pointerover":
    case "touchmove":
      if (penPressed) {
        if (event.type === "touchmove") {
          event.preventDefault();
        } else {
          event.target.style.backgroundColor = "black";
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
  const sketchPadId = "sketch-pad";
  let sketchPad = document.querySelector("#" + sketchPadId);
  if (sketchPad) {
    sketchPadContainer.removeChild(sketchPad);
  }
  sketchPad = document.createElement("div");
  sketchPad.setAttribute("id", sketchPadId);
  sketchPad.style.width = SKETCH_PAD_WIDTH_NUM + "px";
  const gridCellSideLength = SKETCH_PAD_WIDTH_NUM / numOfSquares;
  for (let i = 0; i < numOfSquares * numOfSquares; i++) {
    const gridCell = document.createElement("div");
    gridCell.classList.add("grid-cell");
    gridCell.style.width = gridCellSideLength + "px";
    gridCell.style.height = gridCellSideLength + "px";
    gridCell.style.background = "white";
    sketchPad.appendChild(gridCell);
  }
  sketchPadContainer.appendChild(sketchPad);
}
