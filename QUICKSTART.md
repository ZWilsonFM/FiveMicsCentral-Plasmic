# Quick Start Guide

Get the deck builder logic up and running in 5 minutes.

## Prerequisites

- Node.js 16+ installed
- Supabase project created
- `Cards` table populated in Supabase

## Setup Steps

### 1. Install Dependencies (Already Done)

Dependencies are already installed:
- ✅ zustand
- ✅ @tanstack/react-query
- ✅ @supabase/supabase-js

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from:
1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings → API
4. Copy "Project URL" and "anon/public" key

### 3. Run Database Migration

Apply the migration to create `decks` and `deck_cards` tables:

**Recommended: Use the v2 migration file** (better error handling)

**Option A: Using Supabase Dashboard**
1. Go to SQL Editor in your Supabase dashboard
2. Click "New Query"
3. Copy contents of `supabase/migrations/20260111_create_decks_tables_v2.sql`
4. Paste and run

**Option B: Using Supabase CLI**
```bash
supabase db push
```

**⚠️ If you get an error about "Cards does not exist":**
See [MIGRATION_TROUBLESHOOTING.md](MIGRATION_TROUBLESHOOTING.md) for step-by-step solutions

### 4. Start Development Server

```bash
npm run dev
```

### 5. Test the Implementation

Visit: **http://localhost:3000/dev-test**

You should see:
- ✅ Cards loaded from your Supabase database
- ✅ Filters (search, type, style, cost)
- ✅ Clickable cards that add to deck
- ✅ Real-time deck statistics
- ✅ Legality validation

## What to Test

### Basic Functionality
- [ ] **Card Loading**: Cards appear from your database
- [ ] **Search**: Type in search box, cards filter by name
- [ ] **Type Filter**: Click type checkboxes, cards filter
- [ ] **Style Filter**: Click style checkboxes, cards filter
- [ ] **Cost Filter**: Click cost checkboxes, cards filter

### Deck Building
- [ ] **Add Card**: Click a card, it appears in deck panel
- [ ] **Add Multiple**: Click same card multiple times (up to limit)
- [ ] **Copy Limits**: Unique cards max 1, regular cards max 4
- [ ] **Remove Card**: Click deck card, quantity decreases
- [ ] **Deck Name**: Edit deck name at top of deck panel

### Statistics
- [ ] **Total Cards**: Updates as you add/remove
- [ ] **Average Cost**: Calculates correctly
- [ ] **Character Count**: Shows character cards
- [ ] **Event Count**: Shows event cards
- [ ] **Leader**: Shows leader card name (if added)
- [ ] **Style Breakdown**: Shows distribution by color/style

### Legality
- [ ] **No Leader**: Shows error "Must have a Leader card"
- [ ] **Too Few Cards**: Shows error if < 50 main deck cards
- [ ] **Too Many Cards**: Shows error if > 50 main deck cards
- [ ] **Too Many Copies**: Shows error if > max copies
- [ ] **Legal Deck**: Green background when all rules met

## Troubleshooting

### "Loading cards..." never finishes

**Problem**: Can't connect to Supabase

**Solutions**:
1. Check `.env` file exists with correct values
2. Verify Supabase URL and key are correct
3. Check browser console for errors
4. Verify `Cards` table exists in Supabase
5. Check table has RLS disabled or appropriate policies

### No cards show up

**Problem**: Cards table is empty

**Solution**: Populate the `Cards` table in Supabase with card data

### TypeScript errors

**Problem**: Missing type definitions

**Solution**:
```bash
# Restart TypeScript server in VS Code
# Or restart your editor
```

### Build errors about unused React

**Problem**: Existing Plasmic components have unused imports

**Solution**: These are warnings in existing files, not your new code. They don't affect the build for development.

To suppress:
```json
// tsconfig.json - add to compilerOptions
"noUnusedLocals": false,
"noUnusedParameters": false
```

## Next Steps

Once testing is complete:

1. ✅ **Verify all hooks work** using the test page
2. ⏳ **Wait for Plasmic components** from designer
3. ⏳ **Run `npm run plasmic`** to sync
4. ⏳ **Follow [PLASMIC_INTEGRATION_GUIDE.md](PLASMIC_INTEGRATION_GUIDE.md)**
5. ⏳ **Delete dev-test page** after integration

## File Structure

```
src/
├── hooks/              ← All hooks are here
│   ├── useDeckState.ts
│   ├── useCards.ts
│   ├── useCardFilters.ts
│   └── useDeckStats.ts
├── lib/
│   ├── types.ts        ← Type definitions
│   └── supabase.ts     ← Supabase client
└── pages/
    └── dev-test.tsx    ← TEST THIS PAGE
```

## Environment Setup Checklist

- [ ] `.env` file created
- [ ] Supabase URL added to `.env`
- [ ] Supabase anon key added to `.env`
- [ ] Database migration applied
- [ ] `Cards` table has data
- [ ] Dev server running (`npm run dev`)
- [ ] Test page loads at `/dev-test`
- [ ] Cards are visible
- [ ] Filters work
- [ ] Deck building works

## Support

- **Technical details**: See [DECK_BUILDER_README.md](DECK_BUILDER_README.md)
- **Integration steps**: See [PLASMIC_INTEGRATION_GUIDE.md](PLASMIC_INTEGRATION_GUIDE.md)
- **Build summary**: See [BUILD_SUMMARY.md](BUILD_SUMMARY.md)

---

**Ready to test!** 🚀

Visit `http://localhost:3000/dev-test` after completing setup steps 1-4.
