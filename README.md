# SC General Assembly - Ideas Engine

A collection of 20 prototype research tools, dashboards, and visualizations powered by the [SC Statehouse REST API](https://rest.scstatehouse.gov). Built by the Legislative Services Agency IT department to explore creative uses of legislative data.

![Master Index](screenshots/00-index.png)

## Overview

Each app is a self-contained single-page HTML application that pulls live data directly from the SC Statehouse REST API (no backend/proxy required — CORS is open). The apps target six audiences: **Lawmakers**, **Leadership**, **Staff**, **Lobbyists**, **Agencies**, and **Constituents**.

## Apps

### Series 1 (01–10)
Dark theme with navy/gold color scheme and inline CSS.

| # | Code | Name | Screenshot |
|---|------|------|------------|
| 01 | LBTS | Legislative Bill Tracker | ![](screenshots/01-lbts.png) |
| 02 | MVRX | Member Voting Record Explorer | ![](screenshots/02-mvrx.png) |
| 03 | CMAP | Committee Meeting & Agenda Planner | ![](screenshots/03-cmap.png) |
| 04 | SCLX | SC Legal Code Cross-Reference Engine | ![](screenshots/04-sclx.png) |
| 05 | BFIS | Budget & Fiscal Impact Synthesizer | ![](screenshots/05-bfis.png) |
| 06 | DMAP | District & Delegation Mapper | ![](screenshots/06-dmap.png) |
| 07 | SPNX | Sponsor Network & Collaboration Graph | ![](screenshots/07-spnx.png) |
| 08 | AMDT | Amendment Tracker & Impact Analyzer | ![](screenshots/08-amdt.png) |
| 09 | LSIV | Legislative Session Intelligence View | ![](screenshots/09-lsiv.png) |
| 10 | PRFN | Public Research & Find Navigator | ![](screenshots/10-prfn.png) |

### Series 2 (11–20)
LSA branded theme using the official LSA Style Guide (`css/lsa-styles.css`).

| # | Code | Name | Screenshot |
|---|------|------|------------|
| 11 | BCAL | Bill Activity Calendar & Legislative Pulse | ![](screenshots/11-bcal.png) |
| 12 | CWHP | Committee Workload & Health Profile | ![](screenshots/12-cwhp.png) |
| 13 | JTFR | Journal & Transcript Research Finder | ![](screenshots/13-jtfr.png) |
| 14 | RCVZ | Roll Call Vote Analyzer & Visualization | ![](screenshots/14-rcvz.png) |
| 15 | MTXS | Member Tenure & Experience Scorecard | ![](screenshots/15-mtxs.png) |
| 16 | LCDB | Legislative Comparison Dashboard | ![](screenshots/16-lcdb.png) |
| 17 | PGOV | Party Governance & Caucus Analyzer | ![](screenshots/17-pgov.png) |
| 18 | WHIP | Whip Count & Vote Prediction Simulator | ![](screenshots/18-whip.png) |
| 19 | ACTX | Action Timeline & Cross-Chamber Tracker | ![](screenshots/19-actx.png) |
| 20 | RLDR | Rules & Leadership Directory | ![](screenshots/20-rldr.png) |

## Project Structure

```
rest-api-ideas-engine/
├── index.html              # Master index with card grid and audience filtering
├── 01-lbts/ ... 20-rldr/   # Individual app folders (each with index.html)
├── css/                     # LSA Style Guide (variables, base, components)
├── assets/images/           # LSA seal logo
├── screenshots/             # PNG captures of all apps
├── rest-documentation/      # API docs and Postman collection
├── take-screenshots.js      # Puppeteer screenshot script
└── package.json             # Node dependencies (puppeteer)
```

## Running Locally

The apps are static HTML files — just open `index.html` in a browser or serve with any static file server:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

All API calls go directly to `https://rest.scstatehouse.gov` from the browser.

## Retaking Screenshots

```bash
npm install
node take-screenshots.js
```

Requires Node.js. Puppeteer will download a bundled Chromium on first install.

## API

All apps use the SC Statehouse REST API at `https://rest.scstatehouse.gov`. Key endpoints include:

- `/bills/{session}/{billId}` — Bill details, actions, sponsors, status
- `/bios` — Member biographies and party affiliation
- `/committees` — Committee listings
- `/votes/{session}/{chamber}` — Roll call vote records
- `/sessions` — Legislative session history
- `/officers/{chamber}` — Chamber leadership
- `/rules/{chamber}` — Chamber rules documents

Full API documentation is in `rest-documentation/`. A Postman v2.1 collection is included for testing.

## License

Internal prototype — South Carolina Legislative Services Agency.
