const Tree = require('./tree.js');


class CommandHandler {
	constructor (context) {
		this.context = context;
		this.tree = new Tree(context);
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
				this.getRelationshipHandler(params[1], params[2]);
				break;
			default: 
				return;
		}
	}

	getRelationshipHandler(name, relationshipType) {
		switch(relationshipType) {
			case 'Siblings': 
				this.getSiblingsHandler(name);
				break;
		}
	}

	getSiblingsHandler(name) {
		let person = this.tree.findPersonByName(name);
		if (!person) {
			console.log('PERSON_NOT_FOUND');
			return;
		}

		let siblingsArray = this.tree.getSiblings(person);
		let result = this.printPersonArray(siblingsArray);
		console.log(result);
	}

	printPersonArray(personArray) {
		return personArray.map(p => p.name).join(' ');
	}
}

module.exports = CommandHandler;