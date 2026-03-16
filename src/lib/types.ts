/**
 * Core type definitions for the TCG Deck Builder application
 */

/**
 * Card entity from the Supabase Cards table
 */
export interface Card {
  /** Primary key (int8) */
  id: number;
  /** Card name */
  name: string;
  /** Card type (e.g., "Artist", "Item", "Event") */
  type: string[];
  /** Array of subtypes */
  sub_type: string[];
  /** Card cost (int2) */
  cost: number;
  /** Attack value (int2) */
  atk: number;
  /** Defense value (int2) */
  def: number;
  /** Card ability text */
  ability: string | null;
  /** Rarity (e.g., "Common", "Rare", "Super Rare") */
  rarity: string[];
  /** Whether the card is unique (limited to 1 copy) */
  is_unique: boolean;
  /** Array of styles/colors */
  styles: string[];
  /** URL to card artwork image */
  artwork_img_url: string | null;
  /** Illustrator name */
  illustrator_name: string | null;
  /** Array of set names the card appears in */
  set_name: string[];
  /** Set identifier code (e.g., "OP-01") */
  set_id_code: string;
  /** Card number within the set */
  set_number: number;

  preview_image: string | undefined;
}

/**
 * Card with quantity - represents a card in a deck
 */
export interface DeckCard extends Card {
  /** Number of copies in the deck */
  quantity: number;
  preview_image: string | undefined;
}

/**
 * Deck entity
 */
export interface Deck {
  /** Unique deck identifier */
  id: string;
  /** User who owns the deck */
  user_id: string;
  /** Deck name */
  name: string;
  /** Game format (e.g., "standard", "unlimited") */
  format: string;
  /** Cards in the deck with quantities */
  cards: DeckCard[];
  /** When the deck was created */
  created_at: Date;
  /** When the deck was last updated */
  updated_at: Date;
}

/**
 * Calculated statistics for a deck
 */
export interface DeckStats {
  /** Total number of cards in the deck */
  totalCards: number;
  /** Count of cards by style/color */
  styleBreakdown: Record<string, number>;
  /** Average card cost */
  avgCost: number;
  /** Number of character cards */
  artistCount: number;
  /** Number of event cards */
  eventCount: number;
  /** The deck's leader card (if applicable) */
  itemCount: number;
  /** Whether the deck meets format legality requirements */
  isLegal: boolean;
  /** List of issues preventing the deck from being legal */
  legalityIssues: string[];
}

/**
 * Filter criteria for card searching
 */
export interface CardFilters {
  /** Search text for name/ability/subtype */
  search: string;
  /** Filter by card types */
  types: string[];
  /** Filter by subtypes */
  subTypes: string[];
  /** Filter by styles/colors */
  styles: string[];
  /** Filter by cost values */
  costs: number[];
  /** Filter by rarity */
  rarities: string[];
  /** Filter by set codes */
  sets: string[];
}

/**
 * Database row type for decks table
 */
export interface DeckRow {
  id: string;
  user_id: string;
  name: string;
  format: string;
  created_at: string;
  updated_at: string;
}

/**
 * Database row type for deck_cards table
 */
export interface DeckCardRow {
  deck_id: string;
  card_id: number;
  quantity: number;
}
