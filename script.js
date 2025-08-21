// ========= DOM Elements =========
const gameBoard = document.getElementById("game-board");
const themeSelect = document.getElementById("theme");
const difficultySelect = document.getElementById("difficulty");
const startBtn = document.getElementById("start-btn");
const message = document.getElementById("message");
const movesEl = document.getElementById("moves");
const timeEl = document.getElementById("time");


// ========= Game State =========
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let totalPairs = 0;


let moves = 0;
let time = 0;
let timerId = null;


// ========= Events =========
startBtn.addEventListener("click", startGame);


// ========= Start / Restart =========
function startGame() {
  // Reset UI state
  gameBoard.innerHTML = "";
  message.textContent = "";
  moves = 0;
  time = 0;
  updateMoves(0);
  updateTime(0);
  stopTimer();
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matches = 0;


  // Difficulty -> pairs & board class
  const difficulty = difficultySelect.value; // "easy" | "normal" | "hard"
  const pairsByDifficulty = {
    easy: 6,
    normal: 12,
    hard: 18
  };
  totalPairs = pairsByDifficulty[difficulty] || 12;


  // Apply difficulty class to board
  gameBoard.className = "game-board " + difficulty;


  // Prepare deck from chosen theme
  const theme = themeSelect.value; // "faces" | "animals" | "food"
  let symbols = getSymbols(theme);


  // Safety: ensure we have enough uniques
  if (symbols.length < totalPairs) {
    // If not enough, just reuse from start (rare with our lists)
    while (symbols.length < totalPairs) {
      symbols = symbols.concat(getSymbols(theme));
      symbols = [...new Set(symbols)]; // keep uniques
    }
  }


  const chosen = symbols.slice(0, totalPairs);
  const deck = shuffle([...chosen, ...chosen]); // duplicate + shuffle


  // Render cards
  deck.forEach(sym => gameBoard.appendChild(createCard(sym)));
}


// ========= Card Factory =========
function createCard(symbol) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";
  card.setAttribute("aria-label", "Hidden card");
  card.setAttribute("role", "gridcell");


  const inner = document.createElement("div");
  inner.className = "card-inner";


  const front = document.createElement("div");
  front.className = "card-face card-front";
  front.textContent = symbol;


  const back = document.createElement("div");
  back.className = "card-face card-back";
  back.textContent = "❓";


  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);


  card.addEventListener("click", () => onCardClick(card));
  return card;
}


// ========= Interaction =========
function onCardClick(card) {
  if (lockBoard) return;
  if (card.classList.contains("flipped") || card.classList.contains("matched")) return;


  // Start timer on first flip
  if (!timerId) startTimer();


  card.classList.add("flipped");


  if (!firstCard) {
    firstCard = card;
    return;
  }


  secondCard = card;
  lockBoard = true; // block extra clicks during check


  // Count a move once the second card is flipped
  updateMoves(moves + 1);


  checkForMatch();
}


function checkForMatch() {
  const a = firstCard.querySelector(".card-front").textContent;
  const b = secondCard.querySelector(".card-front").textContent;


  if (a === b) {
    // Match!
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard.setAttribute("aria-label", "Matched card");
    secondCard.setAttribute("aria-label", "Matched card");


    matches++;
    resetTurn();


    // Win?
    if (matches === totalPairs) {
      stopTimer();
      message.textContent = `🎉 You win in ${moves} moves and ${time} seconds!`;
    }
  } else {
    // Not a match: flip back after a delay
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 900);
  }
}


function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}


// ========= Stats =========
function updateMoves(n) {
  moves = n;
  movesEl.textContent = String(moves);
}


function startTimer() {
  if (timerId) return;
  timerId = setInterval(() => {
    time++;
    updateTime(time);
  }, 1000);
}


function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}


function updateTime(n) {
  timeEl.textContent = String(n);
}


// ========= Utils =========
// Fisher–Yates shuffle (stable, unbiased)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
