class Person {
	constructor(jsonObj, parent) {
		this.name = jsonObj.name;
		this.gender = jsonObj.gender;
		this.parent = parent;

		if (jsonObj.spouse) {
			this.spouse = new Person(jsonObj.spouse, undefined);
		}

		this.children = [];
		if (jsonObj.children) {
			jsonObj.children.forEach(jsonChild => {
				this.children.push(new Person(jsonChild, this));
			});
		}
	}
};

module.exports = Person;