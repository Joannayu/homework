var expect = require('chai').expect;
var sinon = require('sinon');
var Person = require('../person.js');
var Tree = require('../tree.js');
var CommandHandler = require('../command-handler.js');

describe('should create handler ', function() {
	it ('create with context', function () {
		let familyTree = {
			name: 'Tim'
		};

		let commandHandler = new CommandHandler(familyTree);
		expect(commandHandler.context).to.not.be.undefined;
		expect(commandHandler.context).to.equal(familyTree);
	});
});

describe('analyze command: ',function () {
	let commandHandler;

	beforeEach(function () {
		let familyTree = {
			name: 'Tim'
		}
		commandHandler = new CommandHandler(familyTree);
	})

	it('should recognize lines of command', function () {
		let lines = 'line1 \n line2 \n line3';
		var commandSpy = sinon.spy(commandHandler, 'executeLine');

		commandHandler.execute(lines);

		expect(commandSpy.callCount).to.equal(3);
		expect(commandSpy.getCall(0).calledWithExactly('line1 ')).to.be.true;

		commandSpy.restore();
	})

	it('should recognize GET_RELATIONSHIP command', function () {
		let line = 'GET_RELATIONSHIP someName Nephew';
		var commandSpy = sinon.spy(commandHandler, 'getRelationshipHandler');

		commandHandler.executeLine(line);

		expect(commandSpy.calledOnce).to.be.true;
		expect(commandSpy.calledWithExactly('someName', 'Nephew')).to.be.true;

		commandSpy.restore();

	})

	it('should recognize when it\'s not GET_RELATIONSHIP command' , function () {
		let command = 'SOME_RANDOM_COMMAND someName Nephew';
		var commandSpy = sinon.spy(commandHandler, 'getRelationshipHandler');

		commandHandler.executeLine(command);

		expect(commandSpy.notCalled).to.be.true;

		commandSpy.restore();
	})
});

describe('handle command: GET_RELATIONSHIP', function () {
	var sandbox;
	var siblingsStub;
	var commandHandler;

	beforeEach(function() {
		sandbox = sinon.createSandbox();
		commandHandler = new CommandHandler({name: 'person1'});
   		siblingsStub = sandbox.stub(commandHandler, 'getSiblingsHandler');
  	});

	it('should recognize \'siblings\' relationship', function () {

		commandHandler.getRelationshipHandler('John', 'Siblings');
		expect(siblingsStub.calledOnce).to.be.true;
	})

	it('should recognize when it\'s not \'siblings\' relationship', function () {
		commandHandler.getRelationshipHandler('John', 'Neighbor');
		expect(siblingsStub.notCalled).to.be.true;
	})

	afterEach(function() {
		sandbox.restore();
	});
})

describe ('handle command for each relationship type', function () {
	var sandbox;
	beforeEach(function() {
		sandbox = sinon.createSandbox();
   		sandbox.stub(console, 'log'); //.callThrough();
  	});

	it('should handle siblings relationship', function () {
		let siblingsArray = [
			new Person({name: 'person1'}), 
			new Person({name: 'person2'}), 
			new Person({name: 'person3'})
		];

		let commandHandler = new CommandHandler({name : 'personX'});
		sandbox.stub(commandHandler.tree, 'findPersonByName').returns(new Person({name: 'person0'}));
		sandbox.stub(commandHandler.tree, 'getSiblings').returns(siblingsArray);

		commandHandler.getSiblingsHandler('person0');

		expect(console.log.calledOnce).to.be.true;
  		expect(console.log.calledWith('person1 person2 person3')).to.be.true;
  	});

	it('should output \'PERSON_NOT_FOUND\' when the given name is not found', function () {
		let commandHandler = new CommandHandler({name : 'personX'});
		sandbox.stub(commandHandler.tree, 'findPersonByName').returns(undefined);

		commandHandler.getSiblingsHandler('person0');

		expect(console.log.callCount).to.be.equal(1);
  		expect(console.log.getCall(0).args[0]).to.be.equal('PERSON_NOT_FOUND');
	})

	afterEach(function() {
		sandbox.restore();
	});
});