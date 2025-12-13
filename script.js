function showQuote() {
  if (!quotes.length) return;

  const q = quotes[index % quotes.length];

  let displayText = `"${q.Quote}"`;

  const username = q["TikTok Username"];
  if (username && username.trim() !== "") {
    displayText += ` - ${username}`;
  }

  document.getElementById("quoteBox").innerText = displayText;
  index++;
}
