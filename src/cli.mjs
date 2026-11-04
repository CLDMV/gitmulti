/**
 *
 *	@Project: gitmulti
 *	@Filename: /src/cli.mjs
 *	@Date: 2019-01-09T05:21:21-08:00 (1547040081)
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
 * @fileoverview The gitmulti command line: a commander program with one command, `list`, which is also the default.
 */
import { statSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { Command } from "commander";
import { findGitmultiFiles } from "./list.mjs";

// package.json sits one level above this file in src/, and one level above the built copies in dist/ and bin/.
const { version, description } = createRequire(import.meta.url)("../package.json");

/**
 * Builds the gitmulti program. Every call returns a new, independent program.
 *
 * @param {object} [options]
 * @param {string} [options.cwd] - Directory that a relative `dir` argument resolves against. Defaults to `process.cwd()`.
 * @param {(text: string) => void} [options.write] - Receives the command's output. Defaults to writing to stdout.
 * @returns {Command} The program, ready for `parse()`.
 */
export function createProgram({ cwd = process.cwd(), write = (text) => process.stdout.write(text) } = {}) {
	const program = new Command("gitmulti");
	program.description(description).version(version, "-V, --version");

	program
		.command("list", { isDefault: true })
		.description("List the .gitmulti files under a directory, relative to it")
		.argument("[dir]", "directory to search (defaults to the current directory)")
		.action((dir) => {
			const root = path.resolve(cwd, dir ?? ".");
			if (statSync(root, { throwIfNoEntry: false })?.isDirectory() !== true) {
				program.error(`error: not a directory: ${root}`);
			}
			for (const file of findGitmultiFiles(root)) {
				write(`${path.relative(root, file)}\n`);
			}
		});

	return program;
}

/**
 * Runs gitmulti with a full argv (`[node, script, ...args]`), the way the `gitmulti` executable does.
 *
 * @param {string[]} [argv] - Defaults to `process.argv`.
 * @param {Parameters<typeof createProgram>[0]} [options] - Passed to {@link createProgram}.
 * @returns {Command} The program after parsing.
 */
export function run(argv = process.argv, options) {
	return createProgram(options).parse(argv);
}
