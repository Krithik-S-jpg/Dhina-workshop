# Database Setup & Troubleshooting

## Attendance Feature Setup

If you are seeing an error like `Could not find the table 'public.employees'`, it means the necessary database tables for the attendance feature have not been created yet.

To fix this, please run the following SQL commands in your Supabase SQL Editor:

```sql
-- Create employees table
create table if not exists employees (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create attendance table
create table if not exists attendance (
  id uuid default gen_random_uuid() primary key,
  employee_id uuid references employees(id) on delete cascade not null,
  date date not null,
  time text not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

After running these commands, refresh the application.

## Troubleshooting

- **Table not found error**: Run the SQL above.
- **Attendance button not showing**: The attendance button only appears on the home page if there is at least one employee added. Go to the Admin Panel -> Attendance tab to add employees.
