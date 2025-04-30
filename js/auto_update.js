// Auto Update Script for Bitcoin News
// This script handles automatic updates for Bitcoin price data and news

// Configuration
const CONFIG = {
    // Update intervals (in milliseconds)
    bitcoinUpdateInterval: 60000, // 1 minute
    newsUpdateInterval: 86400000,  // 24 horas (atualização diária)
    
    // API endpoints
    coinGeckoAPI: 'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false',
    cryptoNewsAPI: 'https://api.apitube.io/v1/news/articles?limit=5&search=bitcoin&api_key=YOUR_API_KEY',
    
    // CORS Proxy (for APIs that don't support CORS)
    corsProxy: 'https://corsproxy.io/?',
    
    // DOM selectors
    priceSelector: '#btc-price',
    changeSelector: '#price-change-percent',
    highSelector: '#day-high',
    lowSelector: '#day-low',
    volumeSelector: '#day-volume',
    lastUpdateSelector: '#last-updated',
    newsContainerSelector: '.news-container'
};

// Initialize auto updates when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Auto update script initialized');
    
    // Start Bitcoin price updates
    updateBitcoinPrice();
    setInterval(updateBitcoinPrice, CONFIG.bitcoinUpdateInterval);
    
    // Start news updates
    updateNews();
    setInterval(updateNews, CONFIG.newsUpdateInterval);
});

