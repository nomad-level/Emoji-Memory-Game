// ========================
// Global Variables
// ========================
let firstCard = null;       // first card flipped
let secondCard = null;      // second card flipped
let lockBoard = false;      // prevents clicking too fast
let moves = 0;              // counts how many turns taken
let timer = null;           // stores the timer interval
let seconds = 0;            // how long player has played

// ========================
// Utility Functions
// ========================

// Shuffle an array randomly (used for shuffling emojis)
function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

// Reset stats before a new game
function resetStats() {
  moves = 0;
  seconds = 0;
  document.getElementById("moves").textContent = "Moves: 0";
  document.getElementById("timer").textContent = "Time: 0 sec";
  if (timer) clearInterval(timer); // stop any old timer
}

// Start the game timer (counts seconds)
function startTimer() {
  timer = setInterval(() => {
    seconds++;
    document.getElementById("timer").textContent = `Time: ${seconds} sec`;
  }, 1000);
}

// ========================
// Board Setup
// ========================

// Create the game board (cards)
function createBoard(theme, difficulty) {
  const board = document.getElementById("game-board");
  board.innerHTML = ""; // clear previous game

  resetStats(); // reset stats when board is created

  // Pick emojis from chosen theme
  let chosenEmojis = [...emojiThemes[theme]];

  // Set number of pairs based on difficulty
  let numPairs = difficulty === "easy" ? 6 : difficulty === "normal" ? 12 : 18;

  // Slice the emojis to the correct difficulty size
  let selected = chosenEmojis.slice(0, numPairs);

  // Duplicate + Shuffle
  let gameEmojis = shuffle([...selected, ...selected]);

  // Start timer
  startTimer();

  // Create each card element
  gameEmojis.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.textContent = "❓"; // hidden side of card
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });
}

// ========================
// Card Flip + Match Logic
// ========================

// Function to handle flipping a card
function flipCard() {
  if (lockBoard) return; // prevents clicking while checking match
  if (this === firstCard) return; // prevents double click

  this.textContent = this.dataset.emoji; // reveal emoji

  if (!firstCard) {
    // if no card selected, this becomes first card
    firstCard = this;
    return;
  }

  // otherwise, this is second card
  secondCard = this;
  moves++;
  document.getElementById("moves").textContent = `Moves: ${moves}`;

  checkMatch();
}

// Check if two flipped cards match
function checkMatch() {
  const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

  if (isMatch) {
    disableCards(); // leave them revealed
  } else {
    unflipCards();  // flip them back over
  }
}

// Disable matched cards (remove click event)
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetTurn();
}

// Flip cards back after short delay if not match
function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.textContent = "❓";
    secondCard.textContent = "❓";
    resetTurn();
  }, 1000);
}

// Reset for next turn
function resetTurn() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// ========================
// Event Listeners
// ========================

// When "Start / Restart" is clicked
document.getElementById("startBtn").addEventListener("click", () => {
  const theme = document.getElementById("theme").value;
  const difficulty = document.getElementById("difficulty").value;
  createBoard(theme, difficulty);
});
