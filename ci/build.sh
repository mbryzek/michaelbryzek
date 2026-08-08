#!/usr/bin/env bash
#
# What CI runs for michaelbryzek.
#
# LANDING THIS FILE IS THE ENROLMENT (ISS-848). The fleet verifies a repo exactly
# when `ci/build.sh` exists at a pull request's head sha — there is no registry to
# keep in step with the repos that have one. A verify job checks the commit out
# detached, runs this, and posts the result as the `ci` commit status the merge
# lane reads.
#
# That cuts both ways: **a broken script here parks every pull request in this
# repo**, because the lane refuses anything whose `ci` is not green. Confirm a
# change to it by hand before merging one:
#
#   dev ci verify --repo mbryzek/michaelbryzek --sha <head sha> --pr <n> --no-post
#
# `set -euo pipefail` is not style. A pipeline reports only its LAST command's
# status, so any chain here that swallowed a failure would exit 0 and publish a
# green nothing measured. One exit status, no exceptions.
#
# This repo's build needs nothing from the machine beyond disk — no Docker, no
# registry credential, no session database — so there is no `# ci-needs:` line.
# `dev ci preflight` reads that directive out of this file at the sha being
# built, so adding a dependency here means adding it there in the same commit.
set -euo pipefail

echo "building ${CI_REPO:-michaelbryzek} @ ${CI_SHA:-working tree} (${CI_EVENT:-local}, clean=${CI_CLEAN_BUILD:-?})"

# `npm ci` rather than `npm install`: the lockfile is the contract, and a build
# that silently resolved a different tree than the one committed is a green
# measured on something nobody is merging. It is fast here regardless — the
# download half is served from ~/.npm, which lives outside the checkout and
# survives every clean.
npm ci

# svelte-check + eslint --max-warnings 0 + prettier --check.
npm run check

# vitest. Named `test` rather than `test:unit` in this repo, and there is no
# Playwright suite here at all, so this is the whole of it.
npm run test

# THE BUILD IS A VERDICT `npm run check` CANNOT GIVE (ISS-868). SvelteKit's
# "$lib/server imported into browser code" guard is a vite BUILD plugin, so
# svelte-check is blind to it — as it is to a bad adapter config and every other
# build-only vite failure. Without this step the release is the first thing that
# ever builds the repo, and the leak is found by a `dev deploy` that has already
# tagged and pushed. That is exactly how playbook-admin 0.4.42 shipped a tag and
# deployed nothing.
npm run build
