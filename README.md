# michaelbryzek.svelte

Personal website for Michael Bryzek, built with SvelteKit and Tailwind CSS.

## Tech Stack

- **Framework**: SvelteKit 2.x with TypeScript and Svelte 5 runes
- **Styling**: Tailwind CSS 4.x with @tailwindcss/forms plugin
- **Deployment**: Static site generation with @sveltejs/adapter-static
- **Type Safety**: Strict TypeScript configuration
- **Build**: Vite 8.x with the @tailwindcss/vite plugin

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── Shell.svelte              # Main layout with navigation and footer
│   │   ├── icons/                    # SVG icon components
│   │   ├── cards/                    # ProjectCard, TalkCard, LinkCard
│   │   ├── ui/                       # ExternalLink
│   │   ├── blog/                     # Blog styling components
│   │   └── ThemeToggle.svelte        # Light/dark theme switch
│   ├── data/
│   │   ├── projects.ts               # 7 projects
│   │   ├── talks.ts                  # 4 talks
│   │   ├── links.ts                  # 2 links
│   │   └── blog.ts                   # Blog metadata
│   ├── posts/
│   │   ├── MotivationBehindTrueAcumen.svelte
│   │   └── ManagingStateInElmSinglePageApps.svelte
│   ├── types.ts                      # TypeScript interfaces
│   └── urls.ts                       # URL constants
├── routes/
│   ├── +layout.svelte                # Root layout
│   ├── +layout.ts                    # Prerender configuration
│   ├── +page.svelte                  # Home/About page
│   ├── +error.svelte                 # 404 page
│   ├── _internal_/version/+server.ts  # Build version endpoint
│   ├── projects/+page.svelte
│   ├── talks/+page.svelte
│   ├── links/+page.svelte
│   └── blog/
│       ├── +page.svelte              # Blog index
│       └── [slug]/
│           ├── +page.svelte          # Blog post viewer
│           └── +page.ts              # Dynamic route loader
└── app.css                           # Global Tailwind styles
```

## Development

```bash
# Install dependencies
npm install

# Start development server
./run.sh
# or
npm run dev

# Type check, lint and format check (the full gate)
npm run check

# Run tests
npm test

# Lint / format on their own
npm run lint
npm run lint:fix
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
```

## Pages

- **/** - Home/About page
- **/projects** - Project showcase (7 projects)
- **/talks** - Speaking engagements (4 talks)
- **/links** - External links (2 links)
- **/blog** - Blog index
- **/blog/[slug]** - Individual blog posts (2 posts)

## Design

- **Theming**: CSS custom-property tokens under `[data-theme='light']` /
  `[data-theme='dark']` in `app.css`, switched by `ThemeToggle.svelte`. Dark is
  the default; the choice is stored in `localStorage` and applied by an inline
  script in `+layout.svelte` before first paint so there is no flash.
- **Typography**: Self-hosted Hanken Grotesk (UI) and JetBrains Mono (code),
  subset to latin and preloaded from `static/fonts/`
- **Mobile-First**: Responsive grid layouts with Tailwind breakpoints
- **Icons**: Custom SVG components for GitHub, LinkedIn, X, Email, etc.
- **Accessibility**: WCAG AA contrast on text tokens, visible focus rings, and
  `prefers-reduced-motion` support throughout

## Build Output

Static HTML pages generated in `/build`:

- All routes pre-rendered at build time
- Optimized assets in `_app/immutable/`
- Ready for deployment to any static host

## Migration Notes

This site was migrated from Elm 0.19.1 to SvelteKit 2.x, preserving:

- Exact dark theme color palette
- All content (projects, talks, links, blog posts)
- Navigation structure and footer
- Mobile-responsive design
- SEO-friendly static HTML generation

Key improvements:

- Simpler component syntax with Svelte 5 runes
- Faster builds and hot module replacement
- Native TypeScript support
- Better developer experience
