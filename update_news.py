import json
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

OUT = Path("news.json")

# Google News RSS is used only to collect headlines/links. The website
# does not copy full articles. Readers are sent to the original publisher.
FEEDS = [
    ("Markets", "https://news.google.com/rss/search?" + urllib.parse.urlencode({
        "q": "stock market finance markets when:2d",
        "hl": "en-IN", "gl": "IN", "ceid": "IN:en"
    })),
    ("India", "https://news.google.com/rss/search?" + urllib.parse.urlencode({
        "q": "India economy business finance RBI markets when:2d",
        "hl": "en-IN", "gl": "IN", "ceid": "IN:en"
    })),
    ("Global", "https://news.google.com/rss/search?" + urllib.parse.urlencode({
        "q": "global economy business finance markets when:2d",
        "hl": "en-IN", "gl": "IN", "ceid": "IN:en"
    })),
    ("Personal Finance", "https://news.google.com/rss/search?" + urllib.parse.urlencode({
        "q": "personal finance investing savings taxes when:2d",
        "hl": "en-IN", "gl": "IN", "ceid": "IN:en"
    })),
]

def clean(text):
    text = re.sub(r"<[^>]+>", "", text or "")
    return re.sub(r"\s+", " ", text).strip()

def parse_date(value):
    if not value:
        return ""
    try:
        return parsedate_to_datetime(value).isoformat()
    except Exception:
        return value

def fetch(url, category):
    req = urllib.request.Request(url, headers={"User-Agent": "FinancialFurriesNewsBot/1.0"})
    with urllib.request.urlopen(req, timeout=20) as r:
        data = r.read()
    root = ET.fromstring(data)
    items = []
    for item in root.findall(".//item")[:12]:
        title = clean(item.findtext("title"))
        link = item.findtext("link") or ""
        description = clean(item.findtext("description"))
        pub = parse_date(item.findtext("pubDate"))
        source = item.findtext("source") or "News source"
        if not title or not link:
            continue
        items.append({
            "category": category,
            "title": title,
            "summary": description[:260],
            "url": link,
            "source": clean(source),
            "published": pub
        })
    return items

all_items = []
for category, url in FEEDS:
    try:
        all_items.extend(fetch(url, category))
    except Exception as exc:
        print(f"Feed failed: {category}: {exc}")

# Remove duplicates by title, keep the first occurrence.
seen = set()
unique = []
for item in all_items:
    key = re.sub(r"\W+", "", item["title"].lower())
    if key in seen:
        continue
    seen.add(key)
    unique.append(item)

# Keep the freshest 24 stories.
unique.sort(key=lambda x: x.get("published", ""), reverse=True)
unique = unique[:24]

payload = {
    "updated": datetime.now(timezone.utc).isoformat(),
    "articles": unique
}
OUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Wrote {len(unique)} news stories.")
