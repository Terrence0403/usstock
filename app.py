from flask import Flask, request, jsonify, render_template
import members as me
import stock_assistant as ai
import yahoofinance as yf



app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/topics')
def hot_topic():
    return render_template("hot-topic.html")

@app.route('/samples')
def samples():
    return render_template("samples.html")

@app.route('/member')
def member_page():
    return render_template("member_page.html")

@app.route('/insights')
def insights():
    return render_template("insights.html")

@app.route('/viewport')
def viewport():
    return render_template("viewport.html")

@app.route('/about')
def about():
    return render_template("about.html")

@app.route('/register_page')
def register_page():
    return render_template("register.html")

@app.route('/fetch-api-data',methods=['GET'])
def yahoo_finance():
    result = yf.fetch_api_data()
    return result
# user login
@app.route('/login/register', methods=['POST'])
def register():
    data = request.get_json()
    mem = me.Member()
    result = mem.register(data)
    mem.send_mail(result['username'], result['randomnum'])
    return jsonify(result)

# AI assistant
@app.route('/assistant', methods=['POST'])
def assistant():
    data = request.get_json()
    print(data)
    result = ai.assistant(data['message'])
    print(result)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
