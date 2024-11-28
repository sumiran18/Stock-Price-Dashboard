from flask import Flask, jsonify
from flask_cors import CORS  # Import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)  # Enable CORS for the Flask app

@app.route('/api/news')
def get_news():
    url = "https://www.cnbc.com/world/?region=world"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    
    # Find the top headlines (adjust the selector based on actual HTML structure)
    headlines = soup.find_all('a', class_='LatestNews-headline')[:3]
    
    news = []
    for headline in headlines:
        title = headline.get_text()
        link = headline['href']
        news.append({"title": title, "link": link, "description": "Sample description for this headline."})
    
    return jsonify(news)

if __name__ == '__main__':
    app.run(debug=True)
