// Yahoo Finance RSS Feed

const rssUrl = 'https://corsproxy.io/?https://finance.yahoo.com/rss/';

async function fetchRSS() {
    try {
        const response = await fetch(rssUrl);
        const text = await response.text();

        // Parse the XML
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        const items = Array.from(xml.querySelectorAll("item"));

        // Extract articles
        const articles = items.map(item => ({
            title: item.querySelector("title").textContent,
            link: item.querySelector("link").textContent,
            date: item.querySelector("pubDate").textContent.split('T')[0],
            source: item.querySelector("source") ? item.querySelector("source").textContent : ""
        }));

        // Randomize and pick 10 articles
        const random20Articles = articles.sort(() => Math.random() - 0.5).slice(0, 10);
        // Display articles
        displayArticles(random20Articles);
        // Display all articles
        displayInsightsArticles(articles);
    } catch (error) {
        console.error("Error fetching RSS feed:", error);
        document.getElementById("rss-feed").innerHTML = "<p>Failed to load articles. Please try again later.</p>";
        document.getElementById("insights-feed").innerHTML = "<p>Failed to load articles. Please try again later.</p>";
    }
}

function displayArticles(articles) {
    const rss = document.getElementById("rss-feed");
    rss.innerHTML = ""; // Clear previous content

    articles.forEach(article => {
        const articleDiv = document.createElement("div");
        articleDiv.className = "article";

        articleDiv.innerHTML = `
            <a href="${article.link}" target="_blank">
            <h2>${article.source}</h2>
            <h3>${article.title}</h3>
            <h2>${article.date}</h2></a>
        `;

        rss.appendChild(articleDiv);
    });
}

function displayInsightsArticles(articles) {
    const rss = document.getElementById("insights-feed");
    rss.innerHTML = ""; // Clear previous content

    articles.forEach(article => {
        const articleDiv = document.createElement("div");
        articleDiv.className = "article";

        articleDiv.innerHTML = `
            <a href="${article.link}" target="_blank">
            <h2>${article.source}</h2>
            <h3>${article.title}</h3>
            <h2>${article.date}</h2></a>
        `;

        rss.appendChild(articleDiv);
    });
}

// Fetch and display RSS feed on page load
fetchRSS();
