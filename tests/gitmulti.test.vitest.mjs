/**
 * Characterization tests for gitmulti.js.
 *
 * gitmulti.js is a tiny CommonJS entry point: on require, it configures a
 * `commander` (v2) program and immediately calls `program.parse(process.argv)`.
 * It has no exports (`module.exports` is never assigned) and no pure helper
 * functions — the entire file *is* the commander wiring, so these tests
 * characterize the CLI's observable behavior (stdout/stderr/exit code) for a
 * given `process.argv`, plus the resulting commander configuration.
 *
 * Because gitmulti.js runs `program.parse()` as an import-time side effect
 * (and `commander` itself is a CJS singleton — `require("commander")` always
 * returns the same `Command` instance), each scenario below loads gitmulti.js
 * through a real, manually-busted `require.cache` (via `createRequire`) so
 * every test gets a genuinely fresh `commander` program — not an artifact of
 * `vi.resetModules()`, which only resets Vitest's own SSR module graph and
 * does NOT reset externalized CJS deps like `commander` (verified: without
 * the manual cache-bust, a second `--help` run shows every option/command
 * doubled, because the second `.version()`/`.command()` call re-registers on
 * the same singleton).
 *
 * `process.exit` is mocked to *throw* rather than no-op. Commander does not
 * stop executing after calling `process.exit()` in scenarios where the real
 * process would have died (e.g. it falls through to attempting to spawn the
 * `list` default executable subcommand after printing `--version`), so a
 * no-op mock lets execution run on into `executeSubCommand`, which calls the
 * *real, unmocked* `child_process.spawn` (mocking `child_process` does not
 * intercept commander's internal `require("child_process")` — commander is
 * loaded as an externalized dependency outside Vitest's module graph, so
 * `vi.mock("child_process", ...)` never reaches it — confirmed empirically).
 * Throwing on `process.exit` halts execution at the same point a real exit
 * would, which avoids ever reaching that real spawn call in these tests.
 *
 * The one scenario that cannot be driven to a synchronous `process.exit`
 * in-process — no matching flag/command, which falls through to commander's
 * `defaultExecutable` ("list") and really attempts to spawn a `gitmulti-list`
 * executable that does not exist in this package — is characterized instead
 * via a real, fully isolated subprocess in gitmulti.cli.test.vitest.mjs, so a failed
 * spawn attempt never touches this test's own process.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const scriptPath = require.resolve("../gitmulti.js");

/** Sentinel thrown by the mocked `process.exit` so synchronous execution stops exactly where a real exit would. */
class ProcessExitSignal extends Error {
	constructor(code) {
		super(`process.exit(${code})`);
		this.name = "ProcessExitSignal";
		this.code = code;
	}
}

/**
 * Loads gitmulti.js fresh (busting both its own and commander's require-cache
 * entries first) with the given argv, returning the resulting commander
 * program plus the exit code it synchronously "exited" with (if any).
 *
 * @param {string[]} argvTail - arguments after `node script.js`, e.g. ["--version"].
 * @returns {{program: import("commander").Command, exitCode: number|null}}
 */
function freshLoad(argvTail) {
	delete require.cache[scriptPath];
	delete require.cache[require.resolve("commander")];

	const originalArgv = process.argv;
	process.argv = ["node", scriptPath, ...argvTail];

	let exitCode = null;
	try {
		require("../gitmulti.js");
	} catch (err) {
		if (err instanceof ProcessExitSignal) {
			exitCode = err.code;
		} else {
			throw err;
		}
	} finally {
		process.argv = originalArgv;
	}

	return { program: require("commander"), exitCode };
}

