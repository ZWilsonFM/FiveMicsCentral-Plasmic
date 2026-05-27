/**
 * Deck state management using Zustand
 *
 * Manages the current deck being edited, including:
 * - Adding/removing cards
 * - Tracking unsaved changes
 * - Persisting to Supabase
 */

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Card, Deck, DeckCard, DeckRow, DeckCardRow, DeckStats } from '@/lib/types';
import { calculateDeckStats } from './useDeckStats';

interface DeckState {
  // State
  /** Current deck being edited */
  deck: Deck;
  /** Last saved version of the deck (for tracking changes) */
  lastSavedDeck: Deck | null;

  /** Calculated statistics for the deck */
  stats: DeckStats;

  // Computed
  /** Whether the deck has unsaved changes */
  hasUnsavedChanges: boolean;

  // Actions
  /**
   * Add a card to the deck
   * Respects copy limits: unique cards limited to 1, others to 4
   */
  addCard: (card: Card) => void;

  /**
   * Remove one copy of a card from the deck
   */
  removeCard: (cardId: number) => void;

  /**
   * Remove all copies of a card from the deck
   */
  removeAllCopies: (cardId: number) => void;

  /**
   * Set the deck name
   */
  setDeckName: (name: string) => void;

  /**
   * Set the deck format
   */
  setFormat: (format: string) => void;

  /**
   * Set the deck description
   */
  setDescription: (description: string) => void;

  /**
   * Set the deck visibility
   */
  setIsPublic: (isPublic: boolean) => void;

  /**
   * Set the author name
   */
  setAuthorName: (authorName: string) => void;

  /**
   * Clear all cards from the deck
   */
  clearDeck: () => void;

  /**
   * Load a deck from storage
   */
  loadDeck: (deck: Deck) => void;

  /**
   * Save the deck to Supabase
   */
  saveDeck: () => Promise<void>;
}

/**
 * Create an empty deck
 */
function createEmptyDeck(): Deck {
  return {
    id: crypto.randomUUID(),
    user_id: '',
    name: 'Untitled Deck',
    description: '',
    is_public: false,
    author_name: '',
    format: 'standard',
    cards: [],
    created_at: new Date(),
    updated_at: new Date(),
  };
}

/**
 * Deep clone a deck
 */
function cloneDeck(deck: Deck): Deck {
  return {
    ...deck,
    cards: deck.cards.map((c) => ({ ...c })),
  };
}

/**
 * Check if two decks are equal (for change tracking)
 */
function decksEqual(a: Deck | null, b: Deck | null): boolean {
  if (!a || !b) return a === b;
  if (
    a.name !== b.name ||
    a.format !== b.format ||
    a.description !== b.description ||
    a.is_public !== b.is_public ||
    a.author_name !== b.author_name
  )
    return false;
  if (a.cards.length !== b.cards.length) return false;

  // Compare cards (order-independent)
  const aCards = [...a.cards].sort((x, y) => x.id - y.id);
  const bCards = [...b.cards].sort((x, y) => x.id - y.id);

  return aCards.every(
    (card, i) =>
      bCards[i].id === card.id && bCards[i].quantity === card.quantity
  );
}

