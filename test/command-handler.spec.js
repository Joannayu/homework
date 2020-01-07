var expect = require('chai').expect;
var sinon = require('sinon');
var Person = require('../person.js');
var Tree = require('../tree.js');
var CommandHandler = require('../command-handler.js');

describe('should create command handler ', function() {
	it ('create with context', function () {
		let familyTree = {
			name: 'Tim'
		};

		let commandHandler = new CommandHandler(familyTree);
		expect(commandHandler.context).to.not.be.undefined;
		expect(commandHandler.context).to.equal(familyTree);
		expect(commandHandler.tree).not.to.be.undefined;
	});
});

describe('analyze command: ',function () {
	let commandHandler;
	let sandbox;

	beforeEach(function () {
		let familyTree = {
			name: 'Tim'
		}
		sandbox = sinon.createSandbox();
		commandHandler = new CommandHandler(familyTree);
	})

	it('should execute multiple lines of command', function () {
		let lines = 'line1 \n line2 \n line3';
		var executeLineStub = sandbox.stub(commandHandler, 'executeLine');

		commandHandler.execute(lines);

		expect(executeLineStub.callCount).to.equal(3);
		expect(executeLineStub.getCall(0).calledWithExactly('line1 ')).to.be.true;
	})

	it('should execute GET_RELATIONSHIP command', function () {
		let line = 'GET_RELATIONSHIP someName Nephew';
		var getRelationshipStub = sandbox.stub(commandHandler, 'getRelationship');

		commandHandler.executeLine(line);

		expect(getRelationshipStub.calledOnce).to.be.true;
		expect(getRelationshipStub.calledWithExactly('someName', 'Nephew')).to.be.true;
	})

	it('should not execute GET_RELATIONSHIP when parameters are not enough', function () {
		let line = 'GET_RELATIONSHIP someName';
		var getRelationshipStub = sandbox.stub(commandHandler, 'getRelationship');

		expect(() => commandHandler.executeLine(line)).not.to.throw(); // executeLine is being called;

		expect(getRelationshipStub.notCalled).to.be.true;
	})


	it('should execute ADD_CHILD command', function () {
		let line = 'ADD_CHILD Flora Minerva Female';
		var addChildStub = sandbox.stub(commandHandler, 'addChild');

		commandHandler.executeLine(line);

		expect(addChildStub.calledOnce).to.be.true;
		expect(addChildStub.calledWithExactly('Flora', 'Minerva', 'Female')).to.be.true;
	})

	it('should not execute ADD_CHILD when parameters are not enough', function () {
		let line = 'ADD_CHILD Flora Minerva';
		var addChildStub = sandbox.stub(commandHandler, 'addChild');

		expect(() => commandHandler.executeLine(line)).not.to.throw(); // executeLine is being called;

		expect(addChildStub.notCalled).to.be.true;
	})

	it('should not execute undefined command' , function () {
		let command = 'SOME_RANDOM_COMMAND someName Nephew';
		var getRelationshipStub = sandbox.stub(commandHandler, 'getRelationship');

		commandHandler.executeLine(command);

		expect(getRelationshipStub.notCalled).to.be.true;
	})

	afterEach(() => {
		sandbox.restore();
	})
});

