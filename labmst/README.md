# RBAC Admin Dashboard

A no-build, local prototype for an AccessOS role-based workspace. It uses plain HTML, CSS, and JavaScript with mock data persisted in browser `localStorage`.

## Run

Open `index.html` in a browser. Sign in with the role selector; any non-empty password and valid email are accepted in this prototype. Demo accounts are prefilled:

- Admin: `ansh@example.com`
- Viewer: `rahul@example.com`
- Password: `workspace`

The navigation opens the separate documents in `pages/`. Session, users, posts, and activity persist in the browser storage for this origin.

## Structure

- `index.html`: Login entry point
- `css/style.css`: Shared tokens and components
- `css/login.css`: Authentication experience
- `css/dashboard.css`: Workspace pages and responsive shell
- `js/auth.js`: Mock session and local data persistence
- `js/permissions.js`: Central role capability checks
- `js/users.js`: Member list and user operations
- `js/posts.js`: Post list and content operations
- `js/activity.js`: Audit feed and filters
- `js/app.js`: Page shell, rendering, dialogs, and event wiring
- `pages/`: Dashboard, users, posts, activity, and settings documents
- `assets/`: Local icon and image assets

## Prototype security

UI permissions are demonstrative. Production authorization must be enforced server-side. The mock sign-in does not authenticate credentials or create a secure session.
