const DEFAULT_SQUARE_NUM = 16;
const MIN_SQUARE_NUM = 4;
const MAX_SQUARE_NUM = 96;
const SKETCH_PAD_WIDTH = 512;

document.addEventListener("DOMContentLoaded", () => drawGrid());

const gridCellsNumBtn = document.querySelector("#grid-cells-num-btn");
gridCellsNumBtn.addEventListener("click", (event) => {
  let userGridCellsNum;
  do {
    userGridCellsNum = window.prompt(
      "Enter a hole number to be used as the number of squares per side (" +
        MIN_SQUARE_NUM +
        "-" +
        MAX_SQUARE_NUM +
        ")? "
    );
    if (userGridCellsNum === null || userGridCellsNum === "") {
      return;
    }
    userGridCellsNum = Number(userGridCellsNum);
  } while (
    Number.isNaN(userGridCellsNum) ||
    !Number.isInteger(userGridCellsNum) ||
    userGridCellsNum < MIN_SQUARE_NUM ||
    userGridCellsNum > MAX_SQUARE_NUM
  );
  drawGrid(userGridCellsNum);
});

function drawGrid(numOfSquares = DEFAULT_SQUARE_NUM) {
  const sketchPadContainer = document.querySelector("#sketch-pad-container");
  const sketchPadId = "sketch-pad";
  let sketchPad = document.querySelector("#" + sketchPadId);
  if (sketchPad) {
    sketchPadContainer.removeChild(sketchPad);
  }
  sketchPad = document.createElement("div");
  sketchPad.setAttribute("id", sketchPadId);
  sketchPad.style.width = SKETCH_PAD_WIDTH;
  const gridCellSideLength = SKETCH_PAD_WIDTH / numOfSquares;
  for (let i = 0; i < numOfSquares * numOfSquares; i++) {
    const gridCell = document.createElement("div");
    gridCell.classList.add("grid-cell");
    gridCell.style.width = gridCellSideLength + "px";
    gridCell.style.height = gridCellSideLength + "px";
    sketchPad.appendChild(gridCell);
  }
  sketchPadContainer.appendChild(sketchPad);
}
