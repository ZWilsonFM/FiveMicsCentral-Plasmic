# Plasmic Integration Quick Reference

This guide shows exactly how to edit Plasmic-generated skeleton components to integrate with our hooks.

## 📋 Integration Checklist

After running `plasmic sync`:

1. [ ] Edit `DeckBuilderPage.tsx` skeleton
2. [ ] Edit `CardTile.tsx` skeleton
3. [ ] Edit `FilterBar.tsx` skeleton
4. [ ] Edit `DeckStatsCard.tsx` skeleton
5. [ ] Test the integrated components
6. [ ] Remove `src/pages/dev-test.tsx`

---

## 1️⃣ DeckBuilderPage Integration

**File:** `components/DeckBuilderPage.tsx`

### Step 1: Add imports

```tsx
// At the top of the file, after existing imports
import { useDeckState } from '@/hooks/useDeckState';
import { useCards } from '@/hooks/useCards';
import { useCardFilters } from '@/hooks/useCardFilters';
import { useDeckStats } from '@/hooks/useDeckStats';
```

### Step 2: Use hooks inside the component

```tsx
function DeckBuilderPage_(props, ref) {
  // Add these hooks
  const { cards, isLoading } = useCards();
  const {
    deck,
    addCard,
    removeCard,
    saveDeck,
    clearDeck,
    setDeckName,
    hasUnsavedChanges
  } = useDeckState();
  const {
    filters,
    setSearch,
    toggleType,
    toggleStyle,
    toggleCost,
    toggleRarity,
    toggleSet,
    filteredCards,
  } = useCardFilters(cards);
  const stats = useDeckStats(deck.cards);

  // Event handlers
  const handleCardClick = (card) => addCard(card);
  const handleDeckCardClick = (cardId) => removeCard(cardId);
  const handleSave = async () => await saveDeck();
  const handleReset = () => {
    if (confirm("Clear all cards from deck?")) {
      clearDeck();
    }
  };

  // Continue to return <PlasmicDeckBuilderPage ... />
}
```

### Step 3: Map data to Plasmic props

```tsx
return (
  <PlasmicDeckBuilderPage
    root={{ ref }}
    {...props}

    // Data props (match what designer named them)
    deckName={deck.name}
    deckCardCount={stats.totalCards}
    deckFormat={deck.format}
    isLoading={isLoading}
    isLegal={stats.isLegal}

    // Slots (inject child components)
    filterBar={
      <FilterBar
        filters={filters}
        onSearchChange={setSearch}
        onTypeToggle={toggleType}
        onStyleToggle={toggleStyle}
        onCostToggle={toggleCost}
        onRarityToggle={toggleRarity}
        onSetToggle={toggleSet}
      />
    }
    statsPanel={<DeckStatsCard stats={stats} />}

    // Overrides (attach behavior to named nodes)
    saveButton={{
      onClick: handleSave,
      disabled: !hasUnsavedChanges,
    }}
    resetButton={{
      onClick: handleReset,
    }}
    cardGrid={{
      children: filteredCards.map((card) => (
        <CardTile
          key={card.id}
          card={card}
          onClick={() => handleCardClick(card)}
        />
      )),
    }}
    deckCardList={{
      children: deck.cards.map((card) => (
        <CardTile
          key={card.id}
          card={card}
          isInDeck={true}
          quantity={card.quantity}
          onClick={() => handleDeckCardClick(card.id)}
        />
      )),
    }}
  />
);
```

---

## 2️⃣ CardTile Integration

**File:** `components/CardTile.tsx`

### Step 1: Extend the props interface

```tsx
import { Card, DeckCard } from '@/lib/types';

export interface CardTileProps extends Omit<DefaultCardTileProps, "onClick"> {
  card: Card | DeckCard;
  isInDeck?: boolean;
  quantity?: number;
  onClick?: () => void;
}
```

### Step 2: Map card data to Plasmic props

