const sheetURL = "https://opensheet.elk.sh/1uEv7XxCZSaWlbBMiE0kKRyZrOnXh4pPy3gvi-oAnwnY/Form%20Responses%201";

let quotes = [];
let index = 0;

async function fetchQuotes() {
  try {
    const res = await fetch(sheetURL);
    quotes = await res.json();
  } catch (err) {
    console.error("Failed to fetch sheet:", err);
  }
}

function showQuote() {
  if (!quotes || quotes.length === 0) return;

  const q = quotes[index % quotes.length];

  // Build the text
  let text = `"${q.Quote}"`;

  if (q["TikTok Username"] && q["TikTok Username"].trim() !== "") {
    text += ` - ${q["TikTok Username"]}`;
  }

  document.getElementById("quoteBox").innerText = text;
  index++;
}

fetchQuotes();
setInterval(fetchQuotes, 5000); // refresh data
setInterval(showQuote, 7000);   // rotate quotes
