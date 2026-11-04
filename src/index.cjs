/**
 *
 *	@Project: gitmulti
 *	@Filename: /src/index.cjs
 *	@Date: 2026-11-03T21:54:36-08:00 (1793771676)
 *	@Author: Nate Corcoran <CLDMV>
 *	@Email: <Shinrai@users.noreply.github.com>
 *	-----
 *	@Last modified by: Nate Corcoran <CLDMV> (Shinrai@users.noreply.github.com)
 *	@Last modified time: 2026-11-03T21:56:33-08:00 (1793771793)
 *	-----
 *	@Copyright: Copyright (c) 2013-2026 Catalyzed Motivation Inc. All rights reserved.
 *
 */

/**
 * CommonJS entry: a thin re-export of the ESM build through Node's synchronous require(esm), not a second bundle. Copied
 * verbatim to dist/index.cjs by tsup.config.mjs. Same exports as the ESM entry.
 *
 * @module gitmulti
 */
"use strict";
if (!process.features?.require_module) {
	const error = new Error(
		`gitmulti: require() needs Node.js >=22.13.0 (this is ${process.version}). On older Node.js, load the package with import() instead.`
	);
	error.code = "ERR_REQUIRE_ESM";
	throw error;
}
module.exports = require("./index.mjs");
