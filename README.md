# gitmulti
Simple Node system to manage multiple Repositories into the same repo

## ✨ What's New

### Latest: v0.0.12 (October 2026)

- **Dev-tooling dependency bump ([#39](https://github.com/CLDMV/gitmulti/pull/39))** — `@cldmv/fix-headers` moves from 2.1.1 to 2.1.4, the tool that maintains the repository's file headers. It produced no header changes here, so only `package.json` and the lockfile changed. The CLI is unchanged; it's a drop-in replacement for the previous version.
- [View full v0.0.12 Changelog](https://github.com/CLDMV/gitmulti/blob/master/docs/changelog/v0/v0.0.12.md)

### Recent Releases

- **v0.0.11** (October 2026) — CI only: the in-repo PR mirror job now always runs and reports under a non-required name instead of being skipped ([Changelog](https://github.com/CLDMV/gitmulti/blob/master/docs/changelog/v0/v0.0.11.md))
- **v0.0.10** (October 2026) — CI only: a skipped PR-run mirror job no longer satisfies the `✅ Required PR Check` ruleset gate; `@cldmv/vitest-runner` 1.5.1 ([Changelog](https://github.com/CLDMV/gitmulti/blob/master/docs/changelog/v0/v0.0.10.md))
- **v0.0.9** (October 2026) — workflows synced to the CLDMV/.github v4.29.2 templates, bundle-size workflow, shared fix-headers config (comment-only header in `gitmulti.js`); no runtime change ([Changelog](https://github.com/CLDMV/gitmulti/blob/master/docs/changelog/v0/v0.0.9.md))
- **v0.0.8** (September 2026) — vitest and `@vitest/coverage-v8` 5.0.1 (dev dependencies only) ([Changelog](https://github.com/CLDMV/gitmulti/blob/master/docs/changelog/v0/v0.0.8.md))

📚 **For complete version history and detailed release notes, see the [docs/changelog/](https://github.com/CLDMV/gitmulti/tree/master/docs/changelog/) folder.**

# Preface
I have a habit of creating tools which are already available but are not simple. I've done research on this issue multiple times and maybe I just didn't find the solution that is already out there. But basically I want to edit a folder of code and have a program update the individual repos which that code belongs to. My first attempt required listing all the files which belonged to each repo. This was alright but required me to either spend hours making this list or write some gui for it. The GUI never happened and months later I abandonned the idea.

Recently I started Forking one of my projects over and using it's base code to create some new code. After a while I got thinking "this is going to be hell when I want to put these improvements back into the base code I forked". So over a year later is there a tool to do what I "need" (want really)? Didn't find one. So taking some look at already present git tools I decided to write a node (for portability) tool which will scan for .gitmulti files. 

# What this tool does:
This tool will scan a repo for .gitmulti files. These files will be in json format (makes it easy for node to read, and frankly looks better than ini file format). From these files the tool will assign based on the git URL and paths specified what repo the files under it belong to.

From there the tool will do it's magic of moving files around, issueing the git commit, push, pull requests for each individual repo that is part of a multi-repo.

# What this tool does NOT do:
It's a simple tool. It will only commit, push, and pull. Anything else from the git toolset will be left out (for now at least).

## ❤️ Contributors

This project exists thanks to all the people who contribute. [[Contributors](https://github.com/CLDMV/gitmulti/graphs/contributors)].
<a href="https://github.com/CLDMV/gitmulti/graphs/contributors"><img src="https://image.cldmv.net/github/contributors/?repo=gitmulti" /></a>
