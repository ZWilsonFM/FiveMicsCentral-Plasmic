# Migration Troubleshooting Guide

## Error: "relation 'Cards' does not exist"

This error means the migration can't find your Cards table. Let's fix it step-by-step.

---

## Step 1: Verify Your Cards Table Exists

### Option A: Using Supabase Dashboard

1. Go to your Supabase dashboard
2. Navigate to **Table Editor**
3. Look for a table named **"Cards"** (with capital C)
4. Check that it has an `id` column of type `int8` (bigint)

### Option B: Using SQL Editor

1. Go to **SQL Editor** in Supabase
2. Run this diagnostic query:

```sql
-- Check if Cards table exists
SELECT
  table_schema,
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'Cards'
ORDER BY ordinal_position;
```

Or use the diagnostic file: [00_check_cards_table.sql](supabase/migrations/00_check_cards_table.sql)

---

## Step 2: Identify the Issue

### Scenario A: No rows returned
**Problem:** Your table is named differently (lowercase "cards" or something else)

**Solution:** Find the actual table name:
```sql
-- Show all tables
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

Then either:
1. **Rename your table** (recommended):
   ```sql
   ALTER TABLE cards RENAME TO "Cards";
   ```

2. **Or update the migration** to use your actual table name

### Scenario B: Table is in a different schema
**Problem:** Table exists but not in the `public` schema

**Solution:**
```sql
-- Find which schema it's in
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_name = 'Cards';
```

If it's in a different schema, you need to either move it to `public` or update the migration to reference the correct schema.

### Scenario C: Missing `id` column
**Problem:** Cards table doesn't have an `id` column of type `int8`

**Solution:** Check your Cards table structure and ensure it has:
```sql
id int8 PRIMARY KEY
```

---

## Step 3: Run the Updated Migration

I've created an improved migration file with better error handling:

### **Use this file:** [20260111_create_decks_tables_v2.sql](supabase/migrations/20260111_create_decks_tables_v2.sql)

This version:
- ✅ Explicitly checks if Cards table exists first
- ✅ Uses `public.` schema prefix
- ✅ Has `CREATE IF NOT EXISTS` for safety
- ✅ Can be re-run without errors
- ✅ Better error messages

### How to Apply

**Via Supabase Dashboard:**

1. Go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `20260111_create_decks_tables_v2.sql`
4. Paste and click **Run**

**Via Supabase CLI:**

```bash
supabase db push
```

---

## Step 4: Verify Migration Success

After running the migration, check that the tables were created:

```sql
-- Verify decks table exists
SELECT * FROM information_schema.tables
WHERE table_name = 'decks';

-- Verify deck_cards table exists
SELECT * FROM information_schema.tables
WHERE table_name = 'deck_cards';

-- Check foreign key constraints
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('decks', 'deck_cards');
```

You should see:
- ✅ `decks` table exists
- ✅ `deck_cards` table exists
- ✅ Foreign key from `deck_cards.deck_id` to `decks.id`
- ✅ Foreign key from `deck_cards.card_id` to `Cards.id`

---

## Common Issues and Fixes

### Issue 1: "permission denied for schema public"

**Solution:** You need to be the database owner or have proper permissions.

In Supabase dashboard:
1. Go to **SQL Editor**
2. Make sure you're running queries as the project owner

### Issue 2: "cannot reference public.Cards"

**Possible cause:** The Cards table is in a different database or project.

**Solution:** Ensure you're running the migration in the same Supabase project where your Cards table exists.

### Issue 3: Foreign key constraint fails

**Cause:** The `id` column in Cards table is not the right type (should be `int8`).

**Check:**
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Cards' AND column_name = 'id';
```

Should return `bigint` or `int8`.

### Issue 4: Migration runs but RLS policies don't work

**Cause:** Policies might not be enabled or user authentication isn't set up.

**Fix:**
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('decks', 'deck_cards');

-- Should show rowsecurity = true for both

-- List policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('decks', 'deck_cards');
```

---

## Manual Table Creation (Alternative)

If the migration keeps failing, you can create the tables manually:

### 1. Create decks table
```sql
CREATE TABLE public.decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Untitled Deck',
  format TEXT NOT NULL DEFAULT 'standard',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_decks_user_id ON public.decks(user_id);
CREATE INDEX idx_decks_updated_at ON public.decks(updated_at DESC);

ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own decks" ON public.decks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own decks" ON public.decks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own decks" ON public.decks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own decks" ON public.decks
  FOR DELETE USING (auth.uid() = user_id);

