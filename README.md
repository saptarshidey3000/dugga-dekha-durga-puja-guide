# DUGGA DEKHA — Kolkata Durga Puja 2026 Metro & Bonedi Bari Guide

"Dugga Dekha tells you where to start and where to go next."

DUGGA DEKHA is a mobile-first, curated Kolkata Durga Puja pandal-hopping guide organized around Kolkata Metro arteries and aristocratic Bonedi Bari heritage households.

## Key Features

1. **Metro Puja Guide**: Curated walking circuits organized by Kolkata regions (South, North, Central, East/West Metro) and stations (Kalighat, Deshapriya Park, Sovabazar, MG Road, etc.).
2. **Bonedi Bari Heritage Guide**: 6 heritage enclaves (Shobhabazar, Girish Park, MG Road, Central, Bhowanipore, Behala) with step-by-step hopping circuits.
3. **Step-by-Step Walking Timeline**: Vertical timelines with red numbered circles (`01`, `02`, `03`...), verified Metro exit gates, walking times, directions, and live sticky next-stop navigation.
4. **Spatial Interactive Map**: Centered on verified coordinates with route polyline paths.
5. **Offline Bookmarking**: Instant saving of pandals stored locally (`localStorage`).

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Key variables:
- `NEXT_PUBLIC_SITE_NAME`: "Dugga Dekha"
- `NEXT_PUBLIC_SITE_URL`: "http://localhost:3000"
- `NEXT_PUBLIC_PUJA_YEAR`: "2026"

## Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Production Build

```bash
npm run build
npm start
```
