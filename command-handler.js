const Tree = require('./tree.js');


class CommandHandler {
	constructor (context) {
		this.context = context;
	}

	execute(lines) {
		let lineArray = lines.split('\n');

		for(let line of lineArray){
			this.executeLine(line);
		}
	}

	executeLine(line) {
		let params = line.split(' ');
		if (params.length < 3) {
			return;
		}

		switch(params[0]) {
			case 'GET_RELATIONSHIP': 
				this.getRelationshipCommand(params[1], params[2]);
				break;
			default: 
				return;
		}
	}

	getRelationshipCommand(name, relationshipType) {
		console.log('hello this is getRelationshipCommand');
	}
}

module.exports = CommandHandler;