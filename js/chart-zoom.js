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
        
        // Adicionar controles de zoom ao gráfico
        window.priceChart.options.plugins.zoom = {
            pan: {
                enabled: true,
                mode: 'x',
                threshold: 10
            },
            zoom: {
                wheel: {
                    enabled: true,
                },
                pinch: {
                    enabled: true
                },
                mode: 'x'
            },
            limits: {
                x: {
                    minRange: 7 // Mínimo de 7 pontos de dados visíveis
                }
            }
        };
        
        // Adicionar botões de controle de zoom
        addZoomControls();
        
        // Atualizar o gráfico
        window.priceChart.update();
    }
    
    // Função para adicionar botões de controle de zoom
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
                window.priceChart.zoom(1.1);
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
                window.priceChart.zoom(0.9);
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
        
        // Adicionar botões ao container
        controlsContainer.appendChild(zoomInBtn);
        controlsContainer.appendChild(zoomOutBtn);
        controlsContainer.appendChild(resetBtn);
        
        // Adicionar container à seção do gráfico
        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer) {
            chartContainer.parentNode.insertBefore(controlsContainer, chartContainer.nextSibling);
        }
        
        // Adicionar instruções de uso
        const instructions = document.createElement('div');
        instructions.className = 'chart-instructions';
        instructions.innerHTML = `
            <p>
                <i class="fas fa-info-circle"></i>
                Use a roda do mouse para ampliar/reduzir ou arraste para navegar pelo gráfico.
                Clique em uma data específica para ver detalhes.
            </p>
        `;
        
        // Adicionar instruções após os controles
        if (chartContainer) {
            chartContainer.parentNode.insertBefore(instructions, controlsContainer.nextSibling);
        }
    }
});
