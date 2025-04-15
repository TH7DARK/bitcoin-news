// Script para adicionar funcionalidade de zoom ao gráfico
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não está carregado. A funcionalidade de zoom não pode ser adicionada.');
        return;
    }
    
    // Carregar o plugin de zoom do Chart.js
    loadZoomPlugin();
    
    // Função para carregar o plugin de zoom
    function loadZoomPlugin() {
        // Criar elemento de script
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@2.0.1/dist/chartjs-plugin-zoom.min.js';
        script.async = true;
        
        // Adicionar evento de carregamento
        script.onload = function() {
            console.log('Plugin de zoom carregado com sucesso');
            configureChartZoom();
        };
        
        // Adicionar evento de erro
        script.onerror = function() {
            console.error('Erro ao carregar o plugin de zoom');
        };
        
        // Adicionar o script ao documento
        document.head.appendChild(script);
    }
    
    // Função para configurar o zoom no gráfico
    function configureChartZoom() {
        // Verificar se o plugin está disponível
        if (!Chart.registry.getPlugin('zoom')) {
            console.error('Plugin de zoom não está registrado');
            return;
        }
        
        // Verificar se o gráfico existe
        if (!window.priceChart) {
            console.error('Gráfico não encontrado');
            return;
        }
        
        // Adicionar controles de zoom ao gráfico
        window.priceChart.options.plugins.zoom = {
            pan: {
                enabled: true,
                mode: 'x',
                threshold: 10,
                onPanComplete: function() {
                    console.log('Pan concluído');
                }
            },
            zoom: {
                wheel: {
                    enabled: true,
                },
                pinch: {
                    enabled: true
                },
                mode: 'x',
                onZoomComplete: function() {
                    console.log('Zoom concluído');
                }
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
        // Criar container para os controles
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'chart-controls';
        
        // Botão de zoom in
        const zoomInBtn = document.createElement('button');
        zoomInBtn.className = 'chart-control-btn';
        zoomInBtn.innerHTML = '<i class="fas fa-search-plus"></i>';
        zoomInBtn.title = 'Ampliar';
        zoomInBtn.onclick = function() {
            window.priceChart.zoom(1.1);
        };
        
        // Botão de zoom out
        const zoomOutBtn = document.createElement('button');
        zoomOutBtn.className = 'chart-control-btn';
        zoomOutBtn.innerHTML = '<i class="fas fa-search-minus"></i>';
        zoomOutBtn.title = 'Reduzir';
        zoomOutBtn.onclick = function() {
            window.priceChart.zoom(0.9);
        };
        
        // Botão de reset
        const resetBtn = document.createElement('button');
        resetBtn.className = 'chart-control-btn';
        resetBtn.innerHTML = '<i class="fas fa-undo"></i>';
        resetBtn.title = 'Resetar zoom';
        resetBtn.onclick = function() {
            window.priceChart.resetZoom();
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
