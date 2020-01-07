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

	getParents(person) {
		let flattenArray = this.flattenTree(this.theGreatAncestor);
		let parent = flattenArray.find(p => 
				p.children.find(child =>
					child.name === person.name
				)
			);
		return [parent, parent.spouse];	
	}

	getChildren(person) {
		return person.children;
	}

	getSiblings(person) {
		let parents = this.getParents(person);

		let parentsChildren = [];
		parents.forEach(p => {
			parentsChildren.push(...this.getChildren(p));
		});

		let siblings = parentsChildren.filter(p => p.name !== person.name);

		return siblings;
	}
}

module.exports = Tree;