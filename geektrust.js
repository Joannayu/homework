var fs = require('fs');

function main() {
	const filename = process.argv[2];
	if (!filename) {
		console.log('ERROR: Plese specify an input file.');
		return;
	}

	fs.readFile(filename, 'utf8', function(err, data) {
	    if (err) throw err;

	    console.log(data);	
	});
}

main();