// Function to update Bitcoin price data
async function updateBitcoinPrice() {
    try {
        console.log('Updating Bitcoin price data...');
        
        // Fetch data from CoinGecko API
        const response = await fetch(CONFIG.coinGeckoAPI);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract relevant data
        const price = data.market_data.current_price.usd;
        const priceChange24h = data.market_data.price_change_percentage_24h;
        const high24h = data.market_data.high_24h.usd;
        const low24h = data.market_data.low_24h.usd;
        const volume24h = data.market_data.total_volume.usd;
        
        // Update DOM elements
        document.querySelector(CONFIG.priceSelector).textContent = `$${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        
        const changeElement = document.querySelector(CONFIG.changeSelector);
        changeElement.textContent = `${priceChange24h.toFixed(2)}%`;
        
        // Add appropriate class based on price change
        if (priceChange24h > 0) {
            changeElement.classList.remove('negative');
            changeElement.classList.add('positive');
        } else {
            changeElement.classList.remove('positive');
            changeElement.classList.add('negative');
        }
        
        document.querySelector(CONFIG.highSelector).textContent = `$${high24h.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.querySelector(CONFIG.lowSelector).textContent = `$${low24h.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.querySelector(CONFIG.volumeSelector).textContent = `$${Math.round(volume24h).toLocaleString()}`;
        
        // Update last update time
        const now = new Date();
        document.querySelector(CONFIG.lastUpdateSelector).textContent = `${now.toLocaleTimeString()}`;
        
        console.log('Bitcoin price data updated successfully');
    } catch (error) {
        console.error('Error updating Bitcoin price:', error);
    }
}

// Function to update news
async function updateNews() {
    try {
        console.log('Updating Bitcoin news...');
        
        // For demonstration, we'll use a fallback approach that doesn't require API keys
        // In a production environment, you would use the actual API with your key
        
        // Fallback: Use a combination of predefined news and Twitter search
        const fallbackNews = await getFallbackNews();
        
        // Update DOM with news
        const newsContainer = document.querySelector(CONFIG.newsContainerSelector);
        
        // Store the featured article element to preserve it
        const featuredArticle = newsContainer.querySelector('.news-card.featured');
        const newsGrid = newsContainer.querySelector('.news-grid');
        
        // Clear existing news in the grid
        if (newsGrid) {
            while (newsGrid.firstChild) {
                newsGrid.removeChild(newsGrid.firstChild);
            }
            
            // Add new news items to the grid (skip the first one which is featured)
            fallbackNews.slice(1).forEach(news => {
                const newsCard = createNewsCard(news, false);
                newsGrid.appendChild(newsCard);
            });
            
            // Update the featured article content if it exists
            if (featuredArticle && fallbackNews.length > 0) {
                updateFeaturedArticle(featuredArticle, fallbackNews[0]);
            }
        }
        
        // Add timestamp to show when news was last updated
        const lastUpdateTime = new Date().toLocaleString();
        const updateInfo = document.createElement('div');
        updateInfo.className = 'news-update-info';
        updateInfo.textContent = `Notícias atualizadas em: ${lastUpdateTime}`;
        
        // Add or update the timestamp element
        let existingUpdateInfo = newsContainer.querySelector('.news-update-info');
        if (existingUpdateInfo) {
            existingUpdateInfo.textContent = updateInfo.textContent;
        } else {
            newsContainer.appendChild(updateInfo);
        }
        
        console.log('News updated successfully');
    } catch (error) {
        console.error('Error updating news:', error);
    }
}

// Function to get fallback news when API is not available
async function getFallbackNews() {
    // Try to fetch recent Bitcoin-related tweets
    try {
        const response = await fetch('https://api.allorigins.win/raw?url=' + 
            encodeURIComponent('https://nitter.net/search?f=tweets&q=bitcoin&since=0&lang=en'));
        
        if (response.ok) {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract tweets
            const tweets = Array.from(doc.querySelectorAll('.tweet-content')).slice(0, 5);
            
            if (tweets.length > 0) {
                return tweets.map((tweet, index) => ({
                    title: tweet.textContent.trim().substring(0, 100) + '...',
                    url: 'https://twitter.com/search?q=bitcoin',
                    source: 'Twitter',
                    date: new Date().toLocaleDateString(),
                    image: index === 0 ? 'img/bitcoin-news.jpg' : null,
                    excerpt: tweet.textContent.trim()
                }));
            }
        }
    } catch (e) {
        console.log('Could not fetch tweets, using fallback news');
    }
    
    // If tweet fetching fails, use predefined news
    return [
        {
            title: 'Bitcoin se mantém acima de $80.000 enquanto mercado aguarda decisões de política monetária',
            url: '#',
            source: 'Crypto News',
            date: new Date().toLocaleDateString(),
            image: 'img/bitcoin-news.jpg',
            featured: true,
            excerpt: 'O Bitcoin continua a se manter acima da marca de $80.000 enquanto investidores aguardam decisões importantes de política monetária dos principais bancos centrais.'
        },
        {
            title: 'Analistas preveem que Bitcoin pode atingir $100.000 até o final do ano',
            url: '#',
            source: 'Bitcoin Analysis',
            date: new Date().toLocaleDateString(),
            image: 'img/bitcoin-forecast.jpg',
            excerpt: 'Vários analistas de mercado estão prevendo que o Bitcoin pode atingir a marca de $100.000 até o final do ano, impulsionado pela adoção institucional.'
        },
        {
            title: 'Guerra comercial entre EUA e China continua impactando mercados de criptomoedas',
            url: '#',
            source: 'Crypto Economy',
            date: new Date().toLocaleDateString(),
            image: 'img/bitcoin-tariffs.jpg',
            excerpt: 'As tensões comerciais entre Estados Unidos e China continuam a gerar volatilidade nos mercados de criptomoedas, com o Bitcoin oscilando em resposta a novas tarifas.'
        },
        {
            title: 'Bitcoin enfrenta resistência técnica em $84.000, dizem especialistas',
            url: '#',
            source: 'Technical Analysis',
            date: new Date().toLocaleDateString(),
            image: 'img/bitcoin-resistance.jpg',
            excerpt: 'Análises técnicas indicam que o Bitcoin está enfrentando uma forte resistência na faixa de $84.000, um nível crucial para determinar o próximo movimento de preço.'
        },
        {
            title: 'Adoção institucional de Bitcoin atinge novos recordes no primeiro trimestre',
            url: '#',
            source: 'Institutional Crypto',
            date: new Date().toLocaleDateString(),
            image: 'img/bitcoin-analysis.jpg',
            excerpt: 'Dados recentes mostram que a adoção institucional de Bitcoin atingiu níveis recordes no primeiro trimestre de 2025, com empresas aumentando suas reservas em criptomoedas.'
        }
    ];
}

// Function to create a news card element
function createNewsCard(news, featured = false) {
    const card = document.createElement('article');
    card.className = featured ? 'news-card featured' : 'news-card';
    
    // Create image container and image
    const imageDiv = document.createElement('div');
    imageDiv.className = 'news-image';
    
    const img = document.createElement('img');
    img.src = news.image || 'img/bitcoin-news.jpg';
    img.alt = news.title;
    img.onerror = function() {
        console.log('Erro ao carregar imagem:', img.src);
        // Tentar caminho alternativo se a imagem falhar
        if (!img.src.startsWith('http')) {
            img.src = window.location.pathname.endsWith('/') 
                ? window.location.pathname + news.image 
                : window.location.pathname + '/' + news.image;
        }
    };
    imageDiv.appendChild(img);
    card.appendChild(imageDiv);
    
    // Create content container
    const content = document.createElement('div');
    content.className = 'news-content';
    
    // Add title
    const title = document.createElement('h3');
    title.textContent = news.title;
    content.appendChild(title);
    
    // Add meta info
    const meta = document.createElement('p');
    meta.className = 'news-meta';
    meta.textContent = `${news.source} • ${news.date}`;
    content.appendChild(meta);
    
    // Add excerpt if featured
    if (featured || news.featured) {
        const excerpt = document.createElement('p');
        excerpt.className = 'news-excerpt';
        excerpt.textContent = news.excerpt || 'Clique para ler mais sobre esta notícia.';
        content.appendChild(excerpt);
    }
    
    // Add read more link
    const readMore = document.createElement('a');
    readMore.className = 'read-more';
    readMore.href = news.url || '#';
    readMore.textContent = 'Ler mais';
    content.appendChild(readMore);
    
    card.appendChild(content);
    
    return card;
}

// Function to update the featured article
function updateFeaturedArticle(featuredElement, news) {
    // Update image
    const imageElement = featuredElement.querySelector('.news-image img');
    if (imageElement && news.image) {
        imageElement.src = news.image;
        imageElement.alt = news.title;
    }
    
    // Update title
    const titleElement = featuredElement.querySelector('h3');
    if (titleElement) {
        titleElement.textContent = news.title;
    }
    
    // Update meta
    const metaElement = featuredElement.querySelector('.news-meta');
    if (metaElement) {
        metaElement.textContent = `${news.source} • ${news.date}`;
    }
    
    // Update excerpt
    const excerptElement = featuredElement.querySelector('.news-excerpt');
    if (excerptElement) {
        excerptElement.textContent = news.excerpt || 'Clique para ler mais sobre esta notícia.';
    }
    
    // Update read more link
    const readMoreElement = featuredElement.querySelector('.read-more');
    if (readMoreElement) {
        readMoreElement.href = news.url || '#';
    }
}

/* Adicionar estilos para o indicador de atualização de notícias */
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
    .news-update-info {
        text-align: center;
        margin-top: 20px;
        padding: 10px;
        background-color: var(--card-background);
        border-radius: 5px;
        font-size: 0.9rem;
        color: var(--secondary-color);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }
    `;
    document.head.appendChild(style);
});