GRANT ALL ON public.decks TO authenticated;
```

### 2. Create deck_cards table

**⚠️ IMPORTANT:** Replace `"Cards"` with your actual table name if different!

```sql
CREATE TABLE public.deck_cards (
  deck_id UUID NOT NULL REFERENCES public.decks(id) ON DELETE CASCADE,
  card_id INT8 NOT NULL REFERENCES public."Cards"(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  PRIMARY KEY (deck_id, card_id),
  CONSTRAINT chk_quantity_positive CHECK (quantity > 0),
  CONSTRAINT chk_quantity_max CHECK (quantity <= 4)
);

CREATE INDEX idx_deck_cards_card_id ON public.deck_cards(card_id);

ALTER TABLE public.deck_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deck cards" ON public.deck_cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.decks
      WHERE decks.id = deck_cards.deck_id AND decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own deck cards" ON public.deck_cards
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.decks
      WHERE decks.id = deck_cards.deck_id AND decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own deck cards" ON public.deck_cards
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.decks
      WHERE decks.id = deck_cards.deck_id AND decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own deck cards" ON public.deck_cards
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.decks
      WHERE decks.id = deck_cards.deck_id AND decks.user_id = auth.uid()
    )
  );

GRANT ALL ON public.deck_cards TO authenticated;
```

### 3. Create trigger for auto-updating timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decks_updated_at
  BEFORE UPDATE ON public.decks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## Testing the Migration

After successful migration, test with these queries:

```sql
-- Test 1: Insert a test deck (will fail if you're not authenticated)
INSERT INTO public.decks (user_id, name, format)
VALUES (auth.uid(), 'Test Deck', 'standard');

-- Test 2: Query your decks (should only show your own)
SELECT * FROM public.decks;

-- Test 3: Add a card to the deck (replace IDs with actual values)
INSERT INTO public.deck_cards (deck_id, card_id, quantity)
VALUES (
  (SELECT id FROM public.decks LIMIT 1),
  1,  -- Replace with actual card ID from your Cards table
  2
);

-- Test 4: Query deck with cards
SELECT
  d.name,
  d.format,
  dc.card_id,
  dc.quantity
FROM public.decks d
LEFT JOIN public.deck_cards dc ON dc.deck_id = d.id
WHERE d.user_id = auth.uid();
```

---

## Still Having Issues?

### Quick Checklist
- [ ] Cards table exists in the `public` schema
- [ ] Cards table has an `id` column of type `int8` (bigint)
- [ ] You're running the migration in the correct Supabase project
- [ ] You have the necessary permissions
- [ ] You're using the v2 migration file

### Get More Information

Run this comprehensive diagnostic:

```sql
-- 1. Check Cards table
SELECT 'Cards table exists' AS check_name,
       CASE WHEN EXISTS (
         SELECT FROM pg_tables
         WHERE schemaname = 'public' AND tablename = 'Cards'
       ) THEN '✅ YES' ELSE '❌ NO' END AS status;

-- 2. Check Cards.id column
SELECT 'Cards.id column type' AS check_name,
       data_type AS status
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'Cards'
  AND column_name = 'id';

-- 3. Check if decks table exists
SELECT 'decks table exists' AS check_name,
       CASE WHEN EXISTS (
         SELECT FROM pg_tables
         WHERE schemaname = 'public' AND tablename = 'decks'
       ) THEN '✅ YES' ELSE '❌ NO - Run migration' END AS status;

-- 4. Check if deck_cards table exists
SELECT 'deck_cards table exists' AS check_name,
       CASE WHEN EXISTS (
         SELECT FROM pg_tables
         WHERE schemaname = 'public' AND tablename = 'deck_cards'
       ) THEN '✅ YES' ELSE '❌ NO - Run migration' END AS status;
```

If you're still stuck, share the output of this diagnostic and we can debug further.

---

## Summary

**To fix the "Cards does not exist" error:**

1. ✅ Run [00_check_cards_table.sql](supabase/migrations/00_check_cards_table.sql) to diagnose
2. ✅ Use [20260111_create_decks_tables_v2.sql](supabase/migrations/20260111_create_decks_tables_v2.sql) (improved migration)
3. ✅ Verify with the test queries above

The v2 migration will give you a clear error message if the Cards table can't be found, making it easier to debug.
