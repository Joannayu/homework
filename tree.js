const Person = require('./person.js');

class Tree {
	constructor(jsonObj) {
		this.theGreatAncestor = new Person(jsonObj);
	}
}

module.exports = Tree;