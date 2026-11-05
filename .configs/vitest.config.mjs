/**
 *
 *	@Project: gitmulti
 *	@Filename: /.configs/vitest.config.mjs
 *	@Date: 2026-08-02T16:42:01-07:00 (1785714121)
 *	@Author: Nate Corcoran <CLDMV>
 *	@Email: <Shinrai@users.noreply.github.com>
 *	-----
 *	@Last modified by: Nate Corcoran <CLDMV> (Shinrai@users.noreply.github.com)
 *	@Last modified time: 2026-11-03T21:56:28-08:00 (1793771788)
 *	-----
 *	@Copyright: Copyright (c) 2013-2026 Catalyzed Motivation Inc. All rights reserved.
 *
 */

import { defineConfig, mergeConfig } from "vitest/config";
import base, { devCondition } from "@cldmv/configs/vitest.config.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Anchor the project root to the package directory so include/exclude work no matter what cwd vitest runs from.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export default mergeConfig(
	mergeConfig(base, devCondition({ root })),
	defineConfig({
		root,
		test: {
			testTimeout: 30000,
			// One character per test file instead of a full block per file in non-interactive CI logs.
			reporters: ["dot"],
			coverage: {
				include: ["src/**"],
				// src/index.cjs is the CommonJS entry. Vitest loads files through its own module runner, so it can't show
				// how a plain require() behaves; tests/cjs/entry.test.cjs covers it under node:test (`npm run test:cjs`)
				// against the built copy in dist/.
				exclude: ["src/index.cjs"],
				reporter: ["html"]
			}
		}
	})
);
