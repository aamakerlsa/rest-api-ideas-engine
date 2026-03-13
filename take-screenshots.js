#!/usr/bin/env node
/**
 * take-screenshots.js
 * Opens each app's index.html in a headless browser, waits for API data to load,
 * and saves a PNG screenshot to ./screenshots/
 *
 * Usage: node take-screenshots.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const APPS = [
  { dir: '01-lbts', name: 'Legislative Bill Tracker' },
  { dir: '02-mvrx', name: 'Member Voting Record Explorer' },
  { dir: '03-cmap', name: 'Committee Meeting & Agenda Planner' },
  { dir: '04-sclx', name: 'SC Legal Code Cross-Reference Engine' },
  { dir: '05-bfis', name: 'Budget & Fiscal Impact Synthesizer' },
  { dir: '06-dmap', name: 'District & Delegation Mapper' },
  { dir: '07-spnx', name: 'Sponsor Network & Collaboration Graph' },
  { dir: '08-amdt', name: 'Amendment Tracker & Impact Analyzer' },
  { dir: '09-lsiv', name: 'Legislative Session Intelligence View' },
  { dir: '10-prfn', name: 'Public Research & Find Navigator' },
  { dir: '11-bcal', name: 'Bill Activity Calendar & Legislative Pulse' },
  { dir: '12-cwhp', name: 'Committee Workload & Health Profile' },
  { dir: '13-jtfr', name: 'Journal & Transcript Research Finder' },
  { dir: '14-rcvz', name: 'Roll Call Vote Analyzer & Visualization' },
  { dir: '15-mtxs', name: 'Member Tenure & Experience Scorecard' },
  { dir: '16-lcdb', name: 'Legislative Comparison Dashboard' },
  { dir: '17-pgov', name: 'Party Governance & Caucus Analyzer' },
  { dir: '18-whip', name: 'Whip Count & Vote Prediction Simulator' },
  { dir: '19-actx', name: 'Action Timeline & Cross-Chamber Tracker' },
  { dir: '20-rldr', name: 'Rules & Leadership Directory' },
  { dir: '.', file: 'index.html', name: 'Master Index', output: '00-index' },
];

const PROJECT_ROOT = __dirname;
const SCREENSHOTS_DIR = path.join(PROJECT_ROOT, 'screenshots');
const VIEWPORT = { width: 1440, height: 900 };
const WAIT_FOR_DATA_MS = 8000;  // wait for API data to load
const NAV_TIMEOUT_MS = 30000;

async function takeScreenshots() {
  // Ensure screenshots directory exists
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  console.log('Launching headless browser...');
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: VIEWPORT,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const results = { success: [], failed: [] };

  for (const app of APPS) {
    const file = app.file || 'index.html';
    const htmlPath = path.join(PROJECT_ROOT, app.dir, file);
    const outputName = app.output || app.dir;
    const pngPath = path.join(SCREENSHOTS_DIR, `${outputName}.png`);

    if (!fs.existsSync(htmlPath)) {
      console.log(`  SKIP  ${app.dir} - ${htmlPath} not found`);
      results.failed.push({ app: app.dir, reason: 'file not found' });
      continue;
    }

    const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

    try {
      console.log(`  [${APPS.indexOf(app) + 1}/${APPS.length}] ${outputName} - ${app.name}`);

      const page = await browser.newPage();
      await page.setViewport(VIEWPORT);

      // Navigate to the local HTML file
      await page.goto(fileUrl, {
        waitUntil: 'networkidle2',
        timeout: NAV_TIMEOUT_MS,
      });

      // Wait extra time for API fetches to complete and DOM to render
      await page.waitForFunction(() => {
        // Check if any loading spinners are still visible
        const spinners = document.querySelectorAll('.spinner, .loading, [class*="loading"]');
        for (const s of spinners) {
          if (s.offsetParent !== null) return false; // still visible
        }
        return true;
      }, { timeout: WAIT_FOR_DATA_MS }).catch(() => {
        // If spinner check times out, continue anyway
      });

      // Additional wait for any remaining renders
      await new Promise(r => setTimeout(r, 3000));

      // Take full-page screenshot
      await page.screenshot({
        path: pngPath,
        fullPage: false, // viewport-sized screenshot for consistency
        type: 'png',
      });

      await page.close();
      console.log(`         -> saved ${outputName}.png`);
      results.success.push(outputName);
    } catch (err) {
      console.error(`  FAIL  ${outputName}: ${err.message}`);
      results.failed.push({ app: outputName, reason: err.message });
    }
  }

  await browser.close();

  // Summary
  console.log('\n--- Screenshot Summary ---');
  console.log(`Success: ${results.success.length}/${APPS.length}`);
  if (results.failed.length) {
    console.log(`Failed:  ${results.failed.length}`);
    results.failed.forEach(f => console.log(`  - ${f.app}: ${f.reason}`));
  }
  console.log(`\nScreenshots saved to: ${SCREENSHOTS_DIR}`);
}

takeScreenshots().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
