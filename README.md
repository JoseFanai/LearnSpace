# LearnSpace

A responsive first version of a personal learning platform. The initial build uses HTML, CSS, and vanilla JavaScript, with optional Supabase authentication and PostgreSQL persistence.

## Features in this version

- Responsive dashboard, course catalog, course details, and lesson player
- Sample courses with YouTube embedded lessons
- Search and category filters
- Enroll in courses and mark lessons complete
- Assignment submission by public URL (not file upload)
- Demo mode that saves sample progress in the current browser
- Optional Supabase email/password authentication and progress/submission storage

## Important mode distinction

**Demo mode is not real authentication.** It uses browser `localStorage`, so data stays in that browser and is not secure or shared across devices. Do not use demo mode for real users or sensitive information.

Cloud accounts and cloud progress are only available after you create and configure a Supabase project and run the SQL schema. The frontend reports whether configuration values are present, but this is not proof that the database policies are correctly configured.

## Run locally on Windows

1. Extract the `LearnSpace` folder somewhere convenient, for example `F:\GU\VScode\LearnSpace`.
2. Open VS Code, select **File -> Open Folder**, and choose `LearnSpace`.
3. Install the **Live Server** extension (by Ritwick Dey) in VS Code, if you don't already have it.
4. Right-click `index.html` and choose **Open with Live Server**.
5. Your browser should open a local address such as `http://127.0.0.1:5500`.

You can open `index.html` directly, but Live Server is recommended for a consistent local web-server environment.

## Enable real Supabase authentication and cloud saving

1. Create a project at https://supabase.com and wait until it is ready.
2. In the Supabase dashboard, open **Project Settings -> API** (wording may vary) and copy the project URL and the publishable key / anon public key.
3. Open `config.js`. Paste the values into `supabaseUrl` and `supabaseAnonKey`.
4. In Supabase, open **SQL Editor**, create a query, paste all of `supabase/schema.sql`, and run it.
5. In **Authentication -> URL Configuration**, set your local site URL (e.g. `http://127.0.0.1:5500`) and add your eventual deployed URL to the allowed redirect URLs if required.
6. In **Authentication -> Providers**, make sure Email is enabled. Email confirmation may be enabled by default.
7. Reload the site. Create a test account, confirm the email if prompted, and sign in.
8. Test by enrolling in a course, completing a lesson, refreshing, signing out, and signing back in. Also test in a second browser/device to verify cloud persistence.

Only use the public/publishable/anon key in this frontend. **Never put a Supabase `service_role` or secret key in `config.js` or any browser code.** Row Level Security policies in the SQL schema restrict each authenticated user to their own rows.

## Deploy to Cloudflare Pages

This is a static site, so no build command is needed.

1. Create a GitHub repository and push the project files.
2. In Cloudflare, open **Workers & Pages -> Create -> Pages -> Connect to Git** (the interface may change).
3. Select the repository.
4. Set framework preset to **None**. Leave the build command blank. Set the build output directory to `/` or the repository root as the dashboard requires.
5. Deploy. Cloudflare will provide a `*.pages.dev` URL.
6. Add the deployed site URL to Supabase Authentication URL configuration and test registration/login and progress sync again.

You can also use Cloudflare Pages Direct Upload if you prefer not to connect Git, though Git integration makes future updates easier.

## Project structure

```text
LearnSpace/
├── index.html
├── styles.css
├── app.js
├── config.js
├── README.md
└── supabase/
    └── schema.sql
```

## Current limitations / next steps

- Course catalog and assignments are hard-coded sample data in `app.js`.
- The example YouTube IDs are curated sample embeds; verify each video and creator before sharing publicly.
- Assignment submission is a URL prompt, not a file-upload system.
- Admin roles, course authoring, teacher feedback, password reset UI, and account deletion are not implemented yet.
- Cloud progress is persisted after lesson completion; production hardening should add robust error handling, loading states, schema validation, and proper account/profile lifecycle handling.
- Course definitions are currently client-side. For a larger platform, move courses and lessons into database tables and build a protected admin workflow.
- A free hosting plan or subdomain does not guarantee permanent, uninterrupted uptime. Review each provider's limits and terms.
