# Plasmic Designer Guide for Five Mics TCG

This guide explains best practices for organizing and structuring designs in Plasmic for seamless integration with our React codebase.

---

## Core Principles

### 1. Component vs. Frame
Understand when to make something a component:

**Make it a component when:**
- It's used in multiple places (e.g., CardTile, Button, FilterBar)
- It needs to receive data or handle interactions programmatically
- Developers need to control its behavior with code
- It has variants or different states (e.g., loading, disabled, selected)

**Keep it as a frame when:**
- It's a one-off layout element
- It's purely decorative
- It's specific to a single page/view

### 2. Component Props
When creating components that will receive data:

**Text Elements**
- Give text nodes descriptive names (e.g., `cardName`, `deckTitle`, `errorMessage`)
- Developers will pass string values to these via props
- Example: A card name should be named `cardName`, not `text1` or `label`

**Image Elements**
- Name image nodes clearly (e.g., `cardArt`, `avatarImage`, `logoIcon`)
- Developers will pass URLs to these props

**Numeric Values**
- Use clear names like `cardCost`, `deckCount`, `avgCost`
- Developers will pass numbers

**Boolean Values (Variants)**
- Use boolean props for states like `isLoading`, `isDisabled`, `isSelected`, `isLegal`
- Create variants based on these states

---

## Naming Conventions

### Interactive Elements
Always use descriptive, consistent names for elements that developers need to hook into:

**Buttons:** End with "Button"
```
saveButton
resetButton
deleteButton
addCardButton
```

**Inputs:** End with "Input"
```
searchInput
deckNameInput
emailInput
```

**Checkboxes:** End with "Checkbox", include the category
```
typeArtistCheckbox
styleRedCheckbox
cost5Checkbox
rarityCommonCheckbox
```

**Containers/Lists:** Indicate what they contain
```
cardGrid
deckCardList
filterContainer
statsPanel
```

---

## Layout Structure

### Page Organization
Structure your pages with clear, semantic sections:

```
DeckBuilderPage (component)
├── Header
│   ├── deckNameInput
│   ├── deckFormatDropdown
│   └── saveButton
├── MainContent
│   ├── filterBar (slot for FilterBar component)
│   ├── cardGrid (container for CardTile components)
│   └── deckPanel
│       ├── statsPanel (slot for DeckStatsCard)
│       └── deckCardList (container for CardTile components)
└── Footer
    └── resetButton
```

### Container Best Practices

**Use named containers for dynamic content:**
- `cardGrid`: Where card components will be rendered in a loop
- `deckCardList`: Where deck cards will be displayed
- `filterContainer`: Where filter buttons/checkboxes live

