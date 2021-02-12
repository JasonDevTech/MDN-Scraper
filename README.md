# MDN Scraper

Searches [MDN](https://developer.mozilla.org/) for JavaScript built-in objects, statements, expressions and more.

![npm](https://img.shields.io/npm/v/mdn-scraper?style=for-the-badge) ![npm](https://img.shields.io/npm/dt/mdn-scraper?style=for-the-badge) ![CircleCI](https://img.shields.io/circleci/build/github/SemperFortis/MDN-Scraper?style=for-the-badge&token=0b3904d32e7714eccf6b8c06c38b39100f550061) ![Maintenance](https://img.shields.io/maintenance/yes/2021?style=for-the-badge)

## Installation
```bash
$ npm install mdn-scraper
```

## Usage
### CommonJS require
```javascript
const search = require("mdn-scraper").default;

// This must be in an async function
const result = await search("String.split");

console.log(result);
```
### ES6 import
```javascript
import search from "mdn-scraper";

// This must be in an async function
const result = await search("String.split");

console.log(result);
```
