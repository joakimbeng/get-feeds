'use strict';
const url = require('url');
const cheerio = require('cheerio');

const FEED_TYPES = /^((application|text)\/(atom|rss)|application\/activitystream)/i;

module.exports = exports = function (html, options) {
	options = options || {};
	if (typeof html !== 'string') {
		throw new TypeError(`Expected html to be a string, but was: ${typeof html}`);
	}
	let baseUrl = options.url || '';
	const $ = cheerio.load(html);
	const base = $('base').first().attr('href');
	const title = $('title').first().text();

	if (base) {
		baseUrl = url.resolve(baseUrl, base);
	}

	const feeds = [];

	$('link[rel=alternate]').each(function () {
		const link = $(this);
		const type = link.attr('type');
		if (type && FEED_TYPES.test(type)) {
			feeds.push({
				title: link.attr('title') || title,
				type,
				href: url.resolve(baseUrl, link.attr('href'))
			});
		}
	});

	return feeds;
};
