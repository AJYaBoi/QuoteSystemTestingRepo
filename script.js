const sheetURL =
  "https://opensheet.elk.sh/1uEv7XxCZSaWlbBMiE0kKRyZrOnXh4pPy3gvi-oAnwnY/Form%20Responses%201";

let quotes = [];
let index = 0;

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

function showQuote() {
  if (!quotes.length) {
    document.getElementById("quoteBox").innerText = "";
    return;
  }

  // Try to find the next unflagged quote
  let attempts = 0;
  while (attempts < quotes.length) {
    const q = quotes[index % quotes.length];
    index++;

    // Skip if flagged
    const flagged = String(q.Flagged).toLowerCase() === "true";
    if (flagged) {
      attempts++;
      continue;
    }

    // Build display text
    let text = `"${q.Quote}"`;
    if (q["TikTok Username"] && q["TikTok Username"].trim() !== "") {
      text += ` - ${q["TikTok Username"]}`;
    }

    document.getElementById("quoteBox").innerText = text;
    return;
  }

  // If all quotes are flagged
  document.getElementById("quoteBox").innerText = "No clean quotes available.";
}

// Initial fetch
fetchQuotes();

// Refresh sheet every 5 seconds
setInterval(fetchQuotes, 5000);

// Rotate quotes every 7 seconds
setInterval(showQuote, 7000);
