/**
 *
 *	@Project: gitmulti
 *	@Filename: /.configs/vitest.config.mjs
 *	@Date: 2026-08-02T16:42:01-07:00 (1785714121)
 *	@Author: Nate Corcoran <CLDMV>
 *	@Email: <Shinrai@users.noreply.github.com>
 *	-----
 *	@Last modified by: Nate Corcoran <CLDMV> (Shinrai@users.noreply.github.com)
 *	@Last modified time: 2026-10-02T11:30:27-07:00 (1790965827)
 *	-----
 *	@Copyright: Copyright (c) 2013-2026 Catalyzed Motivation Inc. All rights reserved.
 *
 */

import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export default defineConfig({
	root,
	test: {
		include: ["tests/**/*.test.vitest.mjs"],
		exclude: ["node_modules"],
		environment: "node",
		testTimeout: 30000,
		reporters: ["dot"],
		coverage: {
			provider: "v8",
			include: ["gitmulti.js"],
			exclude: ["**/*.json", "tests/**", "**/* - Copy.js"],
			reporter: ["text", "html", "json-summary", "json"]
		}
	}
});
