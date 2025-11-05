import os, time, hashlib, requests, feedparser, sys
from datetime import datetime, timezone

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE = os.environ.get("SUPABASE_SERVICE_ROLE")
TABLE = "items"

def upsert_item(item):
    url = f"{SUPABASE_URL}/rest/v1/{TABLE}"
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }
    data = {
        "source": item.get("source"),
        "title": item.get("title"),
        "url": item.get("url"),
        "summary": item.get("summary"),
        "published_at": item.get("published_at")
    }
    r = requests.post(url, headers=headers, json=data, params={"on_conflict": "url"})
    if r.status_code not in (200, 201, 204):
        print("Failed upsert:", r.status_code, r.text, file=sys.stderr)

def parse_time(entry):
    # Try several fields for published date
    for k in ("published_parsed", "updated_parsed"):
        t = entry.get(k)
        if t:
            return datetime(*t[:6], tzinfo=timezone.utc).isoformat()
    return None

def main():
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE:
        raise SystemExit("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE envs")

    feeds = []
    with open(os.path.join(os.path.dirname(__file__), "feeds.txt")) as f:
        feeds = [line.strip() for line in f if line.strip() and not line.strip().startswith("#")]

    for feed_url in feeds:
        print("Fetching", feed_url)
        parsed = feedparser.parse(feed_url)
        source_title = parsed.feed.get("title", feed_url)
        for e in parsed.entries[:50]:
            item = {
                "source": source_title,
                "title": e.get("title") or "(no title)",
                "url": e.get("link"),
                "summary": (e.get("summary") or e.get("description") or "")[:500],
                "published_at": parse_time(e),
            }
            if not item["url"]:
                continue
            upsert_item(item)
        time.sleep(1)

if __name__ == "__main__":
    main()
