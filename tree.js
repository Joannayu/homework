const Person = require('./person.js');

class Tree {
	constructor(jsonObj) {
		this.theGreatAncestor = new Person(jsonObj);
	}

	findPersonByName(name) {
		return this.findPerson(this.theGreatAncestor, name);
	}

	findPerson(rootPerson, name) {
		let flattenArray = this.flattenTree(this.theGreatAncestor);
		return flattenArray.find( p => {
			return p.name === name;
		});
	}

	flattenTree(tree) {
		if (!tree) {
			return [];
		}

		let flattenArray = [];

		flattenArray.push(tree);
		flattenArray.push(...this.flattenTree(tree.spouse));
		tree.children.forEach(child =>  {
			flattenArray.push(...this.flattenTree(child));
		});

		return flattenArray;
	}
}

module.exports = Tree;