describe('execute GET_RELATIONSHIP', function () {
	describe('for each type', function () {
		var sandbox;
		var commandHandler;

		beforeEach(function() {
			sandbox = sinon.createSandbox();
			commandHandler = new CommandHandler({name: 'someAncestor'});
	  	});


		it('daughter', function() {
			let person = 'personX';
			let daughter = 'daughterResult';
			let daughterStub = sandbox.stub(commandHandler.tree, 'getDaughter')
				.withArgs(person)
				.returns(daughter);

			let result = commandHandler.getRelationshipForPerson(person, 'Daughter');

			expect(daughterStub.calledOnce).to.be.true;
			expect(result).to.be.equal(daughter);
		});

		it('siblings', function () {
			let siblings = 'siblingsResult'
			let person = 'personX';

			let siblingsStub = sandbox.stub(commandHandler.tree, 'getSiblings')
				.withArgs(person)
				.returns(siblings);

			let result = commandHandler.getRelationshipForPerson(person, 'Siblings');

			expect(siblingsStub.calledOnce).to.be.true;
			expect(result).to.be.equal(siblings);

		})

		it('son', function () {
			let son = 'sonResult';
			let person = 'person';
			let sonStub = sandbox.stub(commandHandler.tree, 'getSon')
				.withArgs(person)
				.returns(son);

			let result = commandHandler.getRelationshipForPerson(person, 'Son');

			expect(sonStub.calledOnce).to.be.true;
			expect(result).to.be.equal(son);
		})

		it('brother-in-law', function () {
			let brotherInLaw = 'brotherInLawResult';
			let person = 'person';

			let brotherInLawStub = sandbox.stub(commandHandler.tree, 'getBrotherInLaw')
				.withArgs(person)
				.returns(brotherInLaw);

			let result = commandHandler.getRelationshipForPerson(person, 'Brother-In-Law');

			expect(brotherInLawStub.calledOnce).to.be.true;
			expect(result).to.be.equal(brotherInLaw);
		})

		it('sister-in-law', function () {
			let sisterInLaw = 'sisterInLawResult';
			let person = 'person';

			let sisterInLawStub = sandbox.stub(commandHandler.tree, 'getSisterInLaw')
				.withArgs(person)
				.returns(sisterInLaw);

			let result = commandHandler.getRelationshipForPerson(person, 'Sister-In-Law');

			expect(sisterInLawStub.calledOnce).to.be.true;
			expect(result).to.be.equal(sisterInLaw);
		})

		it('maternal-aunt', function () {
			let maternalAunt = 'maternalAuntResult';
			let person = 'person';

			let maternalAuntStub = sandbox.stub(commandHandler.tree, 'getMaternalAunt')
				.withArgs(person)
				.returns(maternalAunt);

			let result = commandHandler.getRelationshipForPerson(person, 'Maternal-Aunt');

			expect(maternalAuntStub.calledOnce).to.be.true;
			expect(result).to.be.equal(maternalAunt);
		})

		it('paternal-aunt', function () {
			let paternalAunt = 'paternalAuntResult';
			let person = 'person';

			let paternalAuntStub = sandbox.stub(commandHandler.tree, 'getPaternalAunts')
				.withArgs(person)
				.returns(paternalAunt);

			let result = commandHandler.getRelationshipForPerson(person, 'Paternal-Aunt');

			expect(paternalAuntStub.calledOnce).to.be.true;
			expect(result).to.be.equal(paternalAunt);
		})

		it('maternal-uncle', function () {
			let maternalUncle = 'maternalUncleResult';
			let person = 'person';

			let maternalUncleStub = sandbox.stub(commandHandler.tree, 'getMaternalUncles')
				.withArgs(person)
				.returns(maternalUncle);

			let result = commandHandler.getRelationshipForPerson(person, 'Maternal-Uncle');

			expect(maternalUncleStub.calledOnce).to.be.true;
			expect(result).to.be.equal(maternalUncle);
		})

		it('paternal-uncle', function () {
			let paternalUncle = 'paternalUncleResult';
			let person = 'person';

			let paternalUncleStub = sandbox.stub(commandHandler.tree, 'getPaternalUncles')
				.withArgs(person)
				.returns(paternalUncle);

			let result = commandHandler.getRelationshipForPerson(person, 'Paternal-Uncle');

			expect(paternalUncleStub.calledOnce).to.be.true;
			expect(result).to.be.equal(paternalUncle);
		})

		it('undefined relationship type', function () {
			let person = 'person';
			let paternalUncleStub = sandbox.stub(commandHandler.tree, 'getPaternalUncles')

			let result = commandHandler.getRelationshipForPerson(person, 'Something-Random-Type');

			expect(paternalUncleStub.notCalled).to.be.true;
			expect(result.length).to.equal(0);

		})

		afterEach(function() {
			sandbox.restore();
		});
	})

	describe('output format check ', function () {

		beforeEach(function() {
			sandbox = sinon.createSandbox();
   			sandbox.stub(console, 'log')//;.callThrough();
   			commandHandler = new CommandHandler({name: 'someAncestor'});
  		});

		it('should separate names with space in the result', function () {

			let personArray = 
			[
				{ name: 'Nancy'}, 
				{ name: 'June' },
				{ name: 'Cindy'}
			];

			sandbox.stub(commandHandler.tree, 'findPersonByName').returns(new Person({name: 'personX'}));
			sandbox.stub(commandHandler, 'getRelationshipForPerson').returns(personArray);

			commandHandler.getRelationship('name', 'relationshipType');
			
			expect(console.log.calledOnce).to.be.true;
  			expect(console.log.calledWith('Nancy June Cindy')).to.be.true;
		})

		it('should print \'NONE for empty result', function () {
			let resultArray = [];
			sandbox.stub(commandHandler.tree, 'findPersonByName').returns(new Person({name: 'personX'}));
			sandbox.stub(commandHandler, 'getRelationshipForPerson').returns(resultArray);

			commandHandler.getRelationship('name', 'relationshipType');

			expect(console.log.calledOnce).to.be.true;
			expect(console.log.calledWith('NONE')).to.be.true;

		})

		it('should print PERSON_NOT_FOUND for non-existing name', function () {
			sandbox.stub(commandHandler.tree, 'findPersonByName')
				.returns(undefined);

			commandHandler.getRelationship('name', 'relationshipType');

			expect(console.log.calledOnce).to.be.true;
			expect(console.log.calledWith('PERSON_NOT_FOUND')).to.be.true;
		})


		afterEach(function() {
			sandbox.restore();
		});
	})
})

