# Nosky HomeOS — Auth, Profiles, Legal & Product Audit

## Scope

Two related asks: (1) add authentication + user system + legal/profile pages, and (2) audit existing app for vision alignment (zones not rooms, dynamic data, functional icons, consistent design).

## 1. Backend (Lovable Cloud)

Enable Lovable Cloud. Create `profiles` table:

- `id uuid PK references auth.users(id) on delete cascade`
- `full_name text`, `email text`, `created_at timestamptz default now()`
- `accepted_terms boolean default false`, `accepted_terms_at timestamptz`

RLS: users read/update own profile. Trigger `handle_new_user` on `auth.users` insert → creates profile row from `raw_user_meta_data.full_name` + email + terms acceptance from metadata.

Grants: `GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated; GRANT ALL TO service_role`.

## 2. Auth Routes

- `src/routes/auth.tsx` — combined Sign In / Sign Up tabbed page. Signup requires Full Name, Email, Password, Confirm Password, and a checkbox linking to `/legal/privacy` and `/legal/terms`. Submit disabled until checkbox checked + passwords match. `emailRedirectTo: window.location.origin`. Store `full_name` and `accepted_terms` in `options.data` for the trigger.
- `src/routes/_authenticated/route.tsx` — managed protected layout (already convention) gating all app routes.

Move existing pages under `_authenticated/`: dashboard (index → `_authenticated/index`), floor-plan, zones, devices, scenes, analytics, notifications, settings (+ subpages).

Note: index route stays as `/` but gated. Use `_authenticated` pathless layout; rename files: `routes/_authenticated/index.tsx`, `routes/_authenticated/devices.tsx`, etc. Update `routeTree.gen.ts` will regenerate.

## 3. Auth context / session

Create `src/hooks/useAuth.tsx` providing `user`, `profile`, `loading`, `signOut`. Use `supabase.auth.onAuthStateChange` + `getSession` pattern. Wrap app in provider in `__root.tsx`.

## 4. Legal & Profile pages

Under `_authenticated/settings/`:

- `settings.index.tsx` — settings hub with cards linking to subpages
- `settings.profile.tsx` — name, email, created date, edit profile, change password, logout
- `settings.about.tsx` — About Nosky HomeOS content
- `settings.privacy.tsx` — Privacy Policy
- `settings.terms.tsx` — Terms of Service
- `settings.disclaimer.tsx` — Disclaimer

Also expose `/legal/privacy` and `/legal/terms` as **public** routes (linked from signup) — same content, no auth.

## 5. Dashboard personalization

Replace static "Good Evening" with `Good Evening, {profile.full_name.split(' ')[0]}` from auth context. Time-based greeting (Morning/Afternoon/Evening).

## 6. Audit fixes

- Sidebar: Dashboard, Floor Plan, Zones, Devices, Scenes, Analytics, Notifications, Settings. Remove any "Rooms" nav entry; keep zones-based architecture (already present per file list).
- AppShell top bar icons: search opens command/dialog or input focus; notifications icon → `/notifications`; profile avatar → `/settings/profile`; settings cog → `/settings`. All icons get `onClick` or wrap in `<Link>`.
- Device cards: ensure toggle, expand-for-controls work (existing DeviceCard).
- Splash, dashboard stats, zones, scenes, analytics already exist — verify and patch minor inconsistencies (greeting, icon handlers, Sign Out button in profile menu).

## 7. Tech notes

- Use `@/integrations/supabase/client` browser client only.
- Profile fetched once after sign-in via `useAuth`, exposed via React context.
- All clickable icons wrap in `<button>` or `<Link>` with aria-label.

## Out of scope

- Email/password reset flow page (mention as follow-up).
- Real social login (can add later via configure_social_auth).
- New analytics data sources.

After approval I'll enable Cloud, run the migration, scaffold routes, and wire auth.
