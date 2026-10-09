# Commercial Browser

A React and Vite application hosted on Netlify. Public browser hubs work without an account. Netlify Identity handles accounts, and Netlify Database stores custom apps, ticker messages, user profiles, and per-account theme preferences.

## Deployment

The Netlify build command is `npm run build`, and the publish directory is `dist`. The build compiles TypeScript and bundles the frontend; it no longer runs Convex code generation or requires a Convex deploy key, deployment URL, or Hercules authentication configuration.

Netlify Database is provisioned by the platform. The schema is defined in `db/schema.ts`, and generated migrations are stored in `netlify/database/migrations/`. The initial migrations create the tables and seed the built-in quick apps and welcome ticker messages. Netlify applies these migrations during deployment; do not apply them manually.

Netlify Identity was enabled through the project's feature activation marker. Account screens are available at `/auth`, including email/password login, signup when registration is open, email confirmation, password recovery, and invitation acceptance. Signup normally requires email confirmation. Administrators must have the `admin` role assigned in Netlify Identity; there is no shared administrator password in the frontend.

Existing Convex records and Hercules accounts are not imported automatically. This deployment starts with the seeded content, and visitors must create or accept invitations for new Netlify Identity accounts. No external credentials are needed for the new backend.

## Application data

`GET /api/app-data` reads active apps and tickers in display order, along with the signed-in account's saved theme. The frontend refreshes content periodically and retains built-in display defaults if the API is unavailable.

`POST /api/preferences` validates the selected theme and saves it for the authenticated Netlify Identity user. Guests can preview themes for the current page session; signing in is required to save them across visits. Theme preferences are stored separately for each account.

The existing admin panel remains a read-only overview. This migration did not add content-editing controls or change the browser's VPN, ad-blocking, media, or note-taking behavior.

## Development

Install dependencies with `npm ci`, then run `netlify dev --port 8889` to emulate the frontend, functions, and Netlify services together. `npm run dev` runs only Vite and does not emulate the backend.

For schema changes, edit `db/schema.ts` and run `npx drizzle-kit generate --name describe_the_change`. Commit the generated migration files alongside the schema. The Netlify Database adapter requires the beta release line of both Drizzle packages.

Type checking can be run without generating build artifacts:

```sh
npx tsc --noEmit --incremental false -p tsconfig.app.json
npx tsc --noEmit --incremental false -p tsconfig.node.json
```

`npm test` runs the configured test projects; the repository currently contains no test files.
