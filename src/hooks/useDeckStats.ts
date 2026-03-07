/**
 * Deck statistics calculation hook
 *
 * Computes real-time statistics for a deck including:
 * - Total card count
 * - Style/color distribution
 * - Average cost
 * - Type counts
 * - Format legality
 */

import { useMemo } from 'react';
import { DeckCard, DeckStats } from '@/lib/types';

/**
 * Calculate comprehensive deck statistics
 *
 * @param deckCards - Cards in the deck with quantities
 * @returns Calculated deck statistics including legality
 *
 * @example
 * ```tsx
 * const { deck } = useDeckState();
 * const stats = useDeckStats(deck.cards);
 *
 * return (
 *   <div>
 *     <p>Total Cards: {stats.totalCards}</p>
 *     <p>Average Cost: {stats.avgCost.toFixed(2)}</p>
 *     <p>Leader: {stats.leaderCard?.name ?? 'None'}</p>
 *     <p>Legal: {stats.isLegal ? '✅' : '❌'}</p>
 *     {stats.legalityIssues.map((issue, i) => (
 *       <p key={i} className="text-red-500">{issue}</p>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useDeckStats(deckCards: DeckCard[]): DeckStats {
  return useMemo(() => {


    // Non-leader cards for main deck calculations
    const mainDeckCards = deckCards;
    const mainDeckTotal = mainDeckCards.reduce(
      (sum, c) => sum + c.quantity,
      0
    );

    // Total cards including leader
    const totalCards = deckCards.reduce((sum, c) => sum + c.quantity, 0);

    // Style/color breakdown
    const styleBreakdown: Record<string, number> = {};
    mainDeckCards.forEach((card) => {
      card.styles.forEach((style) => {
        styleBreakdown[style] = (styleBreakdown[style] || 0) + card.quantity;
      });
    });

    // Average cost calculation (main deck only, excluding leader)
    const totalCost = mainDeckCards.reduce(
      (sum, c) => sum + c.cost * c.quantity,
      0
    );
    const avgCost = mainDeckTotal > 0 ? totalCost / mainDeckTotal : 0;

    // Type counts
    const artistCount = deckCards
      .filter((c) => c.type[0] === 'Artist')
      .reduce((sum, c) => sum + c.quantity, 0);

    const eventCount = deckCards
      .filter((c) => c.type[0] === 'Event')
      .reduce((sum, c) => sum + c.quantity, 0);

    const itemCount = deckCards
      .filter((c) => c.type[0] === 'Item')
      .reduce((sum, c) => sum + c.quantity, 0);

    // Legality checks
    const legalityIssues: string[] = [];


    // Check main deck size (adjust numbers based on your game's rules)
    const MIN_DECK_SIZE = 30;
    const MAX_DECK_SIZE = 30;

    if (mainDeckTotal < MIN_DECK_SIZE) {
      legalityIssues.push(
        `Main deck has ${mainDeckTotal} cards (minimum ${MIN_DECK_SIZE})`
      );
    }
    if (mainDeckTotal > MAX_DECK_SIZE) {
      legalityIssues.push(
        `Main deck has ${mainDeckTotal} cards (maximum ${MAX_DECK_SIZE})`
      );
    }

    // Check copy limits
    deckCards.forEach((card) => {

      const maxCopies = card.is_unique ? 1 : 4;
      if (card.quantity > maxCopies) {
        legalityIssues.push(
          `${card.name}: ${card.quantity} copies (max ${maxCopies})`
        );
      }
    });

    return {
      totalCards,
      styleBreakdown,
      avgCost,
      artistCount,
      eventCount,
      itemCount,
      isLegal: legalityIssues.length === 0,
      legalityIssues,
    };
  }, [deckCards]);
}
