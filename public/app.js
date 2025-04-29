const apiBase = 'http://localhost:3000/api';

let token = null;
let currentUser = null;

const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const userNameSpan = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');
const marketDataDiv = document.getElementById('market-data');
const portfolioDiv = document.getElementById('portfolio');
const tradeForm = document.getElementById('trade-form');
const tradeMessage = document.getElementById('trade-message');
const priceChartCtx = document.getElementById('priceChart').getContext('2d');

let priceChart = null;

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.classList.add('hidden');
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(apiBase + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      token = data.token;
      currentUser = username;
      userNameSpan.textContent = currentUser;
      loginSection.classList.add('hidden');
      dashboardSection.classList.remove('hidden');
      await loadMarketData();
      await loadPortfolio();
      await loadHistoricalData();
    } else {
      loginError.textContent = data.message || 'Login failed';
      loginError.classList.remove('hidden');
    }
  } catch (err) {
    loginError.textContent = 'Error connecting to server';
    loginError.classList.remove('hidden');
  }
});

logoutBtn.addEventListener('click', () => {
  token = null;
  currentUser = null;
  loginSection.classList.remove('hidden');
  dashboardSection.classList.add('hidden');
  marketDataDiv.innerHTML = '';
  portfolioDiv.innerHTML = '';
  tradeMessage.textContent = '';
  if (priceChart) {
    priceChart.destroy();
    priceChart = null;
  }
});

async function loadMarketData() {
  marketDataDiv.innerHTML = '<p>Loading market data...</p>';
  try {
    const res = await fetch(apiBase + '/market/stocks');
    const stocks = await res.json();
    marketDataDiv.innerHTML = '';
    stocks.forEach(stock => {
      const div = document.createElement('div');
      div.textContent = stock.symbol + ' - ' + stock.name + ': ₹' + stock.price.toFixed(2);
      marketDataDiv.appendChild(div);
    });
  } catch {
    marketDataDiv.innerHTML = '<p>Error loading market data</p>';
  }
}

async function loadPortfolio() {
  portfolioDiv.innerHTML = '<p>Loading portfolio...</p>';
  try {
    // For demo, get userId from token payload (in real app decode JWT)
    // Here we simulate userId = 1
    const userId = 1;
    const res = await fetch(apiBase + '/trade/' + userId);
    const portfolio = await res.json();
    portfolioDiv.innerHTML = '';
    portfolio.forEach(item => {
      const div = document.createElement('div');
      div.textContent = item.instrumentType + ' - ' + item.symbol + ': ' + item.quantity + ' shares at avg ₹' + item.averagePrice.toFixed(2);
      portfolioDiv.appendChild(div);
    });
  } catch {
    portfolioDiv.innerHTML = '<p>Error loading portfolio</p>';
  }
}

tradeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  tradeMessage.textContent = '';
  const instrumentType = document.getElementById('trade-type').value;
  const symbol = document.getElementById('trade-symbol').value.trim().toUpperCase();
  const quantity = parseInt(document.getElementById('trade-quantity').value, 10);
  const action = document.getElementById('trade-action').value;

  if (!instrumentType || !symbol || !quantity || !action) {
    tradeMessage.textContent = 'Please fill all trade fields';
    tradeMessage.className = 'text-red-600';
    return;
  }

  try {
    // Simulate userId = 1 for demo
    const userId = 1;
    const res = await fetch(apiBase + '/trade/' + action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, instrumentType, symbol, quantity })
    });
    const data = await res.json();
    if (res.ok) {
      tradeMessage.textContent = data.message;
      tradeMessage.className = 'text-green-600';
      await loadPortfolio();
    } else {
      tradeMessage.textContent = data.message || 'Trade failed';
      tradeMessage.className = 'text-red-600';
    }
  } catch {
    tradeMessage.textContent = 'Error connecting to server';
    tradeMessage.className = 'text-red-600';
  }
});

async function loadHistoricalData() {
  // For demo, simulate historical data for a stock symbol
  const labels = [];
  const prices = [];
  const now = new Date();
  for (let i = 9; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    labels.push(date.toISOString().split('T')[0]);
    prices.push(100 + Math.random() * 20);
  }

  if (priceChart) {
    priceChart.destroy();
  }

  priceChart = new Chart(priceChartCtx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Stock Price (₹)',
        data: prices,
        borderColor: 'rgba(37, 99, 235, 1)',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { display: true, title: { display: true, text: 'Date' } },
        y: { display: true, title: { display: true, text: 'Price (₹)' } }
      }
    }
  });
}
