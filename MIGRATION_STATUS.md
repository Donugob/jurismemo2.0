# Supabase Migration Status: JurisMemo

This document outlines the current architectural state and the remaining steps to fully transition JurisMemo to Supabase Auth.

## 1. Current Architecture Map
The application currently operates with a decoupled frontend and backend:

*   **Frontend (Next.js 16):** Uses traditional `localStorage` tokens and `fetch` calls to an external Express API.
*   **Backend (Express/Node.js):** Handles manual password hashing (Bcrypt), JWT generation/signing, and session management.
*   **Database (Postgres/Supabase):** Stores user profiles in `public."User"` while Supabase handles `auth.users`.

**Target State:** Next.js App Router -> Supabase SSR Utilities -> Postgres (via Prisma or Supabase Client).

---

## 2. Completed Milestones (Backend)
The database layer is now fully "Supabase Ready":

*   [x] **User Migration:** All existing users in `public."User"` have been copied into Supabase's native `auth.users` system.
*   [x] **Identity Mapping:** The `supabase_id` column in your original `public."User"` table now maps exactly to the matching record in `auth.users`.
*   [x] **Secure Password Handover:** Migrated users retain their original Bcrypt hashes. New logins will work natively without password resets.
*   [x] **Autonomous Sync (Trigger):** Created a `handle_new_user()` function and `on_auth_user_created` trigger. New signups via Supabase will automatically create a matching profile in `public."User"` with the `SUPABASE_MANAGED` placeholder.

---

## 3. The Missing Pieces (Frontend/Next.js)
The frontend remains on the "legacy" authentication system. To complete the migration, the following logic must be built using `@supabase/ssr`:

### Step A: Client/Server Utility Setup
*   **Dependencies:** Install `@supabase/ssr` and `@supabase/supabase-js`.
*   **Utility Files:** Create `src/utils/supabase/` directory with:
    *   `client.ts`: For browser-side authentication calls.
    *   `server.ts`: For Server Components, Server Actions, and Route Handlers.
    *   `middleware.ts`: For session refreshing.

### Step B: Route Protection (Middleware)
*   **middleware.ts:** Implement a root-level middleware to protect `/dashboard` and `/admin` routes. This must catch unauthenticated users and redirect them to `/login` before they hit the server.

### Step C: Server Actions for Auth
*   **Actions File:** Create `src/app/auth/actions.ts` containing:
    *   `login`: Calling `supabase.auth.signInWithPassword`.
    *   `signup`: Calling `supabase.auth.signUp` (sending metadata like `username` and `level`).
    *   `signOut`: Calling `supabase.auth.signOut`.

### Step D: UI Component Updates
*   **Forms:** Refactor `src/app/login/page.tsx` and `src/app/register/page.tsx` to use the new Server Actions instead of `authApi` from `api.ts`.
*   **State Management:** Remove `localStorage` token logic and switch to cookie-based sessions managed by Supabase.

---

## 4. Risk Assessment & Cleanup
The following existing logic is now **redundant** and should be decommissioned to avoid security conflicts:

1.  **Frontend Cleanup (`frontend/src/lib/api.ts`):** 
    *   `authApi.login` and `authApi.register` should be deleted.
    *   `localStorage.getItem('token')` logic in `apiFetch` is no longer needed once we switch to Supabase cookies.
2.  **Backend Cleanup (`backend/src/routes/auth.ts`):**
    *   The `/register` and `/login` endpoints use manual Bcrypt hashing and local JWT signing. These should be disabled once the frontend moves to Supabase.
3.  **Conflict Risk:** Ensure the Next.js app does not attempt to send its own custom JWT to a service that is now expecting a Supabase session.

---

## Next Steps
1. Install project dependencies in the `frontend` folder.
2. Configure environment variables (`NEXT_PUBLIC_SUPABASE_URL`, etc.).
3. Implement the `@supabase/ssr` utility bundle.
