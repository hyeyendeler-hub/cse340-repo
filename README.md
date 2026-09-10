# Community Hub

This project is an Express + EJS site for the W02 Database Retrieval assignment.

## Run locally

1. Install dependencies:
   npm install
2. Start the app:
   npm start
3. Open:
   http://localhost:3000

## Database setup

The retrieval pages use PostgreSQL. Create a database, set `DATABASE_URL`, and run
the schema and seed data from `setup.sql`:

```powershell
$env:DATABASE_URL = "postgresql://username:password@localhost:5432/community_hub"
psql $env:DATABASE_URL -f setup.sql
npm start
```

The `organizations`, `projects`, and `categories` pages retrieve their data from
the database through the model functions in `models/community-model.js`.

## Deployment

This project is prepared for Render deployment with a `render.yaml` file.

## Pages

- Home
- Organizations
- Projects
- Categories

## Notes

- All EJS pages use a shared header and footer partial.
- Static assets live in the `public` folder.
- `.env` is not included in the repository.
