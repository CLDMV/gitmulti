/**
 *
 *	@Project: gitmulti
 *	@Filename: /src/list.mjs
 *	@Date: 2026-11-03T21:54:33-08:00 (1793771673)
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
 * @fileoverview Finds the `.gitmulti` files in a directory tree.
 */
import { readdirSync } from "node:fs";
import path from "node:path";

/** Folders that are never searched: installed dependencies and git's own data. */
const SKIPPED_DIRS = new Set(["node_modules", ".git"]);

/**
 * Finds every file named `.gitmulti` under a directory, at any depth. `node_modules` and `.git` folders are skipped, and
 * symbolic links are not followed.
 *
 * @param {string} dir - Directory to search.
 * @returns {string[]} Absolute paths, sorted.
 */
export function findGitmultiFiles(dir) {
	const found = [];
	const walk = (current) => {
		for (const entry of readdirSync(current, { withFileTypes: true })) {
			const full = path.join(current, entry.name);
			if (entry.isDirectory()) {
				if (!SKIPPED_DIRS.has(entry.name)) walk(full);
			} else if (entry.isFile() && entry.name === ".gitmulti") {
				found.push(full);
			}
		}
	};
	walk(path.resolve(dir));
	return found.sort();
}
