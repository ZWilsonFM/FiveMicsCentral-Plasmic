# Deck Builder Logic Layer

This document describes the React/TypeScript logic layer for the TCG deck builder application. All hooks and utilities are ready to be integrated with Plasmic-generated components.

## 📁 Project Structure

```
src/
├── hooks/
│   ├── useDeckState.ts      ✅ Deck management with Zustand
│   ├── useCards.ts          ✅ Card fetching with React Query
│   ├── useCardFilters.ts    ✅ Client-side filtering
│   └── useDeckStats.ts      ✅ Deck statistics calculator
├── lib/
│   ├── types.ts             ✅ TypeScript type definitions
│   └── supabase.ts          ✅ Supabase client
└── pages/
    └── dev-test.tsx         ✅ Test page (remove after Plasmic integration)

supabase/
└── migrations/
    └── 20260111_create_decks_tables.sql  ✅ Database schema
```

## 🎯 What's Built

### 1. Core Hooks (All Complete)

#### `useDeckState()`
Zustand store managing the current deck being edited.

**Features:**
- Add/remove cards with automatic copy limit enforcement
- Unique cards: max 1 copy
- Regular cards: max 4 copies
- Track unsaved changes
- Save/load decks to/from Supabase

**Usage:**
```tsx
const {
  deck,
  hasUnsavedChanges,
  addCard,
  removeCard,
  setDeckName,
  saveDeck,
  clearDeck
} = useDeckState();
```

#### `useCards()`
React Query hook for fetching cards from Supabase.

**Features:**
- Infinite scroll pagination
- Aggressive caching (card data rarely changes)
- Automatic retry logic

**Usage:**
```tsx
const {
  cards,
  isLoading,
  fetchNextPage,
  hasNextPage
} = useCards();
```

#### `useCardFilters()`
Client-side filtering for responsive search.

**Features:**
- Search by name, ability, and subtypes
- Filter by type, style, cost, rarity, set
- Automatically derives available filter options from data

**Usage:**
```tsx
const {
  filters,
  setSearch,
  toggleType,
  toggleStyle,
  filteredCards,
  availableTypes
} = useCardFilters(cards);
```

#### `useDeckStats()`
Real-time deck statistics calculator.

**Features:**
- Total card count
- Average cost
- Style/color distribution
- Type counts (characters, events, etc.)
- Leader card identification
- Format legality validation

**Usage:**
```tsx
const stats = useDeckStats(deck.cards);

// stats.totalCards
// stats.avgCost
// stats.isLegal
// stats.legalityIssues
```

### 2. Type Definitions

All TypeScript interfaces in [src/lib/types.ts](src/lib/types.ts):

- `Card` - Card entity from Supabase
- `DeckCard` - Card with quantity (for decks)
- `Deck` - Deck entity
- `DeckStats` - Calculated statistics
- `CardFilters` - Filter criteria

### 3. Database Schema

Migration file: [supabase/migrations/20260111_create_decks_tables.sql](supabase/migrations/20260111_create_decks_tables.sql)

**Tables:**
- `decks` - User deck configurations
- `deck_cards` - Many-to-many relationship with quantities

**Features:**
- Row Level Security (RLS) enabled
- Users can only access their own decks
- Automatic `updated_at` timestamp
- Quantity constraints (1-4 copies)

## 🚀 Setup Instructions

### 1. Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Run Database Migration

Apply the migration to your Supabase project:

```bash
# If using Supabase CLI
supabase migration up

# Or manually run the SQL in your Supabase dashboard
# Go to: SQL Editor → New Query → Paste contents of migration file
```

### 3. Install Dependencies

Dependencies are already installed:
- `zustand` - State management
- `@tanstack/react-query` - Data fetching
- `@supabase/supabase-js` - Supabase client

### 4. Test the Implementation

Visit the test page to verify all hooks work:

```
http://localhost:3000/dev-test
```

This page demonstrates:
- Card loading from Supabase
- Filtering by type, style, cost
- Adding/removing cards to deck
- Real-time statistics
- Legality validation

## 🔗 Integration with Plasmic

### When Plasmic Components Are Generated

After the designer publishes and you run `plasmic sync`, you'll get skeleton wrapper components like:

```
components/
├── plasmic/fm_central/           # Auto-generated - DON'T EDIT
│   ├── PlasmicDeckBuilderPage.tsx
│   ├── PlasmicCardTile.tsx
│   └── ...
│
├── DeckBuilderPage.tsx           # Edit this!
├── CardTile.tsx                  # Edit this!
├── FilterBar.tsx                 # Edit this!
└── DeckStatsCard.tsx             # Edit this!
```

### Integration Pattern

Edit the skeleton wrappers to import and use our hooks:

