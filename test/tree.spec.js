const Person = require('../person.js');
const expect = require('chai').expect;
const Tree = require('../tree.js');
var sinon = require('sinon');

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

describe('find person by name in the tree', function () {
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
		}], 
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

	it('should return undefined when person is not founnd', function () {
		let target = tree.findPersonByName('Alien');
		expect(target).to.be.undefined;
	})
});

describe('get relationship in the tree', function() {

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
	var sandbox;

	beforeEach(() => {
		tree = new Tree(jsonTree);
		sandbox = sinon.createSandbox();
	})

	describe('parents', function () {
		it('parents', function () {
			let person = new Person({
				name: 'Christina',
				spouse: {
					name: 'Peter'
				},
				children: [{
					name: 'Angela',
					spouse: {
						name: 'Mike'
					}
				}]
			});
			let parentsArray = tree.getParents(person.children[0]);

			expect(parentsArray).to.not.be.undefined;
			expect(parentsArray.length).to.be.equal(2);
			expect(parentsArray[0] instanceof Person).to.be.true;
			expect([parentsArray[0].name, parentsArray[1].name]).to.include.members(['Christina', 'Peter']);
		})

		it('should return [] when no parents are found', function () {
			let person = new Person({
				name: 'Christina',
				spouse: {
					name: 'Peter'
				},
				children: [{
					name: 'Angela',
					spouse: {
						name: 'Mike'
					}
				}]
			});
			let parentsArray = tree.getParents(person);
			expect(parentsArray).to.not.be.undefined;
			expect(parentsArray.length).to.equal(0);
		})
	})
	



	it('children', function () {
		let person = new Person(jsonTree);
		let children = 'children'; 
		let getChildrenStub = sandbox.stub(person, 'children').get(() => children);

		let result = tree.getChildren(person);

		expect(result).to.equal(children);	
	})

	it('siblings', function () {
		let person = new Person({name: 'Christina'});
		let parent1 = {name: 'Mike'};
		let parent2 = {name: 'Yanni'};

		let getParentsStub = sandbox.stub(tree, 'getParents')
			.withArgs(person)
			.returns([parent1, parent2]);

		let getChildrenStub = sandbox.stub(tree, 'getChildren');
		getChildrenStub.withArgs(parent1).returns([{
			name: 'Christina',
			gender: 'female'
		}, {
			name: 'Stephan', 
			gender: 'male'
		}]);

		getChildrenStub.withArgs(parent2).returns([]);

		let siblingsArray = tree.getSiblings(person);

		expect(siblingsArray.length).to.be.equal(1);
		expect(siblingsArray[0].name).to.equal('Stephan');
	})

	it('son', function () {
		let person = new Person(jsonTree);
		let childrenStub = sandbox.stub(tree, 'getChildren')
			.withArgs(person)
			.returns([{
				name: 'child1',
				gender: 'male'
			}, {
				name: 'child2',
				gender: 'female'
		}]);

		let son = tree.getSon(person);
		expect(son.length).to.equal(1);
		expect(son[0].name).to.equal('child1');

	})

	it('daughter', function () {
		let person = new Person ({
			name: 'person'
		});
		let childrenStub = sandbox.stub(tree, 'getChildren')
			.withArgs(person)
			.returns([{
				name: 'child1',
				gender: 'male'
			}, {
				name: 'child2',
				gender: 'female'
			}]);

		let daughter = tree.getDaughter(person);
		expect(daughter.length).to.equal(1);
		expect(daughter[0].name).to.equal('child2');
	})

	it('father', function () {
		let person = new Person({
			name: 'person'
		});

		let getParentsStub = sandbox.stub(tree, 'getParents')
			.withArgs(person)
			.returns([{
				name: 'father_Mike',
				gender: 'male'
			}, {
				name: 'mother_Lucy',
				gender: 'female'
			}]);

		let father = tree.getFather(person);
		expect(father.name).to.equal('father_Mike');
	});

	it('mother', function () {
		let person = new Person({
			name: 'person'
		});

		let getParentsStub = sandbox.stub(tree, 'getParents')
			.withArgs(person)
			.returns([{
				name: 'father_Mike',
				gender: 'male'
			}, {
				name: 'mother_Lucy',
				gender: 'female'
			}]);

		let father = tree.getMother(person);
		expect(father.name).to.equal('mother_Lucy');
	});

	it('brothers', function () {
		let person = new Person({
			name: 'person'
		})

		let getSiblingsStub = sandbox.stub(tree, 'getSiblings')
			.withArgs(person)
			.returns([{
				name: 'Helen',
				gender: 'female'
			}, {
				name: 'Mike',
				gender: 'male'
			}, {
				name: 'lucy',
				gender: 'female'
			}, {
				name: 'Justin',
				gender: 'male'
			}]);
		let brothers = tree.getBrothers(person);
		expect(brothers.length).to.equal(2);

		let brotherNames = brothers.map(p => p.name);
		expect(brotherNames).to.include('Justin');
		expect(brotherNames).to.include('Mike');
	})

	it('sisters', function () {
		let person = new Person({
			name: 'person'
		});
		let getSiblingsStub = sandbox.stub(tree, 'getSiblings')
			.withArgs(person)
			.returns([{
				name: 'Helen',
				gender: 'female'
			}, {
				name: 'Mike',
				gender: 'male'
			}, {
				name: 'Lucy',
				gender: 'female'
			}, {
				name: 'Justin',
				gender: 'male'
			}]);
		let sisters = tree.getSisters(person);
		expect(sisters.length).to.equal(2);

		let sisterNames = sisters.map(p => p.name);
		expect(sisterNames).to.include('Helen');
		expect(sisterNames).to.include('Lucy');
	})

	it('paternal-uncles', function () {
		let person = 'person';
		let father = 'father';
		let brothers = ['brother1', 'brother2'];

		let getFatherStub = sandbox.stub(tree, 'getFather')
			.withArgs(person)
			.returns(father);
		let getBrothersStub = sandbox.stub(tree, 'getBrothers')
			.withArgs(father)
			.returns(brothers);

		let paternalUncles = tree.getPaternalUncles(person);

		expect(paternalUncles).to.equal(brothers);
	})

	it('maternal-uncles', function () {
		let person = 'person';
		let mother = 'mother';
		let brothers = ['brother1', 'super-bro2'];

		let getMotherStub = sandbox.stub(tree, 'getMother')
			.withArgs(person)
			.returns(mother);

		let getBrothersStub = sandbox.stub(tree, 'getBrothers')
			.withArgs(mother)
			.returns(brothers);

		let maternalUncles = tree.getMaternalUncles(person);
		expect(maternalUncles).to.equal(brothers);
	});

	it('paternal-aunt', function () {
		let person = 'person';
		let father = 'father';
		let sisters = ['sis1', 'super-sis2'];

		let getFatherStub = sandbox.stub(tree, 'getFather')
			.withArgs(person)
			.returns(father);

		let getSistersStub = sandbox.stub(tree, 'getSisters')
			.withArgs(father)
			.returns(sisters);

		let paternalAunt = tree.getPaternalAunts(person);
		expect(paternalAunt).to.equal(sisters);
	})

	it('maternal-aunt', function () {
		let person = 'person';
		let mother = 'mother';
		let sisters = ['sis1', 'super-sis2'];

		let getMotherStub = sandbox.stub(tree, 'getMother')
			.withArgs(person)
			.returns(mother);
		let getSistersStub = sandbox.stub(tree, 'getSisters')
			.withArgs(mother)
			.returns(sisters);

		let maternalAunt = tree.getMaternalAunt(person);
		expect(maternalAunt).to.equal(sisters);
	})

	describe('spouse', function () {
		it('when spouse is in first layer', function () {
			let person = {
				name: 'Yanni'
			};

			let spouse = tree.getSpouse(person);
			expect(spouse.name).to.equal('Mike');
		})

		it('when finding the spouse of an original member of the family tree', function () {
			let person = new Person ({
					name: 'Nancy',
					spouse: {
						name: 'Louis'
					}
				});
			let spouse = tree.getSpouse(person);
			expect(spouse.name).to.equal('Louis');
		})

		it('when spouse may be undefined before hitting on the correct target', function () {
			let person = {
				name: 'Yanni',
				spouse: {
					name: 'Justin'
				},
				children: [{
					name: 'Nancy',
					spouse: {
						name: 'Louis'
					}
				}]
			};

			tree = new Tree(person);
			let spouse = tree.getSpouse({name: 'Louis'});
			expect(spouse.name).to.equal('Nancy');
		})
	})
	

	it('spouse\'s sisters', function () {
		let person = 'person';
		let spouse = 'spouse';
		let sisters = ['sis1', 'sis2'];

		let getSpouseStub = sandbox.stub(tree, 'getSpouse')
			.withArgs(person)
			.returns(spouse);
		let getSistersStub = sandbox.stub(tree, 'getSisters')
			.withArgs(spouse)
			.returns(sisters);

		let spousesSisters = tree.getSistersOfSpouse(person);
		expect(spousesSisters).to.equal(sisters);
	})

	it('wives of siblings', function () {

		// given person
		let person = 'person';
		let siblings = ['Mike', 'Helen', 'Daisy', 'Dan'];
		let wife1 = {name: 'wife1', gender: 'female'};
		let wife2 = {name: 'wife2', gender: 'female'};

		// set up get siblings stub
		let getSiblingsStub = sandbox.stub(tree, 'getSiblings')
			.withArgs(person)
			.returns(siblings);

		// set up get spouse stub.
		let getSpouseStub = sandbox.stub(tree, 'getSpouse');
		getSpouseStub.withArgs('Mike').returns(wife1);
		getSpouseStub.withArgs('Helen').returns({name: 'husband1', gender: 'male'});
		getSpouseStub.withArgs('Daisy').returns({name: 'husband2', gender: 'male'});
		getSpouseStub.withArgs('Dan').returns(wife2);

		// when
		let wivesOfSiblings = tree.getWivesOfSiblings(person);

		// expect
		expect(wivesOfSiblings.length).to.equal(2);
		expect(wivesOfSiblings).to.include(wife1);
		expect(wivesOfSiblings).to.include(wife2);
	});

	it('sister-in-law', function () {
		let person = 'person';
		let sistersArray = ['Helen', 'Daisy', 'Christina'];
		let wivesArray = ['Oliver', 'Sue'];
		let getSistersOfSpouseStub = sandbox.stub(tree, 'getSistersOfSpouse')
			.withArgs(person)
			.returns(sistersArray);

		let getWivesOfSiblingsStub = sandbox.stub(tree, 'getWivesOfSiblings')
			.withArgs(person)
			.returns(wivesArray);

		let sisterInLaw = tree.getSisterInLaw(person);

		expect(sisterInLaw).to.include.members([...sistersArray, ...wivesArray]);
	})

	it('spouse\'s brothers', function () {
		let person = 'person';
		let spouse = 'spouse';
		let brothers = ['bro1', 'bro2'];

		let getSpouseStub = sandbox.stub(tree, 'getSpouse')
			.withArgs(person)
			.returns(spouse);
		let getBrothersStub = sandbox.stub(tree, 'getBrothers')
			.withArgs(spouse)
			.returns(brothers);

		let spousesBrothers = tree.getBrothersOfSpouse(person);
		expect(spousesBrothers).to.equal(brothers);
	})

	it('husbands of siblings', function () {

		// given person
		let person = 'person';
		let siblings = ['Mike', 'Helen', 'Daisy', 'Dan'];

		let wife1 = {name: 'wife1', gender: 'female'};
		let wife2 = {name: 'wife2', gender: 'female'};
		let husband1 = {name: 'husband1', gender: 'male'};
		let husband2 = {name: 'husband2', gender: 'male'};

		// set up get siblings stub
		let getSiblingsStub = sandbox.stub(tree, 'getSiblings')
			.withArgs(person)
			.returns(siblings);

		// set up get spouse stub.
		let getSpouseStub = sandbox.stub(tree, 'getSpouse');
		getSpouseStub.withArgs('Mike').returns(wife1);
		getSpouseStub.withArgs('Helen').returns(husband1);
		getSpouseStub.withArgs('Daisy').returns(husband2);
		getSpouseStub.withArgs('Dan').returns(wife2);

		// when
		let husbandsOfSiblings = tree.getHusbandsOfSiblings(person);

		// expect
		expect(husbandsOfSiblings.length).to.equal(2);
		expect(husbandsOfSiblings).to.include.members([husband1, husband2]);
	})

	it('brother-in-law', function () {
		let person = 'person';
		let brothersArray = ['Tim', 'Peter', 'Ellen'];
		let husbandsArray = ['Mike', 'David'];
		let getBrothersOfSpouseStub = sandbox.stub(tree, 'getBrothersOfSpouse')
			.withArgs(person)
			.returns(brothersArray);

		let getHusbandsOfSiblings = sandbox.stub(tree, 'getHusbandsOfSiblings')
			.withArgs(person)
			.returns(husbandsArray);

		let brotherInLaw = tree.getBrotherInLaw(person);

		expect(brotherInLaw).to.include.members([...brothersArray, ...husbandsArray]);
	})
	
	afterEach(function() {
		sandbox.restore();
	});
});

