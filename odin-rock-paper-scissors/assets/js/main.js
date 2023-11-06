// Global scores
let userScore = 0;
let computerScore = 0;

// Choices
const ROCK = "Rock";
const PAPER = "Paper";
const SCISSORS = "Scissors";
const CHOICES = [ROCK, PAPER, SCISSORS];

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
      "Tie! A pair of " +
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
      return "You Lose! " + computerChoice + " beats " + userChoice;
    } else {
      userScore++;
      return "You Win! " + userChoice + " beats " + computerChoice;
    }
  }
}

// Play the game
function game() {
  let computerChoice;
  let userChoice;
  let roundResult;
  // Play 5 rounds
  for (let i = 0; i < 5; i++) {
    computerChoice = getComputerChoice();
    userChoice = getUserChoice();
    roundResult = playRound(computerChoice, userChoice);
    console.log(roundResult);
  }
  // Log final result
  if (userScore === computerScore) {
    console.log("%cTie!", "color: gray");
  } else if (userScore > computerScore) {
    console.log("%cYou Win!", "color: green");
  } else {
    console.log("%cYou Lose!", "color: red");
  }
  // Reset the global scores
  userScore = 0;
  computerScore = 0;
}

game();
