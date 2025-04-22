// Script para adicionar feed do Twitter (X) ao site Bitcoin News
document.addEventListener('DOMContentLoaded', function() {
    // Criar e adicionar a seção de Twitter após o carregamento da página
    createTwitterSection();
    
    // Carregar tweets relevantes
    loadTwitterFeed();
    
    // Função para criar a seção de Twitter
    function createTwitterSection() {
        // Verificar se a seção já existe
        if (document.getElementById('twitter-section')) {
            return;
        }
        
        // Criar a seção
        const twitterSection = document.createElement('section');
        twitterSection.id = 'twitter-section';
        
        // Adicionar HTML da seção
        twitterSection.innerHTML = `
            <div class="container">
                <h2><i class="fab fa-x-twitter"></i> Publicações Relevantes</h2>
                <div class="twitter-container">
                    <div class="twitter-feed" id="twitter-feed">
                        <div class="loading-tweets">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Carregando publicações...</p>
                        </div>
                    </div>
                </div>
                <div class="twitter-footer">
                    <p>Publicações atualizadas diariamente sobre Bitcoin e criptomoedas</p>
                </div>
            </div>
        `;
        
        // Inserir antes do footer
        const footer = document.querySelector('footer');
        if (footer) {
            document.body.insertBefore(twitterSection, footer);
        } else {
            document.body.appendChild(twitterSection);
        }
        
        // Adicionar estilos CSS para a seção
        addTwitterStyles();
    }
    
    // Função para adicionar estilos CSS
    function addTwitterStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #twitter-section {
                padding: 50px 0;
                background-color: var(--background-color);
                border-top: 1px solid var(--border-color);
            }
            
            #twitter-section h2 {
                text-align: center;
                margin-bottom: 30px;
                color: var(--text-color);
            }
            
            #twitter-section h2 i {
                margin-right: 10px;
                color: #1DA1F2;
            }
            
            .twitter-container {
                max-width: 800px;
                margin: 0 auto;
            }
            
            .twitter-feed {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .tweet-card {
                background-color: var(--card-background);
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s, box-shadow 0.3s;
                display: flex;
                flex-direction: column;
            }
            
            .tweet-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
            }
            
            .tweet-header {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .tweet-avatar {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                margin-right: 15px;
                background-color: #f0f0f0;
                overflow: hidden;
            }
            
            .tweet-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .tweet-user {
                flex: 1;
            }
            
            .tweet-name {
                font-weight: bold;
                margin: 0;
                color: var(--text-color);
            }
            
            .tweet-username {
                color: var(--secondary-color);
                margin: 0;
                font-size: 0.9rem;
            }
            
            .tweet-content {
                margin-bottom: 15px;
                color: var(--text-color);
                line-height: 1.5;
                word-break: break-word;
            }
            
            .tweet-media {
                margin-bottom: 15px;
                border-radius: 10px;
                overflow: hidden;
                max-height: 200px;
            }
            
            .tweet-media img {
                width: 100%;
                height: auto;
                object-fit: cover;
            }
            
            .tweet-footer {
                display: flex;
                justify-content: space-between;
                color: var(--secondary-color);
                font-size: 0.9rem;
                margin-top: auto;
            }
            
            .tweet-date {
                color: var(--secondary-color);
            }
            
            .tweet-actions a {
                color: var(--secondary-color);
                text-decoration: none;
                margin-left: 10px;
            }
            
            .tweet-actions a:hover {
                color: var(--accent-color);
            }
            
            .loading-tweets {
                text-align: center;
                padding: 30px;
                grid-column: 1 / -1;
                color: var(--secondary-color);
            }
            
            .loading-tweets i {
                font-size: 2rem;
                margin-bottom: 15px;
                color: var(--primary-color);
            }
            
            .twitter-footer {
                text-align: center;
                margin-top: 20px;
                color: var(--secondary-color);
                font-size: 0.9rem;
            }
            
            @media (max-width: 768px) {
                .twitter-feed {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Função para carregar tweets
    function loadTwitterFeed() {
        // Como não podemos acessar a API do Twitter diretamente, usaremos tweets simulados
        // Em um ambiente de produção, você usaria a API oficial do Twitter ou um serviço de terceiros
        
        setTimeout(() => {
            const tweetData = getSimulatedTweets();
            displayTweets(tweetData);
        }, 1500); // Simular tempo de carregamento
    }
    
    // Função para obter tweets simulados
    function getSimulatedTweets() {
        // Dados simulados de tweets sobre Bitcoin
        return [
            {
                id: '1',
                name: 'CoinDesk',
                username: '@CoinDesk',
                avatar: 'https://pbs.twimg.com/profile_images/1430879040156667904/NlbJjrqZ_400x400.jpg',
                content: 'Bitcoin ultrapassa US$ 80.000 enquanto investidores aguardam decisões de política monetária dos principais bancos centrais. #Bitcoin #Crypto',
                date: 'Hoje',
                likes: 245,
                retweets: 87,
                link: 'https://twitter.com/CoinDesk'
            },
            {
                id: '2',
                name: 'Binance',
                username: '@binance',
                avatar: 'https://pbs.twimg.com/profile_images/1736797776666517504/bTXizsUZ_400x400.png',
                content: 'O volume de negociação de #Bitcoin na Binance atingiu novos recordes esta semana. Veja nossa análise completa sobre o mercado de criptomoedas.',
                date: 'Hoje',
                likes: 532,
                retweets: 124,
                link: 'https://twitter.com/binance'
            },
            {
                id: '3',
                name: 'Michael Saylor',
                username: '@saylor',
                avatar: 'https://pbs.twimg.com/profile_images/1485632175932383235/8t0DGo6V_400x400.jpg',
                content: 'Bitcoin é a única propriedade digital escassa, imutável e soberana do mundo. É o dinheiro perfeito para o futuro digital da humanidade.',
                date: 'Ontem',
                likes: 1243,
                retweets: 421,
                link: 'https://twitter.com/saylor'
            },
            {
                id: '4',
                name: 'CZ 🔶 Binance',
                username: '@cz_binance',
                avatar: 'https://pbs.twimg.com/profile_images/1656399806213189633/XbN6Vn1r_400x400.jpg',
                content: 'Adoção institucional de #Bitcoin continua crescendo. Mais empresas estão adicionando BTC aos seus balanços como reserva de valor.',
                date: 'Ontem',
                likes: 876,
                retweets: 231,
                link: 'https://twitter.com/cz_binance'
            },
            {
                id: '5',
                name: 'Bitcoin Magazine',
                username: '@BitcoinMagazine',
                avatar: 'https://pbs.twimg.com/profile_images/1444022922377576453/AzvXYXGr_400x400.jpg',
                content: 'NOTÍCIA: Analistas preveem que o Bitcoin pode atingir US$ 100.000 até o final do ano, impulsionado pela adoção institucional e escassez pós-halving.',
                date: '2 dias atrás',
                likes: 1532,
                retweets: 487,
                link: 'https://twitter.com/BitcoinMagazine'
            },
            {
                id: '6',
                name: 'Willy Woo',
                username: '@woonomic',
                avatar: 'https://pbs.twimg.com/profile_images/1352158552657055744/UfNxX9hT_400x400.jpg',
                content: 'Dados on-chain mostram acumulação contínua de Bitcoin por investidores de longo prazo, apesar da volatilidade recente. Isso é extremamente bullish.',
                date: '2 dias atrás',
                likes: 654,
                retweets: 187,
                link: 'https://twitter.com/woonomic'
            }
        ];
    }
    
    // Função para exibir tweets
    function displayTweets(tweets) {
        const twitterFeed = document.getElementById('twitter-feed');
        if (!twitterFeed) return;
        
        // Limpar o conteúdo atual
        twitterFeed.innerHTML = '';
        
        // Adicionar cada tweet
        tweets.forEach(tweet => {
            const tweetCard = document.createElement('div');
            tweetCard.className = 'tweet-card';
            
            tweetCard.innerHTML = `
                <div class="tweet-header">
                    <div class="tweet-avatar">
                        <img src="${tweet.avatar}" alt="${tweet.name}" onerror="this.src='https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'">
                    </div>
                    <div class="tweet-user">
                        <p class="tweet-name">${tweet.name}</p>
                        <p class="tweet-username">${tweet.username}</p>
                    </div>
                </div>
                <div class="tweet-content">
                    ${tweet.content}
                </div>
                <div class="tweet-footer">
                    <span class="tweet-date">${tweet.date}</span>
                    <div class="tweet-actions">
                        <a href="${tweet.link}" target="_blank" title="Ver no Twitter">
                            <i class="fab fa-x-twitter"></i>
                        </a>
                    </div>
                </div>
            `;
            
            twitterFeed.appendChild(tweetCard);
        });
    }
});
