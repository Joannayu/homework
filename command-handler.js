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

		switch(params[0]) {
			case 'GET_RELATIONSHIP': {
				if (params.length < 3) return;
				this.getRelationship(params[1], params[2]);
				break;
			}
				
			case 'ADD_CHILD':
				if (params.length < 4) return;
				this.addChild(params[1], params[2], params[3]);
				break;
			default: 
				return;
		}
	}

	addChild(motherName, childName, gender) {
		let person = this.tree.findPersonByName(motherName);

		if (!person) {
			console.log('PERSON_NOT_FOUND');
			return;
		}

		if (person.isMale()) {
			console.log('CHILD_ADDITION_FAILED');
			return;
		}

		this.tree.addChild(motherName, childName, gender);
		console.log('CHILD_ADDITION_SUCCEEDED');
		return;

	}

	getRelationship(name, relationshipType) {
		let person = this.tree.findPersonByName(name);
		
		// if person not found
		if (!person) {
			console.log('PERSON_NOT_FOUND');
			return;
		}

		let result = this.getRelationshipForPerson(person, relationshipType);

		if (!result || result.length === 0) {
			console.log('NONE');
			return;
		}

		let printableResult = result.map(p => p.name).join(' ');
		console.log(printableResult);
	}

	getRelationshipForPerson(person, relationshipType) {
		let result = [];
		switch(relationshipType) {
			case 'Siblings': 
				result = this.tree.getSiblings(person);
				break;
			case 'Daughter':
				result = this.tree.getDaughter(person);
				break;
			case 'Son':
				result = this.tree.getSon(person);
				break;
			case 'Brother-In-Law':
				result = this.tree.getBrotherInLaw(person);
				break;
			case 'Sister-In-Law': 
				result = this.tree.getSisterInLaw(person);
				break;
			case 'Maternal-Aunt':
				result = this.tree.getMaternalAunt(person);
				break;
			case 'Paternal-Aunt':
				result = this.tree.getPaternalAunts(person);
				break;
			case 'Maternal-Uncle':
				result = this.tree.getMaternalUncles(person);
				break;
			case 'Paternal-Uncle':
				result = this.tree.getPaternalUncles(person);
				break;
			default:
				result = [];
		}

		return result;
	}

}

module.exports = CommandHandler;