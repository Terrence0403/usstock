const feedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://rss.nytimes.com/services/xml/rss/nyt/Business.xml';
const feedContainer = document.getElementById('nyt-feed');

fetch(feedUrl)
    .then(response => response.json())
    .then(data => {
        const items = data.items;
        items.forEach(item => {
            const listItem = document.createElement('li');

            // Extract title, link, description, and image
            const title = item.title;
            const link = item.link;
            const date = item.pubDate.split(' ')[0];
            const description = truncateText(stripHtml(item.description), 300); // Limit to 300 characters

            // Populate list item
            listItem.innerHTML = `
            <div>
            <a href="${link}" target="_blank">
            <h3>${title}</h3>
            <p>${description}</p>
            <h2>${date}</h2>
            </a>
            </div>
          `;
            feedContainer.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error fetching RSS feed:', error));

// Helper function to remove HTML tags
function stripHtml(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
}

// Helper function to truncate text
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}