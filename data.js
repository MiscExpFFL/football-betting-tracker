window.BET_TRACKER_DATA = {
  config: {
    season: 2026,
    unitDollars: 100,
    weeklyCapUnits: 10,
    refreshSeconds: 60,
    timezone: 'America/Los_Angeles'
  },
  leagues: {
    NCAA: {
      label: 'NCAA Football',
      espnPath: 'college-football',
      weeks: [
        {
          week: 1,
          label: 'Week 1',
          dateStart: '2026-09-03',
          dateEnd: '2026-09-07',
          tickets: [
            {
              id: 'NCAA-W1-01', category: 'Best Bet', booked: true,
              description: 'Tulane +7.5 at Duke', risk: 110, toWin: 100, odds: '-110',
              legs: [{ gameKey:'tulane-duke', team:'Tulane', opponent:'Duke', betType:'spread', line:7.5 }]
            },
            {
              id: 'NCAA-W1-02', category: 'Biggest Lock', booked: true,
              description: 'Alabama -28 vs East Carolina', risk: 55, toWin: 50, odds: '-110',
              legs: [{ gameKey:'ecu-alabama', team:'Alabama', opponent:'East Carolina', betType:'spread', line:-28 }]
            },
            {
              id: 'NCAA-W1-03', category: 'Best Total', booked: true,
              description: 'Western Michigan / Michigan Under 49.5', risk: 55, toWin: 50, odds: '-110',
              legs: [{ gameKey:'wmu-michigan', team:'Western Michigan', opponent:'Michigan', betType:'total', direction:'under', line:49.5 }]
            },
            {
              id: 'NCAA-W1-04', category: 'Best Underdog', booked: true,
              description: 'Washington State +23.5 at Washington', risk: 55, toWin: 50, odds: '-110',
              legs: [{ gameKey:'wsu-washington', team:'Washington State', opponent:'Washington', betType:'spread', line:23.5 }]
            },
            {
              id: 'NCAA-W1-05', category: 'Best Bang for the Buck', booked: true,
              description: 'San Jose State ML at Eastern Michigan', risk: 50, toWin: 66, odds: '+132',
              legs: [{ gameKey:'sjsu-emu', team:'San Jose State', opponent:'Eastern Michigan', betType:'moneyline' }]
            },
            {
              id: 'NCAA-W1-06', category: '3-Team Parlay', booked: true,
              description: 'Tulane +7.5 / Washington State +23.5 / SJSU–EMU Under 55.5', risk: 50, toWin: 300, odds: '+600',
              legs: [
                { gameKey:'tulane-duke', team:'Tulane', opponent:'Duke', betType:'spread', line:7.5 },
                { gameKey:'wsu-washington', team:'Washington State', opponent:'Washington', betType:'spread', line:23.5 },
                { gameKey:'sjsu-emu', team:'San Jose State', opponent:'Eastern Michigan', betType:'total', direction:'under', line:55.5 }
              ]
            },
            {
              id: 'NCAA-W1-07', category: '3-Team Teaser', booked: true,
              description: 'Tulane +13.5 / Auburn -1.5 / Notre Dame -14.5', risk: 50, toWin: 90, odds: '+180',
              legs: [
                { gameKey:'tulane-duke', team:'Tulane', opponent:'Duke', betType:'spread', line:13.5 },
                { gameKey:'baylor-auburn', team:'Auburn', opponent:'Baylor', betType:'spread', line:-1.5 },
                { gameKey:'wisconsin-nd', team:'Notre Dame', opponent:'Wisconsin', betType:'spread', line:-14.5 }
              ]
            },
            {
              id: 'NCAA-W1-08', category: '3-Team Underdog Parlay', booked: true,
              description: 'San Jose State ML / Wyoming ML / Tulane ML', risk: 25, toWin: 476, odds: '+1904',
              legs: [
                { gameKey:'sjsu-emu', team:'San Jose State', opponent:'Eastern Michigan', betType:'moneyline' },
                { gameKey:'wyoming-csu', team:'Wyoming', opponent:'Colorado State', betType:'moneyline' },
                { gameKey:'tulane-duke', team:'Tulane', opponent:'Duke', betType:'moneyline' }
              ]
            },
            {
              id: 'NCAA-W1-09', category: 'So Crazy It Just Might Work', booked: true,
              description: 'Toledo ML at Michigan State', risk: 25, toWin: 85, odds: '+340',
              legs: [{ gameKey:'toledo-msu', team:'Toledo', opponent:'Michigan State', betType:'moneyline' }]
            },
            {
              id: 'NCAA-W1-10', category: 'Degenerate Pick', booked: true,
              description: 'Western Kentucky / Nevada Under 52.5', risk: 55, toWin: 50, odds: '-110',
              legs: [{ gameKey:'wku-nevada', team:'Western Kentucky', opponent:'Nevada', betType:'total', direction:'under', line:52.5 }]
            },
            {
              id: 'NCAA-W1-11', category: 'Bonus ATS', booked: true,
              description: 'Tulsa +13.5 vs Oklahoma State', risk: 55, toWin: 50, odds: '-110',
              legs: [{ gameKey:'okstate-tulsa', team:'Tulsa', opponent:'Oklahoma State', betType:'spread', line:13.5 }]
            },
            {
              id: 'NCAA-W1-12', category: 'Bonus ATS', booked: true,
              description: 'Florida Atlantic +26.5 at Florida', risk: 27, toWin: 25, odds: '-110',
              legs: [{ gameKey:'fau-florida', team:'Florida Atlantic', opponent:'Florida', betType:'spread', line:26.5 }]
            },
            {
              id: 'NCAA-W1-ALT', category: 'Best Alternate Line', booked: false,
              description: 'Notre Dame alternate line — check BetWCS game day', risk: 0, toWin: 0, odds: 'TBD',
              legs: []
            }
          ]
        }
      ]
    },
    NFL: {
      label: 'NFL',
      espnPath: 'nfl',
      weeks: [
        {
          week: 1,
          label: 'Week 1',
          dateStart: '2026-09-09',
          dateEnd: '2026-09-14',
          tickets: []
        }
      ]
    }
  }
};
