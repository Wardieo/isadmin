# Isora Studio Admin

A responsive Supabase-backed administration workspace for bookings, scheduling,
reviews, reports, and studio settings.

## Setup

1. Copy `.env.example` to `.env`.
2. Add the Supabase project URL and anonymous key.
3. Run `npm install` and `npm run dev`.

Authentication uses Supabase email/password. After sign-in, the app verifies the
user against `admin_users` before loading protected data. Database reads and writes
use the signed-in Supabase client, so existing Row Level Security policies remain in
force.

Create the administrator table by running
`supabase/migrations/202608150001_create_admin_users.sql` in the Supabase SQL Editor.
After creating an Authentication user, insert its UUID with:

```sql
insert into public.admin_users (user_id)
values ('AUTHENTICATION_USER_UUID');
```

Apply both admin migrations to grant that allowlist access to the dashboard
tables. With a linked Supabase CLI project, run `supabase db push`.

The app reads `bookings`, `reviews`, `packages`, and `addons`. It supports common
legacy field variants for booking references, totals, contacts, package snapshots,
add-ons, and review visibility. Catalog price edits never update JSON snapshots in
existing bookings.

## Commands

- `npm run dev` — start the local development server
- `npm run build` — type-check and create a production build
- `npm run lint` — run Oxlint

## Original Vite notes

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
# isadmin
# isadmin
