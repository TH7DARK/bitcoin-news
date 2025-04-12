import sys
import json
import time
from datetime import datetime

sys.path.append('/opt/.manus/.sandbox-runtime')
from data_api import ApiClient

def fetch_bitcoin_data():
    client = ApiClient()
    
    # Obter dados do Bitcoin usando a API do Yahoo Finance
    bitcoin_data = client.call_api('YahooFinance/get_stock_chart', query={
        'symbol': 'BTC-USD',
        'region': 'US',
        'interval': '1d',
        'range': '1mo',
        'includeAdjustedClose': True
    })
    
    # Salvar dados brutos para análise posterior
    with open('bitcoin_raw_data.json', 'w') as f:
        json.dump(bitcoin_data, f, indent=2)
    
    # Processar dados para uso no frontend
    processed_data = process_data(bitcoin_data)
    
    # Salvar dados processados
    with open('bitcoin_processed_data.json', 'w') as f:
        json.dump(processed_data, f, indent=2)
    
    return processed_data

def process_data(data):
    result = data.get('chart', {}).get('result', [{}])[0]
    meta = result.get('meta', {})
    timestamps = result.get('timestamp', [])
    indicators = result.get('indicators', {})
    quote = indicators.get('quote', [{}])[0]
    
    # Extrair dados relevantes
    processed_data = {
        'symbol': meta.get('symbol'),
        'currency': meta.get('currency'),
        'regularMarketPrice': meta.get('regularMarketPrice'),
        'previousClose': meta.get('chartPreviousClose'),
        'fiftyTwoWeekHigh': meta.get('fiftyTwoWeekHigh'),
        'fiftyTwoWeekLow': meta.get('fiftyTwoWeekLow'),
        'regularMarketDayHigh': meta.get('regularMarketDayHigh'),
        'regularMarketDayLow': meta.get('regularMarketDayLow'),
        'regularMarketVolume': meta.get('regularMarketVolume'),
        'lastUpdated': datetime.now().strftime('%d/%m/%Y %H:%M:%S'),
        'priceChange': calculate_price_change(meta),
        'priceChangePercent': calculate_price_change_percent(meta),
        'historicalData': []
    }
    
    # Processar dados históricos para o gráfico
    for i in range(len(timestamps)):
        if i < len(quote.get('close', [])) and quote.get('close', [])[i] is not None:
            processed_data['historicalData'].append({
                'date': datetime.fromtimestamp(timestamps[i]).strftime('%d/%m/%Y'),
                'timestamp': timestamps[i],
                'open': quote.get('open', [])[i],
                'high': quote.get('high', [])[i],
                'low': quote.get('low', [])[i],
                'close': quote.get('close', [])[i],
                'volume': quote.get('volume', [])[i]
            })
    
    return processed_data

def calculate_price_change(meta):
    current_price = meta.get('regularMarketPrice', 0)
    previous_close = meta.get('chartPreviousClose', 0)
    return round(current_price - previous_close, 2)

def calculate_price_change_percent(meta):
    current_price = meta.get('regularMarketPrice', 0)
    previous_close = meta.get('chartPreviousClose', 0)
    if previous_close == 0:
        return 0
    return round(((current_price - previous_close) / previous_close) * 100, 2)

if __name__ == "__main__":
    print("Obtendo dados do Bitcoin...")
    bitcoin_data = fetch_bitcoin_data()
    print(f"Preço atual do Bitcoin: {bitcoin_data['regularMarketPrice']} {bitcoin_data['currency']}")
    print(f"Variação: {bitcoin_data['priceChange']} ({bitcoin_data['priceChangePercent']}%)")
    print(f"Dados salvos em bitcoin_processed_data.json")
