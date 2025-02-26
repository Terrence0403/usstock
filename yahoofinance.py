from flask import Flask, request, jsonify, render_template
import yfinance as yf

def fetch_api_data():
    symbol = request.args.get('symbol', '').strip()
    print(f"Fetching data for symbol: {symbol}")
    
    try:
        stock = yf.Ticker(symbol)
        recommendations = stock.recommendations
        hist = stock.history(period='1y')
        info = stock.info  # get stock info
        
        print("Raw recommendations data:")
        print(recommendations)
        
        # reset data
        data = {
            'ratings': {
                'buy': 0,
                'hold': 0,
                'sell': 0,
                'highTarget': None,
                'avgTarget': None,
                'lowTarget': None
            },
            'stock_data': {
                'dates': hist.index.strftime('%Y-%m-%d').tolist(),
                'prices': hist['Close'].tolist()
            }
        }
        
        if recommendations is not None and not recommendations.empty:
            latest_rec = recommendations.iloc[0]
            print("Latest recommendation:", latest_rec)
            
            # update data   
            data['ratings']['buy'] = int(latest_rec.get('strongBuy', 0) + latest_rec.get('buy', 0))
            data['ratings']['hold'] = int(latest_rec.get('hold', 0))
            data['ratings']['sell'] = int(latest_rec.get('sell', 0) + latest_rec.get('strongSell', 0))
            
            # update target prices
            data['ratings']['highTarget'] = info.get('targetHighPrice')
            data['ratings']['avgTarget'] = info.get('targetMeanPrice')
            data['ratings']['lowTarget'] = info.get('targetLowPrice')

        print(f"Processed data:", data)
        return jsonify(data)
        
    except Exception as e:
        print(f"Error processing {symbol}: {str(e)}")
        return jsonify({'error': str(e)}), 500
