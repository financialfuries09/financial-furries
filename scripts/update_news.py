import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

FEEDS = [
    ("Moneycontrol", "https://www.moneycontrol.com/rss/latestnews.xml", "India"),
    ("Business Standard", "https://www.business-standard.com/rss/finance-103.rss", "India"),
    ("Mint", "https://www.livemint.com/rss/markets", "India"),
]

articles = []

for source, url, region in FEEDS:
    try:
        request = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0"}
        )

        with urllib.request.urlopen(request, timeout=20) as response:
            xml_data = response.read()

        root = ET.fromstring(xml_data)

        for item in root.findall(".//item")[:8]:
            title = item.findtext("title", "").strip()
            link = item.findtext("link", "").strip()
            description = item.findtext("description", "").strip()
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
    "articles": articles[:24]
}

with open("media-news.json", "w", encoding="utf-8") as file:
    json.dump(data, file, ensure_ascii=False, indent=2)

print(f"Saved {len(articles[:24])} media articles.")
