// Global scores
let userScore = 0;
let computerScore = 0;
let roundCounter = 0;

// Choices
const ROCK = "Rock";
const PAPER = "Paper";
const SCISSORS = "Scissors";
const CHOICES = [ROCK, PAPER, SCISSORS];

const BUTTON_BG_COLOR = document.querySelector("button").style.backgroundColor;
const BUTTON_ALT_BG_COLOR = "#ffffff";

// Get computer choice
function getComputerChoice() {
  const randomIndex = Math.floor(Math.random() * 3);
  return CHOICES[randomIndex];
}

// Get user choice
function getUserChoice() {
  let userInput;
  // WHILE user input is null, empty string, less than 4 or invalid
  // keep ask for his choice
  while (true) {
    userInput = prompt("Enter you choice [Rock | Paper | Scissors]: ");
    if (userInput !== null && userInput.length > 3) {
      userInput = userInput.toLocaleLowerCase();
      userInput = userInput.replace(/^./, (c) => c.toUpperCase());
      if (CHOICES.includes(userInput)) break;
    }
  }
  return userInput;
}

// Play a round
function playRound(computerChoice, userChoice) {
  if (computerChoice === userChoice) {
    return (
      "<strong>Tie!</strong> A pair of " +
      computerChoice +
      (computerChoice === SCISSORS ? "" : "s")
    );
  } else {
    if (
      (computerChoice === ROCK && userChoice === SCISSORS) ||
      (computerChoice === PAPER && userChoice === ROCK) ||
      (computerChoice === SCISSORS && userChoice === PAPER)
    ) {
      computerScore++;
      return (
        '<strong style="color: red;">You Lose! </strong>' +
        computerChoice +
        " beats " +
        userChoice
      );
    } else {
      userScore++;
      return (
        '<strong style="color: green;">You Win! </strong>' +
        userChoice +
        " beats " +
        computerChoice
      );
    }
  }
}

// Update scores
function updateScores() {
  document.querySelector("#user-score").textContent = userScore;
  document.querySelector("#computer-score").textContent = computerScore;
  document.querySelector("#round-counter").textContent = roundCounter;
}

// Show result message
function showResultMessage(messageContent) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("round-result-msg");
  messageElement.innerHTML = messageContent;
  document.body.insertBefore(
    messageElement,
    document.querySelector("#reset-container")
  );
  return messageElement;
}

// UI
const choicesDiv = document.querySelector("#choices");
choicesDiv.addEventListener("click", (event) => {
  if (!document.querySelector(".final-result-msg")) {
    showResultMessage(playRound(getComputerChoice(), event.target.value));
    // Update data
    roundCounter++;
    updateScores();
    if (roundCounter === 5) {
      let finalResultElement;
      if (userScore > computerScore) {
        finalResultElement = showResultMessage(
          '<strong style="color: green;">You Win!</strong>'
        );
      } else if (userScore < computerScore) {
        finalResultElement = showResultMessage(
          '<strong style="color: red;">You Lose!</strong>'
        );
      } else {
        finalResultElement = showResultMessage("<strong>Tie!</strong>");
      }
      // Add class to distinguish between the final message and the others
      finalResultElement.classList.add("final-result-msg");
    }
  }
});
document.body.addEventListener("click", (event) => {
  // Add click effect to all buttons
  if (event.target.tagName.toLocaleLowerCase() === "button") {
    const oldBackgroundColor = event.target.style.backgroundColor;
    event.target.style.backgroundColor = BUTTON_ALT_BG_COLOR;
    event.target.style.transform = "scale(98%)";
    setTimeout(() => {
      event.target.style.backgroundColor = BUTTON_BG_COLOR;
      event.target.style.transform = "scale(100%)";
    }, 200);
    // Reset
    if (event.target.id === "reset") {
      (userScore = 0), (computerScore = 0), (roundCounter = 0);
      updateScores();
      const roundResultMessages =
        document.querySelectorAll(".round-result-msg");
      roundResultMessages.forEach((msg) => msg.parentNode.removeChild(msg));
    }
  }
});
