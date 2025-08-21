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
  document.getElementById("moves").textContent = "0";
  document.getElementById("time").textContent = "0";
  if (timer) clearInterval(timer); // stop any old timer
}

// Start the game timer (counts seconds)
function startTimer() {
  timer = setInterval(() => {
    seconds++;
    document.getElementById("time").textContent = `${seconds}`;
  }, 1000);
}

// ========================
// Board Setup
// ========================

// Create the game board (cards)
function createBoard(theme, difficulty) {
  const board = document.getElementById("game-board");
  board.innerHTML = ""; // clear previous game

  // Set grid class for difficulty
  board.className = "game-board " + difficulty;

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

  // Create each card element (as button with inner divs for flip effect)
  gameEmojis.forEach((emoji) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.setAttribute("aria-label", "Hidden card");
    card.setAttribute("role", "gridcell");

    const inner = document.createElement("div");
    inner.className = "card-inner";

    const front = document.createElement("div");
    front.className = "card-face card-front";
    front.textContent = emoji;

    const back = document.createElement("div");
    back.className = "card-face card-back";
    back.textContent = "❓";

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

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
  if (this.classList.contains("flipped") || this.classList.contains("matched")) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;
  moves++;
  document.getElementById("moves").textContent = `${moves}`;

  checkMatch();
}

// Check if two flipped cards match
function checkMatch() {
  const a = firstCard.querySelector(".card-front").textContent;
  const b = secondCard.querySelector(".card-front").textContent;
  const isMatch = a === b;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard.setAttribute("aria-label", "Matched card");
    secondCard.setAttribute("aria-label", "Matched card");
    resetTurn();

    // Check if all pairs are matched
    const matchedCards = document.querySelectorAll('.card.matched').length;
    const totalPairs = document.querySelectorAll('.card').length / 2;
    if (matchedCards === totalPairs * 2) {
      if (timer) clearInterval(timer);
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 900);
  }
}

// Reset for next turn
function resetTurn() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// ========================
// Event Listeners
// ========================

// When "Start / Restart" is clicked
document.getElementById("start-btn").addEventListener("click", () => {
  const theme = document.getElementById("theme").value;
  const difficulty = document.getElementById("difficulty").value;
  createBoard(theme, difficulty);
});
