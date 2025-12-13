const sheetURL =
  "https://opensheet.elk.sh/1uEv7XxCZSaWlbBMiE0kKRyZrOnXh4pPy3gvi-oAnwnY/Form%20Responses%201";

// Raw GitHub URL for the profane words JSON
const profanityURL =
  "https://raw.githubusercontent.com/zautumnz/profane-words/master/words.json";

let quotes = [];
let profaneWords = [];
let index = 0;

// Fetch profane words list
async function fetchProfaneWords() {
  try {
    const res = await fetch(profanityURL);
    profaneWords = await res.json();
  } catch (err) {
    console.error("Failed to fetch profanity list:", err);
    profaneWords = [];
  }
}

// Fetch sheet data
async function fetchQuotes() {
  try {
    const res = await fetch(sheetURL);
    quotes = await res.json();
  } catch (err) {
    console.error("Failed to fetch sheet:", err);
    quotes = [];
  }
}

// Check if a quote contains any profane word
function containsProfanity(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return profaneWords.some(word => lower.includes(word.toLowerCase()));
}

function showQuote() {
  // No data
  if (!quotes.length) {
    document.getElementById("quoteBox").innerText = "";
    return;
  }

  // Try to find the next valid quote
  let attempts = 0;
  while (attempts < quotes.length) {
    const q = quotes[index % quotes.length];
    index++;

    const text = q.Quote;
    const flagged = String(q.Flagged).toLowerCase() === "true";

    // Skip if text has profanity AND not manually flagged to override
    if (containsProfanity(text) && !flagged) {
      attempts++;
      continue;
    }

    // Build display string
    let display = `"${text}"`;
    if (q["TikTok Username"]) {
      display += ` - ${q["TikTok Username"]}`;
    }

    document.getElementById("quoteBox").innerText = display;
    return;
  }

  // If we get here, no clean quote to show
  document.getElementById("quoteBox").innerText = "No clean quotes available.";
}

fetchProfaneWords();
fetchQuotes();
setInterval(fetchProfaneWords, 60_000); // refresh profanity list occasionally
setInterval(fetchQuotes, 5000);
setInterval(showQuote, 7000);
