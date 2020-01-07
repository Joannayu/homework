const Person = require('./person.js');

class Tree {
	constructor(jsonObj) {
		this.theGreatAncestor = new Person(jsonObj);
	}

	findPersonByName(name) {
		let flattenArray = this.flattenTree(this.theGreatAncestor);
		return flattenArray.find( p => {
			return p.name === name;
		});
	}

	getParents(person) {
		if (person && person.parent) {
			return [person.parent, person.parent.spouse];
		}

		return [];
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

	getChildren(person) {
		if (!person) {
			return [];
		}
		return [...person.children, ...this.getSpouse(person).children]; // adding both parent's children.
	}

	getSiblings(person) {
		if(!person || !person.parent) {
			return [];
		}

		let parentsChildren = this.getChildren(person.parent);
		let siblings = parentsChildren.filter(p => p.name !== person.name);

		return siblings;
	}

	getSon(person) {
		let children = this.getChildren(person);
		return this.getMale(children);
	}

	getMale(personArray){
		return personArray.filter(p => p.gender === 'male');
	}

	getDaughter(person) {
		let children = this.getChildren(person);
		return this.getFemale(children);
	}

	getFemale(personArray) {
		return personArray.filter(p => p.gender === 'female');
	}

	getFather(person) {
		let parents = this.getParents(person);
		let fatherArray = this.getMale(parents);

		if (fatherArray.length === 1) {
			return fatherArray[0];
		}
	}

	getMother(person) {
		let parents = this.getParents(person);
		let motherArray = this.getFemale(parents);

		if (motherArray.length === 1) {
			return motherArray[0];
		}
	}

	getBrothers(person) {
		let siblings = this.getSiblings(person);
		let brothers = this.getMale(siblings);
		return brothers;
	}

	getSisters(person) {
		let siblings = this.getSiblings(person);
		let sisters = this.getFemale(siblings);
		return sisters;
	}

	getPaternalUncles(person) {
		let father = this.getFather(person);
		let brothersOfFather = this.getBrothers(father);
		return brothersOfFather;
	}
	
	getMaternalUncles(person) {
		let mother = this.getMother(person);
		let brothersOfMother = this.getBrothers(mother);
		return brothersOfMother;
	}

	getPaternalAunts(person) {
		let father = this.getFather(person);
		let sistersOfFather = this.getSisters(father);
		return sistersOfFather;
	}

	getMaternalAunt(person) {
		let mother = this.getMother(person);
		let sistersOfMother = this.getSisters(mother);
		return sistersOfMother;
	}

	getSpouse(person) {
		if (person.spouse) {
			return person.spouse;
		}

		let flattenArray = this.flattenTree(this.theGreatAncestor);
		return flattenArray.find(p => {
			return p.spouse && p.spouse.name === person.name;
		});
	}

	getSistersOfSpouse(person) {
		let spouse = this.getSpouse(person);
		let sisters = this.getSisters(spouse);
		return sisters;
	}

	getSpouseOfSiblings(person) {
		let siblings = this.getSiblings(person);
		let spouses = [];

		siblings.forEach(p => {
			spouses.push(this.getSpouse(p));
		});

		return spouses;
	}

	getWivesOfSiblings(person) {
		let spousesOfSiblings = this.getSpouseOfSiblings(person);
		return this.getFemale(spousesOfSiblings);
	}

	getSisterInLaw(person) {
		let sistersOfSpouse = this.getSistersOfSpouse(person);
		let getWivesOfSiblings = this.getWivesOfSiblings(person);

		return [...sistersOfSpouse, ...getWivesOfSiblings];
	}

	getBrothersOfSpouse(person) {
		let spouse = this.getSpouse(person);
		let brothers = this.getBrothers(spouse);
		return brothers;
	}

	getHusbandsOfSiblings(person) {
		let spousesOfSiblings = this.getSpouseOfSiblings(person);
		return this.getMale(spousesOfSiblings);
	}

	getBrotherInLaw(person) {
		let brothersOfSpouse = this.getBrothersOfSpouse(person);
		let husbandsOfSiblings = this.getHusbandsOfSiblings(person);
		
		return [...brothersOfSpouse, ...husbandsOfSiblings];
	}

	addChild(motherName, childName, gender) {
		let mother = this.findPersonByName(motherName);

		// add child to the original member of King Arthur's family to keep the tree clean.
		if (this.isOriginalFamilyMember(mother)) {
			this.addChildToPerson(mother, childName, gender);
			return;
		}

		let spouse = this.getSpouse(mother);
		this.addChildToPerson(spouse, childName, gender);
	}

	// private
	addChildToPerson(person, childName, gender) {
		let child = new Person({
				name: childName,
				gender: gender.toLowerCase()
			}, person);

		person.children.push(child);
	}

	// private
	isOriginalFamilyMember(person) {
		if (person.children && person.children.length > 0) {
			return true;
		}

		if (person.parent) {
			return true;
		}
		return false;
	}
}

module.exports = Tree;