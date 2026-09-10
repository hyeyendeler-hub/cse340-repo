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

The retrieval pages use PostgreSQL. For a local PostgreSQL setup with no password,
create a database and run the schema and seed data from `setup.sql`:

```powershell
createdb -U postgres community_hub
psql -U postgres -d community_hub -f setup.sql
npm start
```

The app defaults to `postgresql://postgres@localhost:5432/community_hub`. Set
`DATABASE_URL` if your PostgreSQL installation uses a different connection.

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
