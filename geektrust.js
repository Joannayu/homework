var fs = require('fs');
var CommandHandler = require('./command-handler.js');
var familyTree = require('./tree-json.js');

function main() {
	const filename = process.argv[2];
	if (!filename) {
		console.log('ERROR: Plese specify an input file.');
		return;
	}

	fs.readFile(filename, 'utf8', function(err, data) {
	    if (err) throw err;

	    let commandHandler = new CommandHandler(familyTree);
	    commandHandler.execute(data);
	});
}

main();