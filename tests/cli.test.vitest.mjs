/**
 *
 *	@Project: gitmulti
 *	@Filename: /tests/cli.test.vitest.mjs
 *	@Date: 2026-11-03T21:55:50-08:00 (1793771750)
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
import { readFileSync } from "node:fs";
import path from "node:path";
import { CommanderError } from "commander";
import { createProgram, run } from "gitmulti";
import { makeTree, removeTree } from "./helpers/tree.mjs";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

const trees = [];
const tree = (files) => {
	const root = makeTree(files);
	trees.push(root);
	return root;
};

afterEach(() => {
	while (trees.length) removeTree(trees.pop());
});

/**
 * Parses `args` with a program whose output and exits are captured instead of reaching the process.
 *
 * @param {string[]} args - Arguments after the executable name.
 * @param {{ cwd?: string }} [options]
 * @returns {{ out: string, err: string, exit: CommanderError | null }}
 */
function parse(args, { cwd } = {}) {
	const out = [];
	const err = [];
	const program = createProgram({ cwd, write: (text) => out.push(text) });
	for (const command of [program, ...program.commands]) {
		command.exitOverride();
		command.configureOutput({ writeOut: (text) => out.push(text), writeErr: (text) => err.push(text) });
	}
	let exit = null;
	try {
		program.parse(args, { from: "user" });
	} catch (error) {
		if (!(error instanceof CommanderError)) throw error;
		exit = error;
	}
	return { out: out.join(""), err: err.join(""), exit };
}

describe("gitmulti list", () => {
	it("lists the .gitmulti files under a directory, relative to it", () => {
		const root = tree(["a/.gitmulti", ".gitmulti", "node_modules/x/.gitmulti"]);

		expect(parse(["list", root])).toEqual({ out: `.gitmulti\n${path.join("a", ".gitmulti")}\n`, err: "", exit: null });
	});

	it("is the default command and searches the current directory without a dir", () => {
		const root = tree(["b/.gitmulti"]);

		expect(parse([], { cwd: root }).out).toBe(`${path.join("b", ".gitmulti")}\n`);
		expect(parse(["list"], { cwd: root }).out).toBe(`${path.join("b", ".gitmulti")}\n`);
	});

	it("resolves a relative dir against cwd", () => {
		const root = tree(["sub/c/.gitmulti"]);

		expect(parse(["sub"], { cwd: root }).out).toBe(`${path.join("c", ".gitmulti")}\n`);
	});

	it("prints nothing for a directory without .gitmulti files", () => {
		const root = tree(["readme.md"]);

		expect(parse(["list", root])).toEqual({ out: "", err: "", exit: null });
	});

	it("fails with exit code 1 for a path that isn't a directory", () => {
		const root = tree(["file.txt"]);

		for (const target of ["missing", "file.txt"]) {
			const { out, err, exit } = parse(["list", target], { cwd: root });
			expect(out).toBe("");
			expect(err).toBe(`error: not a directory: ${path.join(root, target)}\n`);
			expect(exit.exitCode).toBe(1);
		}
	});
});

describe("gitmulti options", () => {
	it("--version and -V print the package.json version", () => {
		for (const flag of ["--version", "-V"]) {
			const { out, exit } = parse([flag]);
			expect(out).toBe(`${pkg.version}\n`);
			expect(exit.code).toBe("commander.version");
			expect(exit.exitCode).toBe(0);
		}
	});

	it("--help describes the program and the list command", () => {
		const { out, exit } = parse(["--help"]);

		expect(exit.exitCode).toBe(0);
		expect(out).toContain("Usage: gitmulti [options] [command]");
		expect(out).toContain(pkg.description);
		expect(out).toMatch(/list \[dir\]\s+List the \.gitmulti files under a directory, relative to it/);
		expect(out).toContain("-V, --version");
	});

	it("list --help describes the dir argument", () => {
		const { out } = parse(["list", "--help"]);

		expect(out).toContain("Usage: gitmulti list [options] [dir]");
		expect(out).toContain("directory to search (defaults to the current directory)");
	});

	it("rejects an unknown option", () => {
		const { err, exit } = parse(["--nope"]);

		expect(err).toContain("unknown option '--nope'");
		expect(exit.exitCode).toBe(1);
	});

	it("returns a new program on every call", () => {
		expect(createProgram()).not.toBe(createProgram());
	});
});

describe("run", () => {
	it("parses a full argv and writes the listing", () => {
		const root = tree(["d/.gitmulti"]);
		const out = [];

		const program = run(["node", "gitmulti", "list", root], { write: (text) => out.push(text) });

		expect(program.name()).toBe("gitmulti");
		expect(out).toEqual([`${path.join("d", ".gitmulti")}\n`]);
	});
});
