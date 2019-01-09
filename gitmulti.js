"use strict"	
	const program = require('commander');
	
	program.on('option:verbose', function () {
		process.env.VERBOSE = this.verbose;
	});
	
	program
		.version('0.1.0', '-V, --version')
		// .command('install [name]', 'install one or more packages')
		// .command('search [query]', 'search with optional query')
		.command('list [dir]', 'List gitmulti output for dir (defaults to process.cwd())', {isDefault: true})
		// .option('-r, --repo <repo_url>', 'Specify what Repo to inspect based on it\'s full URL.')
		// .option('-d, --dir <scan_dir>', 'Specify what directory to scan in.')
		.parse(process.argv);