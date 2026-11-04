/**
 *
 *	@Project: gitmulti
 *	@Filename: /tests/bin.test.vitest.mjs
 *	@Date: 2026-11-03T21:55:56-08:00 (1793771756)
 *	@Author: Nate Corcoran <CLDMV>
 *	@Email: <Shinrai@users.noreply.github.com>
 *	-----
 *	@Last modified by: Nate Corcoran <CLDMV> (Shinrai@users.noreply.github.com)
 *	@Last modified time: 2026-11-03T21:56:35-08:00 (1793771795)
 *	-----
 *	@Copyright: Copyright (c) 2013-2026 Catalyzed Motivation Inc. All rights reserved.
 *
 */

import { describe, it, expect, afterEach, vi } from "vitest";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { makeTree, removeTree } from "./helpers/tree.mjs";

const bin = fileURLToPath(new URL("../src/bin/gitmulti.mjs", import.meta.url));
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

const trees = [];
afterEach(() => {
	vi.restoreAllMocks();
	while (trees.length) removeTree(trees.pop());
});

describe("the gitmulti executable", () => {
	it("runs the program on process.argv", async () => {
		const root = makeTree(["e/.gitmulti"]);
		trees.push(root);
		vi.spyOn(process, "argv", "get").mockReturnValue([process.execPath, bin, "list", root]);
		const write = vi.spyOn(process.stdout, "write").mockImplementation(() => true);

		await import("../src/bin/gitmulti.mjs");

		expect(write).toHaveBeenCalledWith(`${path.join("e", ".gitmulti")}\n`);
	});

	it("works as a real process: lists, prints the version and exits with commander's codes", () => {
		const root = makeTree(["f/.gitmulti"]);
		trees.push(root);
		const runBin = (args) => spawnSync(process.execPath, [bin, ...args], { cwd: root, encoding: "utf8" });

		expect(runBin([])).toMatchObject({ status: 0, stdout: `${path.join("f", ".gitmulti")}\n`, stderr: "" });
		expect(runBin(["--version"])).toMatchObject({ status: 0, stdout: `${pkg.version}\n` });
		expect(runBin(["list", "missing"])).toMatchObject({ status: 1, stderr: `error: not a directory: ${path.join(root, "missing")}\n` });
	});
});
