// Script para adicionar funcionalidade de zoom ao gráfico
document.addEventListener('DOMContentLoaded', function() {
  // Carregar o plugin de zoom do Chart.js primeiro
  loadZoomPlugin().then(() => {
    // Inicializar o gráfico com zoom só depois que o plugin estiver carregado
    initChart();
  }).catch(error => {
    console.error('Erro ao carregar plugin de zoom:', error);
  });
});

// Função para carregar o plugin de zoom
function loadZoomPlugin() {
  return new Promise((resolve, reject) => {
    // Verificar se o plugin já está carregado
    if (window.Chart && Chart.Zoom) {
      resolve();
      return;
    }
    
    // Carregar o plugin
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@2.0.0/dist/chartjs-plugin-zoom.min.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Plugin de zoom carregado com sucesso');
      resolve();
    };
    
    script.onerror = () => {
      reject(new Error('Falha ao carregar o plugin de zoom'));
    };
    
    document.head.appendChild(script);
  });
}

// Função para configurar o zoom no gráfico
function configureChartZoom(chart) {
  if (!chart || !Chart.Zoom) {
    console.error('Chart ou plugin de zoom não disponível');
    return;
  }
  
  // Configurar opções de zoom
  chart.options.plugins.zoom = {
    zoom: {
      wheel: {
        enabled: true,
      },
      pinch: {
        enabled: true
      },
      mode: 'xy',
    },
    pan: {
      enabled: true,
      mode: 'xy',
    }
  };
  
  // Atualizar o gráfico para aplicar as configurações
  chart.update();
  
  // Adicionar botões de controle de zoom
  addZoomControls(chart);
}

// Função para adicionar botões de controle
function addZoomControls(chart) {
  const chartContainer = document.querySelector('.chart-container');
  if (!chartContainer) return;
  
  // Criar div para os controles
  const controlsDiv = document.createElement('div');
  controlsDiv.className = 'chart-controls';
  controlsDiv.innerHTML = `
    <button class="chart-control-btn" id="zoom-in"><i class="fas fa-search-plus"></i></button>
    <button class="chart-control-btn" id="zoom-out"><i class="fas fa-search-minus"></i></button>
    <span class="chart-control-separator"></span>
    <button class="chart-control-btn chart-control-btn-text" id="reset-zoom">Resetar</button>
  `;
  
  // Adicionar depois do gráfico
  chartContainer.after(controlsDiv);
  
  // Adicionar eventos aos botões
  document.getElementById('zoom-in').addEventListener('click', () => {
    chart.zoom(1.1);
  });
  
  document.getElementById('zoom-out').addEventListener('click', () => {
    chart.zoom(0.9);
  });
  
  document.getElementById('reset-zoom').addEventListener('click', () => {
    chart.resetZoom();
  });
}

// Modificar a função initChart no arquivo main.js
function initChart() {
  const ctx = document.getElementById('price-chart').getContext('2d');
  
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Preço do Bitcoin (USD)',
        borderColor: 'var(--primary-color)',
        backgroundColor: 'rgba(247, 147, 26, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        data: []
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      // Outras opções...
    }
  });
  
  // Configurar zoom depois que o gráfico estiver inicializado
  if (window.Chart && Chart.Zoom) {
    configureChartZoom(chart);
  } else {
    console.warn('Plugin de zoom não disponível ainda. Tentará configurar mais tarde...');
    // Tentar novamente depois de um tempo
    setTimeout(() => {
      if (window.Chart && Chart.Zoom) {
        configureChartZoom(chart);
      } else {
        console.error('Plugin de zoom não pôde ser carregado');
      }
    }, 2000);
  }
  
  // Salvar referência do gráfico
  window.bitcoinChart = chart;
  
  // Carregar dados iniciais
  loadBitcoinData();
}
