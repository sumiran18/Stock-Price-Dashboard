"use strict";

// Initial mock balance
let balance = 10000;  // Starting balance (₹)

// Initial portfolio mock (simulating localStorage)
let portfolio = [
    { code: 'AAPL', quantity: 10, avgPrice: 150 },
    { code: 'GOOG', quantity: 5, avgPrice: 2700 }
];

// Function to fetch stock price from Alpha Vantage API
async function fetchStockPrice() {
    const symbol = document.getElementById('stock_symbol').value.trim().toUpperCase(); // Ensure uppercase symbol
    const apiKey = "ZNX0Q11WFNVSXUOY"; // Replace with your actual Alpha Vantage API key
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Parse price data
        const timeSeries = data["Time Series (1min)"];
        if (!timeSeries) {
            alert("Invalid symbol or data not available");
            return;
        }

        const latestPrice = Object.values(timeSeries)[0]["1. open"];
        document.getElementById('current-price').innerText = `Current Price: ₹${parseFloat(latestPrice).toFixed(2)}`;
    } catch (error) {
        console.error("Error fetching stock price:", error);
        alert("Failed to fetch stock price. Please try again.");
    }
}

// Buy stock
function buyStock() {
    const stockCode = document.getElementById('stock_symbol').value.trim().toUpperCase(); // Get stock symbol from input
    const quantity = parseInt(document.getElementById('quantity').value, 10); // Quantity to buy
    const price = parseFloat(document.getElementById('current-price').innerText.split('₹')[1]); // Get the current price

    // Validate the input
    if (isNaN(quantity) || quantity <= 0) {
        return alert("Please enter a valid quantity.");
    }

    // Check if balance is enough
    if (balance >= price * quantity) {
        balance -= price * quantity; // Deduct from balance
        document.getElementById('balance-display').innerText = `Balance: ₹${balance.toFixed(2)}`;
        
        // Add the transaction to history
        addToHistory("Bought", quantity, price);
        
        // Add stock to portfolio
        addToPortfolio(stockCode, quantity, price); // Add to portfolio
        updatePortfolioDisplay(); // Refresh portfolio display
    } else {
        alert("Insufficient balance.");
    }
}

// Add to portfolio
function addToPortfolio(stockCode, quantity, price) {
    const existingStock = portfolio.find(item => item.code === stockCode);

    if (existingStock) {
        // If stock already exists, increase the quantity
        existingStock.quantity += quantity;
        existingStock.avgPrice = ((existingStock.avgPrice * existingStock.quantity) + (price * quantity)) / (existingStock.quantity + quantity); // Update average price
    } else {
        // If stock doesn't exist, add a new entry
        portfolio.push({ code: stockCode, quantity: quantity, avgPrice: price });
    }

    updatePortfolio(); // Update the portfolio in localStorage
}

// Sell stock
function sellStock() {
    const stockCode = document.getElementById('stock_symbol').value.trim().toUpperCase(); // Stock symbol (case-insensitive)
    const sellQuantity = parseInt(document.getElementById('quantity').value, 10); // Quantity to sell
    const currentPrice = parseFloat(document.getElementById('current-price').innerText.split('₹')[1]); // Current stock price

    if (isNaN(sellQuantity) || sellQuantity <= 0) {
        return alert("Please enter a valid quantity to sell.");
    }

    // Find the stock in the portfolio
    const stock = portfolio.find(item => item.code === stockCode);

    if (!stock) {
        return alert("You don't own this stock.");
    }

    // Check if you have enough stock to sell
    if (stock.quantity < sellQuantity) {
        return alert("You don't have enough stock to sell.");
    }

    // Calculate the total sale value
    const saleAmount = sellQuantity * currentPrice;
    balance += saleAmount; // Add the sale amount to balance

    // Deduct the sold quantity from the portfolio
    stock.quantity -= sellQuantity;

    // If stock quantity reaches zero, remove it from portfolio
    if (stock.quantity === 0) {
        portfolio = portfolio.filter(item => item.code !== stockCode);
    }

    updatePortfolio(); // Update portfolio in localStorage
    updateBalance(); // Update balance display

    // Notify the user
    alert(`You sold ${sellQuantity} shares of ${stockCode} for ₹${saleAmount.toFixed(2)}. Your new balance is ₹${balance.toFixed(2)}`);
    updateUI(); // Optional: Update UI to show changes

    // Refresh the portfolio display after selling
    updatePortfolioDisplay(); // Refresh portfolio display
}

// Function to update portfolio in localStorage (or simulate it)
function updatePortfolio() {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
}

// Function to update balance in localStorage (or simulate it)
function updateBalance() {
    localStorage.setItem('balance', balance.toFixed(2)); // Save the updated balance
}

// Function to add transaction to history
function addToHistory(type, quantity, price) {
    const historyList = document.getElementById('history-list');
    const listItem = document.createElement('li');
    listItem.innerText = `${type} ${quantity} shares at ₹${price.toFixed(2)}`;
    historyList.appendChild(listItem);
}

// Function to refresh the UI
function updateUI() {
    document.getElementById('balance-display').innerText = `Balance: ₹${balance.toFixed(2)}`;
}

// Function to update portfolio display
function updatePortfolioDisplay() {
    const portfolioCardsContainer = document.getElementById('portfolio-cards');
    portfolioCardsContainer.innerHTML = ''; // Clear the existing portfolio cards

    // Loop through the portfolio and create cards for each stock
    portfolio.forEach(stock => {
        const card = document.createElement('div');
        card.classList.add('portfolio-card');

        // Add stock symbol, quantity, and average price to the card
        card.innerHTML = `
            <h4>${stock.code}</h4>
            <p>Quantity: ${stock.quantity}</p>
            <p>Avg. Price: ₹${stock.avgPrice.toFixed(2)}</p>
            <p>Total Value: ₹${(stock.quantity * stock.avgPrice).toFixed(2)}</p>
        `;

        portfolioCardsContainer.appendChild(card);
    });
}

// Call this function when the page loads to get portfolio and balance from localStorage
function loadPortfolioAndBalance() {
    const storedPortfolio = localStorage.getItem('portfolio');
    if (storedPortfolio) {
        portfolio = JSON.parse(storedPortfolio);
    }

    const storedBalance = localStorage.getItem('balance');
    if (storedBalance) {
        balance = parseFloat(storedBalance);
    }

    document.getElementById('balance-display').innerText = `Balance: ₹${balance.toFixed(2)}`;
    updatePortfolioDisplay(); // Update the portfolio display
}

// Load portfolio and balance when page loads
window.onload = function() {
    loadPortfolioAndBalance();
};

//button animation
let startX;

document.getElementById('backButton').addEventListener('click', function() {
    window.location.href = '../index.html'; // Redirect to dashboard
});
