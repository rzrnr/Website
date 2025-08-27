# Gugli Studios Website - Copilot Instructions

## Architecture Overview

This is a **modular Browser Company-inspired portfolio website** with a sophisticated intro animation system and theme management. The architecture prioritizes visual elegance, smooth animations, and component reusability.

### Core Structure
- **`index-modular.html`** - Main page with integrated header navigation (no separate header file)
- **`index.html`** - Original backup (preserve for fallback)
- **`assets/css/main.css`** - Monolithic stylesheet with all visual components
- **`assets/js/main.js`** - Monolithic JavaScript with all functionality
- **`assets/js/design-system.js`** - Reusable components for new pages
- **`pages/`** - Simple template pages using the design system

## Critical Animation System

### Intro Animation Sequence
The intro animation (`IntroAnimationManager`) is the **most critical component**:
```javascript
// Never modify the timing without understanding the full sequence
setTimeout(() => {
    this.startLogoAnimation();
}, 800); // Precise timing for smooth transition
```

**Key principles:**
- Uses `sessionStorage.getItem('introPlayed')` to skip repeat animations
- Logo transitions from center screen to final position in header using `calculateFinalPosition()`
- Double-calculates position to ensure layout stability (at 100ms and 300ms)
- Includes window resize listener to maintain responsive positioning
- Any changes to header layout WILL break the intro animation
- Console logs final position for debugging: `Logo position: X%, Y%`

### Theme System Architecture
Themes use CSS custom properties with `data-theme` attribute:
```css
[data-theme="dark"] {
    --bg-primary: #0d0d0d;
    --text-primary: #f5f5f5;
}
```
- Theme state persisted in `localStorage`
- Toggle handled by `ThemeManager` class
- SVG icons change automatically via CSS

## Component Development Patterns

### Adding New Pages
1. Create directory under `pages/` 
2. Use this exact template structure:
```html
<link rel="stylesheet" href="../../assets/css/main.css">
<script src="../../assets/js/main.js"></script>
```
3. **Always** use relative paths: `../../` from `pages/subdirectory/`
4. Include theme toggle and logo from `design-system.js`

### Navigation Integration
- Main page navigation is **embedded in hero section**, not separate component
- Project cards and footer links connect to pages via href changes:
```html
<a href="pages/portfolio/" class="project-card">
<a href="pages/about/" class="footer-link">ÜBER UNS</a>
```

## Performance & Animation Patterns

### Mouse Effects System
```javascript
class MouseTrailManager {
    // Uses requestAnimationFrame for 60fps performance
    // Automatic cleanup on page unload
}
```

### CSS Animation Strategy
- Uses `will-change`, `backface-visibility: hidden` for GPU acceleration
- Intersection Observer for scroll-triggered animations
- Performance optimized with `contain: layout style`

## File Management Rules

### Monolithic Approach
- **DO NOT** split `main.css` - keep all styles in one file
- **DO NOT** split `main.js` - modular version (`app.js`) caused intro animation failures
- The working pattern is proven: one CSS file, one JS file

### Design System Usage
For new pages, use `design-system.js` components:
```javascript
// Theme management
GuglıStudiosDesignSystem.utils.initTheme();

// Pre-built components
GuglıStudiosDesignSystem.components.themeToggle
GuglıStudiosDesignSystem.components.logoAnimation
```

## Integration Points

### External Dependencies
- Google Fonts (preconnected for performance)
- No JavaScript frameworks - pure vanilla ES6+
- CSS custom properties for theming (IE11+ support)

### Browser Support Strategy
- Progressive enhancement from modern baseline
- CSS Grid with fallbacks
- `prefers-color-scheme` detection for initial theme

## Debugging Workflows

### Animation Issues
1. Check browser DevTools > Performance tab for intro animation timing
2. Verify `sessionStorage.getItem('introPlayed')` for state management
3. Logo positioning calculated via `getBoundingClientRect()` - viewport dependent

### Theme Issues
```javascript
// Debug current theme state
console.log(document.documentElement.getAttribute('data-theme'));
console.log(localStorage.getItem('theme'));
```

### Performance Monitoring
- Mouse trail effects auto-throttle based on device capabilities
- No dedicated PerformanceManager class (removed for simplicity)
- Uses `requestAnimationFrame` for 60fps animations
- CSS containment and GPU acceleration for optimal performance

---

**Golden Rule:** This codebase prioritizes visual impact over code organization. The monolithic files are intentional and proven to work. Modular approaches have caused intro animation failures.