```tsx
function CardTile_(
  { card, isInDeck = false, quantity, onClick, ...plasmicProps },
  ref
) {
  const displayQuantity = quantity ?? (card as DeckCard).quantity;

  return (
    <PlasmicCardTile
      root={{ ref }}
      {...plasmicProps}

      // Map card data to Plasmic's prop names
      cardName={card.name}
      cardArt={card.artwork_img_url}
      cardType={card.type}
      cardSubTypes={card.sub_type.join(' / ')}
      cardCost={card.cost}
      cardAtk={card.atk}
      cardDef={card.def}
      cardRarity={card.rarity}
      cardAbility={card.ability}
      cardStyles={card.styles}
      isUnique={card.is_unique}
      isInDeck={isInDeck}

      // Activate variants based on state
      showQuantityBadge={displayQuantity !== undefined && displayQuantity > 1}

      // Overrides
      quantityBadge={{
        children: displayQuantity,
      }}
      cardContainer={{
        onClick: onClick,
        style: { cursor: onClick ? 'pointer' : 'default' },
      }}
    />
  );
}
```

---

## 3️⃣ FilterBar Integration

**File:** `components/FilterBar.tsx`

### Step 1: Extend props

```tsx
import { CardFilters } from '@/lib/types';

export interface FilterBarProps extends DefaultFilterBarProps {
  filters: CardFilters;
  onSearchChange: (value: string) => void;
  onTypeToggle: (type: string) => void;
  onStyleToggle: (style: string) => void;
  onCostToggle: (cost: number) => void;
  onRarityToggle: (rarity: string) => void;
  onSetToggle: (set: string) => void;
}
```

### Step 2: Wire up filter controls

Since your designer has added checkbox filters directly in Plasmic, you'll wire up the checkboxes using overrides. Each checkbox should be named in Plasmic (e.g., `typeArtistCheckbox`, `styleRedCheckbox`, etc.).

```tsx
function FilterBar_(
  {
    filters,
    onSearchChange,
    onTypeToggle,
    onStyleToggle,
    onCostToggle,
    onRarityToggle,
    onSetToggle,
    ...plasmicProps
  },
  ref
) {
  return (
    <PlasmicFilterBar
      root={{ ref }}
      {...plasmicProps}

      // Search input
      searchInput={{
        value: filters.search,
        onChange: (e) => onSearchChange(e.target.value),
        placeholder: "Search cards...",
      }}

      // Type filter checkboxes
      // Wire up each checkbox by name (match names from Plasmic)
      typeArtistCheckbox={{
        checked: filters.types.includes("Artist"),
        onChange: () => onTypeToggle("Artist"),
      }}
      typeItemCheckbox={{
        checked: filters.types.includes("Item"),
        onChange: () => onTypeToggle("Item"),
      }}
      typeEventCheckbox={{
        checked: filters.types.includes("Event"),
        onChange: () => onTypeToggle("Event"),
      }}

      // Style filter checkboxes
      styleRedCheckbox={{
        checked: filters.styles.includes("Red"),
        onChange: () => onStyleToggle("Red"),
      }}
      styleBlueCheckbox={{
        checked: filters.styles.includes("Blue"),
        onChange: () => onStyleToggle("Blue"),
      }}
      styleGreenCheckbox={{
        checked: filters.styles.includes("Green"),
        onChange: () => onStyleToggle("Green"),
      }}
      styleYellowCheckbox={{
        checked: filters.styles.includes("Yellow"),
        onChange: () => onStyleToggle("Yellow"),
      }}
      stylePurpleCheckbox={{
        checked: filters.styles.includes("Purple"),
        onChange: () => onStyleToggle("Purple"),
      }}
      styleBlackCheckbox={{
        checked: filters.styles.includes("Black"),
        onChange: () => onStyleToggle("Black"),
      }}

      // Cost filter checkboxes (0-10)
      cost0Checkbox={{
        checked: filters.costs.includes(0),
        onChange: () => onCostToggle(0),
      }}
      cost1Checkbox={{
        checked: filters.costs.includes(1),
        onChange: () => onCostToggle(1),
      }}
      cost2Checkbox={{
        checked: filters.costs.includes(2),
        onChange: () => onCostToggle(2),
      }}
      // ... continue for cost3-10

      // Rarity filter checkboxes
      rarityCommonCheckbox={{
        checked: filters.rarities.includes("Common"),
        onChange: () => onRarityToggle("Common"),
      }}
      rarityRareCheckbox={{
        checked: filters.rarities.includes("Rare"),
        onChange: () => onRarityToggle("Rare"),
      }}
      raritySuperRareCheckbox={{
        checked: filters.rarities.includes("Super Rare"),
        onChange: () => onRarityToggle("Super Rare"),
      }}

      // Set filter checkboxes (add as needed based on available sets)
      // Example:
      // set01Checkbox={{
      //   checked: filters.sets.includes("OP-01"),
      //   onChange: () => onSetToggle("OP-01"),
      // }}
    />
  );
}
```

