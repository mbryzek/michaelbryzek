import { describe, expect, it } from 'vitest';
import { parseSuggestions, renderReply, stripSuggestions } from './suggestions';

const BLOCK = `Chania old town is worth a morning.

\`\`\`suggestions
[{"title": "Seitan Limania", "detail": "40 min east. Steep descent."},
 {"title": "Chania market", "detail": "Closed Sundays."}]
\`\`\``;

describe('parseSuggestions', () => {
  it('reads the fenced block', () => {
    expect(parseSuggestions(BLOCK)).toEqual([
      { title: 'Seitan Limania', detail: '40 min east. Steep descent.' },
      { title: 'Chania market', detail: 'Closed Sundays.' }
    ]);
  });

  it('returns nothing when there is no block', () => {
    expect(parseSuggestions('Just a plain answer.')).toEqual([]);
  });

  /**
   * The reply streams token by token, so the UI parses a partial block on
   * nearly every frame. Half-written JSON must yield no suggestions rather
   * than throwing and taking the whole message render down with it.
   */
  it('survives a block that is still arriving', () => {
    const partial = 'Text\n\n```suggestions\n[{"title": "Seit';
    expect(() => parseSuggestions(partial)).not.toThrow();
    expect(parseSuggestions(partial)).toEqual([]);
  });

  it('drops entries with no title and caps the list at five', () => {
    const many = JSON.stringify([
      { title: '', detail: 'no title' },
      ...Array.from({ length: 8 }, (_, i) => ({ title: `Idea ${i}`, detail: '' }))
    ]);
    const result = parseSuggestions(`text\n\`\`\`suggestions\n${many}\n\`\`\``);
    expect(result).toHaveLength(5);
    expect(result[0].title).toBe('Idea 0');
  });

  it('ignores a block that is not an array', () => {
    expect(parseSuggestions('```suggestions\n{"title":"x"}\n```')).toEqual([]);
  });
});

describe('stripSuggestions', () => {
  it('hides the block from the reader', () => {
    expect(stripSuggestions(BLOCK)).toBe('Chania old town is worth a morning.');
  });

  /**
   * Cut at the opening fence, not the closing one: mid-stream there is no
   * closing fence yet, and showing raw JSON to the reader until it arrives is
   * the visible failure this avoids.
   */
  it('hides a block that has not finished streaming', () => {
    expect(stripSuggestions('Answer.\n\n```suggestions\n[{"title": "Seit')).toBe('Answer.');
  });

  it('leaves a plain reply alone', () => {
    expect(stripSuggestions('Just an answer.')).toBe('Just an answer.');
  });
});

describe('renderReply', () => {
  /**
   * The reply is inserted with {@html}, and it contains web search results —
   * text from pages neither of us controls. Escaping happens before any
   * formatting, so markup in a search result renders as characters.
   */
  it('escapes HTML in the reply', () => {
    const rendered = renderReply('Try <script>alert(1)</script> today');
    expect(rendered).not.toContain('<script>');
    expect(rendered).toContain('&lt;script&gt;');
  });

  it('escapes HTML inside link text and code spans', () => {
    expect(renderReply('`<img onerror=x>`')).not.toContain('<img');
    expect(renderReply('[<b>hi</b>](https://example.com)')).not.toContain('<b>');
  });

  it('only linkifies http and https', () => {
    const rendered = renderReply('[click](javascript:alert(1))');
    expect(rendered).not.toContain('href="javascript:');
  });

  it('formats paragraphs, bullets and headings', () => {
    const rendered = renderReply('## Morning\n\nGo early.\n\n- Market\n- Harbour');
    expect(rendered).toContain('<h4>Morning</h4>');
    expect(rendered).toContain('<p>Go early.</p>');
    expect(rendered).toContain('<li>Market</li>');
    expect(rendered).toContain('<li>Harbour</li>');
  });

  it('handles bold and links', () => {
    const rendered = renderReply('**Seitan Limania** is [here](https://example.com).');
    expect(rendered).toContain('<strong>Seitan Limania</strong>');
    expect(rendered).toContain('rel="noopener noreferrer"');
  });

  it('closes a list that ends the reply', () => {
    const rendered = renderReply('- one\n- two');
    expect(rendered).toBe('<ul><li>one</li><li>two</li></ul>');
  });
});
