const DEFAULT_GRID_CELLS_NUM = 16;
const MIN_GRID_CELLS_NUM = 4;
const MAX_GRID_CELLS_NUM = 128;
const SKETCH_PAD_WIDTH_NUM = 512;
let userGridCellsNum;

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

let mouseDown = false;
const sketchPadContainer = document.querySelector("#sketch-pad-container");
sketchPadContainer.onmousedown = () => (mouseDown = true);
sketchPadContainer.onmouseup = () => (mouseDown = false);
sketchPadContainer.addEventListener("mouseover", (event) => {
  if (mouseDown && event.target.classList.contains("grid-cell")) {
    event.target.style.backgroundColor = "black";
  }
  event.stopPropagation();
});

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
