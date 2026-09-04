# 2026 Football Betting Tracker

Static GitHub Pages tracker for the 2026 NCAA and NFL betting project.

## Structure

- `index.html` — page shell
- `styles.css` — responsive desktop/mobile styling
- `app.js` — score-feed, grading, live-sweat, exposure, P/L and analytics logic
- `data.js` — the season ledger and the only file that normally changes when weekly bets are added
- `404.html` — GitHub Pages fallback

## Weekly workflow

1. Add the exact booked BetWCS tickets to `data.js`.
2. NCAA and NFL remain separate by league and week.
3. Each leg supports an `espnEventId`. When a verified ESPN event ID is available, the tracker uses it first; otherwise it falls back to strict two-team matching.
4. Public ESPN scores are used for live grading only.
5. When a week is complete, freeze each ticket with `result`, `pnl`, and `settledAt`, set the week `archived: true`, and optionally enter `closingLine` / `closingOdds` for CLV. Archived weeks then remain a permanent season ledger independent of the live feed.

## v1.4 features

- Separate NCAA and NFL ledgers
- Combined All Football summary without mixing the underlying records
- Live Sweat panel
- Game-level exposure panel
- Weekly risk, settled risk, open risk, realized P/L, ROI and remaining 10u cap
- Profit still alive
- ESPN event-ID support with strict two-team fallback matching
- Desktop table + mobile betting cards
- All / Live / Upcoming / Settled filters
- Weekly and cumulative season P/L
- Category and bet-type leaderboards
- CLV tracking
- Best/worst week and biggest win/loss
- Manual score overrides and JSON export
- Pacific Time (`PT`) display
- Last score refresh and last site update timestamps

## Standing betting rules

- 1u = $100
- 10u maximum exposure per league/week
- NCAA and NFL tracked separately
- Booked BetWCS line/price is frozen for grading
- The site never connects to BetWCS and cannot place wagers