describe('execute ADD_CHILD', function () {
	var sandbox;
	var commandHandler;
	beforeEach(() => {
		sandbox = sinon.createSandbox();
		commandHandler = new CommandHandler({name: 'somePerson'});
		sandbox.stub(console, 'log');//.callThrough();
	});

	it('should print success message for success', function () {
		let findPersonStub = sandbox.stub(commandHandler.tree, 'findPersonByName').returns(new Person());
		let addChildStub = sandbox.stub(commandHandler.tree, 'addChild');

		commandHandler.addChild('motherName', 'childName', 'male');

		expect(console.log.calledOnce).to.be.true;
		expect(console.log.calledWithExactly('CHILD_ADDITION_SUCCEEDED')).to.be.true;
  		expect(addChildStub.calledWithExactly('motherName', 'childName', 'male')).to.be.true;
  		expect(findPersonStub.calledOnce).to.be.true;
  		expect(addChildStub.calledOnce).to.be.true;
	});

	it('should print fail message when mother turns out to be male', function () {
		let person = new Person({
				name: 'Peter Parker',
				gender: 'male'
			});
		let findPersonStub = sandbox.stub(commandHandler.tree, 'findPersonByName')
			.withArgs('maleName')
			.returns(person);
		let addChildStub = sandbox.stub(commandHandler.tree, 'addChild');
		let isMaleStub = sandbox.stub(person, 'isMale').returns(true);

		commandHandler.addChild('maleName', 'childName', 'female');

		expect(console.log.calledOnce).to.be.true;
		expect(console.log.calledWithExactly('CHILD_ADDITION_FAILED')).to.be.true;
		expect(findPersonStub.calledOnce).to.be.true;
		expect(addChildStub.notCalled).to.be.true;
		expect(isMaleStub.calledOnce).to.be.true;
	});

	it('should print PERSON_NOT_FOUND when mother name is not found', function () {
		let findPersonStub = sandbox.stub(commandHandler.tree, 'findPersonByName').returns(undefined);
		let addChildStub = sandbox.stub(commandHandler.tree, 'addChild');

		commandHandler.addChild('motherName', 'childName', 'male');

		expect(console.log.calledOnce).to.be.true;
  		expect(console.log.calledWith('PERSON_NOT_FOUND')).to.be.true;
  		expect(findPersonStub.calledOnce).to.be.true;
  		expect(addChildStub.notCalled).to.be.true;
	})

	afterEach(() => {
		sandbox.restore();
	});
})