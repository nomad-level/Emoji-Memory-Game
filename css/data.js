// ===== Emoji Themes (unique symbols per theme) =====
// Ensure enough uniques for "hard" (18 pairs). Each list has 20+.


const emojiThemes = {
  faces: [
    "😀","😂","😎","😍","🤓","😡","😭","😴","🤯","😇",
    "🤠","🥳","😜","🤔","🙃","😱","🤩","😅","😷","🤪",
    "🤖","👻"
  ],
  animals: [
    "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯",
    "🦁","🐮","🐷","🐸","🐵","🐤","🦆","🐙","🐠","🦋",
    "🦄","🦖"
  ],
  food: [
    "🍎","🍌","🍇","🍕","🍔","🍟","🌭","🍣","🍪","🍩",
    "🍫","🍓","🍒","🥑","🥦","🍉","🍊","🍍","🥨","🥕",
    "🧁","🥐"
  ]
};


// Helper to fetch a copy (so we can safely slice/shuffle)
function getSymbols(theme) {
  return [...(emojiThemes[theme] || [])];
}
