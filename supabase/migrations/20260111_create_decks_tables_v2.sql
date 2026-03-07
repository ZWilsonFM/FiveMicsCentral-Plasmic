-- Migration: Create decks and deck_cards tables
-- Created: 2026-01-11
-- Description: Tables for storing user-created decks and their card compositions

-- First, verify that the Cards table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'Cards'
    ) THEN
        RAISE EXCEPTION 'The "Cards" table does not exist. Please ensure your cards table is named "Cards" (with capital C) in the public schema.';
    END IF;
END $$;

-- ============================================================
-- DECKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Untitled Deck',
  format TEXT NOT NULL DEFAULT 'standard',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_decks_user_id ON public.decks(user_id);

-- Index for faster sorting by update time
CREATE INDEX IF NOT EXISTS idx_decks_updated_at ON public.decks(updated_at DESC);

-- Add comment
COMMENT ON TABLE public.decks IS 'User-created deck configurations';

-- ============================================================
-- DECK_CARDS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.deck_cards (
  deck_id UUID NOT NULL REFERENCES public.decks(id) ON DELETE CASCADE,
  card_id INT8 NOT NULL REFERENCES public."Cards"(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  PRIMARY KEY (deck_id, card_id),
  -- Enforce quantity constraints
  CONSTRAINT chk_quantity_positive CHECK (quantity > 0),
  CONSTRAINT chk_quantity_max CHECK (quantity <= 4)
);

-- Index for faster card lookups
CREATE INDEX IF NOT EXISTS idx_deck_cards_card_id ON public.deck_cards(card_id);

-- Add comment
COMMENT ON TABLE public.deck_cards IS 'Cards included in each deck with quantities';

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on decks table
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running migration)
DROP POLICY IF EXISTS "Users can view own decks" ON public.decks;
DROP POLICY IF EXISTS "Users can create own decks" ON public.decks;
DROP POLICY IF EXISTS "Users can update own decks" ON public.decks;
DROP POLICY IF EXISTS "Users can delete own decks" ON public.decks;

-- Users can view their own decks
CREATE POLICY "Users can view own decks" ON public.decks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own decks
CREATE POLICY "Users can create own decks" ON public.decks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own decks
CREATE POLICY "Users can update own decks" ON public.decks
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own decks
CREATE POLICY "Users can delete own decks" ON public.decks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on deck_cards table
ALTER TABLE public.deck_cards ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running migration)
DROP POLICY IF EXISTS "Users can view own deck cards" ON public.deck_cards;
DROP POLICY IF EXISTS "Users can insert own deck cards" ON public.deck_cards;
DROP POLICY IF EXISTS "Users can update own deck cards" ON public.deck_cards;
DROP POLICY IF EXISTS "Users can delete own deck cards" ON public.deck_cards;

-- Users can view cards in their own decks
CREATE POLICY "Users can view own deck cards" ON public.deck_cards
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.decks
      WHERE decks.id = deck_cards.deck_id
        AND decks.user_id = auth.uid()
    )
  );

-- Users can insert cards into their own decks
CREATE POLICY "Users can insert own deck cards" ON public.deck_cards
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.decks
      WHERE decks.id = deck_cards.deck_id
        AND decks.user_id = auth.uid()
    )
  );

-- Users can update cards in their own decks
CREATE POLICY "Users can update own deck cards" ON public.deck_cards
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.decks
      WHERE decks.id = deck_cards.deck_id
        AND decks.user_id = auth.uid()
    )
  );

-- Users can delete cards from their own decks
CREATE POLICY "Users can delete own deck cards" ON public.deck_cards
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.decks
      WHERE decks.id = deck_cards.deck_id
        AND decks.user_id = auth.uid()
    )
  );

-- ============================================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists (for re-running migration)
DROP TRIGGER IF EXISTS trigger_decks_updated_at ON public.decks;

CREATE TRIGGER trigger_decks_updated_at
  BEFORE UPDATE ON public.decks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- GRANT PERMISSIONS
-- ============================================================
-- Allow authenticated users to access these tables through RLS
GRANT ALL ON public.decks TO authenticated;
GRANT ALL ON public.deck_cards TO authenticated;
