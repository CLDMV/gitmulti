/**
 *
 *	@Project: gitmulti
 *	@Filename: /src/index.mjs
 *	@Date: 2026-11-03T21:54:34-08:00 (1793771674)
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
 * @fileoverview ESM entry: the gitmulti program and the `.gitmulti` file search.
 *
 * @module gitmulti
 */
export { createProgram, run } from "./cli.mjs";
export { findGitmultiFiles } from "./list.mjs";
