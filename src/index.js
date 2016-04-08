'use strict';
const url = require('url');
const cheerio = require('cheerio');

const FEED_TYPES = /^((application|text)\/(atom|rss)|application\/activitystream)/i;
const NON_LETTERS = /\W/g;
const LEADING_NON_LETTERS = /^\W+/;
const NONSENSE_TITLES = /^(feed|(rss|atom)\d*)$/;

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
				title: getTitle(link, title),
				type,
				href: url.resolve(baseUrl, link.attr('href'))
			});
		}
	});

	return feeds;
};

function getTitle(link, documentTitle) {
	const titleAttr = link.attr('title') || '';
	if (!titleAttr) {
		return documentTitle;
	}
	if (!documentTitle) {
		return titleAttr;
	}
	if (LEADING_NON_LETTERS.test(titleAttr)) {
		return `${documentTitle.trim()} ${titleAttr.trim()}`;
	}
	const nonLettersRemoved = titleAttr.toLowerCase().replace(NON_LETTERS, '');
	if (NONSENSE_TITLES.test(nonLettersRemoved)) {
		return documentTitle;
	}
	return titleAttr;
}
