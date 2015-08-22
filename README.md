Dependencies scraper
====================

A web scraper that given a URL to a site, crawls all pages on the same domain and lists their static dependencies (CSS, JS, PDF) as well as links to other pages on the same domain.

_This was a programming challenge for an interview._

Setup
-----

1. Install [node](http://nodejs.org).
2. Run `npm install` in the root directory of the project to install dependencies.


Using the crawler
-------------------

`node index [URL] [filename]` starts the crawler at the specified `URL`, storing the JSON output in `filename`. Both parameters are required.


Output format
-------------

```json
[{
  "url": "http://example.org",
  "links": ["http://example.org/about", "..."],
  "assets": ["http://example.org/main.css", "..."]
},{
  "url": "http://example.org/about",
  "links": ["http://example.org/team"],
  "assets": ["..."]
}]
```
