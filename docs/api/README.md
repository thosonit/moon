# API

Two thin JSON endpoints under `app/api/`: `app/api/topics/route.ts` and `app/api/topics/[topicId]/days/route.ts`. Both read from `public/data/*.json` — no database, no auth. No separate `api.md` or `endpoints/` docs are needed beyond the route files themselves.
