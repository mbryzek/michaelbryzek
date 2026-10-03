/**
 * @vitest-environment happy-dom
 *
 * The three cards share one shell (`Card.svelte`), and `app.css` styles that
 * shell by class name. These mount each card and pin what a visitor gets: the
 * title, where it links, and one paragraph per description entry — plus the
 * one structural rule the shell exists to keep, that a card with several links
 * is never wrapped in an outer anchor.
 */
import { flushSync, mount, unmount, type Component } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import type { Link, Project, Talk } from '$lib/types';

const LinkCard = (await import('./LinkCard.svelte')).default;
const TalkCard = (await import('./TalkCard.svelte')).default;
const ProjectCard = (await import('./ProjectCard.svelte')).default;

function render<P extends Record<string, unknown>>(component: Component<P>, props: P) {
  const instance = mount(component, { target: document.body, props });
  flushSync();
  return instance;
}

const card = () => document.querySelector('.project')!;
const title = () => card().querySelector('.project-top .pname')!;
const paragraphs = () => [...card().querySelectorAll('.pdesc')].map((p) => p.textContent);

afterEach(() => {
  document.body.innerHTML = '';
});

describe('LinkCard', () => {
  const link: Link = { name: 'rallyd', description: ['First.', 'Second.'], url: 'https://rallyd.net' };

  it('is one anchor to the link, with the title, the arrow and each description paragraph', async () => {
    const instance = render(LinkCard, { link });

    expect(card().tagName).toBe('A');
    expect(card().getAttribute('href')).toBe('https://rallyd.net');
    expect(title().tagName).toBe('P');
    expect(title().textContent).toBe('rallyd');
    expect(card().querySelector('.project-top .arrow svg')).not.toBeNull();
    expect(paragraphs()).toEqual(['First.', 'Second.']);

    await unmount(instance);
  });
});

describe('TalkCard', () => {
  const talk: Talk = {
    title: 'Testing in Production',
    event: 'Podcast',
    date: 'January 2025',
    description: ['A conversation.'],
    videoUrl: 'https://www.youtube.com/watch?v=6qv0sCcV_Zg'
  };

  it('is one anchor to the video, with the title, the event line and the description', async () => {
    const instance = render(TalkCard, { talk });

    expect(card().tagName).toBe('A');
    expect(card().getAttribute('href')).toBe(talk.videoUrl);
    expect(title().textContent).toBe('Testing in Production');
    expect(card().querySelector('.arrow')).not.toBeNull();
    expect(card().querySelector('.talk-meta')!.textContent).toBe('Podcast · January 2025');
    expect(paragraphs()).toEqual(['A conversation.']);

    await unmount(instance);
  });
});

describe('ProjectCard', () => {
  const project: Project = {
    name: 'apibuilder',
    description: ['One.', 'Two.'],
    githubUrl: 'https://github.com/apicollective/apibuilder',
    projectUrl: 'https://www.apibuilder.io'
  };

  it('is a plain container whose title links to the primary url, with an icon per link and no arrow', async () => {
    const instance = render(ProjectCard, { project });

    expect(card().tagName).toBe('DIV');
    expect(card().closest('a')).toBeNull();
    expect(title().tagName).toBe('A');
    expect(title().getAttribute('href')).toBe('https://www.apibuilder.io');
    expect(title().textContent).toBe('apibuilder');
    expect(card().querySelector('.arrow')).toBeNull();
    expect([...card().querySelectorAll('.card-icons a')].map((a) => a.getAttribute('aria-label'))).toEqual([
      'Project website',
      'GitHub repository'
    ]);
    expect(paragraphs()).toEqual(['One.', 'Two.']);

    await unmount(instance);
  });

  it('renders a plain title when the project has no url at all', async () => {
    const instance = render(ProjectCard, { project: { name: 'quiet', description: ['Only.'] } });

    expect(title().tagName).toBe('P');
    expect(card().querySelectorAll('a')).toHaveLength(0);

    await unmount(instance);
  });
});