### Important Notes

- **Checkbox naming**: The exact override names (e.g., `typeArtistCheckbox`) must match what your designer named them in Plasmic
- **Check the generated types**: Look in `components/plasmic/.../PlasmicFilterBar.tsx` to find the exact names of all checkbox overrides
- **Add all needed filters**: Include overrides for costs 0-10, all rarities, and all set codes that exist in your card database

---

## 4️⃣ DeckStatsCard Integration

**File:** `components/DeckStatsCard.tsx`

### Step 1: Extend props

```tsx
import { DeckStats } from '@/lib/types';

export interface DeckStatsCardProps extends DefaultDeckStatsCardProps {
  stats: DeckStats;
}
```

### Step 2: Map stats to Plasmic props

```tsx
function DeckStatsCard_(
  { stats, ...plasmicProps },
  ref
) {
  return (
    <PlasmicDeckStatsCard
      root={{ ref }}
      {...plasmicProps}

      // Basic stats
      totalCards={stats.totalCards}
      avgCost={stats.avgCost.toFixed(2)}
      characterCount={stats.characterCount}
      eventCount={stats.eventCount}
      isLegal={stats.isLegal}
      leaderName={stats.leaderCard?.name ?? "No Leader"}

      // Style breakdown (render custom content)
      styleBreakdown={{
        children: Object.entries(stats.styleBreakdown).map(([style, count]) => (
          <div key={style}>
            {style}: {count}
          </div>
        )),
      }}

      // Legality issues
      legalityIssues={{
        children: stats.legalityIssues.length > 0 ? (
          stats.legalityIssues.map((issue, i) => (
            <div key={i} className="text-red-500">
              {issue}
            </div>
          ))
        ) : (
          <div className="text-green-500">Deck is legal!</div>
        ),
      }}
    />
  );
}
```

---

## 🎨 Prop Naming Convention

The exact prop names depend on what the designer used in Plasmic. Check the generated `DefaultXxxProps` interface to find the correct names:

```tsx
// Example: components/plasmic/fm_central/PlasmicCardTile.tsx
export interface DefaultCardTileProps {
  cardName?: string;  // Use this prop name
  cardCost?: number;  // Not "cost"
  // ... etc
}
```

---

## 🧪 Testing After Integration

1. Start the dev server: `npm run dev`
2. Navigate to the deck builder page
3. Verify:
   - [ ] Cards load and display
   - [ ] Search works
   - [ ] Filters work
   - [ ] Clicking cards adds them to deck
   - [ ] Stats update in real-time
   - [ ] Save button works (requires Supabase auth)

---

## ⚠️ Common Issues

### Props not showing up
- Check that prop names match what's in `DefaultXxxProps`
- Ensure props are being passed to the Plasmic component

### Click handlers not working
- Verify the node name in the override (e.g., `saveButton`)
- Check that the node exists in the Plasmic design

### Data not updating
- Make sure hooks are called at the component level
- Check React DevTools to verify state changes

---

## 🗑️ After Integration

Once everything is working:

1. Delete `src/pages/dev-test.tsx`
2. Remove the route if it was added to routing config
3. Update `.gitignore` if needed

---

**The logic is ready - just wire it up to the Plasmic components!** 🎉
