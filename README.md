# Infodash

Infodash is a Next.js + Supabase opportunity intelligence dashboard for tracking internships, research opportunities, and hackathons in one place.

## Features

- Track internships, research programs, and hackathons
- Filter by category, level, and status
- Search by title, organization, skill, and location
- Sort by latest, deadline, level, title, or category
- Toggle between detailed and compact card views
- Live deployment on Vercel

## Tech Stack

- Next.js
- TypeScript
- Supabase
- Vercel
- Custom CSS

## Live Demo

https://infodash-eta.vercel.app?_vercel_share=kwo7eKiXhgTzB3Eg7SeCsZw6taVlHWYG
## Data Model

The dashboard is designed around opportunities with fields such as:
- title
- category
- level
- status
- organization
- location
- deadline
- event dates
- compensation or prize details
- skills
- official URL
- application URL

## Roadmap

### Phase A
- Base Supabase integration
- Core dashboard
- Initial deployment

### Phase B
- Premium UI redesign
- Better search, sorting, and filters
- Compact and detailed card modes

### Phase C
- Add more live sources
- Improve ingestion pipeline
- Better normalization and duplicate handling

### Phase D
- Analytics and charts
- Detail drawer or modal
- Saved filters and richer discovery workflows

## Why I built this

Students often discover internships, research programs, and hackathons from scattered platforms. Infodash is an attempt to centralize those opportunities into a single, searchable dashboard.

## Status

Active and evolving.

## License

MIT
