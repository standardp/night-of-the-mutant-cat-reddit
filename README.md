# Night of the Mutant Cat: Daily (Reddit, Devvit Web)

A point-and-click puzzle for Reddit's Game of the Day Hackathon. Three flatmates, one freezer, one enormous mutant cat. Click a verb, then the thing.

- A new mutation (tint and name) every UTC day, and a fresh per-day leaderboard of fewest actions.
- Built on Devvit Web (Hono server, Redis sorted set for scores).
- Based on the original game: https://github.com/standardp/night-of-the-mutant-cat

## Run

    npm install
    npm run build
    npm run dev    # devvit playtest, needs `npm run login`
