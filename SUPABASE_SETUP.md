# Supabase Setup Guide

Follow these steps to set up the backend database for the SRI CHELLAM AUTOMOBILE application.

## 1. Create a Supabase Project

1.  Go to [Supabase](https://supabase.com/) and sign in.
2.  Click **"New Project"**.
3.  Choose your organization, give the project a name (e.g., `Tyre Shop`), set a password, and select a region.
4.  Click **"Create new project"** and wait for it to finish setting up.

## 2. Run the Schema Script

1.  In your project dashboard, go to the **SQL Editor** (icon on the left sidebar that looks like `>_` or a terminal).
2.  Click **"New query"**.
3.  Open the file `supabase_schema.sql` from this repository.
4.  Copy the entire content of `supabase_schema.sql`.
5.  Paste it into the SQL Editor in Supabase.
6.  Click the **"Run"** button (bottom right of the editor).
    *   *This will create the tables (`services`, `car_models`, `saved_bills`, `bill_items`) and insert the initial sample data.*

## 3. Connect the Application

1.  In your Supabase project dashboard, go to **Project Settings** (gear icon) -> **API**.
2.  Find the **Project URL** and **anon public key**.
3.  In your local project root, create a file named `.env` (if it doesn't exist).
4.  Add the following lines, replacing the values with yours:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Restart the Application

1.  If your development server is running, stop it (Ctrl+C).
2.  Run `npm run dev` again to load the new environment variables.

Your application is now connected to the Supabase database!
