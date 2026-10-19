"""Verify public HTTPS responses after GitHub Pages deploys (standard library only)."""
from html.parser import HTMLParser
import time
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

ORIGIN = "https://wangsculpture.com"


class RobotsMeta(HTMLParser):
    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        if tag == "meta" and attributes.get("name", "").lower() in ("robots", "googlebot"):
            content = attributes.get("content", "").lower()
            assert "noindex" not in content and "nofollow" not in content, "Blocking robots meta"


def fetch(path):
    url = ORIGIN + path
    with urlopen(Request(url, headers={"User-Agent": "Portfolio-deployment-check/1.0"}), timeout=25) as response:
        assert response.status == 200, f"{url}: HTTP {response.status}"
        assert response.url == url, f"{url} redirected to {response.url}"
        blocking = response.headers.get("X-Robots-Tag", "").lower()
        assert "noindex" not in blocking and "nofollow" not in blocking, f"{url}: blocking X-Robots-Tag"
        return response.read().decode("utf-8"), response.headers.get_content_type()


def verify():
    xml, content_type = fetch("/sitemap.xml")
    assert content_type in ("application/xml", "text/xml"), content_type
    assert xml.startswith('<?xml version="1.0" encoding="UTF-8"?>'), "Missing XML declaration"
    sitemap = ET.fromstring(xml)
    assert sitemap.tag == "{http://www.sitemaps.org/schemas/sitemap/0.9}urlset", "Response is not a sitemap"
    urls = [node.text for node in sitemap.findall("{*}url/{*}loc")]
    assert len(urls) == len(set(urls)) and len(urls) > 5, "Empty or duplicate sitemap"
    assert all(url.startswith(ORIGIN + "/") and "?" not in url and "#" not in url for url in urls)
    for path in ("/", "/works/", "/about/", "/cv/", "/contact/", "/works/somira/"):
        assert ORIGIN + path in urls, f"Missing {path}"
    robots, content_type = fetch("/robots.txt")
    assert content_type == "text/plain", content_type
    assert "User-agent: *" in robots and "Allow: /" in robots
    assert f"Sitemap: {ORIGIN}/sitemap.xml" in robots
    assert not any(line.lower().startswith("disallow:") and line.split(":", 1)[1].strip() for line in robots.splitlines())
    for path in ("/", "/works/", "/works/somira/"):
        html, content_type = fetch(path)
        assert content_type == "text/html", content_type
        RobotsMeta().feed(html)
    print(f"PASS: {ORIGIN}/sitemap.xml returns HTTP 200, valid XML, {len(urls)} unique production URLs, no redirects or blocking headers.")
    print(f"PASS: {ORIGIN}/robots.txt returns HTTP 200, plain text, allows crawling and declares the sitemap.")
    print("PASS: homepage, Works and Somira return HTTP 200 without blocking robots meta or headers.")


for attempt in range(12):
    try:
        verify()
        break
    except Exception as error:
        if attempt == 11:
            raise
        print(f"Waiting for production propagation ({attempt + 1}/12): {error}", flush=True)
        time.sleep(10)
