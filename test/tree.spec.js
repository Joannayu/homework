const Person = require('../person.js');
const expect = require('chai').expect;
const Tree = require('../tree.js');

describe('construct a tree', function () {
	it('should create a tree with Json', function () {
		const jsonTree = {
			name: 'grandpa'
		};

		let tree = new Tree(jsonTree);
		expect(tree.theGreatAncestor.name).to.equal('grandpa');
		expect(tree.theGreatAncestor).to.be.an.instanceof(Person);
	})
});