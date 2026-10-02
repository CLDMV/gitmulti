/**
 *
 *	@Project: gitmulti
 *	@Filename: /gitmulti.js
 *	@Date: 2019-01-09T05:21:21-08:00 (1547040081)
 *	@Author: Nate Corcoran <CLDMV>
 *	@Email: <Shinrai@users.noreply.github.com>
 *	-----
 *	@Last modified by: Nate Corcoran <CLDMV> (Shinrai@users.noreply.github.com)
 *	@Last modified time: 2026-10-02T11:30:32-07:00 (1790965832)
 *	-----
 *	@Copyright: Copyright (c) 2013-2026 Catalyzed Motivation Inc. All rights reserved.
 *
 */

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