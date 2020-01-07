
const familyTree = {
	name: 'King Arthur',
	gender: 'male',
	spouse: {
		name: 'Queen Margret',
		gender: 'female'

	},
	children: [
	{
		name: 'Bill',
		gender: 'male',
		spouse: {
			name:'Flora', 
			gender: 'female'
		},
		children: [{
			name: 'Victoire',
			gender: 'female',
			spouse: {
				name: 'Ted',
				gender: 'male'
			},
			children: [{
				name: 'Remus',
				gender: 'male',
			}]
		},
		{
			name: 'Dominique',
			gender: 'female',
		}, {
			name: 'Louis',
			gendle: 'male'
		}],
	},
	{
		name: 'Charlie',
		gender: 'male'
	},
	{
		name: 'Percy',
		gender: 'male',
		spouse: {
			name: 'Audrey',
			gender: 'female'
		},
		children: [{
			name: 'Molly',
			gender: 'female',
		}, {
			name: 'Lucy',
			gendle: 'female'
		}]
	}, 
	{
		name: 'Ronald',
		gender: 'male',
		spouse: {
			name: 'Helen',
			gender: 'female'
		},
		children: [{
			name: 'Rose',
			gender: 'female',
			spouse: {
				name: 'Malfoy',
				gender: 'male'
			},
			children: [{
				name: 'Draco',
				gender: 'male'
			}, {
				name: 'Aster',
				gender: 'female'
			}]
		},
		{
			name: 'Hugo',
			gender: 'male'
		}]
	},
	{
		name: 'Ginerva',
		gender: 'female',
		spouse: {
			name: 'Harry',
			gender: 'male'
		},
		children: [{
			name: 'James',
			gender: 'male',
			spouse: {
				name: 'Darcy',
				gender: 'female',
			},
			children: [{
				name: 'William',
				gender: 'male',
			}]
		},{
			name: 'Albus',
			spouse: {
				name: 'Alice',
				gender: 'female',
			},
			gender: 'male',
			children: [{
				name: 'Ron',
				gender: 'male',
			},
			{
				name: 'Ginny',
				gender: 'female'
			}]
		},
		{
			name: 'Lily',
			gender: 'female'
		}]
	}],
}

module.exports = familyTree;