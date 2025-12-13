const sheetURL = "https://opensheet.elk.sh/1uEv7XxCZSaWlbBMiE0kKRyZrOnXh4pPy3gvi-oAnwnY/Form%20Responses%201";
let quotes = [];
let index = 0;

async function fetchQuotes() {
  const res = await fetch(sheetURL);
  quotes = await res.json();
}

function showQuote() {
  if (!quotes.length) return;

  const q = quotes[index % quotes.length];
  document.getElementById("quoteBox").innerText =
    q.Name ? `"${q.Quote}" — ${q.Name}` : `"${q.Quote}"`;

  index++;
}

fetchQuotes();
setInterval(fetchQuotes, 5000); // pull new responses
setInterval(showQuote, 7000);   // rotate quotes
