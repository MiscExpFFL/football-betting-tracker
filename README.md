# 2026 Football Live Betting Tracker

Static, GitHub Pages-ready dashboard for the weekly NCAA + NFL betting project.

## What it does
- Keeps NCAA and NFL in separate tables and separate season ledgers.
- Tracks weekly record, risk, realized profit/loss, units, and ROI.
- Tracks cumulative season record/P&L independently for NCAA and NFL.
- Grades straight spreads, totals, moneylines, 3-team parlays, and teasers from public ESPN scores.
- Refreshes scores every 60 seconds while the page is open.
- Includes manual score overrides if a public matchup is delayed or not recognized.
- Exports a JSON snapshot of current grades/results.
- Never connects to BetWCS and never places a wager.

## Current seed
NCAA Week 1 includes the 12 wagers confirmed booked on BetWCS ($612 / 6.12u total exposure). The Notre Dame alternate-line slot is shown as open and is not counted in exposure. NFL Week 1 is ready for wagers when they are selected.

## Put it on GitHub Pages
1. Create a new GitHub repository.
2. Upload `index.html` and `data.js` to the repository root.
3. In GitHub: Settings → Pages → Deploy from a branch → `main` / root.
4. GitHub will provide the public URL.

## Add future weeks
Edit `data.js`. Each league has a `weeks` array. Copy a week object, change the week number/date range, and add ticket objects. The site automatically adds that week to the league selector and season P/L table.

## Ticket fields
- `booked`: only booked tickets count toward exposure and P/L.
- `risk`, `toWin`: exact BetWCS dollar amounts.
- `odds`: frozen display price.
- `legs`: used for live grading. Supported `betType` values: `spread`, `moneyline`, `total`.

The tracker assumes 1u = $100 and a 10u weekly cap, configured at the top of `data.js`.

## Time zone

All scheduled kickoff times are converted to Pacific time and displayed as PST on the tracker.
