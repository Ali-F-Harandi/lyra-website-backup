# Lyra made a website — Preservation Backup

Fan preservation backup of **[Lyra made a website](https://lyra-made-a.website/)**, a Pokémon Living Dex companion website by [Lyra](https://www.youtube.com/@Lyra), covering Pokémon Generations 1 to 4.

**Live backup:** <https://ali-f-harandi.github.io/lyra-website-backup/>

## What this is

The original site's owner could no longer afford hosting, so this repository mirrors the entire website and serves it from GitHub Pages:

- **Pokédex tracker** for every generation (click to track, 3-state option, box labels, color themes, multiple sprite sets, import/export of progress)
- **Full living dex guides** with checklists linked to the tracker (localStorage)
- **Catch locations** with encounter tables per version, filters and rod options
- **Pokémon info** pages with quick search and per-version filters
- **Extra info** pages (catching strategies, Poké Balls, events…)
- **Unown dex** for gens 1–4
- Complete English **and French** versions of every page

## Changes compared to the original

- The YouTube channel link was removed from the top bar; a credit to Lyra was added to the footer instead (per the site owner's request conveyed by the user archiving it).
- All internal links were rewritten to work under the GitHub Pages project subpath.
- **Gen 4 completion:** on the original site, the Gen 4 section only had the Pokédex tracker — the guide, catch locations, Pokémon info and extra info pages were never finished. In this backup, the Gen 4 section was completed (EN + FR) by the archive maintainer using the open [PokéAPI](https://pokeapi.co/) database for encounter tables and obtainability data, following the exact layout, styling and conventions of the Gens 1–3 pages. This covers Diamond, Pearl, Platinum, HeartGold and SoulSilver: 289 catch-location pages, 8 Pokémon info filter pages, a full 493-entry living dex guide and an extra info page. The few encounter rates that the database could not model exactly (Poké Radar slots, GBA slot Pokémon, Great Marsh and Trophy Garden daily rotations, Safari Zone object placements) are presented as their slot percentages.
- All other pages are the original site's files, untouched.

## Credits

- All design, concept, data and content: **Lyra** — [YouTube](https://www.youtube.com/@Lyra) — [lyra-made-a.website](https://lyra-made-a.website/)
- Pokémon and all related assets are trademarks of Nintendo / Creatures Inc. / GAME FREAK inc.
- Gen 4 completion data: [PokéAPI](https://pokeapi.co/)
