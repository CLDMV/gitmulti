/**
 *
 *	@Project: gitmulti
 *	@Filename: /tests/helpers/tree.mjs
 *	@Date: 2026-11-03T21:55:30-08:00 (1793771730)
 *	@Author: Nate Corcoran <CLDMV>
 *	@Email: <Shinrai@users.noreply.github.com>
 *	-----
 *	@Last modified by: Nate Corcoran <CLDMV> (Shinrai@users.noreply.github.com)
 *	@Last modified time: 2026-11-03T21:56:35-08:00 (1793771795)
 *	-----
 *	@Copyright: Copyright (c) 2013-2026 Catalyzed Motivation Inc. All rights reserved.
 *
 */

/**
 * @fileoverview Builds throwaway directory trees for the tests under the repository's gitignored tmp/ folder.
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scratch = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../tmp/tests");

/**
 * Creates a new directory and writes the given files into it.
 *
 * @param {string[]} files - Paths relative to the new directory; parent folders are created as needed.
 * @returns {string} The new directory's absolute path.
 */
export function makeTree(files) {
	mkdirSync(scratch, { recursive: true });
	const root = mkdtempSync(path.join(scratch, "tree-"));
	for (const file of files) {
		const full = path.join(root, file);
		mkdirSync(path.dirname(full), { recursive: true });
		writeFileSync(full, "{}\n");
	}
	return root;
}

/**
 * Removes a tree made by {@link makeTree}.
 *
 * @param {string} root - The directory {@link makeTree} returned.
 */
export function removeTree(root) {
	rmSync(root, { recursive: true, force: true });
}
