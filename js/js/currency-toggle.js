// Script para alternar entre moedas (USD e BRL)
document.addEventListener('DOMContentLoaded', function() {
    // Configurações iniciais
    let currentCurrency = 'USD';
    let exchangeRate = 5.0; // Taxa de câmbio inicial aproximada USD para BRL
    
    // Criar e adicionar o botão de alternância de moeda
    createCurrencyToggleButton();
    
    // Buscar taxa de câmbio atual
    fetchExchangeRate();
    
    // Atualizar taxa de câmbio a cada hora
    setInterval(fetchExchangeRate, 3600000);
    
    // Função para criar e adicionar o botão de alternância de moeda
    function createCurrencyToggleButton() {
        // Criar o botão
        const currencyToggle = document.createElement('div');
        currencyToggle.className = 'currency-toggle';
        currencyToggle.innerHTML = `
            <button id="currency-toggle-btn">
                <i class="fas fa-dollar-sign"></i>
                <span>USD / BRL</span>
            </button>
        `;
        
        // Encontrar o local para inserir o botão (ao lado do cabeçalho do preço)
        const priceHeader = document.querySelector('.price-header');
        if (priceHeader) {
            priceHeader.appendChild(currencyToggle);
        }
        
        // Adicionar evento de clique
        document.getElementById('currency-toggle-btn').addEventListener('click', toggleCurrency);
    }
    
    // Função para alternar entre moedas
    function toggleCurrency() {
        currentCurrency = currentCurrency === 'USD' ? 'BRL' : 'USD';
        
        // Atualizar ícone e texto do botão
        const button = document.getElementById('currency-toggle-btn');
        const icon = button.querySelector('i');
        
        if (currentCurrency === 'BRL') {
            icon.className = 'fas fa-money-bill-wave';
            button.querySelector('span').textContent = 'BRL / USD';
        } else {
            icon.className = 'fas fa-dollar-sign';
            button.querySelector('span').textContent = 'USD / BRL';
        }
        
        // Atualizar a exibição dos preços
        updateCurrencyDisplay();
        
        // Atualizar o gráfico
        updateChartCurrency();
    }
    
    // Função para buscar a taxa de câmbio atual
    function fetchExchangeRate() {
        // Usar a API do CoinGecko para obter o preço do Bitcoin em USD e BRL
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,brl')
            .then(response => response.json())
            .then(data => {
                if (data.bitcoin && data.bitcoin.usd && data.bitcoin.brl) {
                    // Calcular a taxa de câmbio BRL/USD a partir dos preços do Bitcoin
                    exchangeRate = data.bitcoin.brl / data.bitcoin.usd;
                    console.log(`Taxa de câmbio atualizada: 1 USD = ${exchangeRate.toFixed(2)} BRL`);
                    
                    // Se a moeda atual for BRL, atualizar a exibição com a nova taxa
                    if (currentCurrency === 'BRL') {
                        updateCurrencyDisplay();
                    }
                }
            })
            .catch(error => {
                console.error('Erro ao buscar taxa de câmbio:', error);
            });
    }
    
    // Função para atualizar a exibição dos preços com a moeda atual
    function updateCurrencyDisplay() {
        // Obter os elementos de preço
        const priceElements = [
            document.getElementById('btc-price'),
            document.getElementById('price-change-value'),
            document.getElementById('day-high'),
            document.getElementById('day-low')
        ];
        
        // Atualizar cada elemento de preço
        priceElements.forEach(element => {
            if (element) {
                // Extrair o valor numérico do texto atual
                const valueText = element.textContent;
                const numericValue = parseFloat(valueText.replace(/[^0-9.-]+/g, ''));
                
                if (!isNaN(numericValue)) {
                    // Converter o valor para a moeda atual
                    const convertedValue = currentCurrency === 'BRL' 
                        ? numericValue * exchangeRate 
                        : numericValue / exchangeRate;
                    
                    // Formatar e exibir o valor convertido
                    element.textContent = formatCurrencyValue(convertedValue);
                }
            }
        });
        
        // Atualizar o volume (tratamento especial devido ao formato)
        const volumeElement = document.getElementById('day-volume');
        if (volumeElement) {
            const volumeText = volumeElement.textContent;
            let multiplier = 1;
            
            // Determinar o multiplicador com base no sufixo (K, M, B)
            if (volumeText.includes('K')) {
                multiplier = 1e3;
            } else if (volumeText.includes('M')) {
                multiplier = 1e6;
            } else if (volumeText.includes('B')) {
                multiplier = 1e9;
            }
            
            // Extrair o valor numérico
            const numericVolume = parseFloat(volumeText.replace(/[^0-9.-]+/g, '')) * multiplier;
            
            if (!isNaN(numericVolume)) {
                // Converter o valor para a moeda atual
                const convertedVolume = currentCurrency === 'BRL' 
                    ? numericVolume * exchangeRate 
                    : numericVolume / exchangeRate;
                
                // Formatar e exibir o valor convertido
                volumeElement.textContent = formatLargeNumber(convertedVolume);
            }
        }
    }
    
    // Função para atualizar a moeda no gráfico
    function updateChartCurrency() {
        if (window.priceChart) {
            // Atualizar o rótulo do conjunto de dados
            window.priceChart.data.datasets[0].label = `Preço do Bitcoin (${currentCurrency})`;
            
            // Atualizar os dados do gráfico se necessário
            if (currentCurrency === 'BRL') {
                // Converter os valores de USD para BRL
                window.priceChart.data.datasets[0].data = window.priceChart.data.datasets[0].data.map(
                    value => value * exchangeRate
                );
            } else {
                // Converter os valores de BRL para USD
                window.priceChart.data.datasets[0].data = window.priceChart.data.datasets[0].data.map(
                    value => value / exchangeRate
                );
            }
            
            // Atualizar as opções de formatação do eixo Y
            window.priceChart.options.scales.y.ticks.callback = function(value) {
                return formatCurrencyValue(value);
            };
            
            // Atualizar as opções de formatação da tooltip
            window.priceChart.options.plugins.tooltip.callbacks.label = function(context) {
                return `Preço: ${formatCurrencyValue(context.raw)}`;
            };
            
            // Atualizar o gráfico
            window.priceChart.update();
        }
    }
    
    // Função para formatar valores monetários com a moeda atual
    function formatCurrencyValue(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currentCurrency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }
    
    // Função para formatar números grandes (ex: volume)
    function formatLargeNumber(value) {
        const prefix = currentCurrency === 'USD' ? '$' : 'R$';
        
        if (value >= 1e9) {
            return `${prefix}${(value / 1e9).toFixed(2)} B`;
        } else if (value >= 1e6) {
            return `${prefix}${(value / 1e6).toFixed(2)} M`;
        } else if (value >= 1e3) {
            return `${prefix}${(value / 1e3).toFixed(2)} K`;
        }
        return `${prefix}${value.toFixed(2)}`;
    }
    
    // Expor funções e variáveis necessárias globalmente
    window.currencyToggle = {
        getCurrentCurrency: () => currentCurrency,
        getExchangeRate: () => exchangeRate,
        formatCurrencyValue: formatCurrencyValue,
        formatLargeNumber: formatLargeNumber
    };
});
