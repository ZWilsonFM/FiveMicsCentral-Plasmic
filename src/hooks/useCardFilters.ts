/**
 * Card filtering hook
 *
 * Provides client-side filtering of cards based on multiple criteria:
 * - Search text (name, ability, subtypes)
 * - Card types
 * - Styles/colors
 * - Costs
 * - Rarities
 * - Sets
 */

import { useState, useMemo } from 'react';
import { Card, CardFilters } from '@/lib/types';

interface UseCardFiltersReturn {
  // Current filter state
  /** Current filter criteria */
  filters: CardFilters;

  // Filter setters
  /** Set search text */
  setSearch: (value: string) => void;
  /** Set card types filter */
  setTypes: (types: string[]) => void;
  /** Toggle a single type on/off */
  toggleType: (type: string) => void;
  /** Set styles filter */
  setStyles: (styles: string[]) => void;
  /** Toggle a single style on/off */
  toggleStyle: (style: string) => void;
  /** Set costs filter */
  setCosts: (costs: number[]) => void;
  /** Toggle a single cost on/off */
  toggleCost: (cost: number) => void;
  /** Set rarities filter */
  setRarities: (rarities: string[]) => void;
  /** Toggle a single rarity on/off */
  toggleRarity: (rarity: string) => void;
  /** Set sets filter */
  setSets: (sets: string[]) => void;
  /** Toggle a single set on/off */
  toggleSet: (set: string) => void;
  /** Clear all filters */
  clearFilters: () => void;

  // Filtered results
  /** Cards matching the current filters */
  filteredCards: Card[];

  // Available filter options (derived from card data)
  /** All unique types in the card data */
  availableTypes: string[];
  /** All unique styles in the card data */
  availableStyles: string[];
  /** All unique costs in the card data */
  availableCosts: number[];
  /** All unique rarities in the card data */
  availableRarities: string[];
  /** All unique set codes in the card data */
  availableSets: string[];
}

const INITIAL_FILTERS: CardFilters = {
  search: '',
  types: [],
  subTypes: [],
  styles: [],
  costs: [],
  rarities: [],
  sets: [],
};

/**
 * Client-side card filtering
 *
 * @param cards - All available cards to filter
 * @returns Filter state, setters, and filtered results
 *
 * @example
 * ```tsx
 * const { cards } = useCards();
 * const {
 *   filters,
 *   setSearch,
 *   toggleType,
 *   filteredCards,
 *   availableTypes
 * } = useCardFilters(cards);
 *
 * return (
 *   <div>
 *     <input
 *       value={filters.search}
 *       onChange={(e) => setSearch(e.target.value)}
 *       placeholder="Search cards..."
 *     />
 *     {availableTypes.map(type => (
 *       <button
 *         key={type}
 *         onClick={() => toggleType(type)}
 *         data-selected={filters.types.includes(type)}
 *       >
 *         {type}
 *       </button>
 *     ))}
 *     {filteredCards.map(card => <CardTile key={card.id} card={card} />)}
 *   </div>
 * );
 * ```
 */
export function useCardFilters(cards: Card[]): UseCardFiltersReturn {
  const [filters, setFilters] = useState<CardFilters>(INITIAL_FILTERS);

  // Derive available filter options from card data
  const availableOptions = useMemo(() => {
    const types = new Set<string>();
    const styles = new Set<string>();
    const costs = new Set<number>();
    const rarities = new Set<string>();
    const sets = new Set<string>();

    cards.forEach((card) => {
      types.add(card.type[0]);
      card.styles.forEach((style) => styles.add(style));
      costs.add(card.cost);
      rarities.add(card.rarity[0]);
      sets.add(card.set_id_code);
    });

    return {
      types: Array.from(types).sort(),
      styles: Array.from(styles).sort(),
      costs: Array.from(costs).sort((a, b) => a - b),
      rarities: Array.from(rarities).sort(),
      sets: Array.from(sets).sort(),
    };
  }, [cards]);

  // Filter cards based on current filters
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      // Search filter (case-insensitive)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const nameMatch = card.name.toLowerCase().includes(searchLower);
        const abilityMatch =
          card.ability?.toLowerCase().includes(searchLower) ?? false;
        const subTypeMatch = card.sub_type.some((st) =>
          st.toLowerCase().includes(searchLower)
        );

        if (!nameMatch && !abilityMatch && !subTypeMatch) {
          return false;
        }
      }

      // Type filter (empty array = show all)
      if (filters.types.length > 0 && !filters.types.includes(card.type[0])) {
        return false;
      }

      // Style filter (card must have at least one of the selected styles)
      if (
        filters.styles.length > 0 &&
        !card.styles.some((style) => filters.styles.includes(style))
      ) {
        return false;
      }

      // Cost filter (empty array = show all)
      if (filters.costs.length > 0 && !filters.costs.includes(card.cost)) {
        return false;
      }

      // Rarity filter (empty array = show all)
      if (
        filters.rarities.length > 0 &&
        !filters.rarities.includes(card.rarity[0])
      ) {
        return false;
      }

      // Set filter (empty array = show all)
      if (
        filters.sets.length > 0 &&
        !filters.sets.includes(card.set_id_code)
      ) {
        return false;
      }

      return true;
    });
  }, [cards, filters]);

  // Filter setters
  const setSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const setTypes = (types: string[]) => {
    setFilters((prev) => ({ ...prev, types }));
  };

  const toggleType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const setStyles = (styles: string[]) => {
    setFilters((prev) => ({ ...prev, styles }));
  };

  const toggleStyle = (style: string) => {
    setFilters((prev) => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter((s) => s !== style)
        : [...prev.styles, style],
    }));
  };

  const setCosts = (costs: number[]) => {
    setFilters((prev) => ({ ...prev, costs }));
  };

  const toggleCost = (cost: number) => {
    setFilters((prev) => ({
      ...prev,
      costs: prev.costs.includes(cost)
        ? prev.costs.filter((c) => c !== cost)
        : [...prev.costs, cost],
    }));
  };

  const setRarities = (rarities: string[]) => {
    setFilters((prev) => ({ ...prev, rarities }));
  };

  const toggleRarity = (rarity: string) => {
    setFilters((prev) => ({
      ...prev,
      rarities: prev.rarities.includes(rarity)
        ? prev.rarities.filter((r) => r !== rarity)
        : [...prev.rarities, rarity],
    }));
  };

  const setSets = (sets: string[]) => {
    setFilters((prev) => ({ ...prev, sets }));
  };

  const toggleSet = (set: string) => {
    setFilters((prev) => ({
      ...prev,
      sets: prev.sets.includes(set)
        ? prev.sets.filter((s) => s !== set)
        : [...prev.sets, set],
    }));
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return {
    // State
    filters,

    // Setters
    setSearch,
    setTypes,
    toggleType,
    setStyles,
    toggleStyle,
    setCosts,
    toggleCost,
    setRarities,
    toggleRarity,
    setSets,
    toggleSet,
    clearFilters,

    // Results
    filteredCards,

    // Available options
    availableTypes: availableOptions.types,
    availableStyles: availableOptions.styles,
    availableCosts: availableOptions.costs,
    availableRarities: availableOptions.rarities,
    availableSets: availableOptions.sets,
  };
}
