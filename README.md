# 2026 Football Live Betting Tracker

Static GitHub Pages dashboard for the weekly NCAA + NFL betting project. The live site keeps NCAA and NFL as separate season ledgers while also showing a combined All Football summary.

## v1.5
- Separate NCAA and NFL weekly/season records, P/L and realized ROI.
- Live grading of spreads, totals, moneylines, parlays and teasers from public ESPN scores.
- Exact frozen BetWCS risk, payout and odds for each booked ticket.
- Live Sweat cards with current edge, score, multi-leg progress and money still alive.
- Game exposure/concentration so repeated opinions across straight bets, parlays and teasers are visible.
- 10u weekly exposure meter plus settled risk, open/review risk, remaining cap and potential profit.
- Season Pulse with hit rate, average stake, average P/L per settled bet, current streak and max drawdown.
- Permanent week-by-week season ledger with cumulative P/L equity curve and archive state.
- Category leaderboard and bet-type leaderboard.
- Straight Bets vs Parlays/Teasers performance.
- Performance by odds/price band.
- CLV framework: average/median point CLV, beat-close percentage, best/worst CLV and CLV on wins vs losses once closing lines are entered.
- Streak, peak P/L, drawdown and season-low analytics.
- Best/worst week, biggest ticket win/loss and best/worst category.
- Week-over-week risk, P/L, ROI and hit-rate comparisons.
- Desktop table plus mobile card layout.
- Filters for All, Live, Upcoming, Settled and Review.
- Manual score overrides and JSON result export.
- Pacific time displayed as PT.

## Reliability
- Score lookup prefers a verified ESPN event ID when one is stored on a leg.
- Otherwise it requires an exact two-team match inside the same ESPN event; loose substring matching is not used.
- NCAA and NFL feeds are queried independently.
- A push inside a multi-leg ticket is flagged `REVIEW` instead of assuming the whole parlay/teaser pushes. This prevents incorrect P/L when the sportsbook reduces a parlay or applies a teaser-specific push rule.
- Completed weeks can be frozen directly into `data.js` with final results so historical records no longer depend on old live-score responses.

## Current seed
NCAA Week 1 contains the 12 confirmed booked BetWCS wagers for $612 / 6.12u total exposure. The Notre Dame alternate-line category remains open for a possible game-day wager. The SMU–Florida State Pass of the Week is recorded as an intentional pass. NFL Week 1 is ready for the NFL card.

## Weekly workflow
1. Build the NCAA and NFL cards in ChatGPT.
2. Confirm the exact wagers actually booked at BetWCS.
3. ChatGPT updates `data.js` directly through the connected GitHub repository.
4. The existing GitHub Pages URL republishes automatically.
5. After games settle, final results and closing lines can be archived into the same weekly record.

## Repository structure
- `index.html` / `404.html` — page shell and Pages fallback.
- `styles.css` — base responsive styling.
- `v15.css` — v1.5 performance/analytics styling.
- `data.js` — season ledger and the only file normally changed for weekly wagers/results.
- `core.js` — score matching, grading and statistics engine.
- `ui.js` — summaries, live sweat, wager tables, mobile cards and season ledger.
- `analytics.js` — Performance Lab and CLV/streak/drawdown analysis.
- `boot.js` — public score refresh, manual overrides and exports.

The tracker assumes **1u = $100** and a **10u weekly cap**, configured at the top of `data.js`. It never connects to BetWCS and cannot place wagers.
