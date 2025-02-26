console.log('fetchData.js loaded');

// Ensure these are global variables
let ratingsChart = null;
let forecastChart = null;

// Define API port (can be set dynamically or through config)
const apiPort = 6001;  // You can update this dynamically, e.g., from an environment variable or config

// Initialize charts
function initializeCharts() {
    console.log('Initializing charts...');
    
    // Initialize the doughnut chart
    const ratingsCtx = document.getElementById('ratingsChart');
    ratingsChart = new Chart(ratingsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Buy', 'Hold', 'Sell'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    'rgba(152, 216, 206, 0.8)',
                    'rgba(255, 224, 156, 0.8)',
                    'rgba(255, 182, 185, 0.8)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Initialize the line chart
    const forecastCtx = document.getElementById('forecastChart');
    forecastChart = new Chart(forecastCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Price',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Add input event listener
    const inputElement = document.getElementById('stockSymbol');
    inputElement.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            updateCharts(this.value);
        }
    });
}

// Define the center text plugin
const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart) => {
        if (chart.options.plugins.centerText) {
            const { ctx, chartArea } = chart;
            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = '#333';
            ctx.fillText(chart.options.plugins.centerText.text || '', centerX, centerY);
            ctx.restore();
        }
    }
};

// Register the plugin
Chart.register(centerTextPlugin);

// Update chart data
async function updateCharts(symbol) {
    if (!symbol) return;
    
    console.log('Updating charts for:', symbol);

    const apiUrl = `/fetch-api-data?symbol=${symbol}`;  // Use dynamic port

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log('API response data:', data);

        // Update the line chart
        if (data.stock_data && data.stock_data.dates && data.stock_data.prices) {
            forecastChart.data.labels = data.stock_data.dates;
            forecastChart.data.datasets[0].data = data.stock_data.prices;
            forecastChart.update();
        }

        // Update the analyst ratings chart
        if (data.ratings) {
            const ratings = data.ratings;
            const ratingData = [
                ratings.buy || 0,
                ratings.hold || 0,
                ratings.sell || 0
            ];
            
            // Update doughnut chart
            ratingsChart.data.datasets[0].data = ratingData;
            
            // Calculate total analysts
            const total = ratingData.reduce((a, b) => a + b, 0);
            
            if (total > 0) {
                // Update total analysts
                document.getElementById('totalAnalysts').textContent = total;

                // Update average rating with custom styling
                const avgRating = ((ratings.buy * 1 + ratings.hold * 2 + ratings.sell * 3) / total).toFixed(1);
                const avgRatingElement = document.getElementById('averageRating');
                avgRatingElement.innerHTML = `<span class="highlight">${avgRating}</span> / 3.0`;

                // Update price targets
                if (typeof ratings.highTarget === 'number') {
                    document.getElementById('highTarget').textContent = `$${ratings.highTarget.toFixed(2)}`;
                }
                if (typeof ratings.avgTarget === 'number') {
                    document.getElementById('avgTarget').textContent = `$${ratings.avgTarget.toFixed(2)}`;
                }
                if (typeof ratings.lowTarget === 'number') {
                    document.getElementById('lowTarget').textContent = `$${ratings.lowTarget.toFixed(2)}`;
                }
            }

            // Update central text in the doughnut chart
            const buyPercent = (ratings.buy / total) * 100;
            const sellPercent = (ratings.sell / total) * 100;
            ratingsChart.options.plugins.centerText = {
                text: buyPercent > 50 ? 'Buy' : (sellPercent > 50 ? 'Sell' : 'Hold')
            };
            
            ratingsChart.update();
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

// Display error or success messages
function setMessage(message, type) {
    const messageEl = document.getElementById('error-message');
    if (message) {
        messageEl.textContent = message;
        messageEl.className = `message ${type} show`;
    } else {
        messageEl.className = 'message';
    }
}

function clearMessage() {
    const messageEl = document.getElementById('error-message');
    messageEl.className = 'message';
}

// Fetch stock data (optional helper function)
async function fetchStockData(symbol) {
    try {
        console.log('Fetching data for:', symbol);
        const apiUrl = `/fetch-api-data?symbol=${symbol}`;  // Use dynamic port
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Data received:', data);
    } catch (error) {
        console.error('Error details:', error);
        alert('Unable to fetch data. Please try again later.');
    }
}
