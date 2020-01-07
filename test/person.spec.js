var expect = require('chai').expect;
const Person = require('../person.js');

describe('should create a person', function() {
	it ('should create with no parameter',() => {
		 expect(() => new Person()).not.to.throw();
	});

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

	it('should create with parent', function () {
		let jsonObj = {
			name: 'Oscar',
			children: [{
				name: 'Peter',
			}, 
			{
				name: 'Ming Li'
			}]
		};

		let person = new Person (jsonObj);
		expect(person.children[0].parent).not.to.be.undefined;
		expect(person.parent).to.be.undefined;
		expect(person.children[0].parent.name).to.equal('Oscar');
	})
});

describe('check gender of a person', function () {
	it('should return true when person is male', function () {
		let person = new Person({
			gender: 'male'
		})

		expect(person.isMale()).to.be.true;
	})

	it('should return false when person is female', function () {
		let person = new Person({
			gender: 'female'
		})

		expect(person.isMale()).not.to.be.undefined;
		expect(person.isMale()).not.to.be.true;
	})
})