describe('add child', function () {
	var sandbox;
	beforeEach(() => {
		sandbox = sinon.createSandbox();
	});

	it('add child by given the name of an origianl family member', function () {
		let tree = new Tree();
		let person = new Person({
			name: 'Lily',
			children: [{
				name: 'Nancy'
			}, {
				name: 'Mark'
			}]
		});
		let spouse = new Person ({
			name: 'Peter'
		})
		sandbox.stub(tree, 'findPersonByName').withArgs('Lily').returns(person);
		sandbox.stub(tree, 'getSpouse').withArgs(person).returns(spouse);
		sandbox.stub(tree, 'isOriginalFamilyMember').withArgs(person).returns(true);

		tree.addChild('Lily', 'Angela', 'female');
		expect(person.children.length).to.equal(3);
		expect(person.children.map(p => p.name)).to.include('Angela');
		expect(spouse.children.length).to.equal(0);
	})

	it('add child by given the spouse\'s name of an original family member', function () {
		let tree = new Tree();
		let spouse = new Person({
			name: 'Peter',
			children: [{
				name: 'Nancy'
			}, {
				name: 'Mark'
			}]
		});
		let person = new Person ({
			name: 'Lily'
		})

		sandbox.stub(tree, 'findPersonByName').withArgs('Lily').returns(person);
		sandbox.stub(tree, 'getSpouse').withArgs(person).returns(spouse);
		sandbox.stub(tree, 'isOriginalFamilyMember').withArgs(person).returns(false);

		tree.addChild('Lily', 'Angela', 'female');
		expect(spouse.children.length).to.equal(3);
		expect(spouse.children.map(p => p.name)).to.include('Angela');
		expect(person.children.length).to.equal(0);
	})

	it('formatting: should always save lowercase gender info when adding to a spouse', function () {
		let tree = new Tree();
		let spouse = new Person({
			name: 'Peter',
			children: [{
				name: 'Nancy'
			}, {
				name: 'Mark'
			}]
		});
		let person = new Person ({
			name: 'Lily'
		})

		sandbox.stub(tree, 'findPersonByName').withArgs('Lily').returns(person);
		sandbox.stub(tree, 'getSpouse').withArgs(person).returns(spouse);
		sandbox.stub(tree, 'isOriginalFamilyMember').withArgs(person).returns(false);

		tree.addChild('Lily', 'Angela', 'Female')

		expect(spouse.children.find(p => p.name === 'Angela').gender).to.equal('female');
	})	

	it('formatting: should always save lowercase gender info when adding to the original family member', function () {
		let tree = new Tree();
		let person = new Person({
			name: 'Lily',
			children: [{
				name: 'Nancy'
			}, {
				name: 'Mark'
			}]
		});
		let spouse = new Person ({
			name: 'Peter'
		})
		sandbox.stub(tree, 'findPersonByName').withArgs('Lily').returns(person);
		sandbox.stub(tree, 'getSpouse').withArgs(person).returns(spouse);
		sandbox.stub(tree, 'isOriginalFamilyMember').withArgs(person).returns(true);

		tree.addChild('Lily', 'Angela', 'Female')

		expect(person.children.find(p => p.name === 'Angela').gender).to.equal('female');
	})	

	describe('is original member', function () {
		it('if they have children', function () {
			let tree = new Tree();
			let person = new Person({
				name: 'someone',
				children: ['child1', 'child2', 'child3']
			});
			let result = tree.isOriginalFamilyMember(person);

			expect(result).to.be.true;
		})

		it('if they have parents ', function () {
			let tree = new Tree();
			let person = new Person({
				name: 'someone',
			}, new Person());
			let result = tree.isOriginalFamilyMember(person);

			expect(result).to.be.true;
		})

		it('is not original member if they don\'t have parents or children info', function () {
			let tree = new Tree();
			let person = new Person({
				name: 'someone',
				gender: 'male'
			});
			let result = tree.isOriginalFamilyMember(person);

			expect(result).to.be.false;
		})
	})
	
})