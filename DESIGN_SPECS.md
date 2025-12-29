# Design Specifications

## Color Palette

### Primary Colors
- **Background Dark**: `#0A0E27` - Main app background
- **Card Background**: `#1A1F3A` - Elevated components
- **Accent Cyan**: `#00D9FF` - Primary interactive elements
- **Accent Blue**: `#0066FF` - Secondary gradient color

### Status Colors
- **Success Green**: `#00FF00` - Connected WiFi
- **Warning Orange**: `#FFA500` - Medium battery
- **Error Red**: `#FF0000` - Disconnected/Low battery
- **Inactive Gray**: `#808080` - Disabled states

## Typography

### Font Sizes
- **Large Title**: 20px - Speed value display
- **Title**: 16px - Section headers
- **Body**: 14px - Dropdown items, tab labels
- **Caption**: 12px - Bottom nav labels
- **Small**: 10px - Dropdown labels
- **Tiny**: 8px - Battery percentage in icon

### Font Weights
- **Bold**: 700 - Active states, values
- **Normal**: 400 - Default text

## Spacing & Layout

### Padding
- **Screen Padding**: 20px
- **Card Padding**: 16-20px
- **Component Spacing**: 12-32px vertical
- **Status Bar**: 16px horizontal, 16px vertical

### Border Radius
- **Large**: 24px - Bottom navigation
- **Medium**: 16px - Speed slider container
- **Small**: 12px - Dropdowns, eyes selector
- **Tiny**: 10px - Tab items
- **Circle**: 20px - Refresh button

## Component Dimensions

### Status Bar
- Height: Auto (padding-based)
- Logo: 40x40px
- Icons: 20-28px

### Eyes Selector
- Height: 48px (with padding)
- Tab padding: 12px vertical

### Direction Pad
- Outer circle: 280x280px
- Inner gradient: 200x200px
- Center logo: 80x80px
- Direction buttons: 60x60px
- Button icons: 28px

### Speed Slider
- Track height: 6px
- Thumb radius: 12px

### Bottom Navigation
- Height: 70px
- Icon size: 28px
- Border radius: 24px (top only)

## Shadows & Elevation

### Box Shadows
```
Status Bar:
- color: rgba(0, 0, 0, 0.2)
- blur: 10px
- offset: (0, 2px)

Eyes Selector:
- color: rgba(0, 0, 0, 0.3)
- blur: 10px
- offset: (0, 4px)

Active Tab:
- color: rgba(0, 217, 255, 0.5)
- blur: 10px
- offset: (0, 2px)

Direction Pad Center:
- color: rgba(0, 217, 255, 0.3)
- blur: 20px
- spread: 2px

Pressed Button:
- color: rgba(0, 217, 255, 0.6)
- blur: 20px
- spread: 2px

Bottom Nav:
- color: rgba(0, 0, 0, 0.3)
- blur: 20px
- offset: (0, -5px)
```

## Gradients

### Active Tab Gradient
```
Linear Gradient:
- colors: [#00D9FF, #0066FF]
- begin: topLeft
- end: bottomRight
```

### Direction Pad Inner Ring
```
Radial Gradient:
- colors: [
    rgba(0, 102, 255, 0.3),
    rgba(0, 217, 255, 0.1),
    transparent
  ]
```

### Pressed Button Gradient
```
Linear Gradient:
- colors: [#00D9FF, #0066FF]
- begin: topLeft
- end: bottomRight
```

## Borders

### Standard Border
- Width: 1px
- Color: `rgba(0, 217, 255, 0.3)`

### Outer Ring Border
- Width: 2px
- Color: `rgba(0, 217, 255, 0.3)`

## Animations

### Durations
- **Fast**: 100ms - Button press feedback
- **Normal**: 200ms - Tab transitions
- **Slow**: 1000ms - WiFi blink animation

### Curves
- Material Motion Curve (default Flutter easing)

### Animation Types
1. **WiFi Blink**: FadeTransition with repeat
2. **Button Press**: Scale + Shadow + Color transition
3. **Tab Switch**: Background color + text color fade
4. **Slider**: Continuous value update

## States

### Button States
1. **Default**: Dark background, cyan icon
2. **Pressed**: Gradient background, white icon, glow
3. **Disabled**: Gray background, gray icon

### Connection States
1. **Connected**: Green blinking WiFi icon
2. **Disconnected**: Red static WiFi icon

### Battery States
1. **High (>60%)**: Green icon
2. **Medium (30-60%)**: Orange icon
3. **Low (<30%)**: Red icon

## Accessibility

- Minimum touch target: 48x48dp (Flutter standard)
- Color contrast ratio: 4.5:1 minimum
- All interactive elements have visual feedback
- Icons paired with text labels where possible
