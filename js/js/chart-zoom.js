// Script para adicionar funcionalidade de zoom ao gráfico
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que o gráfico foi inicializado
    setTimeout(function() {
        initZoomFunctionality();
    }, 1000);
    
    function initZoomFunctionality() {
        // Verificar se o Chart.js está disponível
        if (typeof Chart === 'undefined') {
            console.error('Chart.js não está carregado. A funcionalidade de zoom não pode ser adicionada.');
            return;
        }
        
        // Carregar o plugin de zoom do Chart.js diretamente no HTML
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@1.2.1/dist/chartjs-plugin-zoom.min.js';
        script.onload = function() {
            console.log('Plugin de zoom carregado com sucesso');
            
            // Aguardar um pouco para garantir que o plugin foi registrado
            setTimeout(function() {
                configureChartZoom();
            }, 500);
        };
        script.onerror = function() {
            console.error('Erro ao carregar o plugin de zoom');
        };
        document.head.appendChild(script);
    }
    
    // Função para configurar o zoom no gráfico
    function configureChartZoom() {
        // Verificar se o gráfico existe
        if (!window.priceChart) {
            console.error('Gráfico não encontrado');
            return;
        }
        
        console.log('Configurando zoom para o gráfico');
        
        // Adicionar controles de zoom ao gráfico com opções aprimoradas
        window.priceChart.options.plugins.zoom = {
            pan: {
                enabled: true,
                mode: 'x',
                threshold: 5,
                modifierKey: 'shift' // Permite pan segurando shift
            },
            zoom: {
                wheel: {
                    enabled: true,
                    speed: 0.1, // Velocidade de zoom reduzida para maior precisão
                    sensitivity: 0.5 // Maior sensibilidade para zoom mais suave
                },
                pinch: {
                    enabled: true
                },
                drag: {
                    enabled: true, // Habilita zoom por seleção de área
                    backgroundColor: 'rgba(225,225,225,0.3)',
                    borderColor: 'rgba(54, 162, 235, 0.8)',
                    borderWidth: 1
                },
                mode: 'x'
            },
            limits: {
                x: {
                    minRange: 3, // Reduzido para permitir zoom mais profundo
                    maxRange: 31 // Máximo de um mês visível por vez
                }
            }
        };
        
        // Adicionar botões de controle de zoom
        addZoomControls();
        
        // Atualizar o gráfico
        window.priceChart.update();
    }
    
    // Função para adicionar botões de controle de zoom aprimorados
    function addZoomControls() {
        // Remover controles existentes, se houver
        const existingControls = document.querySelector('.chart-controls');
        if (existingControls) {
            existingControls.remove();
        }
        
        // Criar container para os controles
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'chart-controls';
        
        // Botão de zoom in
        const zoomInBtn = document.createElement('button');
        zoomInBtn.className = 'chart-control-btn';
        zoomInBtn.innerHTML = '<i class="fas fa-search-plus"></i>';
        zoomInBtn.title = 'Ampliar';
        zoomInBtn.onclick = function() {
            if (window.priceChart.zoom && typeof window.priceChart.zoom === 'function') {
                window.priceChart.zoom(1.2); // Zoom mais intenso
            } else {
                console.error('Função de zoom não disponível');
            }
        };
        
        // Botão de zoom out
        const zoomOutBtn = document.createElement('button');
        zoomOutBtn.className = 'chart-control-btn';
        zoomOutBtn.innerHTML = '<i class="fas fa-search-minus"></i>';
        zoomOutBtn.title = 'Reduzir';
        zoomOutBtn.onclick = function() {
            if (window.priceChart.zoom && typeof window.priceChart.zoom === 'function') {
                window.priceChart.zoom(0.8); // Zoom out mais intenso
            } else {
                console.error('Função de zoom não disponível');
            }
        };
        
        // Botão de reset
        const resetBtn = document.createElement('button');
        resetBtn.className = 'chart-control-btn';
        resetBtn.innerHTML = '<i class="fas fa-undo"></i>';
        resetBtn.title = 'Resetar zoom';
        resetBtn.onclick = function() {
            if (window.priceChart.resetZoom && typeof window.priceChart.resetZoom === 'function') {
                window.priceChart.resetZoom();
            } else {
                console.error('Função de resetZoom não disponível');
            }
        };
        
        // Botão de zoom para 7 dias
        const zoom7DaysBtn = document.createElement('button');
        zoom7DaysBtn.className = 'chart-control-btn chart-control-btn-text';
        zoom7DaysBtn.textContent = '7D';
        zoom7DaysBtn.title = 'Visualizar últimos 7 dias';
        zoom7DaysBtn.onclick = function() {
            zoomToLastDays(7);
        };
        
        // Botão de zoom para 14 dias
        const zoom14DaysBtn = document.createElement('button');
        zoom14DaysBtn.className = 'chart-control-btn chart-control-btn-text';
        zoom14DaysBtn.textContent = '14D';
        zoom14DaysBtn.title = 'Visualizar últimos 14 dias';
        zoom14DaysBtn.onclick = function() {
            zoomToLastDays(14);
        };
        
        // Botão de zoom para 30 dias
        const zoom30DaysBtn = document.createElement('button');
        zoom30DaysBtn.className = 'chart-control-btn chart-control-btn-text';
        zoom30DaysBtn.textContent = '30D';
        zoom30DaysBtn.title = 'Visualizar últimos 30 dias';
        zoom30DaysBtn.onclick = function() {
            zoomToLastDays(30);
        };
        
        // Adicionar botões ao container
        controlsContainer.appendChild(zoomInBtn);
        controlsContainer.appendChild(zoomOutBtn);
        controlsContainer.appendChild(resetBtn);
        controlsContainer.appendChild(document.createElement('span')).className = 'chart-control-separator';
        controlsContainer.appendChild(zoom7DaysBtn);
        controlsContainer.appendChild(zoom14DaysBtn);
        controlsContainer.appendChild(zoom30DaysBtn);
        
        // Adicionar container à seção do gráfico
        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer) {
            chartContainer.parentNode.insertBefore(controlsContainer, chartContainer.nextSibling);
        }
        
        // Adicionar instruções de uso aprimoradas
        const instructions = document.createElement('div');
        instructions.className = 'chart-instructions';
        instructions.innerHTML = `
            <p>
                <i class="fas fa-info-circle"></i>
                <strong>Controles avançados de zoom:</strong> Use a roda do mouse para ampliar/reduzir, 
                selecione uma área do gráfico para ampliar, ou segure SHIFT e arraste para navegar. 
                Clique nos botões de período (7D, 14D, 30D) para visualizar intervalos específicos.
            </p>
        `;
        
        // Adicionar instruções após os controles
        if (chartContainer) {
            chartContainer.parentNode.insertBefore(instructions, controlsContainer.nextSibling);
        }
    }
    
    // Função para dar zoom em um período específico de dias
    function zoomToLastDays(days) {
        if (!window.priceChart || !window.priceChart.data || !window.priceChart.data.labels) {
            console.error('Dados do gráfico não disponíveis');
            return;
        }
        
        const labels = window.priceChart.data.labels;
        if (labels.length === 0) return;
        
        // Resetar zoom primeiro
        if (window.priceChart.resetZoom && typeof window.priceChart.resetZoom === 'function') {
            window.priceChart.resetZoom();
        }
        
        // Se temos menos pontos que o número de dias solicitado, não fazemos nada
        if (labels.length <= days) return;
        
        // Calcular os índices para o zoom
        const endIndex = labels.length - 1;
        const startIndex = Math.max(0, endIndex - days + 1);
        
        // Aplicar zoom
        window.priceChart.zoomScale('x', {
            min: labels[startIndex],
            max: labels[endIndex]
        });
    }
});
