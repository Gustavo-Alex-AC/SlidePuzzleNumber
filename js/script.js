const puzzleContainer = document.querySelector("#puzzle-container");
const btnBaralhar = document.querySelector("#btn-baralhar");
let puzzle = [];
let size = 3;
let isCompleted = false;

function init() {
  generatePuzzle();
  randomizePuzzle();
  renderPuzzle();
  handleInput();
}

init();

btnBaralhar.addEventListener("click", () => {
  location.reload();
});

function getRow(pos) {
  return Math.ceil(pos / size);
}
function getCol(pos) {
  const col = pos % size;
  if (col === 0) {
    return size;
  }
  return col;
}

function generatePuzzle() {
  for (let i = 1; i <= size * size; i++) {
    puzzle.push({
      value: i,
      position: i,
      x: (getCol(i) - 1) * 100,
      y: (getRow(i) - 1) * 100,
      disabled: false,
    });
  }
  console.log(puzzle);
}

function renderPuzzle() {
  puzzleContainer.innerHTML = "";
  for (let puzzleItem of puzzle) {
    if (puzzleItem.disabled === true) continue;
    puzzleContainer.innerHTML += `
            <div class="puzzle-Item ${
              isCompleted ? "game-over" : ""
            }" style="left: ${puzzleItem.x}px; top: ${puzzleItem.y}px">
                ${puzzleItem.value}
            </div>
        `;
  }
}

function randomizePuzzle() {
  const randomValues = getRandomValues();
  let i = 0;

  for (let puzzleItem of puzzle) {
    puzzleItem.value = randomValues.at(i);
    i++;
  }

  const hiddenPuzzle = puzzle.find((item) => item.value === size * size);
  hiddenPuzzle.disabled = true;
}

function getRandomValues() {
  const values = [];
  for (let i = 1; i <= size * size; i++) {
    values.push(i);
  }

  const randomValues = values.sort(() => Math.random() - 0.5);
  return randomValues;
}

function handleInput() {
  document.addEventListener("keydown", handleKeyDown);
}

function handleKeyDown(e) {
  console.log(e.key);
  switch (e.key) {
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    case "ArrowUp":
      moveUp();
      break;
    case "ArrowDown":
      moveDown();
      break;

    default:
      break;
  }
  isCompleted = endOfGame();
  renderPuzzle();
  endOfGame();
}

function moveLeft() {
  const emptyPuzzle = getEmptyPuzzle();
  const rightPuzzle = getRightPuzzle();
  if (rightPuzzle) swapPuzzle(emptyPuzzle, rightPuzzle, true);

  console.log(emptyPuzzle, rightPuzzle);
}

function moveRight() {
  const emptyPuzzle = getEmptyPuzzle();
  const leftPuzzle = getLeftPuzzle();
  if (leftPuzzle) swapPuzzle(emptyPuzzle, leftPuzzle, true);
}
function moveUp() {
  const emptyPuzzle = getEmptyPuzzle();
  const belowPuzzle = getBelowPuzzle();
  if (belowPuzzle) swapPuzzle(emptyPuzzle, belowPuzzle);
}
function moveDown() {
  const emptyPuzzle = getEmptyPuzzle();
  const abovePuzzle = getAbovePuzzle();
  if (abovePuzzle) swapPuzzle(emptyPuzzle, abovePuzzle);
}

function swapPuzzle(firstPuzzle, secondPuzzle, isX = false) {
  // swap position
  let temp = firstPuzzle.position;
  firstPuzzle.position = secondPuzzle.position;
  secondPuzzle.position = temp;

  //x position swapping
  if (isX) {
    temp = firstPuzzle.x;
    firstPuzzle.x = secondPuzzle.x;
    secondPuzzle.x = temp;
  } else {
    // y swapping
    temp = firstPuzzle.y;
    firstPuzzle.y = secondPuzzle.y;
    secondPuzzle.y = temp;
  }
}

function getLeftPuzzle() {
  // Encontrar o puzzle a esquerda do puzzle vazio
  const emptyPuzzle = getEmptyPuzzle();
  const isleftEdgeCol = getCol(emptyPuzzle.position) === 1;
  if (isleftEdgeCol) return null;
  const puzzle = getItemByPosition(emptyPuzzle.position - 1);
  return puzzle;
}

function getRightPuzzle() {
  // Encontrar o puzzle a direita do puzzle vazio
  const emptyPuzzle = getEmptyPuzzle();
  const isrightEdgeCol = getCol(emptyPuzzle.position) === size;
  if (isrightEdgeCol) {
    return null;
  }
  const puzzle = getItemByPosition(emptyPuzzle.position + 1);
  return puzzle;
}

function getAbovePuzzle() {
  // Encontrar o puzzle acima do puzzle vazio
  const emptyPuzzle = getEmptyPuzzle();
  const isAboveEdgeRow = getRow(emptyPuzzle.positio) + 1;
  if (isAboveEdgeRow) return null;
  const puzzle = getItemByPosition(emptyPuzzle.position - size);
  return puzzle;
}

function getBelowPuzzle() {
  // Encontrar o puzzle abaixo do puzzle vazio
  const emptyPuzzle = getEmptyPuzzle();
  const isBelowEdgeRow = getRow(emptyPuzzle.position) === size;
  if (isBelowEdgeRow) return null;
  const puzzle = getItemByPosition(emptyPuzzle.position + size);
  return puzzle;
}

function getEmptyPuzzle() {
  return puzzle.find((item) => item.disabled);
}

function getItemByPosition(pos) {
  return puzzle.find((item) => item.position === pos);
}

function endOfGame() {
  for (let i = 0; i < puzzle.length; i++) {
    if (puzzle[i].position !== i + 1) {
      return false; // If any piece is not in its correct position, the game is not completed
    }
  }

  alert("Parabéns! Você conseguiu montar o quebra-cabeça!!!");
  return true;
}
