# Travel Assistant — Claude Code Guide

## Stack

| Layer    | Technology                                                       |
| -------- | ---------------------------------------------------------------- |
| Monorepo | Bun workspaces (`api/`, `client/`, `shared/`)                    |
| Frontend | React 19 + Vite 6 + TypeScript                                   |
| UI       | HeroUI v2 + Heroicons + Tailwind v4                              |
| Auth     | AWS Cognito + Amplify v6                                         |
| API      | Serverless Framework 4 + AWS Lambda (Node 22) + API Gateway HTTP |
| Database | AWS DynamoDB                                                     |
| Hosting  | Firebase Hosting                                                 |

## Workspace structure

```
travel-assistant-challenge/
├── api/          Lambda handlers, DynamoDB data layer, serverless.yml
├── client/       React app (Vite)
├── shared/       TypeScript types shared between api and client
└── .github/      CI/CD workflows
```

## Local development

```bash
bun install          # install all workspace deps + run prepare (sets up Husky)
bun dev              # start api (serverless-offline) + client (Vite) concurrently
bun dev:client       # client only — no AWS needed (uses VITE_DEV_AUTH=true)
bun dev:api          # api only — requires Docker DynamoDB Local on port 8000
```

### Auth bypass for local dev

Set `VITE_DEV_AUTH=true` in `client/.env.local` to skip Cognito and use a hardcoded dev user. The API reads `x-user-id` header when `IS_OFFLINE=true` (set automatically by serverless-offline).

## Key environment variables

| Variable                           | Where                     | Purpose                      |
| ---------------------------------- | ------------------------- | ---------------------------- |
| `VITE_DEV_AUTH`                    | `client/.env.local`       | `true` = bypass Cognito      |
| `VITE_API_URL`                     | `client/.env.local`       | API base URL                 |
| `VITE_COGNITO_USER_POOL_ID`        | `client/.env.local`       | Cognito pool ID              |
| `VITE_COGNITO_USER_POOL_CLIENT_ID` | `client/.env.local`       | Cognito client ID            |
| `IS_OFFLINE`                       | set by serverless-offline | switches auth mode in Lambda |

## Testing

```bash
bun run test           # run api + client tests
bun run test:api       # Jest (api/src/__tests__/**/*.test.ts)
bun run test:client    # Vitest (client/src/__tests__/**/*.test.{ts,tsx})
```

- **API**: Jest + ts-jest. All DynamoDB calls are mocked via `jest.mock`. No real AWS needed.
- **Client**: Vitest + jsdom + Testing Library. `fetch` and `aws-amplify/auth` are mocked via `vi.mock`.

## Code formatting

```bash
bun run format          # prettier --write (formats everything)
bun run format:check    # prettier --check (CI check, fails if unformatted)
```

Config: `.prettierrc` at root (2 spaces, double quotes, trailing commas, 100 char width).

## Git hooks (Husky)

| Hook         | Runs            | Command                                            |
| ------------ | --------------- | -------------------------------------------------- |
| `pre-commit` | on every commit | `lint-staged` → formats staged files with Prettier |
| `pre-push`   | before push     | `bun run test` → blocks push if any test fails     |

Run `bun install` to activate the hooks (triggers the `prepare` script).

## CI/CD

Two GitHub Actions workflows deploy on push to `main` or `staging`:

- **`deploy-api.yml`**: format check → tests → `serverless deploy` (us-east-1 for prod, us-east-2 for staging)
- **`deploy-client.yml`**: format check → tests → Vite build → Firebase Hosting deploy

Both jobs use GitHub Environments (`PROD` / `STG`) for environment-scoped secrets.

## Shared types

All API request/response types live in `shared/src/index.ts`. Import from `"shared"` in both `api/` and `client/`. The workspace alias is configured in each `tsconfig.json`.

## Security notes

- API Gateway uses a Cognito JWT authorizer on all routes (production only)
- Lambdas read `event.requestContext.authorizer.jwt.claims.email` for user identity
- Local dev uses the `x-user-id` header guarded by `process.env.IS_OFFLINE`
