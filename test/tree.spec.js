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

describe('find person by name on a tree', function () {
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
	it('should find person without parent', function () {
		let target = tree.findPersonByName('Mike');
		expect(target).to.not.be.undefined;
		expect(target.gender).to.equal('male');
	});

	it('should find person as a child', function () {
		let target = tree.findPersonByName('Stephan');
		expect(target).to.not.be.undefined;
		expect(target.gender).to.equal('male');
	})

	it('should find person as a spouse', function () {
		let target = tree.findPersonByName('Yanni');
		expect(target).to.not.be.undefined;
		expect(target.gender).to.equal('female');
	})

	it('should find person as a grandchild', function () {
		let target = tree.findPersonByName('Yvonne');
		expect(target).to.not.be.undefined;
		expect(target.gender).to.equal('female');
	})
});

describe('get relationship', function() {

	var tree;
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

	beforeEach(() => {
		tree = new Tree(jsonTree);
	})

	it('parents', function () {

		let person = new Person({name: 'Christina'});
		let parentsArray = tree.getParents(person);

		expect(parentsArray).to.not.be.undefined;
		expect(parentsArray.length).to.be.equal(2);

		expect(parentsArray).to.include(tree.theGreatAncestor.spouse);
		expect(parentsArray).to.include(tree.theGreatAncestor);

	})

	it('children', function () {
		let person = new Person(jsonTree);
		let childrenArray = tree.getChildren(person);
		expect(childrenArray).to.equal(person.children);	
	})

	it('siblings', function () {
		let person = new Person({name: 'Christina'});
		let siblingsArray = tree.getSiblings(person);

		expect(siblingsArray.length).to.be.equal(1);
		expect(siblingsArray).to.include(tree.theGreatAncestor.children[1]);
	})
});