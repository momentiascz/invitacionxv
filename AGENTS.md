# AGENTS

## Project type
Static HTML/CSS/JavaScript invitation page. No build system, no package manager, no backend.

## Key files
- `index.html` — page structure, sections, content, accessibility markup.
- `css/style.css` — visual design, layout, responsive behavior, theming.
- `js/main.js` — page behavior, countdown, playlist embed, gallery, RSVP/WhatsApp flow.
- `README.md` — publishing and personalization guidance for end users.

## What agents should know
- This project is designed to be deployed as a plain static website.
- The editable configuration lives in `js/main.js` inside the `CONFIG` object.
  - `eventDate` controls the countdown target.
  - `whatsappNumber` controls the RSVP share link.
  - `spotifyPlaylistId` controls the embedded Spotify player.
  - `galleryCount` controls how many gallery slots are rendered.
- Gallery images are expected under `assets/img/` and are enabled by replacing the placeholder markup in `initGallery()`.
- The page intentionally uses progressive enhancement and accessible patterns (`aria-label`, `aria-live`, `role="dialog"`, skip link).
- Preserve the existing mobile-first card layout and accessible markup when editing.

## Best practices for changes
- Edit content and text in `index.html` for names, dates, locations, dress code, and event details.
- Edit layout and styling in `css/style.css`; avoid introducing external frameworks.
- Edit behavior and configuration in `js/main.js` only for interactivity, page state, and personalization values.
- Keep paths relative and do not assume a build pipeline.

## Validation
- No build step is required. Changes can be validated by opening `index.html` in a browser.
- If a feature depends on JavaScript, make sure a failure in one module does not break the rest of the page.

## Notes
- The repository root does not include a `.github` folder or existing Copilot instruction files.
- `README.md` is the primary user-facing documentation for customizing and deploying this invitation.
