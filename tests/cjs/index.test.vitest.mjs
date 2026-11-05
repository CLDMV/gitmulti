/**
 *
 *	@Project: gitmulti
 *	@Filename: /tests/cjs/index.test.vitest.mjs
 *	@Date: 2026-11-03T21:55:58-08:00 (1793771758)
 *	@Author: Nate Corcoran <CLDMV>
 *	@Email: <Shinrai@users.noreply.github.com>
 *	-----
 *	@Last modified by: Nate Corcoran <CLDMV> (Shinrai@users.noreply.github.com)
 *	@Last modified time: 2026-11-03T21:56:35-08:00 (1793771795)
 *	-----
 *	@Copyright: Copyright (c) 2013-2026 Catalyzed Motivation Inc. All rights reserved.
 *
 */

import { describe, it, expect } from "vitest";
import { createRequire } from "node:module";
import * as esm from "../../src/index.mjs";

const require = createRequire(import.meta.url);

describe("src/index.cjs", () => {
	it("exports the same names as src/index.mjs, as functions", () => {
		const cjs = require("../../src/index.cjs");

		expect(Object.keys(cjs).sort()).toEqual(Object.keys(esm).sort());
		for (const name of Object.keys(esm)) expect(typeof cjs[name]).toBe("function");
	});
});
