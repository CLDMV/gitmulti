/**
 *
 *	@Project: gitmulti
 *	@Filename: /tests/list.test.vitest.mjs
 *	@Date: 2026-11-03T21:55:37-08:00 (1793771737)
 *	@Author: Nate Corcoran <CLDMV>
 *	@Email: <Shinrai@users.noreply.github.com>
 *	-----
 *	@Last modified by: Nate Corcoran <CLDMV> (Shinrai@users.noreply.github.com)
 *	@Last modified time: 2026-11-03T21:56:35-08:00 (1793771795)
 *	-----
 *	@Copyright: Copyright (c) 2013-2026 Catalyzed Motivation Inc. All rights reserved.
 *
 */

import { describe, it, expect, afterEach } from "vitest";
import { mkdirSync, symlinkSync } from "node:fs";
import path from "node:path";
import { findGitmultiFiles } from "gitmulti";
import { makeTree, removeTree } from "./helpers/tree.mjs";

const trees = [];
const tree = (files) => {
	const root = makeTree(files);
	trees.push(root);
	return root;
};

afterEach(() => {
	while (trees.length) removeTree(trees.pop());
});

describe("findGitmultiFiles", () => {
	it("finds .gitmulti files at every depth, sorted, as absolute paths", () => {
		const root = tree(["b/.gitmulti", ".gitmulti", "a/deep/er/.gitmulti", "a/readme.md"]);

		expect(findGitmultiFiles(root)).toEqual([
			path.join(root, ".gitmulti"),
			path.join(root, "a/deep/er/.gitmulti"),
			path.join(root, "b/.gitmulti")
		]);
	});

	it("skips node_modules and .git folders", () => {
		const root = tree(["node_modules/pkg/.gitmulti", ".git/.gitmulti", "src/.gitmulti"]);

		expect(findGitmultiFiles(root)).toEqual([path.join(root, "src/.gitmulti")]);
	});

	it("matches the exact file name only, and searches inside a folder named .gitmulti", () => {
		const root = tree([".gitmulti.bak", "x.gitmulti", ".gitmulti/inner/.gitmulti"]);

		expect(findGitmultiFiles(root)).toEqual([path.join(root, ".gitmulti/inner/.gitmulti")]);
	});

	it("does not follow symbolic links, so a link back up the tree can't loop", () => {
		const root = tree(["a/.gitmulti"]);
		symlinkSync(root, path.join(root, "a/loop"), "dir");

		expect(findGitmultiFiles(root)).toEqual([path.join(root, "a/.gitmulti")]);
	});

	it("returns an empty list for a tree without .gitmulti files", () => {
		const root = tree(["a/b.txt"]);
		mkdirSync(path.join(root, "empty"));

		expect(findGitmultiFiles(root)).toEqual([]);
	});

	it("resolves a relative directory against the current directory", () => {
		const root = tree(["one/.gitmulti"]);

		expect(findGitmultiFiles(path.relative(process.cwd(), root))).toEqual([path.join(root, "one/.gitmulti")]);
	});
});
