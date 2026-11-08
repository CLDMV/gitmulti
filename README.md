# gitmulti

Simple Node system to manage multiple Repositories into the same repo

## ✨ What's New

### Latest: v0.1.0 (November 2026)

- **A working CLI, rebuilt as ESM on commander 15 ([#68](https://github.com/CLDMV/gitmulti/pull/68))**: `gitmulti list [dir]` lists the `.gitmulti` files under a directory, and the package now installs a `gitmulti` executable. From code, `findGitmultiFiles`, `createProgram` and `run` work through both `import` and `require()`. `require("gitmulti")` no longer runs the CLI on load, and the package needs Node.js 22.12.0 or newer.
- **Toolchain and security ([#66](https://github.com/CLDMV/gitmulti/pull/66) and the Dependabot bumps since v0.0.12)**: Vitest 5.1, `@cldmv/vitest-runner` 1.6.1, `@cldmv/fix-headers` 2.2.6 and `@cldmv/configs` 1.4.0, plus `overrides` that pin `katex` and `minimatch` to patched versions. These clear every open Dependabot alert. Developing the package needs Node.js 22.22.0 or newer.
- [View full v0.1.0 Changelog](https://github.com/CLDMV/gitmulti/blob/master/docs/changelog/v0/v0.1.0.md)

### Recent Releases

- **v0.0.12** (October 2026) — `@cldmv/fix-headers` 2.2.0 and `@cldmv/configs` 1.2.4 (dev dependencies only); no header or runtime change ([Changelog](https://github.com/CLDMV/gitmulti/blob/master/docs/changelog/v0/v0.0.12.md))
- **v0.0.11** (October 2026) — CI only: the in-repo PR mirror job now always runs and reports under a non-required name instead of being skipped ([Changelog](https://github.com/CLDMV/gitmulti/blob/master/docs/changelog/v0/v0.0.11.md))
- **v0.0.10** (October 2026) — CI only: a skipped PR-run mirror job no longer satisfies the `✅ Required PR Check` ruleset gate; `@cldmv/vitest-runner` 1.5.1 ([Changelog](https://github.com/CLDMV/gitmulti/blob/master/docs/changelog/v0/v0.0.10.md))
- **v0.0.9** (October 2026) — workflows synced to the CLDMV/.github v4.29.2 templates, bundle-size workflow, shared fix-headers config (comment-only header in `gitmulti.js`); no runtime change ([Changelog](https://github.com/CLDMV/gitmulti/blob/master/docs/changelog/v0/v0.0.9.md))

📚 **For complete version history and detailed release notes, see the [docs/changelog/](https://github.com/CLDMV/gitmulti/tree/master/docs/changelog/) folder.**

## 📦 Install and use

gitmulti is installed from GitHub; it isn't published to npm.

```bash
npm install --global github:CLDMV/gitmulti
gitmulti list [dir]
```

`gitmulti list [dir]` prints the path of every `.gitmulti` file under `dir` (the current directory by default), relative to it, one per line. It searches every folder except `node_modules` and `.git` and doesn't follow symbolic links. `list` is the default command, so `gitmulti` and `gitmulti some/dir` do the same. `gitmulti --version` prints the version and `gitmulti --help` lists the commands.

The same functions are available from code, with `import` or `require()`:

```js
import { findGitmultiFiles, run } from "gitmulti";

findGitmultiFiles("."); // absolute paths of every .gitmulti file, sorted
run(["node", "gitmulti", "list", "."]); // what the gitmulti executable does
```

### Requirements

- **Node.js 22.12.0 or newer**, the floor of `commander` 15. `require()` needs Node.js 22.13.0 or newer (`require(esm)`); on older versions the CommonJS entry throws `ERR_REQUIRE_ESM` and points to `import()`.
- Developing gitmulti needs Node.js 22.22.0 or newer (`devEngines`). In a checkout, the `gitmulti-dev` export condition loads `src/` instead of the build in `dist/`: `export NODE_OPTIONS=--conditions=gitmulti-dev`. The tests use it automatically; `npm run build` builds `dist/` and `bin/`. `npm test` runs the suite against `src/`, then `npm run test:cjs` checks the CommonJS entry on the build and `npm run test:dist` runs the suite again against `dist/`.

## Preface

I have a habit of creating tools which are already available but are not simple. I've done research on this issue multiple times and maybe I just didn't find the solution that is already out there. But basically I want to edit a folder of code and have a program update the individual repos which that code belongs to. My first attempt required listing all the files which belonged to each repo. This was alright but required me to either spend hours making this list or write some gui for it. The GUI never happened and months later I abandonned the idea.

Recently I started Forking one of my projects over and using it's base code to create some new code. After a while I got thinking "this is going to be hell when I want to put these improvements back into the base code I forked". So over a year later is there a tool to do what I "need" (want really)? Didn't find one. So taking some look at already present git tools I decided to write a node (for portability) tool which will scan for .gitmulti files.

## What this tool does:

This tool will scan a repo for .gitmulti files. These files will be in json format (makes it easy for node to read, and frankly looks better than ini file format). From these files the tool will assign based on the git URL and paths specified what repo the files under it belong to.

From there the tool will do it's magic of moving files around, issueing the git commit, push, pull requests for each individual repo that is part of a multi-repo.

## What this tool does NOT do:

It's a simple tool. It will only commit, push, and pull. Anything else from the git toolset will be left out (for now at least).

## ❤️ Contributors

This project exists thanks to all the people who contribute. [[Contributors](https://github.com/CLDMV/gitmulti/graphs/contributors)].
<a href="https://github.com/CLDMV/gitmulti/graphs/contributors"><img src="https://image.cldmv.net/github/contributors/?repo=gitmulti" alt="gitmulti contributors" /></a>

## 📄 License

Apache-2.0 © Shinrai / CLDMV. See [LICENSE](LICENSE).