describe("gitmulti.js", () => {
	let exitSpy;
	let stdoutSpy;
	let consoleErrorSpy;

	beforeEach(() => {
		exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => {
			throw new ProcessExitSignal(code);
		});
		stdoutSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
		// commander reports errors via console.error(...), not process.stderr.write
		// directly — Vitest's own console interception means spying on
		// process.stderr.write never observes these calls (verified empirically:
		// the spy recorded zero calls even though the error text still reached the
		// terminal through Vitest's separate console-capture path).
		consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
	});

	afterEach(() => {
		exitSpy.mockRestore();
		stdoutSpy.mockRestore();
		consoleErrorSpy.mockRestore();
		delete process.env.VERBOSE;
	});

	describe("--version / -V", () => {
		it("--version writes the version string to stdout and exits 0", () => {
			const { exitCode } = freshLoad(["--version"]);

			expect(stdoutSpy).toHaveBeenCalledWith("0.1.0\n");
			expect(exitCode).toBe(0);
		});

		it("-V (short flag) behaves the same as --version", () => {
			const { exitCode } = freshLoad(["-V"]);

			expect(stdoutSpy).toHaveBeenCalledWith("0.1.0\n");
			expect(exitCode).toBe(0);
		});
	});

	describe("--help / -h", () => {
		const expectedHelp =
			"Usage: gitmulti [options] [command]\n" +
			"\n" +
			"Options:\n" +
			"  -V, --version  output the version number\n" +
			"  -h, --help     output usage information\n" +
			"\n" +
			"Commands:\n" +
			"  list [dir]     List gitmulti output for dir (defaults to process.cwd())\n" +
			"  help [cmd]     display help for [cmd]\n";

		it("--help writes the exact current usage text to stdout and exits 0", () => {
			const { exitCode } = freshLoad(["--help"]);

			expect(stdoutSpy).toHaveBeenCalledWith(expectedHelp);
			expect(exitCode).toBe(0);
		});

		it("-h (short flag) behaves the same as --help", () => {
			const { exitCode } = freshLoad(["-h"]);

			expect(stdoutSpy).toHaveBeenCalledWith(expectedHelp);
			expect(exitCode).toBe(0);
		});
	});

	describe("unknown / undeclared options", () => {
		it("an unrecognized long option exits 1 with an 'unknown option' error on stderr", () => {
			const { exitCode } = freshLoad(["--bogus"]);

			expect(consoleErrorSpy).toHaveBeenCalledWith("error: unknown option `%s'", "--bogus");
			expect(exitCode).toBe(1);
		});

		it("an unrecognized short option exits 1 with an 'unknown option' error on stderr", () => {
			const { exitCode } = freshLoad(["-z"]);

			expect(consoleErrorSpy).toHaveBeenCalledWith("error: unknown option `%s'", "-z");
			expect(exitCode).toBe(1);
		});

		it("--verbose is wired via an 'option:verbose' listener but was never declared with .option(), so it is itself an unknown option", () => {
			// Documents that the VERBOSE env wiring below is currently dead code from
			// the CLI's perspective: there is no `.option("--verbose", ...)` call
			// anywhere in gitmulti.js, so commander treats `--verbose` as unknown
			// rather than ever emitting "option:verbose".
			const { exitCode } = freshLoad(["--verbose"]);

			expect(consoleErrorSpy).toHaveBeenCalledWith("error: unknown option `%s'", "--verbose");
			expect(exitCode).toBe(1);
		});
	});

	describe("commander program configuration", () => {
		it("sets the version to 0.1.0 and infers the program name from the script path", () => {
			const { program } = freshLoad(["--version"]);

			expect(program.version()).toBe("0.1.0");
			expect(program._name).toBe("gitmulti");
		});

		it("registers 'list' as the default executable subcommand", () => {
			const { program } = freshLoad(["--version"]);

			expect(program.defaultExecutable).toBe("list");
			expect(Object.keys(program._execs)).toEqual(["list", "help"]);

			const listCommand = program.commands.find((c) => c._name === "list");
			expect(listCommand).toBeDefined();
			expect(listCommand._description).toBe("List gitmulti output for dir (defaults to process.cwd())");
			expect(listCommand._args.map((a) => a.name)).toEqual(["dir"]);
			expect(listCommand._args.map((a) => a.required)).toEqual([false]);
		});

		it("registers exactly one 'option:verbose' listener and one 'option:version' listener", () => {
			const { program } = freshLoad(["--version"]);

			expect(program.listenerCount("option:verbose")).toBe(1);
			expect(program.listenerCount("option:version")).toBe(1);
		});
	});

	describe("'option:verbose' handler behavior", () => {
		it("copies this.verbose onto process.env.VERBOSE when the event fires", () => {
			// The CLI itself never emits this event (see the "unknown / undeclared
			// options" describe block above), but the registered listener is still
			// real, reachable code whose behavior is worth characterizing directly:
			// invoke it the same way commander would (via EventEmitter, with
			// `this` bound to the emitting command) if `--verbose` were ever wired
			// up as a real option.
			const { program } = freshLoad(["--version"]);

			expect(process.env.VERBOSE).toBeUndefined();

			program.verbose = "on";
			program.emit("option:verbose");

			expect(process.env.VERBOSE).toBe("on");
		});

		it("stringifies a non-string this.verbose the same way a real assignment to process.env would", () => {
			const { program } = freshLoad(["--version"]);

			program.verbose = true;
			program.emit("option:verbose");

			expect(process.env.VERBOSE).toBe("true");
		});
	});
});
