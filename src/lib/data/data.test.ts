import { describe, expect, it } from 'vitest';
import { blogPosts } from './blog';
import { links } from './links';
import { projects } from './projects';
import { talks } from './talks';
import type { Link, Project, Talk } from '$lib/types';

/**
 * These files are hand-maintained content with no build step to validate them,
 * which is how the weekly review found a stray `&t=5s` on a video URL, three
 * descriptions with trailing spaces, and two URLs pointing at redirect sources.
 * Pin the invariants that hold today so the next edit cannot break them.
 *
 * The whitespace, redirect-host and query-param assertions are deliberately
 * NOT here yet: the data they pin is corrected in the sibling PR, and asserting
 * them before that merges would ship a red branch. Add them once it lands.
 */

const allStrings: { where: string; value: string }[] = [
  ...projects.flatMap((p: Project) => [
    { where: `projects[${p.name}].name`, value: p.name },
    ...p.description.map((d, i) => ({ where: `projects[${p.name}].description[${i}]`, value: d }))
  ]),
  ...links.flatMap((l: Link) => [
    { where: `links[${l.name}].name`, value: l.name },
    ...l.description.map((d, i) => ({ where: `links[${l.name}].description[${i}]`, value: d }))
  ]),
  ...talks.flatMap((t: Talk) => [
    { where: `talks[${t.title}].title`, value: t.title },
    { where: `talks[${t.title}].event`, value: t.event },
    { where: `talks[${t.title}].description`, value: t.description }
  ]),
  ...blogPosts.flatMap((b) => [
    { where: `blogPosts[${b.slug}].title`, value: b.title },
    { where: `blogPosts[${b.slug}].date`, value: b.date }
  ])
];

const externalUrls: { where: string; value: string }[] = [
  ...projects.flatMap((p: Project) => [
    ...(p.githubUrl ? [{ where: `projects[${p.name}].githubUrl`, value: p.githubUrl }] : []),
    ...(p.projectUrl ? [{ where: `projects[${p.name}].projectUrl`, value: p.projectUrl }] : [])
  ]),
  ...links.map((l: Link) => ({ where: `links[${l.name}].url`, value: l.url })),
  ...talks.map((t: Talk) => ({ where: `talks[${t.title}].videoUrl`, value: t.videoUrl }))
];

describe('site content', () => {
  it('has no empty copy', () => {
    const offenders = allStrings.filter(({ value }) => value.length === 0);
    expect(offenders).toEqual([]);
  });
});

describe('external urls', () => {
  it('are all absolute https', () => {
    const offenders = externalUrls.filter(({ value }) => !value.startsWith('https://'));
    expect(offenders).toEqual([]);
  });

  it('all parse as URLs', () => {
    const offenders = externalUrls.filter(({ value }) => !URL.canParse(value));
    expect(offenders).toEqual([]);
  });
});

describe('blog posts', () => {
  it('have unique slugs', () => {
    const slugs = blogPosts.map((post) => post.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('have url-safe slugs', () => {
    const offenders = blogPosts.filter((post) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(post.slug));
    expect(offenders).toEqual([]);
  });
});
