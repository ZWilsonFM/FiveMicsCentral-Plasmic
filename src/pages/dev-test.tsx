/**
 * Development test page for testing deck builder hooks
 * This page demonstrates all hooks working together without Plasmic components
 *
 * Remove this file once Plasmic components are generated and integrated
 */

import { useDeckState } from '@/hooks/useDeckState';
import { useCards } from '@/hooks/useCards';
import { useCardFilters } from '@/hooks/useCardFilters';
import { useDeckStats } from '@/hooks/useDeckStats';

export default function DevTestPage() {
  const { cards, isLoading } = useCards();
  const { deck, addCard, removeCard, setDeckName } = useDeckState();
  const {
    filters,
    setSearch,
    toggleType,
    toggleStyle,
    toggleCost,
    filteredCards,
    availableTypes,
    availableStyles,
    availableCosts,
  } = useCardFilters(cards);
  const stats = useDeckStats(deck.cards);

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Loading cards...</h2>
        <p>Fetching card data from Supabase</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '2rem',
        padding: '1rem',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* FILTERS PANEL */}
      <div
        style={{
          width: '220px',
          flexShrink: 0,
          borderRight: '1px solid #e5e7eb',
          paddingRight: '1rem',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Filters</h3>

        {/* Search */}
        <input
          type="text"
          placeholder="Search cards..."
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
          }}
        />

        {/* Types */}
        <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
          Types
        </h4>
        <div style={{ marginBottom: '1rem' }}>
          {availableTypes.map((type) => (
            <label
              key={type}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.25rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              <input
                type="checkbox"
                checked={filters.types.includes(type)}
                onChange={() => toggleType(type)}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>

        {/* Styles */}
        <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
          Styles
        </h4>
        <div style={{ marginBottom: '1rem' }}>
          {availableStyles.map((style) => (
            <label
              key={style}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.25rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              <input
                type="checkbox"
                checked={filters.styles.includes(style)}
                onChange={() => toggleStyle(style)}
              />
              <span>{style}</span>
            </label>
          ))}
        </div>

        {/* Costs */}
        <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
          Costs
        </h4>
        <div style={{ marginBottom: '1rem' }}>
          {availableCosts.slice(0, 15).map((cost) => (
            <label
              key={cost}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginRight: '0.5rem',
                marginBottom: '0.25rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              <input
                type="checkbox"
                checked={filters.costs.includes(cost)}
                onChange={() => toggleCost(cost)}
              />
              <span>{cost}</span>
            </label>
          ))}
        </div>
      </div>

      {/* AVAILABLE CARDS PANEL */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <h2 style={{ marginTop: 0 }}>
          Available Cards ({filteredCards.length})
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Click a card to add it to your deck
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '0.75rem',
            marginTop: '1rem',
          }}
        >
          {filteredCards.slice(0, 100).map((card) => (
            <div
              key={card.id}
              onClick={() => addCard(card)}
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '0.75rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                backgroundColor: 'white',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 4px 6px -1px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  fontWeight: 'bold',
                  marginBottom: '0.25rem',
                  fontSize: '0.9rem',
                }}
              >
                {card.name}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                {card.type}
                {card.styles.length > 0 && ` • ${card.styles.join(', ')}`}
              </div>
              {card.type[0] == "Artist" && (<div
                style={{
                  marginTop: '0.5rem',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid #f3f4f6',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                }}
              >
                <span style={{ fontWeight: 'bold' }}>Cost: {card.cost}</span>
                <span>
                  {card.atk}/{card.def}
                </span>
              </div>)}
              {card.is_unique && (
                <div
                  style={{
                    marginTop: '0.25rem',
                    fontSize: '0.7rem',
                    color: '#8b5cf6',
                    fontWeight: 'bold',
                  }}
                >
                  ◆ UNIQUE
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCards.length > 100 && (
          <p
            style={{
              textAlign: 'center',
              color: '#6b7280',
              marginTop: '1rem',
              fontSize: '0.875rem',
            }}
          >
            Showing first 100 cards. Use filters to narrow results.
          </p>
        )}
      </div>

      {/* DECK PANEL */}
      <div
        style={{
          width: '320px',
          flexShrink: 0,
          borderLeft: '1px solid #e5e7eb',
          paddingLeft: '1rem',
        }}
      >
        {/* Deck Name */}
        <input
          type="text"
          value={deck.name}
          onChange={(e) => setDeckName(e.target.value)}
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            border: 'none',
            borderBottom: '2px solid #e5e7eb',
            width: '100%',
            padding: '0.25rem 0',
            marginBottom: '1rem',
          }}
        />

        {/* Stats Card */}
        <div
          style={{
            padding: '1rem',
            background: stats.isLegal ? '#d1fae5' : '#fee2e2',
            marginBottom: '1rem',
            borderRadius: '6px',
            fontSize: '0.875rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
            }}
          >
            <strong>Total Cards:</strong>
            <span>{stats.totalCards}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
            }}
          >
            <strong>Avg Cost:</strong>
            <span>{stats.avgCost.toFixed(2)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
            }}
          >
            <strong>Artists:</strong>
            <span>{stats.artistCount}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
            }}
          >
            <strong>Events:</strong>
            <span>{stats.eventCount}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
            }}
          >
            <strong>Items:</strong>
            <span>{stats.itemCount}</span>
          </div>

          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Legality: {stats.isLegal ? '✅ Legal' : '❌ Illegal'}
            </div>
            {stats.legalityIssues.length > 0 && (
              <div>
                {stats.legalityIssues.map((issue, i) => (
                  <div
                    key={i}
                    style={{
                      color: '#dc2626',
                      fontSize: '0.8rem',
                      marginBottom: '0.25rem',
                    }}
                  >
                    • {issue}
                  </div>
                ))}
              </div>
            )}
          </div>

          {Object.keys(stats.styleBreakdown).length > 0 && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Style Breakdown:
              </div>
              {Object.entries(stats.styleBreakdown).map(([style, count]) => (
                <div
                  key={style}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    marginBottom: '0.25rem',
                  }}
                >
                  <span>{style}:</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deck List */}
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
          Deck Cards
        </h3>

        {deck.cards.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            Click cards on the left to add them to your deck
          </p>
        ) : (
          <div style={{ fontSize: '0.875rem' }}>
            {deck.cards
              .sort((a, b) => {
                // Sort by cost, then by name
                if (a.cost !== b.cost) return a.cost - b.cost;
                return a.name.localeCompare(b.name);
              })
              .map((card) => (
                <div
                  key={card.id}
                  onClick={() => removeCard(card.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f3f4f6',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef3f2';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>
                    {card.quantity}x {card.name}
                  </span>
                  <span style={{ color: '#6b7280' }}>{card.cost}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
