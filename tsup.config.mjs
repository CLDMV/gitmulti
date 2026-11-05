/**
 *
 *	@Project: gitmulti
 *	@Filename: /tsup.config.mjs
 *	@Date: 2026-11-03T21:54:44-08:00 (1793771684)
 *	@Author: Nate Corcoran <CLDMV>
 *	@Email: <Shinrai@users.noreply.github.com>
 *	-----
 *	@Last modified by: Nate Corcoran <CLDMV> (Shinrai@users.noreply.github.com)
 *	@Last modified time: 2026-11-03T21:56:36-08:00 (1793771796)
 *	-----
 *	@Copyright: Copyright (c) 2013-2026 Catalyzed Motivation Inc. All rights reserved.
 *
 */

/**
 * @fileoverview Bundler config: builds the published output from src/.
 *
 *  - dist/index.mjs: the bundle of src/index.mjs (minified, function names kept for stack traces).
 *  - dist/index.cjs: not a second bundle. src/index.cjs is copied in verbatim by onSuccess and require()s ./index.mjs
 *    through Node's synchronous require(esm).
 *  - bin/gitmulti.mjs: the executable, bundled from src/bin/gitmulti.mjs.
 *
 * commander stays external; consumers install it from package.json `dependencies`. Sourcemaps are built for local
 * debugging and left out of the published tarball by the `files` negations in package.json.
 */
import { copyFileSync } from "node:fs";
import { defineConfig } from "tsup";

const shared = {
	format: ["esm"],
	// engines.node is >=22.12.0; the build must not emit syntax newer than that.
	target: "node22",
	platform: "node",
	splitting: false,
	sourcemap: true,
	dts: false,
	minify: true,
	keepNames: true,
	removeNodeProtocol: false,
	external: ["commander"],
	outExtension() {
		return { js: ".mjs" };
	}
};

export default defineConfig([
	{
		...shared,
		entry: { index: "src/index.mjs" },
		outDir: "dist",
		clean: true,
		onSuccess() {
			copyFileSync("src/index.cjs", "dist/index.cjs");
		}
	},
	{
		...shared,
		entry: { gitmulti: "src/bin/gitmulti.mjs" },
		outDir: "bin",
		clean: true
	}
]);
