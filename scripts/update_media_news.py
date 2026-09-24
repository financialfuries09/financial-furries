import json
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from html import unescape
import re

FEEDS = [
    ("Google News - Indian Finance", "https://news.google.com/rss/search?q=Indian+stock+market+finance&hl=en-IN&gl=IN&ceid=IN:en", "India"),
    ("Google News - Moneycontrol", "https://news.google.com/rss/search?q=Moneycontrol+India+finance&hl=en-IN&gl=IN&ceid=IN:en", "India"),
    ("Google News - Global Finance", "https://news.google.com/rss/search?q=global+financial+markets&hl=en&gl=US&ceid=US:en", "Global"),
]

articles = []

for source, url, region in FEEDS:
    try:
        request = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0"}
        )

        with urllib.request.urlopen(request, timeout=30) as response:
            xml_data = response.read()

        root = ET.fromstring(xml_data)

        for item in root.findall(".//item")[:10]:
            title = unescape(item.findtext("title", "").strip())
            link = item.findtext("link", "").strip()
            description = unescape(item.findtext("description", "").strip())
            pub_date = item.findtext("pubDate", "").strip()

            description = re.sub(r"<[^>]+>", "", description)
            description = re.sub(r"\s+", " ", description).strip()

            if title and link:
                articles.append({
                    "title": title,
                    "description": description[:300],
                    "link": link,
                    "source": source,
                    "region": region,
                    "date": pub_date
                })

    except Exception as error:
        print(f"Could not load {source}: {error}")

data = {
    "updated": datetime.now(timezone.utc).isoformat(),
    "articles": articles[:30]
}

with open("media-news.json", "w", encoding="utf-8") as file:
    json.dump(data, file, ensure_ascii=False, indent=2)

print(f"Saved {len(articles[:30])} media articles.")
