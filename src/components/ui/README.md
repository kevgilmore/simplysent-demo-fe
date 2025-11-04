# UI Components Library

A comprehensive collection of reusable UI components built with React, TypeScript, and Tailwind CSS.

## Design System

### Colors
- **Primary**: `#5E57AC` - Used for main actions, highlights, and interactive elements
- **Dark**: `#1F2937` (gray-800) - Text and dark elements
- **Light**: `#E5E7EB` (gray-200) - Backgrounds and borders
- **White**: `#FFFFFF` - Cards and containers

### Typography
- **Headings**: Baloo 2 (Semi-bold) - For all heading elements
- **Body Text**: Comfortaa (Medium) - For paragraphs and general text
- **Buttons**: Outfit (Semi-bold) - For button labels and CTAs

### Design Principles
- **Rounded Corners**: All components use rounded corners (rounded-full for buttons, rounded-3xl for cards)
- **Generous Padding**: Modern spacing with plenty of breathing room
- **Mobile-First**: All components are fully responsive and mobile-friendly
- **Smooth Transitions**: 200ms duration for all hover and active states

## Components

### Heading

Semantic heading component with multiple levels and responsive sizing.

```tsx
import { Heading } from './components/ui/Heading';

<Heading level={1}>Main Title</Heading>
<Heading level={2}>Subtitle</Heading>
<Heading level={3} className="text-center">Custom Heading</Heading>
```

**Props:**
- `level`: 1-6 (default: 1) - Heading level
- `children`: React.ReactNode - Content to display
- `className`: string (optional) - Additional CSS classes

---

### ProductCard

Interactive product card with favorite and rating functionality.

```tsx
import { ProductCard } from './components/ui/ProductCard';

<ProductCard
  image="https://example.com/image.jpg"
  name="Product Name"
  price={99.99}
/>
```

**Props:**
- `image`: string - Product image URL
- `name`: string - Product name (truncated to 15 characters)
- `price`: number - Product price
- `className`: string (optional) - Additional CSS classes

**Features:**
- Heart icon for favorites (top right)
- Thumbs up/down buttons for feedback
- Automatic name truncation with ellipsis
- Hover effects and smooth transitions

---

### TextInput

Modern text input with label, error states, and various types.

```tsx
import { TextInput } from './components/ui/TextInput';

const [value, setValue] = useState('');

<TextInput
  label="Email Address"
  placeholder="Enter your email"
  value={value}
  onChange={setValue}
  type="email"
  error="Invalid email format"
/>
```

**Props:**
- `value`: string - Current input value
- `onChange`: (value: string) => void - Change handler
- `label`: string (optional) - Input label
- `placeholder`: string (optional) - Placeholder text
- `type`: 'text' | 'email' | 'password' | 'number' (default: 'text')
- `error`: string (optional) - Error message to display
- `disabled`: boolean (default: false)
- `className`: string (optional) - Additional CSS classes

---

### Dropdown

Custom dropdown with smooth animations and keyboard navigation.

```tsx
import { Dropdown } from './components/ui/Dropdown';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
];

<Dropdown
  label="Select Category"
  placeholder="Choose an option"
  value={selectedValue}
  options={options}
  onChange={setSelectedValue}
/>
```

**Props:**
- `value`: string - Selected value
- `options`: Array<{ value: string; label: string }> - Dropdown options
- `onChange`: (value: string) => void - Change handler
- `label`: string (optional) - Dropdown label
- `placeholder`: string (optional) - Placeholder text
- `error`: string (optional) - Error message
- `disabled`: boolean (default: false)
- `className`: string (optional) - Additional CSS classes

**Features:**
- Click outside to close
- Highlighted selected option
- Smooth dropdown animation
- Scrollable options list

---

### RangeSlider

Dual-handle range slider for selecting minimum and maximum values.

```tsx
import { RangeSlider } from './components/ui/RangeSlider';

<RangeSlider
  min={10}
  max={500}
  minValue={50}
  maxValue={300}
  onChange={(min, max) => {
    console.log('Range:', min, max);
  }}
  label="Budget Range"
/>
```

**Props:**
- `min`: number - Minimum possible value
- `max`: number - Maximum possible value
- `minValue`: number - Current minimum value
- `maxValue`: number - Current maximum value
- `onChange`: (min: number, max: number) => void - Change handler
- `label`: string (optional) - Slider label
- `className`: string (optional) - Additional CSS classes

**Features:**
- Two draggable handles
- Touch and mouse support
- Real-time value display
- Prevents handle collision
- Smooth dragging experience

---

### Button

Versatile button component with multiple variants and sizes.

```tsx
import { Button } from './components/ui/Button';

<Button variant="primary" size="medium">
  Click Me
</Button>

<Button variant="outline" size="large" fullWidth>
  Full Width Button
</Button>
```

**Props:**
- `children`: React.ReactNode - Button content
- `onClick`: () => void (optional) - Click handler
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' (default: 'primary')
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- `disabled`: boolean (default: false)
- `fullWidth`: boolean (default: false)
- `type`: 'button' | 'submit' | 'reset' (default: 'button')
- `className`: string (optional) - Additional CSS classes

**Variants:**
- **Primary**: Purple background with white text
- **Secondary**: Gray background
- **Outline**: Transparent with border
- **Ghost**: Transparent with subtle hover

---

### TabMenu

Simple tab navigation with underline indicator.

```tsx
import { TabMenu } from './components/ui/TabMenu';

const tabs = [
  { id: 'tab1', label: 'Tab 1' },
  { id: 'tab2', label: 'Tab 2' },
  { id: 'tab3', label: 'Tab 3' },
];

<TabMenu
  tabs={tabs}
  activeTab={activeTabId}
  onTabChange={setActiveTabId}
/>
```

**Props:**
- `tabs`: Array<{ id: string; label: string }> - Tab items
- `activeTab`: string - Currently active tab ID
- `onTabChange`: (tabId: string) => void - Tab change handler
- `className`: string (optional) - Additional CSS classes

**Features:**
- Smooth underline animation
- Horizontal scrolling on mobile
- Clean, minimalist design
- No borders, just underline indicator

---

## Usage

To use these components in your project, simply import them from the ui directory:

```tsx
import { Button, TextInput, Heading } from './components/ui';
```

Or import individually:

```tsx
import { Button } from './components/ui/Button';
import { TextInput } from './components/ui/TextInput';
```

## Viewing the Components

Visit `/components` in your application to see a live showcase of all components with interactive examples.

## Customization

All components accept a `className` prop for additional styling. They're built with Tailwind CSS, so you can easily extend or override styles:

```tsx
<Button className="shadow-2xl">
  Custom Styled Button
</Button>
```

## Browser Support

These components are tested and work on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

All components follow WCAG 2.1 guidelines:
- Proper ARIA labels
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- Semantic HTML