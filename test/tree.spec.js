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

describe('inquiries on a tree', function () {
	describe('find person by name', function () {
			const jsonTree = {
			name: 'Mike',
			gender: 'male',

			children: [{
				name: 'Christina',
				gender: 'female',
				children: [{
					name: 'Yvonne',
					gender: 'female'
				}]
			}, {
				name: 'Stephan',
				gender: 'male'
			}
			], 
			spouse: {
				name: 'Yanni',
				gender: 'female'
			}
		};

		let tree = new Tree(jsonTree);
		it('should find person info in root by name', function () {
			let target = tree.findPersonByName('Mike');
			expect(target).to.not.be.undefined;
			expect(target.gender).to.equal('male');
		});

		it('should find person in its children', function () {
			let target = tree.findPersonByName('Stephan');
			expect(target).to.not.be.undefined;
			expect(target.gender).to.equal('male');
		})

		it('should find person in its spouse', function () {
			let target = tree.findPersonByName('Yanni');
			expect(target).to.not.be.undefined;
			expect(target.gender).to.equal('female');
		})

		it('should be able to find the person in the third layer', function () {
			let target = tree.findPersonByName('Yvonne');
			expect(target).to.not.be.undefined;
			expect(target.gender).to.equal('female');
		})
	});
});