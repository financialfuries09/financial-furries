# Financial Furries Daily News

This add-on adds an automatically refreshed Daily Financial News section.

Files:
- `script.js` — displays the daily news section and keeps the existing article/admin functionality.
- `news.json` — generated news data.
- `scripts/update_news.py` — collects headlines and links from Google News RSS searches.
- `.github/workflows/daily-news.yml` — runs daily at 09:00 IST and commits the updated `news.json`.

Important:
- The site displays headlines, short feed summaries, source names, and links.
- It does not copy full news articles.
- News availability depends on the public RSS/search feeds.
- GitHub Actions must be enabled for the daily update to run.
