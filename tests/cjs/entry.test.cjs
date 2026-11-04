/**
 *
 *	@Project: gitmulti
 *	@Filename: /tests/cjs/entry.test.cjs
 *	@Date: 2026-11-03T21:56:03-08:00 (1793771763)
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
 * Checks the build: dist/index.cjs re-exports dist/index.mjs, require() fails clearly without require(esm), and the built
 * bin/gitmulti.mjs runs. Run by `npm run test:cjs` under node:test after `npm run build`.
 */
"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "../..");
const { version } = require("../../package.json");

test("require() returns the same functions as import", async () => {
	const required = require("../../dist/index.cjs");
	const esm = await import("../../dist/index.mjs");

	assert.deepEqual(Object.keys(required).sort(), ["createProgram", "findGitmultiFiles", "run"]);
	for (const name of Object.keys(esm)) assert.equal(required[name], esm[name]);
});

test("require() fails with a clear message where Node.js has no require(esm)", () => {
	// --no-experimental-require-module turns require(esm) off, which is what older Node.js looks like to the entry.
	const res = spawnSync(process.execPath, ["--no-experimental-require-module", "-e", "require('./dist/index.cjs')"], {
		cwd: repoRoot,
		encoding: "utf8"
	});

	assert.notEqual(res.status, 0);
	assert.match(res.stderr, /ERR_REQUIRE_ESM/);
	assert.match(res.stderr, /require\(\) needs Node\.js >=22\.13\.0/);
	assert.match(res.stderr, /import\(\)/);
});

test("the built executable runs", () => {
	const res = spawnSync(process.execPath, ["bin/gitmulti.mjs", "--version"], { cwd: repoRoot, encoding: "utf8" });

	assert.equal(res.status, 0);
	assert.equal(res.stdout, `${version}\n`);
});
