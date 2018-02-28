var expect = require('chai').expect;
var hrn = require('..');
var mlog = require('mocha-logger');

describe('hashed-release-name', function() {

	it('should generate a release name from a limited array set', ()=> {
		expect(hrn({
			adjectives: ['foo'],
			nouns: ['bar'],
		})).to.equal('foo bar');
	});

	it('should generate a release name from an array set', ()=> {
		expect(hrn({
			sampler: list => list[1], // Always choose the second option
			adjectives: ['foo', 'bar', 'baz'],
			nouns: ['quz', 'quzz', 'qux'],
			joiner: '-',
			transformer: phrase => phrase.toUpperCase(),
		})).to.equal('BAR-QUZZ');
	});

	it('should generate a release name that is alliterative', ()=> {
		var generated = Array.apply(null, Array(10)).map(i => // Fill an array with choices
			hrn({
				alliterative: true,
				adjectives: ['fruity', 'batty', 'chalky'],
				nouns: ['foo', 'bar', 'baz', 'cheese', 'quz'],
			})
		);

		mlog.log('generated:', generated.join(', '));
		expect(generated).to.satisfy(i => i.every(choice => choice.split(' ')[0].substr(0, 1) == choice.split(' ')[1].substr(0, 1)));
	});

	it('should generate a release name from the full wordlists', ()=> {
		expect(hrn()).to.be.an('string');
	});

	it('should generate an alliterative release name from the full wordlists', ()=> {
		var generated = Array.apply(null, Array(10)).map(i => // Fill an array with choices
			hrn({alliterative: true})
		);

		mlog.log('generated:', generated.join(', '));
		expect(generated).to.satisfy(i => i.every(choice => choice.split(' ')[0].substr(0, 1) == choice.split(' ')[1].substr(0, 1)));
	});

	it('should generate a consistant alliterative release name when given a hash', ()=> {
		var generated = hrn({alliterative: true, hash: 123});
		var generated2 = hrn({alliterative: true, hash: 123});

		expect(generated).to.be.a('string');
		expect(generated2).to.be.deep.equal(generated);
	});

});
