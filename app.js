
const apiKey = 'JP1BSN14S6NPIG16'; 
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const trendingStocks = document.getElementById('trending-stocks');
const stockData = document.getElementById('stock-data');
const stockChart = document.getElementById('stockChart').getContext('2d');
const loadStock =document.getElementById('load-stock');
const stockInfo = document.querySelector('.stock-info');
let chart; 

const popularStocks = [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'GOOGL', name: 'Google' },
    { symbol: 'AMZN', name: 'Amazon' },
    { symbol: 'TSLA', name: 'Tesla' },
    { symbol: 'FB', name: 'Meta (Facebook)' },
    { symbol: 'NFLX', name: 'Netflix' },
    { symbol: 'NVDA', name: 'Nvidia' },
    { symbol: 'AMD', name: 'AMD' },
    { symbol: 'INTC', name: 'Intel' }
  ];

  function populateDropdown() {
    popularStocks.forEach(stock => {
      const option = document.createElement('option');
      option.value = stock.symbol;
      option.textContent = `${stock.name} (${stock.symbol})`;
      trendingStocks.appendChild(option);
    });
  }


function fetchStockData(symbol) {
  const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data['Time Series (Daily)']) {
        const timeSeries = data['Time Series (Daily)'];
        const stockDetails = Object.keys(timeSeries).map(date => ({
          date,
          open: parseFloat(timeSeries[date]['1. open']),
          high: parseFloat(timeSeries[date]['2. high']),
          low: parseFloat(timeSeries[date]['3. low']),
          close: parseFloat(timeSeries[date]['4. close']),
          volume: parseFloat(timeSeries[date]['5. volume'])
        }));

        updateTable(symbol, stockDetails);
        updateChart(stockDetails);
      } else {
        alert('Error fetching stock data. Please try again.');
      }
    })
    .catch(error => console.error('Error:', error));
}

function updateTable(symbol, stockDetails) {
  const latestData = stockDetails[0];
  const previousData = stockDetails[1];
  const priceChange = (latestData.close - previousData.close).toFixed(2);

  stockInfo.innerHTML = `

      <h2>${symbol}</h2>
      <p>Price : ${latestData.close.toFixed(2)}</p>
      <p>Change : ${priceChange}</p>
      <p>Volume : ${latestData.volume}</p>
  `;

    const newRow = stockData.insertRow();
    newRow.innerHTML = `
    <tr>
        <td>${symbol}</td>
        <td>${latestData.close.toFixed(2)}</td>
        <td>${latestData.volume}</td>
        <td>${priceChange}</td>
    </tr>
`;
}

function updateChart(stockDetails) {
  const labels = stockDetails.map(detail => detail.date).reverse();
  const prices = stockDetails.map(detail => detail.close).reverse();

  if (chart) {
    chart.destroy(); // Destroy the previous chart
  }

  chart = new Chart(stockChart, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Stock Price',
        data: prices,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { display: true },
        y: { display: true }
      }
    }
  });
}

searchBtn.addEventListener('click', () => {
  const symbol = searchInput.value.toUpperCase();
  fetchStockData(symbol);
});

loadStock.addEventListener('click', () => {
  const symbol = trendingStocks.value;
  console.log(symbol)
  fetchStockData(symbol);
});

window.onload = () => {
    populateDropdown(); 
  fetchStockData(trendingStocks.value);
};
