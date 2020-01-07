var expect = require('chai').expect;
const sinon = require("sinon");
var CommandHandler = require('../command-handler.js');

describe('should create handler - ', function() {
	it ('create with context', function () {
		let familyTree = {
			name: 'Tim'
		};

		let commandHandler = new CommandHandler(familyTree);
		expect(commandHandler.context).to.not.be.undefined;
		expect(commandHandler.context).to.equal(familyTree);
	});

	it('should execute lines one by one', function () {
		let lines = 'line1 \n line2 \n line3';
		let commandHandler = new CommandHandler('');
		var commandSpy = sinon.spy(commandHandler, 'executeLine');

		commandHandler.execute(lines);

		expect(commandSpy.callCount).to.equal(3);
		expect(commandSpy.getCall(0).calledWithExactly('line1 ')).to.be.true;
	})

	it('should recognize and execute GET_RELATIONSHIP lines', function () {
		let line = 'GET_RELATIONSHIP someName Nephew';
		let commandHandler = new CommandHandler('');
		var commandSpy = sinon.spy(commandHandler, 'getRelationshipCommand');

		commandHandler.executeLine(line);

		expect(commandSpy.calledOnce).to.be.true;
		expect(commandSpy.calledWithExactly('someName', 'Nephew')).to.be.true;

	})

	it('should not call getRelationship for other command', function () {
		let command = 'SOME_RANDOM_COMMAND someName Nephew';
		let commandHandler = new CommandHandler('');
		var commandSpy = sinon.spy(commandHandler, 'getRelationshipCommand');

		commandHandler.executeLine(command);

		expect(commandSpy.notCalled).to.be.true;
	})
});