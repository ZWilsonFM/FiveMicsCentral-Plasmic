/**
 * Card data fetching hook using TanStack Query
 *
 * Fetches cards from Supabase with pagination support
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card } from '@/lib/types';

interface UseCardsOptions {
  /** Number of cards to fetch per page */
  pageSize?: number;
  /** Whether the query should be enabled */
  enabled?: boolean;
}

interface UseCardsReturn {
  /** All fetched cards (flattened from all pages) */
  cards: Card[];
  /** Whether the initial load is in progress */
  isLoading: boolean;
  /** Error if the query failed */
  error: Error | null;
  /** Fetch the next page of cards */
  fetchNextPage: () => void;
  /** Whether there are more pages to fetch */
  hasNextPage: boolean;
  /** Whether next page is being fetched */
  isFetchingNextPage: boolean;
}

const DEFAULT_PAGE_SIZE = 100;

/**
 * Fetch cards from Supabase
 *
 * @param pageSize - Number of cards per page
 * @param enabled - Whether the query should run
 * @returns Card data and pagination controls
 *
 * @example
 * ```tsx
 * const { cards, isLoading, fetchNextPage, hasNextPage } = useCards();
 *
 * if (isLoading) return <div>Loading...</div>;
 *
 * return (
 *   <div>
 *     {cards.map(card => <CardTile key={card.id} card={card} />)}
 *     {hasNextPage && <button onClick={fetchNextPage}>Load More</button>}
 *   </div>
 * );
 * ```
 */
export function useCards(options: UseCardsOptions = {}): UseCardsReturn {
  const { pageSize = DEFAULT_PAGE_SIZE, enabled = true } = options;

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['cards', pageSize],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from('Cards')
        .select('*', { count: 'exact' })
        .order('id', { ascending: true })
        .range(from, to);

      if (error) throw error;

      return {
        cards: data as Card[],
        nextCursor: to < (count ?? 0) - 1 ? pageParam + 1 : undefined,
        totalCount: count ?? 0,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    enabled,
    // Card data rarely changes, cache aggressively
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60, // 1 hour
  });

  // Flatten all pages into a single cards array
  const cards =
    data?.pages.flatMap((page) => page.cards) ?? ([] as Card[]);

  return {
    cards,
    isLoading,
    error: error as Error | null,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
  };
}
