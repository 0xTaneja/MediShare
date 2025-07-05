# MediShare – Secure Patient ↔ Doctor File Sharing

Live Demo: https://medishares.netlify.app/

MediShare lets patients upload any medical file (PDF, scan, report) and instantly share a permanent IPFS link with their doctor.  Doctors can view all files addressed to their ID in a simple portal – no accounts, no blockchain wallets, just secure links.

## Features

| Role | Capability |
|------|------------|
| Patient | • Choose file → upload to Pinata IPFS via Netlify Function<br/>• CID / gateway link copied to clipboard |
| Doctor | • Enter Doctor-ID → fetch list of files sent to them<br/>• Open or copy link to view in browser |

Additional goodies:
* Links are immutable & globally accessible via `https://gateway.pinata.cloud/ipfs/<cid>`
* Pinata JWT hidden in serverless functions – never exposed to the browser
* Built with vanilla JS + Vite, no heavyweight frameworks

## Tech Stack

- Front-end: HTML5, CSS, vanilla JS, Vite
- Backend: Netlify Functions (Node 18)
- Storage: Pinata Cloud IPFS API

## Local Dev
```bash
# install deps
npm install
# dev server at http://localhost:5173 (Vite)
npm run dev
```

## Deploy on Netlify
1. Fork this repo → New Site → Import from GitHub
2. Add env var `PINATA_JWT` (value: "Bearer <your-jwt>")
3. Netlify picks up `netlify.toml`; no build command required (we serve /public)

## License

MIT © 2025 Rushab Taneja 
