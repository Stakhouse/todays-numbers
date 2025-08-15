# Today’s Numbers — Design Principles & Guidelines

## 1. Overall Design Philosophy
- **Mood & Personality:** Energetic, exciting, and “cash-flow” lottery vibe while staying welcoming and tropical.  
- **Tone:** Fun but trustworthy — dynamic and engaging but reliable for users seeking accurate info.  
- **Visual Feel:**  
  - Bright accents for excitement (lottery highlights, notifications)  
  - Calm tropical backgrounds (sea, sand, vegetation)  
  - Clear, readable typography for data-heavy content  

---

## 2. Color Palette
| Purpose                  | Color Example | Notes |
|---------------------------|---------------|-------|
| Lottery highlights / accents | #FFBF00 (gold) | Attention-grabbing, draws eye to lottery numbers |
| Tropical backgrounds / accents | #00BFA6 (teal), #00CFFF (sky blue) | Soft, calming, tropical feel |
| Primary text | #212121 (dark gray) | Easy readability |
| Secondary text / hints | #757575 (medium gray) | Less emphasis |
| Buttons / call-to-actions | #FF5722 (orange) | Energetic, clickable |
| Background | #E0F7FA (light cyan) | Light, tropical, clean |

---

## 3. Typography
- **Headlines:** Bold, modern sans-serif (MUI default: `Roboto`).  
- **Body Text:** Regular, legible sans-serif (`Roboto` or `Open Sans`).  
- **Data Display:** Monospaced or semi-bold font for lottery numbers, scores, prices.  
- **Hierarchy:** Use size, weight, and color to distinguish info types (numbers > secondary text).

---

## 4. Layout & Spacing
- **Responsive Grid Layout:**  
  - Mobile-first, stacked cards  
  - Multi-column cards for tablets/desktops  
- **Content Cards:**  
  - Distinct card components for lottery, sports, hotels, events  
  - Spacing: MUI `spacing={2–3}`  
- **Navigation:**  
  - Tabs for islands (scrollable on mobile, full width on desktop)  
  - Category navigation as cards or tabs within each island page  

---

## 5. Component Usage (MUI Guidelines)
| Component | Usage / Style Notes |
|-----------|------------------|
| **Button** | Rounded corners (`border-radius: 8px`), vibrant (#FF5722), hover elevation |
| **Tabs** | Bold, color accent for selected (#FFBF00) |
| **Cards** | Slight shadow, rounded edges, tropical accent backgrounds |
| **Dropdowns** | Clean, minimal, clear labels; MUI Select |
| **Modal/Dialogs** | Subtle overlay, smooth transitions |
| **Alerts / Snackbars** | Lottery wins, system messages; animated for attention |

---

## 6. Visual Indicators
- **Lottery numbers:** Highlighted boxes with shadows or borders.  
- **Sports / Price changes:** Upward green arrows for increase, red downward arrows for decrease.  
- **Events:** Colored tags for type or urgency.  

---

## 7. Icons & Imagery
- **Icons:** MUI icons (money, ticket, home, sports, location).  
- **Imagery:**  
  - Tropical landscapes in hero sections or subtle backgrounds.  
  - Small illustrations for excitement or island vibe.  

---

## 8. Accessibility
- Minimum contrast ratio for text (#212121 on #E0F7FA meets WCAG AA).  
- Keyboard navigable tabs, cards, and interactive elements.  
- ARIA labels for dynamic content (lottery numbers, scores, events).  

---

## 9. Example Component Code Snippets (MUI)
```jsx
// Lottery Number Card
<Card sx={{ borderRadius: 2, boxShadow: 3, p: 2, backgroundColor: '#FFF8E1' }}>
  <Typography variant="h6" color="primary">Lotto 6/42</Typography>
  <Box display="flex" justifyContent="space-around">
    {numbers.map((num) => (
      <Box key={num} sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#FFBF00' }}>{num}</Box>
    ))}
  </Box>
</Card>
