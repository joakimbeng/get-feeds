# get-feeds

[![Build status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![NPM version][npm-image]][npm-url] [![XO code style][codestyle-image]][codestyle-url]

> Get RSS/Atom/ActivityStream feeds from an HTML string

## Installation

Install `get-feeds` using [npm](https://www.npmjs.com/):

```bash
npm install --save get-feeds
```

## Usage

### Module usage

```javascript
const getFeeds = require('get-feeds');

const feeds = getFeeds(`
	<html>
		<head>
			<link rel="alternate" type="application/rss+xml" href="feed.xml" title="My feed">
		</head>
		<body>
			Lorem ipsum...
		</body>
	</html>
`, {
	url: 'http://the.location.of/the.html?used=for&absolute=urls'}
);
/*
[{
	type: 'application/rss+xml',
	title: 'My feed',
	href: 'http://the.location.of/feed.xml'
}]
```

## API

### `getFeeds(html, options)`

| Name | Type | Description |
|------|------|-------------|
| html | `String` | The HTML document to look for feeds in |
| options | `Object` | Options |

Returns: `Array` of [feed objects](#the-feed-object).

#### The Feed Object

A feed object has these properties:

| Property | Type | Description |
|------|------|-------------|
| title | `String` | The feed title or `<title>` if feed title is missing |
| href | `String` | The feed url, which takes any `<base>` tag and [`options.url`](#optionsurl) into account |
| type | `String` | The feed content type, e.g: `"application/atom+xml"` |

#### `options.url`

Type: `String`  

Should be the full URL of the HTML document, it's used to make feed URLs absolute.

## License

MIT © [Joakim Carlstein](http://joakim.beng.se)

[npm-url]: https://npmjs.org/package/get-feeds
[npm-image]: https://badge.fury.io/js/get-feeds.svg
[travis-url]: https://travis-ci.org/joakimbeng/get-feeds
[travis-image]: https://travis-ci.org/joakimbeng/get-feeds.svg?branch=master
[coveralls-url]: https://coveralls.io/github/joakimbeng/get-feeds?branch=master
[coveralls-image]: https://coveralls.io/repos/github/joakimbeng/get-feeds/badge.svg?branch=master
[codestyle-url]: https://github.com/sindresorhus/xo
[codestyle-image]: https://img.shields.io/badge/code%20style-XO-5ed9c7.svg?style=flat
