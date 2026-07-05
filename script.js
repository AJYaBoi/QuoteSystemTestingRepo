const sheetURL =
  "https://opensheet.elk.sh/1uEv7XxCZSaWlbBMiE0kKRyZrOnXh4pPy3gvi-oAnwnY/";

let quotes = [];
let index = 0;
let loadingAnimation;

// Status display functions
function showStatus(message, color) {
  const status = document.getElementById("statusText");

  status.style.color = color;

  if (message === "Fetching list...") {

    let dots = 0;

    clearInterval(loadingAnimation);

    loadingAnimation = setInterval(() => {
      dots = (dots + 1) % 4;
      status.innerText = "Fetching list" + ".".repeat(dots);
    }, 400);

  } else {

    clearInterval(loadingAnimation);
    status.innerText = message;
  }

  status.style.opacity = "1";
}

function hideStatus() {
  clearInterval(loadingAnimation);
  document.getElementById("statusText").style.opacity = "0";
}

// Fetch quotes from sheet
async function fetchQuotes() {

  showStatus("Fetching list...", "orange");

  try {

    const res = await fetch(sheetURL);

    if (!res.ok) {
      throw new Error("Network Error");
    }

    quotes = await res.json();

    hideStatus();

  } catch (err) {

    console.error("Failed to fetch sheet:", err);

    quotes = [];

    showStatus("Fetch Error!", "red");
  }
}

// Display next valid quote
function showQuote() {

  const quoteBox = document.getElementById("quoteBox");

  if (!quotes.length) {
    quoteBox.innerText = "";
    return;
  }

  let attempts = 0;

  while (attempts < quotes.length) {

    const q = quotes[index % quotes.length];
    index++;

    const flagged =
      String(q.Flagged || "")
        .trim()
        .toLowerCase() === "true";

    const forceShow =
      String(q["Force Show"] || "")
        .trim()
        .toLowerCase() === "true";

    const forceHide =
      String(q["Force Hide"] || "")
        .trim()
        .toLowerCase() === "true";

    // Force Hide always wins
    if (forceHide) {
      attempts++;
      continue;
    }

    // Skip flagged unless manually approved
    if (flagged && !forceShow) {
      attempts++;
      continue;
    }

    let text = `"${q.Quote}"`;

    if (
      q["TikTok Username"] &&
      q["TikTok Username"].trim() !== ""
    ) {
      text += ` - ${q["TikTok Username"]}`;
    }

    quoteBox.innerText = text;
    return;
  }

  quoteBox.innerText = "No clean quotes available.";
}

// Initial startup
fetchQuotes();
setTimeout(showQuote, 500);

// Refresh quote list every 5 seconds
setInterval(fetchQuotes, 5000);

// Rotate displayed quote every 7 seconds
setInterval(showQuote, 7000);
