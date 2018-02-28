var _ = require('lodash');
var fs = require('fs');
var seedRandom = require('seed-random');

/**
* Generate a project name from a given hash
* @param {string} [hash] The hash to generate the name from
* @param {Object} [options] Additional options
* @param {string} [options.hash] Alternate way to specify the hash
* @param {boolean} [options.alliterative=false] Generated name should be alliterative (e.g. 'wicked wombat')
* @param {string|array} [options.adjectives] A word list of adjectives, if this is a string the file path specified will be processed as JSON
* @param {string|array} [options.nouns] A word list of nouns, if this is a string the file path specified will be processed as JSON
* @param {function} [options.sampler] Function called as `(list, settings)` to return a random choice from a word list
* @param {function} [options.samplerAlliterative] Function called as `(list, settings, firstChar)` to return a random choice from a word list, limited by alliteration
* @param {function} [options.mapper] Additional transforms to apply on a per-word basis to the output
* @param {string} [options.joiner=' '] String sequence to join the generated terms by
* @param {string} [options.transformer] Function to run the whole generated phrase though before returning
*/
module.exports = function(hash, options) {
	// Argument mangling {{{
	if (_.isObject(hash)) {
		options = hash;
		hash = undefined;
	}
	// }}}

	var settings = _.defaults(options, {
		hash,
		alliterative: false,
		adjectives: `${__dirname}/data/adjectives.json`,
		nouns: `${__dirname}/data/nouns.json`,
		sampler: (list, settings) => list[Math.floor(settings.getRandom() * list.length)],
		samplerAlliterative: (list, settings, firstChar) => {
			var choice;
			while (true) {
				choice = list[Math.floor(settings.getRandom() * list.length)];
				if (choice.startsWith(firstChar)) return choice;
			}
		},
		mapper: word => word,
		joiner: ' ',
		transformer: phrase => phrase,
		// getRandom - computed later from hash
	});

	// Setup a random hash if we don't already have one
	if (settings.hash === undefined) settings.hash = Date.now();

	// Initialize the randomizer
	settings.getRandom = seedRandom(settings.hash);

	// Read in wordlists {{{
	var wordList = {};
	['nouns', 'adjectives'].forEach(w => {
		if (_.isString(settings[w])) { // Read as file source
			wordList[w] = JSON.parse(fs.readFileSync(settings[w], 'utf-8'));
		} else if (_.isArray(settings[w])) { // Read as raw array
			wordList[w] = settings[w];
		} else {
			throw new Error(`Unknown wordlist type for "${w}"`);
		}
	})
	// }}}

	// Generate combinations {{{
	var adjective = settings.sampler(wordList.adjectives, settings);
	var noun = settings.alliterative ? settings.samplerAlliterative(wordList.nouns, settings, adjective.substr(0, 1)) : settings.sampler(wordList.nouns, settings);

	return settings.transformer(
		[adjective, noun]
			.map(settings.mapper)
			.join(settings.joiner)
	)
	// }}}
};