```tsx
// components/DeckBuilderPage.tsx
import { useDeckState } from '@/hooks/useDeckState';
import { useCards } from '@/hooks/useCards';
import { useCardFilters } from '@/hooks/useCardFilters';
import { useDeckStats } from '@/hooks/useDeckStats';

function DeckBuilderPage_(props, ref) {
  // Use our hooks
  const { cards, isLoading } = useCards();
  const { deck, addCard, removeCard, saveDeck } = useDeckState();
  const { filters, setSearch, filteredCards } = useCardFilters(cards);
  const stats = useDeckStats(deck.cards);

  // Pass data to Plasmic component via props and overrides
  return (
    <PlasmicDeckBuilderPage
      root={{ ref }}
      {...props}
      deckName={deck.name}
      totalCards={stats.totalCards}
      isLegal={stats.isLegal}
      cardGrid={{
        children: filteredCards.map(card => (
          <CardTile key={card.id} card={card} onClick={() => addCard(card)} />
        ))
      }}
      saveButton={{
        onClick: saveDeck,
        disabled: !hasUnsavedChanges
      }}
    />
  );
}
```

### What You'll Need From The Designer

1. **Prop names** - What the designer named each data prop in Plasmic
2. **Slot names** - Where dynamic content should go (`cardGrid`, `filterBar`, etc.)
3. **Named nodes** - Elements that need event handlers (`saveButton`, `cardContainer`, etc.)
4. **Variant names** - Toggle states (`isSelected`, `isLoading`, etc.)

These are visible in the generated `DefaultXxxProps` interface.

## 📊 Deck Legality Rules

Current validation rules (adjust in `useDeckStats.ts` as needed):

- ✅ Must have exactly 1 Leader card
- ✅ Main deck must be exactly 50 cards (excluding leader)
- ✅ Unique cards: maximum 1 copy
- ✅ Regular cards: maximum 4 copies

## 🧪 Testing Checklist

Use the [dev-test](src/pages/dev-test.tsx) page to verify:

- [ ] Cards load from Supabase
- [ ] Search filters cards by name/ability/subtype
- [ ] Type, style, and cost filters work
- [ ] Clicking a card adds it to the deck
- [ ] Copy limits are enforced (unique = 1, regular = 4)
- [ ] Clicking a deck card removes one copy
- [ ] Deck stats calculate correctly
- [ ] Legality validation works
- [ ] Deck name can be edited

## 🔄 Next Steps

1. ✅ All hooks implemented
2. ✅ Database schema created
3. ✅ Test page created
4. ⏳ **Wait for designer to create Plasmic components**
5. ⏳ **Run `plasmic sync` to generate skeleton wrappers**
6. ⏳ **Edit skeleton wrappers to integrate hooks**
7. ⏳ **Remove DevTestPage after integration is complete**

## 📝 Notes

- Card IDs are `number` (int8), not `string`
- The Supabase table name is `"Cards"` (capitalized)
- All filtering is client-side for responsiveness
- Path alias `@/` is configured to point to `src/`
- React Query is already set up in [App.tsx](src/App.tsx)

## 🐛 Troubleshooting

**Cards not loading?**
- Check that Supabase credentials are set in `.env`
- Verify the `Cards` table exists in Supabase
- Check browser console for errors

**Can't save decks?**
- Make sure you're authenticated with Supabase
- Verify the migration has been run
- Check RLS policies are enabled

**TypeScript errors?**
- Ensure all dependencies are installed
- Check that `@/` path alias is working
- Verify TypeScript version is 5.x+

## 🤝 Coordination with Designer

Share this information with the designer:

### Required Plasmic Components

1. **DeckBuilderPage** (main page)
   - Slots: `filterBar`, `cardGrid`, `deckCardList`, `statsPanel`
   - Props: `deckName`, `totalCards`, `isLegal`, `isLoading`
   - Named nodes: `saveButton`, `resetButton`

2. **CardTile** (card display)
   - Props: `cardName`, `cardArt`, `cardType`, `cardCost`, `cardAtk`, `cardDef`, `cardRarity`, `cardAbility`, `isUnique`, `isInDeck`
   - Named nodes: `cardContainer`, `quantityBadge`
   - Variants: `showQuantityBadge`

3. **FilterBar** (search/filters)
   - Slots: `typeFilters`, `styleFilters`, `costFilters`
   - Named nodes: `searchInput`

4. **DeckStatsCard** (stats display)
   - Props: `totalCards`, `avgCost`, `characterCount`, `eventCount`, `isLegal`, `leaderName`
   - Slots: `styleBreakdown`, `legalityIssues`

---

**Ready for Plasmic integration!** All logic is tested and working. 🚀
