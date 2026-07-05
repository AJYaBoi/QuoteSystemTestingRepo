const sheetURL =
  "https://opensheet.elk.sh/1uEv7XxCZSaWlbBMiE0kKRyZrOnXh4pPy3gvi-oAnwnY/Form%20Responses%201";

let quotes = [];
let index = 0;

// Fetch quotes from the sheet
async function fetchQuotes() {
  try {
    const res = await fetch(sheetURL);
    quotes = await res.json();
  } catch (err) {
    console.error("Failed to fetch sheet:", err);
    quotes = [];
  }
}

// Display next valid quote
function showQuote() {
  if (!quotes.length) {
    document.getElementById("quoteBox").innerText = "";
    return;
  }

  let attempts = 0;
  while (attempts < quotes.length) {
    const q = quotes[index % quotes.length];
    index++;

    // Convert Flagged and Force Show to booleans
    const flagged = String(q.Flagged || "").trim().toLowerCase() === "true";
    const forceShow = String(q["Force Show"] || "").trim().toLowerCase() === "true";
    const forceHide = String(q["Force Hide"] || "").trim().toLowerCase() === "true";

    // Force Hide always wins
    if (forceHide) {
        attempts++;
        continue;
    }

    // Skip flagged quotes unless Force Show is enabled
    if (flagged && !forceShow) {
        attempts++;
        continue;
    }

    // Build display text
    let text = `"${q.Quote}"`;
    if (q["TikTok Username"] && q["TikTok Username"].trim() !== "") {
      text += ` - ${q["TikTok Username"]}`;
    }

    // Display normally (no highlight)
    document.getElementById("quoteBox").innerText = text;
    return;
  }

  // If all quotes are skipped
  document.getElementById("quoteBox").innerText = "No clean quotes available.";
}

// Initial fetch
fetchQuotes();

// Refresh sheet every 5 seconds
setInterval(fetchQuotes, 5000);

// Rotate quotes every 7 seconds
setInterval(showQuote, 7000);
