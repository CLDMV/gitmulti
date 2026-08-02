/**
 * End-to-end characterization of the gitmulti CLI entry point via a real,
 * fully isolated subprocess (spawnSync of `node gitmulti.js <args>`).
 *
 * This complements gitmulti.test.mjs, which drives gitmulti.js in-process for
 * statement/branch coverage. Two scenarios cannot be driven that way without
 * either mocking `child_process` (which does not work here — commander's
 * internal `require("child_process")` is not reachable by `vi.mock`, see the
 * comment at the top of gitmulti.test.mjs) or letting a real spawn attempt
 * happen inside the test worker process (which leaks an async `process.exit`
 * call that fires after the test body returns and trips Vitest's
 * unexpected-exit detector). Running the real CLI as a genuine child process
 * sidesteps both problems: whatever it spawns, or however it exits, happens
 * entirely inside that child process.
 *
 * This does not shell out to `git` and never touches a real repository or
 * the filesystem beyond the ENOENT spawn attempt below — gitmulti.js has no
 * git/`.gitmulti` handling of its own yet (see gitmulti.test.mjs's file
 * banner); the "list" subcommand it declares as its default is meant to be
 * an executable sibling file (`gitmulti-list`) that does not exist in this
 * package, so invoking it is expected, currently, to fail.
 */
import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const scriptPath = require.resolve("../gitmulti.js");

function runCli(args) {
	return spawnSync(process.execPath, [scriptPath, ...args], {
		encoding: "utf8",
		timeout: 5000
	});
}

describe("gitmulti CLI (real subprocess)", () => {
	it("with no arguments, falls through to the default 'list' subcommand, which does not exist yet, and exits 1", () => {
		const result = runCli([]);

		expect(result.status).toBe(1);
		expect(result.stdout).toBe("");
		expect(result.stderr).toBe("error: gitmulti-list(1) does not exist, try --help\n");
	});

	it("explicitly invoking 'list' hits the same missing-executable error and exits 1", () => {
		const result = runCli(["list"]);

		expect(result.status).toBe(1);
		expect(result.stdout).toBe("");
		expect(result.stderr).toBe("error: gitmulti-list(1) does not exist, try --help\n");
	});

	it("'list' with a directory argument is forwarded the same way and still hits the missing executable", () => {
		const result = runCli(["list", "some/dir"]);

		expect(result.status).toBe(1);
		expect(result.stdout).toBe("");
		expect(result.stderr).toBe("error: gitmulti-list(1) does not exist, try --help\n");
	});

	it("--version prints the version and exits 0 as a real process", () => {
		const result = runCli(["--version"]);

		expect(result.status).toBe(0);
		expect(result.stdout).toBe("0.1.0\n");
		expect(result.stderr).toBe("");
	});

	it("--help prints usage and exits 0 as a real process", () => {
		const result = runCli(["--help"]);

		expect(result.status).toBe(0);
		expect(result.stdout).toBe(
			"Usage: gitmulti [options] [command]\n" +
				"\n" +
				"Options:\n" +
				"  -V, --version  output the version number\n" +
				"  -h, --help     output usage information\n" +
				"\n" +
				"Commands:\n" +
				"  list [dir]     List gitmulti output for dir (defaults to process.cwd())\n" +
				"  help [cmd]     display help for [cmd]\n"
		);
		expect(result.stderr).toBe("");
	});
});
