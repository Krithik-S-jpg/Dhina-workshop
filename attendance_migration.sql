create table if not exists employees (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists attendance (
  id uuid default gen_random_uuid() primary key,
  employee_id uuid references employees(id) on delete cascade not null,
  date date not null,
  time text not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
