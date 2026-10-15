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

# THE SHARED STEPS ARE DEVOPS', NOT THIS FILE'S (ISS-19732). `dev ci step NAME`
# runs `templates/ci/steps/NAME` out of the devops release this machine runs, so a
# step's rule, its comment or a new step in the family sequence reaches every
# SvelteKit repo with one devops release and no pull request here. Each step
# reports what it covered itself. `dev ci step --list` says what this release
# carries, and the comments that say why each step exists live with the step.
#
# `codegen`: the two codegen lints, before `npm ci` because they read only
# committed files; reported not-run without `.api/config.pkl`.
dev ci step codegen

# `npm ci` rather than `npm install`: the lockfile is the contract, and a build
# that silently resolved a different tree than the one committed is a green
# measured on something nobody is merging. It is fast here regardless — the
# download half is served from ~/.npm, which lives outside the checkout and
# survives every clean.
npm ci

# svelte-check + eslint --max-warnings 0 + vitest. `npm run check`
# is the whole gate in every SvelteKit repo in this fleet (ISS-3885), so there is
# deliberately no second test step below. There is no Playwright suite here at all.
npm run check

# `sveltekit`: everything the family runs after `npm run check`, in order —
# the advisory format report (formatting never fails a build, ISS-19427), the
# svelte-vitals gate on new findings (ISS-15600), and `npm run build`, the verdict
# svelte-check cannot give (ISS-868).
#
# The hygiene sweep reads the declaration below out of this file and runs the
# repo's `scripts/check-format` (a copy of devops templates/ci/check-format) over
# `main` every 14 days.
# ci-advisory: scripts/check-format
dev ci step sveltekit