**Set container properties correctly:**
- Use **Flex** or **Grid** layout for lists
- Set **gap** for spacing between items (don't rely on margins)
- Make containers **scrollable** if content can overflow

---

## Slots vs. Overrides

Understand the difference between slots and overrides:

### Slots
Use slots when you want developers to inject entire components:

**Example:**
```
filterBar (slot) → Developer injects <FilterBar /> component
statsPanel (slot) → Developer injects <DeckStatsCard /> component
```

**How to create a slot:**
1. Create a placeholder in your design
2. Name it descriptively (e.g., `filterBar`, `statsPanel`)
3. Developers will replace this entire element with their component

### Overrides
Use overrides for individual elements within your component that need behavior:

**Example:**
```
saveButton → Developer adds onClick handler
searchInput → Developer adds value and onChange
```

**What can be overridden:**
- Click handlers (`onClick`)
- Input values (`value`, `onChange`)
- Disabled states (`disabled`)
- Styles (`className`, `style`)
- Children content (for dynamic lists)

---

## Working with Lists

### Dynamic Lists (Children Override)
When developers need to render lists of items dynamically:

**Setup:**
1. Create a container (e.g., `cardGrid`)
2. Add 2-3 example items to show the layout
3. Name the container clearly

**Developer will:**
- Override the container's `children` prop
- Map through data and render components
- Your example items are just for preview in Plasmic

**Example Structure:**
```
cardGrid (container)
├── CardTile (example 1)
├── CardTile (example 2)
└── CardTile (example 3) ← These are removed at runtime
```

---

## Variants

Use variants to represent different component states:

### Boolean Variants
Create boolean variants for states:
- `isLoading` → Show loading spinner, disable interactions
- `isSelected` → Highlight background, change border
- `isDisabled` → Gray out, show disabled cursor
- `isInDeck` → Show quantity badge, different styling

### Value Variants
For components with multiple distinct appearances:
- `size`: small, medium, large
- `variant`: primary, secondary, danger
- `type`: button, link, text

### Combination Variants
Variants can be combined:
- Card can be `isInDeck` AND `isSelected`
- Button can be `isLoading` AND `isDisabled`

**Best Practice:** Test all variant combinations to ensure they work together visually.

---

## Filters & Forms

### Filter Components
When designing filter interfaces:

**Checkbox Filters:**
```
FilterBar (component)
├── searchInput
├── Type Filters
│   ├── typeArtistCheckbox
│   ├── typeItemCheckbox
│   └── typeEventCheckbox
├── Style Filters
│   ├── styleRedCheckbox
│   ├── styleBlueCheckbox
│   └── ... (one per style)
└── Cost Filters
    ├── cost0Checkbox
    ├── cost1Checkbox
    └── ... (cost0 through cost10)
```

**Form Inputs:**
- Always name inputs clearly: `emailInput`, `passwordInput`, `deckNameInput`
- Add placeholder text to show expected format
- Design error states (use variants)

---

## State Indicators

Design clear visual feedback for different states:

### Loading States
- Add `isLoading` variant to components
- Show skeleton loaders or spinners
- Disable interactions during loading

### Error States
- Add `hasError` variant
- Display error messages clearly
- Use red/warning colors consistently

### Success States
- Add `isSuccess` variant for confirmations
- Use green/success colors
- Consider temporary success animations

### Empty States
- Design what shows when there's no data
- Include helpful messaging (e.g., "No cards match your filters")
- Add illustrations or icons for polish

---

## Responsive Design

Consider different screen sizes:

### Breakpoints
Test your designs at:
- Desktop: 1920px, 1440px, 1280px
- Tablet: 1024px, 768px
- Mobile: 375px, 320px

### Layout Tips
- Use **Auto Layout** (Flex) for responsive containers
- Set **min-width** and **max-width** constraints
- Use **wrap** for grids that should reflow
- Test with different content lengths (short/long card names, etc.)

---

## Common Pitfalls to Avoid

### 1. Generic Naming
**Bad:** `text1`, `button`, `container2`, `group7`
**Good:** `cardName`, `saveButton`, `filterContainer`, `statsPanel`

### 2. Absolute Positioning
- Avoid absolute positioning unless necessary
- Use Flex or Grid for layouts
- Absolute positioning breaks when content size changes

### 3. Fixed Dimensions
- Don't set fixed heights on containers with dynamic content
- Use `min-height` or `height: auto` instead
- Fixed widths should only be used when truly necessary

### 4. Hardcoded Content
- Don't hardcode data that will be dynamic
- Use placeholder text that makes it clear what data goes there
  - **Good:** `"Card Name"`, `"42"`, `"Deck Stats"`
  - **Bad:** `"Pikachu"`, `"My Cool Deck"` (too specific)

### 5. Unnamed Interactive Elements
Every button, input, checkbox, etc. that needs behavior MUST have a clear name. Otherwise, developers can't hook into it.

### 6. Inconsistent Spacing
- Use consistent gap/padding values (e.g., 8px, 16px, 24px)
- Define spacing using Plasmic tokens when possible
- Don't mix random values (e.g., 13px, 19px, 22px)

---

## Communication with Developers

### After Making Changes
When you update designs, inform the developer about:
1. **New components** created
2. **Renamed elements** (this breaks code!)
3. **New props or variants** added
4. **Layout changes** that might affect integration

### Sync Workflow
1. Make changes in Plasmic
2. Tell developer you've made updates
3. Developer runs `plasmic sync` to pull changes
4. Developer updates integration code if needed
5. Test together to verify everything works

### Element Names Matter
**NEVER rename elements** that developers are already using without telling them. This breaks the integration!

If you need to rename something:
1. Tell the developer FIRST
2. Make a list of old name → new name
3. Rename in Plasmic
4. Developer updates code with new names
5. Test together

---

## Testing Your Designs

Before considering a component "done":

1. **Test all variants** individually and in combination
2. **Test with realistic data** (long names, missing images, etc.)
3. **Test empty states** (no results, no data)
4. **Test error states** (failed loads, validation errors)
5. **Test at different screen sizes**
6. **Verify all element names** are clear and descriptive
7. **Check spacing consistency** throughout

---

## Quick Checklist

Before handing off a component:

- [ ] All interactive elements have clear names
- [ ] Text/image elements are named based on the data they'll receive
- [ ] Variants are created for all necessary states
- [ ] Layout uses Flex/Grid (not absolute positioning)
- [ ] Spacing is consistent (using tokens if possible)
- [ ] Component works at different screen sizes
- [ ] Slots are set up for child components (if applicable)
- [ ] Example content is realistic and placeholder-like
- [ ] All states tested (loading, error, success, empty)

---

## Resources

- [Plasmic Documentation](https://docs.plasmic.app/)
- [Auto Layout Guide](https://docs.plasmic.app/learn/auto-layout/)
- [Component Props](https://docs.plasmic.app/learn/component-props/)
- [Variants](https://docs.plasmic.app/learn/variants/)

---

**Questions?** Ask the developer if you're unsure whether something should be a component, how to name an element, or how to structure a complex layout.
