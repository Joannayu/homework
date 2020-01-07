class Person {
	constructor(jsonObj) {
		this.name = jsonObj.name;
		this.gender = jsonObj.gender;

		if (jsonObj.spouse) {
			this.spouse = new Person(jsonObj.spouse);
		}

		this.children = [];
		if (jsonObj.children) {
			jsonObj.children.forEach(jsonChild => {
				this.children.push(new Person(jsonChild));
			});
		}
	}
};

module.exports = Person;