export const useDeckState = create<DeckState>((set, get) => ({
  // Initial state
  deck: createEmptyDeck(),
  lastSavedDeck: null,
  stats: calculateDeckStats([]),
  hasUnsavedChanges: false,

  // Actions
  addCard: (card: Card) => {
    set((state) => {
      const { stats, deck } = state;
      const isArtist = card.type === 'Artist';
      
      // Limit to 30 cards total
      if (stats.totalCards >= 30) {
        console.warn("Deck limit reached: 30 cards max.");
        return state;
      }

      // Limit to 15 Artist cards
      if (isArtist && stats.artistCount >= 15) {
        console.warn("Artist limit reached: 15 artists max.");
        return state;
      }

      const existingCardIndex = deck.cards.findIndex(
        (c) => c.id === card.id
      );

      let newCards: DeckCard[];

      if (existingCardIndex >= 0) {
        // Card already in deck - increment quantity if under limit
        const existingCard = deck.cards[existingCardIndex];
        const maxCopies = card.is_unique ? 1 : 4;

        if (existingCard.quantity >= maxCopies) {
          // Already at max copies - don't add
          return state;
        }

        newCards = [...deck.cards];
        newCards[existingCardIndex] = {
          ...existingCard,
          quantity: existingCard.quantity + 1,
          preview_image: card.preview_image
        };
      } else {
        // New card - add with quantity 1
        const deckCard: DeckCard = {
          ...card,
          quantity: 1,
          preview_image: card.preview_image
        };
        newCards = [...deck.cards, deckCard];
      }

      const newDeck = {
        ...deck,
        cards: newCards,
        updated_at: new Date(),
      };

      return {
        deck: newDeck,
        stats: calculateDeckStats(newCards),
        hasUnsavedChanges: !decksEqual(newDeck, state.lastSavedDeck),
      };
    });
  },

  removeCard: (cardId: number) => {
    set((state) => {
      const existingCardIndex = state.deck.cards.findIndex(
        (c) => c.id === cardId
      );

      if (existingCardIndex < 0) {
        // Card not in deck
        return state;
      }

      const existingCard = state.deck.cards[existingCardIndex];
      let newCards: DeckCard[];

      if (existingCard.quantity > 1) {
        // Decrement quantity
        newCards = [...state.deck.cards];
        newCards[existingCardIndex] = {
          ...existingCard,
          quantity: existingCard.quantity - 1,
        };
      } else {
        // Remove card entirely
        newCards = state.deck.cards.filter((c) => c.id !== cardId);
      }

      const newDeck = {
        ...state.deck,
        cards: newCards,
        updated_at: new Date(),
      };

      return {
        deck: newDeck,
        stats: calculateDeckStats(newCards),
        hasUnsavedChanges: !decksEqual(newDeck, state.lastSavedDeck),
      };
    });
  },

  removeAllCopies: (cardId: number) => {
    set((state) => {
      const newCards = state.deck.cards.filter((c) => c.id !== cardId);

      const newDeck = {
        ...state.deck,
        cards: newCards,
        updated_at: new Date(),
      };

      return {
        deck: newDeck,
        stats: calculateDeckStats(newCards),
        hasUnsavedChanges: !decksEqual(newDeck, state.lastSavedDeck),
      };
    });
  },

  setDeckName: (name: string) => {
    set((state) => {
      const newDeck = {
        ...state.deck,
        name,
        updated_at: new Date(),
      };

      return {
        deck: newDeck,
        hasUnsavedChanges: !decksEqual(newDeck, state.lastSavedDeck),
      };
    });
  },

  setFormat: (format: string) => {
    set((state) => {
      const newDeck = {
        ...state.deck,
        format,
        updated_at: new Date(),
      };

      return {
        deck: newDeck,
        hasUnsavedChanges: !decksEqual(newDeck, state.lastSavedDeck),
      };
    });
  },

  setDescription: (description: string) => {
    set((state) => {
      const newDeck = {
        ...state.deck,
        description,
        updated_at: new Date(),
      };

      return {
        deck: newDeck,
        hasUnsavedChanges: !decksEqual(newDeck, state.lastSavedDeck),
      };
    });
  },

  setIsPublic: (is_public: boolean) => {
    set((state) => {
      const newDeck = {
        ...state.deck,
        is_public,
        updated_at: new Date(),
      };

      return {
        deck: newDeck,
        hasUnsavedChanges: !decksEqual(newDeck, state.lastSavedDeck),
      };
    });
  },

  setAuthorName: (author_name: string) => {
    set((state) => {
      const newDeck = {
        ...state.deck,
        author_name,
        updated_at: new Date(),
      };

      return {
        deck: newDeck,
        hasUnsavedChanges: !decksEqual(newDeck, state.lastSavedDeck),
      };
    });
  },

  clearDeck: () => {
    set((state) => {
      const newDeck = {
        ...state.deck,
        cards: [],
        updated_at: new Date(),
      };

      return {
        deck: newDeck,
        stats: calculateDeckStats([]),
        hasUnsavedChanges: !decksEqual(newDeck, state.lastSavedDeck),
      };
    });
  },

  loadDeck: (deck: Deck) => {
    set({
      deck: cloneDeck(deck),
      lastSavedDeck: cloneDeck(deck),
      stats: calculateDeckStats(deck.cards),
      hasUnsavedChanges: false,
    });
  },

  saveDeck: async () => {
    const { deck } = get();

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User must be authenticated to save decks');
      }

      // Prepare deck row
      const deckRow: Partial<DeckRow> = {
        id: deck.id,
        user_id: user.id,
        name: deck.name,
        description: deck.description || null,
        is_public: deck.is_public || false,
        author_name: deck.author_name || user.user_metadata?.full_name || user.email || null,
        format: deck.format,
        updated_at: new Date().toISOString(),
      };

      // Upsert deck
      const { error: deckError } = await supabase
        .from('decks')
        .upsert(deckRow);

      if (deckError) throw deckError;

      // Delete existing deck_cards for this deck
      const { error: deleteError } = await supabase
        .from('deck_cards')
        .delete()
        .eq('deck_id', deck.id);

      if (deleteError) throw deleteError;

      // Insert new deck_cards
      if (deck.cards.length > 0) {
        const deckCardRows: DeckCardRow[] = deck.cards.map((card) => ({
          deck_id: deck.id,
          card_id: card.id,
          quantity: card.quantity,
        }));

        const { error: insertError } = await supabase
          .from('deck_cards')
          .insert(deckCardRows);

        if (insertError) throw insertError;
      }

      // Update lastSavedDeck and clear unsaved changes flag
      set({
        lastSavedDeck: cloneDeck(deck),
        hasUnsavedChanges: false,
      });
    } catch (error) {
      console.error('Error saving deck:', error);
      throw error;
    }
  },
}));
