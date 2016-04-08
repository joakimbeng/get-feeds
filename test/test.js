import test from 'ava';
import getFeeds from '../src';

test('non string given', t => {
	t.throws(() => getFeeds({}), 'Expected html to be a string, but was: object');
});

test('html with no links', t => {
	const feeds = getFeeds('<html>Lorem ipsum</html>');
	t.truthy(Array.isArray(feeds));
	t.falsy(feeds.length);
});

test('html with a stylesheet link', t => {
	const feeds = getFeeds(`
		<html>
			<head>
				<link rel="stylesheet" href="main.css">
			</head>
			<body>
				Lorem ipsum
			</body>
		</html>
	`);
	t.truthy(Array.isArray(feeds));
	t.falsy(feeds.length);
});

test('html with an alternate non Atom/RSS/ActivityStream link', t => {
	const feeds = getFeeds(`
		<html>
			<head>
				<link rel="alternate" type="application/pdf" href="page.pdf">
			</head>
			<body>
				Lorem ipsum
			</body>
		</html>
	`);
	t.truthy(Array.isArray(feeds));
	t.falsy(feeds.length);
});

test('html with an alternate Atom link', t => {
	const feeds = getFeeds(`
		<html>
			<head>
				<link rel="alternate" type="application/atom" href="feed.atom">
			</head>
			<body>
				Lorem ipsum
			</body>
		</html>
	`);
	t.truthy(Array.isArray(feeds));
	t.truthy(feeds.length);
	t.is(feeds[0].href, 'feed.atom');
});

test('html with an alternate Atom + xml link', t => {
	const feeds = getFeeds(`
		<html>
			<head>
				<link rel="alternate" type="text/atom+xml" href="feed.xml">
			</head>
			<body>
				Lorem ipsum
			</body>
		</html>
	`);
	t.truthy(Array.isArray(feeds));
	t.truthy(feeds.length);
	t.is(feeds[0].href, 'feed.xml');
});

test('html with an alternate RSS link', t => {
	const feeds = getFeeds(`
		<html>
			<head>
				<link rel="alternate" type="text/rss" href="feed.rss">
			</head>
			<body>
				Lorem ipsum
			</body>
		</html>
	`);
	t.truthy(Array.isArray(feeds));
	t.truthy(feeds.length);
	t.is(feeds[0].href, 'feed.rss');
});

test('html with an alternate ActivityStream link', t => {
	const feeds = getFeeds(`
		<html>
			<head>
				<link rel="alternate" type="application/activitystream+json" href="feed.json">
			</head>
			<body>
				Lorem ipsum
			</body>
		</html>
	`);
	t.truthy(Array.isArray(feeds));
	t.truthy(feeds.length);
	t.is(feeds[0].href, 'feed.json');
});

test('html with an alternate RSS + xml link', t => {
	const feeds = getFeeds(`
		<html>
			<head>
				<link rel="alternate" type="application/rss+xml" href="feed.xml">
			</head>
			<body>
				Lorem ipsum
			</body>
		</html>
	`);
	t.truthy(Array.isArray(feeds));
	t.truthy(feeds.length);
	t.is(feeds[0].href, 'feed.xml');
});

test('html with a feed link with title attribute', t => {
	const [feed] = getFeeds(`
		<html>
			<head>
				<link rel="alternate" type="application/rss+xml" href="feed.xml" title="My feed">
			</head>
			<body>
				Lorem ipsum
			</body>
		</html>
	`);
	t.is(feed.title, 'My feed');
});

test('html with a title and a feed link without title attribute', t => {
	const [feed] = getFeeds(`
		<html>
			<head>
				<title>My blog</title>
				<link rel="alternate" type="application/rss+xml" href="feed.xml">
			</head>
			<body>
				Lorem ipsum
			</body>
		</html>
	`);
	t.is(feed.title, 'My blog');
});

test('html with both a title and a feed link with title attribute', t => {
	const [feed] = getFeeds(`
		<html>
			<head>
				<title>My blog</title>
				<link rel="alternate" type="application/rss+xml" href="feed.xml" title="My feed">
			</head>
			<body>
				Lorem ipsum
			</body>
		</html>
	`);
	t.is(feed.title, 'My feed');
});

test('html with a base tag and a feed', t => {
	const [feed] = getFeeds(`
		<html>
			<head>
				<base href="base/">
				<link rel="alternate" type="application/rss+xml" href="feed.xml" title="My feed">
			</head>
			<body>
				Lorem ipsum
			</body>
		</html>
	`);
	t.is(feed.href, 'base/feed.xml');
});

test('html with a base tag and a feed, given url option', t => {
	const [feed] = getFeeds(`
		<html>
			<head>
				<base href="base/">
				<link rel="alternate" type="application/rss+xml" href="feed.xml" title="My feed">
			</head>
			<body>
				Lorem ipsum
			</body>
		</html>
	`, {url: 'http://example.com'});
	t.is(feed.href, 'http://example.com/base/feed.xml');
});

test('multiple feeds', t => {
	const feeds = getFeeds(`
		<html>
			<head>
				<link rel="alternate" type="application/rss+xml" href="rss.xml" title="My feed">
				<link rel="alternate" type="application/atom+xml" href="atom.xml" title="My feed">
				<link rel="alternate" type="application/activitystream+json" href="feed.json" title="My feed">
			</head>
			<body>
				Lorem ipsum
			</body>
		</html>
	`);
	t.is(feeds.length, 3);
	t.is(feeds[0].href, 'rss.xml');
	t.is(feeds[1].href, 'atom.xml');
	t.is(feeds[2].href, 'feed.json');
	t.is(feeds[0].type, 'application/rss+xml');
	t.is(feeds[1].type, 'application/atom+xml');
	t.is(feeds[2].type, 'application/activitystream+json');
	t.is(feeds[0].title, 'My feed');
	t.is(feeds[1].title, 'My feed');
	t.is(feeds[2].title, 'My feed');
});
