# SimplySent Theme System

This directory contains the theme configuration and brand guidelines for the SimplySent application.

## 📁 Files

- **`colors.ts`** - Brand color definitions and usage guidelines
- **`README.md`** - This file - theme system documentation

## 🎨 Brand Colors

### Primary Color

**SimplySent Purple: `#5f59a6`**

This is our primary brand color used throughout the application for:
- Primary CTAs and buttons
- Brand badges and verification marks
- Product page accents
- Trust indicators
- Navigation highlights

### Color Variants

- **Light Purple**: `#7a75ba` - Used for hover states and lighter backgrounds
- **Dark Purple**: `#4a4582` - Used for active states and emphasis

## 🔧 Usage in Code

### Option 1: Tailwind CSS Classes (Recommended)

```jsx
// Text color
<h1 className="text-simplysent-purple">SimplySent</h1>

// Background color
<button className="bg-simplysent-purple text-white">Click Me</button>

// Border color
<div className="border-2 border-simplysent-purple">Content</div>

// With opacity
<div className="bg-simplysent-purple/20">Subtle background</div>

// Hover states
<button className="bg-simplysent-purple hover:bg-simplysent-purple-light">
  Hover Me
</button>

// Gradients
<div className="bg-gradient-to-r from-simplysent-purple to-pink-600">
  Gradient Background
</div>
```

### Option 2: Import from colors.ts

```typescript
import { colors } from '@/theme/colors';

// In inline styles
<div style={{ backgroundColor: colors.simplysent.purple }}>
  Content
</div>

// In CSS-in-JS
const styles = {
  primary: {
    color: colors.simplysent.purple,
  },
};
```

## 🎯 Common Use Cases

### Buttons
```jsx
// Primary button
<button className="bg-simplysent-purple text-white px-6 py-3 rounded-xl">
  Primary Action
</button>

// Secondary button with outline
<button className="border-2 border-simplysent-purple text-simplysent-purple">
  Secondary Action
</button>
```

### Badges
```jsx
// Solid badge
<span className="bg-simplysent-purple text-white px-3 py-1 rounded-full">
  Featured
</span>

// Subtle badge
<span className="bg-simplysent-purple/20 text-simplysent-purple px-3 py-1 rounded-full">
  New
</span>
```

### Cards & Sections
```jsx
// Card with border
<div className="bg-white border-2 border-simplysent-purple/30 rounded-2xl p-6">
  Card Content
</div>

// Gradient background section
<div className="bg-gradient-to-br from-simplysent-purple/10 to-pink-50 p-6">
  Section Content
</div>
```

### Icons & Indicators
```jsx
import { Award } from 'lucide-react';

// Colored icon
<Award className="text-simplysent-purple" size={24} />

// Icon with background
<div className="bg-simplysent-purple/20 rounded-full p-2">
  <Award className="text-simplysent-purple" size={16} />
</div>
```

## 🔄 Updating the Theme

### Adding New Colors

1. Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      simplysent: {
        purple: "#5f59a6",
        "purple-light": "#7a75ba",
        "purple-dark": "#4a4582",
        // Add new colors here
        "new-color": "#hexcode",
      },
    },
  },
}
```

2. Update `colors.ts` with the new color and documentation

3. Restart your development server for Tailwind to pick up changes

### Changing the Primary Color

If you need to change the primary purple color:

1. Update `#5f59a6` in `tailwind.config.js`
2. Update the hex value in `colors.ts`
3. Update any hard-coded colors in the codebase (search for `#5f59a6`)
4. Restart dev server

## 📋 Color Accessibility

The SimplySent purple (`#5f59a6`) has been tested for accessibility:

- **On white backgrounds**: Meets WCAG AA standards for normal text
- **For buttons**: Use white text for maximum contrast
- **For borders**: Can be used at various opacities (20%, 30%, etc.)

## 🌈 Color Palette Reference

```
Primary Purple:  #5f59a6  ████████
Light Purple:    #7a75ba  ████████
Dark Purple:     #4a4582  ████████

Pink Accent:     #ec4899  ████████
Green Success:   #10b981  ████████
Yellow (Amazon): #FFA500  ████████
```

## 🔗 Related Files

- **`tailwind.config.js`** - Tailwind theme configuration
- **`src/pages/ProductPage.tsx`** - Example usage of brand colors
- **`src/pages/PersonPage.tsx`** - Original source of brand color

## 📝 Best Practices

1. **Always use Tailwind classes** when possible instead of inline styles
2. **Use opacity modifiers** (`/20`, `/30`, etc.) for subtle backgrounds
3. **Maintain contrast** - ensure text is readable on colored backgrounds
4. **Be consistent** - use the same color approach across similar components
5. **Test on mobile** - colors should look good on all screen sizes

## 🚀 Quick Reference

| Element | Class |
|---------|-------|
| Primary text | `text-simplysent-purple` |
| Primary button | `bg-simplysent-purple text-white` |
| Badge | `bg-simplysent-purple/20 text-simplysent-purple` |
| Border | `border-2 border-simplysent-purple/30` |
| Hover state | `hover:bg-simplysent-purple-light` |
| Gradient | `from-simplysent-purple to-pink-600` |

---

**Note**: After modifying any theme files, remember to restart your development server to ensure Tailwind picks up the changes.