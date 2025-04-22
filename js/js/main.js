// Carregamento de dados do Bitcoin
document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados do Bitcoin
    loadBitcoinData();
    
    // Inicializar o gráfico
    initChart();
    
    // Atualizar dados a cada 60 segundos
    setInterval(loadBitcoinData, 60000);
});

// Função para carregar dados do Bitcoin do arquivo JSON
function loadBitcoinData() {
    fetch('js/bitcoin_processed_data.json')
        .then(response => response.json())
        .then(data => {
            updatePriceDisplay(data);
            updateChart(data);
        })
        .catch(error => {
            console.error('Erro ao carregar dados do Bitcoin:', error);
        });
}

// Função para atualizar a exibição do preço
function updatePriceDisplay(data) {
    // Atualizar preço atual
    document.getElementById('btc-price').textContent = formatCurrency(data.regularMarketPrice);
    
    // Atualizar variação de preço
    const priceChangeElement = document.getElementById('price-change-percent');
    const priceChangeValueElement = document.getElementById('price-change-value');
    
    priceChangeElement.textContent = `${data.priceChangePercent > 0 ? '+' : ''}${data.priceChangePercent}%`;
    priceChangeValueElement.textContent = `${data.priceChange > 0 ? '+' : ''}${formatCurrency(data.priceChange)}`;
    
    // Adicionar classe para cor (verde/vermelho)
    if (data.priceChangePercent > 0) {
        priceChangeElement.className = 'positive';
        priceChangeValueElement.className = 'positive';
    } else {
        priceChangeElement.className = 'negative';
        priceChangeValueElement.className = 'negative';
    }
    
    // Atualizar estatísticas
    document.getElementById('day-high').textContent = formatCurrency(data.regularMarketDayHigh);
    document.getElementById('day-low').textContent = formatCurrency(data.regularMarketDayLow);
    document.getElementById('day-volume').textContent = formatLargeNumber(data.regularMarketVolume);
    
    // Atualizar timestamp
    document.getElementById('last-updated').textContent = data.lastUpdated;
}

// Variável global para o gráfico
let priceChart;

// Função para inicializar o gráfico
function initChart() {
    const ctx = document.getElementById('price-chart').getContext('2d');
    
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Preço do Bitcoin (USD)',
                data: [],
                borderColor: '#f7931a',
                backgroundColor: 'rgba(247, 147, 26, 0.1)',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: '#f7931a',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `Preço: ${formatCurrency(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Função para atualizar o gráfico com novos dados
function updateChart(data) {
    if (!priceChart || !data.historicalData) return;
    
    // Preparar dados para o gráfico
    const labels = data.historicalData.map(item => item.date);
    const prices = data.historicalData.map(item => item.close);
    
    // Atualizar dados do gráfico
    priceChart.data.labels = labels;
    priceChart.data.datasets[0].data = prices;
    
    // Atualizar o gráfico
    priceChart.update();
}

// Função para formatar valores monetários
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

// Função para formatar números grandes (ex: volume)
function formatLargeNumber(value) {
    if (value >= 1e9) {
        return `${(value / 1e9).toFixed(2)} B`;
    } else if (value >= 1e6) {
        return `${(value / 1e6).toFixed(2)} M`;
    } else if (value >= 1e3) {
        return `${(value / 1e3).toFixed(2)} K`;
    }
    return value.toString();
}

// Função para abrir a análise completa
document.querySelector('.read-full-analysis').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Carregar o conteúdo da análise
    fetch('js/price_analysis.md')
        .then(response => response.text())
        .then(text => {
            // Criar um modal para exibir a análise
            const modal = document.createElement('div');
            modal.className = 'analysis-modal';
            
            const modalContent = document.createElement('div');
            modalContent.className = 'analysis-modal-content';
            
            const closeBtn = document.createElement('span');
            closeBtn.className = 'close-modal';
            closeBtn.innerHTML = '&times;';
            closeBtn.onclick = function() {
                document.body.removeChild(modal);
            };
            
            const title = document.createElement('h2');
            title.textContent = 'Análise Completa das Oscilações de Preço do Bitcoin';
            
            const content = document.createElement('div');
            content.className = 'analysis-content-text';
            
            // Converter markdown para HTML (versão simplificada)
            const htmlContent = text
                .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n\n/g, '<br><br>');
            
            content.innerHTML = htmlContent;
            
            modalContent.appendChild(closeBtn);
            modalContent.appendChild(title);
            modalContent.appendChild(content);
            modal.appendChild(modalContent);
            
            // Adicionar estilos para o modal
            const style = document.createElement('style');
            style.textContent = `
                .analysis-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    z-index: 1000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .analysis-modal-content {
                    background-color: white;
                    padding: 30px;
                    border-radius: 10px;
                    max-width: 800px;
                    max-height: 80vh;
                    overflow-y: auto;
                    position: relative;
                }
                .close-modal {
                    position: absolute;
                    top: 10px;
                    right: 20px;
                    font-size: 28px;
                    cursor: pointer;
                }
                .analysis-content-text {
                    margin-top: 20px;
                }
                .analysis-content-text h1, .analysis-content-text h2, .analysis-content-text h3 {
                    margin-bottom: 15px;
                    color: #333;
                }
                .analysis-content-text h1 {
                    font-size: 24px;
                }
                .analysis-content-text h2 {
                    font-size: 20px;
                }
                .analysis-content-text h3 {
                    font-size: 18px;
                }
            `;
            
            document.head.appendChild(style);
            document.body.appendChild(modal);
        })
        .catch(error => {
            console.error('Erro ao carregar análise:', error);
        });
});
