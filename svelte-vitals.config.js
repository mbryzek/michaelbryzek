// svelte-vitals (ci/build.sh gates on it, ISS-15600). This is a public site, so
// the seo rules apply alongside correctness, security and a11y; performance and
// architecture are not gated.
// The config file has no category key, so every rule outside the gated
// categories is turned off by id — a rule a later release adds lands in the
// right half on its own.
import { knownRuleIds } from 'svelte-vitals';

const GATED = new Set(['correctness', 'security', 'a11y', 'seo']);

export default {
  failOn: 'warning',
  rules: Object.fromEntries(
    knownRuleIds()
      .filter((id) => !GATED.has(id.split('/')[0]))
      .map((id) => [id, 'off'])
  )
};
