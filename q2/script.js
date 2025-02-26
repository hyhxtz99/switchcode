
const pricesUrl = "https://interview.switcheo.com/prices.json";

let prices = {};
let tokens = [];


async function fetchPrices() {
  try {
    const response = await fetch(pricesUrl);
    const rawData = await response.json();

    const latestPrices = {};
    rawData.forEach((entry) => {
      const { currency, date, price } = entry;
      if (!latestPrices[currency] || new Date(date) > new Date(latestPrices[currency].date)) {
        latestPrices[currency] = { price, date };
      }
    });


    prices = Object.fromEntries(
      Object.entries(latestPrices).map(([currency, data]) => [currency, data.price])
    );

    tokens = Object.keys(prices);
    populateTokenDropdowns();
  } catch (error) {
    showError("unable to fetch price information, please try again later.");
  }
}

function populateTokenDropdowns() {
  const fromTokenSelect = document.getElementById("from-token");
  const toTokenSelect = document.getElementById("to-token");

  tokens.forEach((token) => {
    const optionFrom = document.createElement("option");
    optionFrom.value = token;
    optionFrom.textContent = token;

    const optionTo = optionFrom.cloneNode(true);

    fromTokenSelect.appendChild(optionFrom);
    toTokenSelect.appendChild(optionTo);
  });
}


function updateExchangeRate() {
  const fromAmount = parseFloat(document.getElementById("from-amount").value) || 0;
  const fromToken = document.getElementById("from-token").value;
  const toToken = document.getElementById("to-token").value;

  if (fromToken && toToken && prices[fromToken] && prices[toToken]) {
    const rate = prices[toToken] / prices[fromToken];
    const toAmount = fromAmount * rate;

    document.getElementById("to-amount").value = toAmount.toFixed(6);
  } else {
    document.getElementById("to-amount").value = "0.00";
  }
}

function showError(message) {
  const errorMessageEl = document.getElementById("error-message");
  errorMessageEl.textContent = message;

  setTimeout(() => (errorMessageEl.textContent = ""), 3000);
}


document.getElementById("swap-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const fromAmount = parseFloat(document.getElementById("from-amount").value) || null;

  if (!fromAmount || fromAmount <= 0) {
    showError("Please enter valid amount.");
    return;
  }

  alert(`Swap success! Have exchanged ${fromAmount} ${document.getElementById("from-token").value}`);
});


document.getElementById("from-amount").addEventListener("input", updateExchangeRate);
document.getElementById("from-token").addEventListener("change", updateExchangeRate);
document.getElementById("to-token").addEventListener("change", updateExchangeRate);


fetchPrices();
