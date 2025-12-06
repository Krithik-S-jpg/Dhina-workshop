-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create services table
create table services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  price numeric not null,
  image text,
  hsn_code text,
  category text not null,
  type text, -- 'tube' or 'tubeless'
  description text,
  stock integer,
  discount_percentage numeric default 0,
  gst_percentage numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create car_models table
create table car_models (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  brand text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create saved_bills table
create table saved_bills (
  id uuid default uuid_generate_v4() primary key,
  bill_number text not null,
  customer_name text,
  customer_address text,
  customer_phone text,
  vehicle_number text,
  date text,
  gst_number text,
  total numeric,
  gst_amount numeric,
  sgst_amount numeric,
  cgst_amount numeric,
  net_amount numeric,
  payment_method text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create bill_items table
create table bill_items (
  id uuid default uuid_generate_v4() primary key,
  bill_id uuid references saved_bills(id) on delete cascade,
  description text,
  hsn_code text,
  quantity integer,
  rate numeric,
  tax_percentage numeric,
  amount numeric,
  discount_percentage numeric,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Seed Data for Services (Tyres)
insert into services (name, price, category, type, description, hsn_code, gst_percentage, discount_percentage) values
('Good Year Assurance 185/65 R15', 5200, 'good-year', 'tubeless', 'TripleMax 2 Tubeless', '4011', 28, 0),
('Good Year Kelly 165/80 R14', 3400, 'good-year', 'tube', 'Standard Tube Tyre', '4011', 28, 0),
('Bridgestone Sturdo 195/55 R16', 7800, 'bridgestone', 'tubeless', 'Long life tyre', '4011', 28, 5),
('MRF ZVTV 175/65 R14', 4100, 'mrf', 'tubeless', 'Stock replacement', '4011', 28, 0),
('MRF Wanderer 215/75 R15', 6500, 'mrf', 'tube', 'All terrain tube type', '4011', 28, 0),
('Michelin Primacy 4ST', 9200, 'michelin', 'tubeless', 'Premium comfort', '4011', 28, 2);

-- Seed Data for Car Models
insert into car_models (name, brand) values
('Maruti Swift', 'Maruti Suzuki'),
('Hyundai Creta', 'Hyundai'),
('Honda City', 'Honda'),
('Toyota Innova', 'Toyota'),
('Mahindra Thar', 'Mahindra');
