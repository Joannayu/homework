var expect = require('chai').expect;
const Person = require('../person.js');

describe('should create person - ', function() {
	it ('should create with name', function () {
		let jsonObj = {
			name: 'Peter',
			gender: 'male'
		}

		let person = new Person(jsonObj);
		expect(person.name).to.equal('Peter');
		expect(person.gender).to.equal('male');
	});

	it ('should create with gender.', function () {
		let jsonObj = {
			name: 'Julie',
			gender: 'female'
		}

		let person = new Person(jsonObj);
		expect(person.name).to.equal('Julie');
		expect(person.gender).to.equal('female');
	});

	it('should create with spouse', function (){
		let jsonObj = {
			name: 'Mark',
			spouse: {
				name: 'Nancy'
			}
		}

		let person = new Person(jsonObj);
		expect(person.spouse instanceof Person).to.equal(true);
		expect(person.spouse.name).to.equal('Nancy');
	})

	it('should create with children', function () {
		let jsonObj = {
			name: 'Oscar',
			children: [{
				name: 'Peter',
			}, 
			{
				name: 'Ming Li'
			}]
		};

		let person = new Person(jsonObj);
		expect(person.children.length).to.equal(2);
		expect(person.children[1] instanceof Person).to.equal(true);
		expect(person.children[0].name).to.equal('Peter');
	})
});