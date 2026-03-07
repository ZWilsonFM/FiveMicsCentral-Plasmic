-- Diagnostic Query: Check Cards Table
-- Run this first to verify your Cards table setup

-- Check if Cards table exists and show its schema
SELECT
  table_schema,
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'Cards'
ORDER BY ordinal_position;

-- If the above returns no rows, try checking for lowercase 'cards'
SELECT
  table_schema,
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'cards'
ORDER BY ordinal_position;

-- Show all tables in the public schema
SELECT
  schemaname,
  tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
