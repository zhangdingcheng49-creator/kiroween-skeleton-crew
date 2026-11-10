# Skeleton Crew Project - Design

## Architecture Overview

### File Structure
```
skeleton-crew/
├── index.html                  # Main entry point
├── css/
│   ├── base.css               # Core styles and CSS custom properties
│   ├── layout.css             # Layout components (header, footer, containers)
│   ├── components.css         # Reusable UI components
│   ├── themes/
│   │   ├── light.css          # Light theme variables
│   │   └── dark.css           # Dark theme variables
│   └── utilities.css          # Helper classes
├── js/
│   ├── app.js                 # Main application entry point
│   ├── auth.js                # Authentication simulation
│   ├── data.js                # localStorage data layer
│   ├── theme.js               # Theme management
│   ├── ui.js                  # UI utilities and component rendering
│   └── utils.js               # General utilities
├── examples/
│   ├── habit-tracker/
│   │   ├── index.html
│   │   ├── css/
│   │   │   └── habits.css
│   │   ├── js/
│   │   │   └── habits.js
│   │   └── data/
│   │       └── sample-habits.json
│   └── shop-inventory/
│       ├── index.html
│       ├── css/
│       │   └── inventory.css
│       ├── js/
│       │   └── inventory.js
│       └── data/
│           └── sample-products.json
└── README.md
```

## Component Design

### 1. Layout Components

#### Header Component
**HTML Structure:**
```html
<header class="app-header">
  <div class="header-container">
    <div class="logo">
      <h1><a href="/">App Name</a></h1>
    </div>
    <nav class="main-nav">
      <ul class="nav-links">
        <!-- Dynamic navigation links -->
      </ul>
    </nav>
    <div class="user-actions">
      <button class="theme-toggle" aria-label="Toggle theme">
        <span class="theme-icon">🌙</span>
      </button>
      <div class="user-status">
        <!-- Login form or user info -->
      </div>
    </div>
  </div>
</header>
```

**Features:**
- Fixed or sticky positioning
- Responsive navigation (hamburger menu on mobile)
- Integrated theme toggle
- User status display

#### Footer Component
```html
<footer class="app-footer">
  <div class="footer-container">
    <p class="copyright">&copy; 2025 App Name. All rights reserved.</p>
    <nav class="footer-nav">
      <a href="#privacy">Privacy</a>
      <a href="#terms">Terms</a>
      <a href="#contact">Contact</a>
    </nav>
  </div>
</footer>
```

### 2. Theme System Design

#### CSS Custom Properties Structure
```css
:root {
  /* Color palette - light theme default */
  --color-primary: #2563eb;
  --color-secondary: #7c3aed;
  --color-success: #059669;
  --color-warning: #d97706;
  --color-danger: #dc2626;
  
  /* Background colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-surface: #ffffff;
  
  /* Text colors */
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  
  /* Border colors */
  --border-color: #e2e8f0;
  
  /* Spacing */
  --spacing-unit: 0.25rem;
  
  /* Typography */
  --font-family: system-ui, -apple-system, sans-serif;
  --font-size-base: 16px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-speed: 150ms;
}
```

#### Theme Switching Mechanism
- CSS classes: `.theme-light` and `.theme-dark` on body element
- JavaScript toggles class and saves preference to localStorage
- Smooth transitions for color changes

### 3. Authentication Simulation Design

#### Data Structure
```javascript
// User data stored in localStorage
const userData = {
  currentUser: {
    id: 'user-123',
    username: 'demo',
    email: 'demo@example.com',
    preferences: {
      theme: 'light',
      // other preferences
    }
  },
  // Optional: store multiple users for demo
  users: [
    {
      id: 'user-123',
      username: 'demo',
      password: 'demo123', // In real app, this would be hashed
      email: 'demo@example.com'
    }
  ]
};
```

#### Authentication Flow
1. Check localStorage for existing session
2. Show login form if no session
3. Validate credentials against stored users
4. Set session and update UI
5. Handle logout by clearing session

### 4. Data Layer Design

#### Storage API
```javascript
class DataStore {
  constructor(namespace) {
    this.namespace = namespace;
  }
  
  // CRUD operations
  create(key, data) { /* ... */ }
  read(key) { /* ... */ }
  update(key, data) { /* ... */ }
  delete(key) { /* ... */ }
  
  // Batch operations
  getAll() { /* ... */ }
  clear() { /* ... */ }
  
  // Export/Import
  exportData() { /* ... */ }
  importData(data) { /* ... */ }
}
```

#### Data Models
- Type definitions for different data structures
- Validation functions
- Default values and schemas

### 5. Example App Designs

#### Habit Tracker Data Model
```javascript
const habitModel = {
  id: 'string',
  title: 'string',
  description: 'string',
  category: 'health|work|personal|other',
  frequency: 'daily|weekly|custom',
  targetCount: 'number', // times per period
  completedDates: 'array', // dates when completed
  streak: 'number',
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
};
```

#### Inventory App Data Model
```javascript
const productModel = {
  id: 'string',
  name: 'string',
  description: 'string',
  category: 'string',
  price: 'number',
  quantity: 'number',
  lowStockThreshold: 'number',
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
};
```

## UI/UX Design Principles

### 1. Responsive Grid System
- Mobile-first approach
- Flexible grid using CSS Grid and Flexbox
- Breakpoints: 320px, 768px, 1024px, 1280px

### 2. Component States
- Default, hover, active, focus, disabled
- Consistent feedback for user interactions

### 3. Accessibility Features
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Color contrast compliance

### 4. Interaction Patterns
- Consistent form styling
- Modal/dialog patterns
- Toast notifications for feedback
- Loading states
- Error states

## Performance Considerations

### 1. Asset Loading
- Inline critical CSS
- Defer non-critical JavaScript
- Optimize images (for examples)

### 2. Storage Efficiency
- Minimize localStorage usage
- Clean up old data
- Efficient data serialization

### 3. Rendering Optimization
- Efficient DOM updates
- Debounced input handlers
- Virtual scrolling for large lists (if needed)

## Cross-Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Fallbacks
- CSS Grid fallback to Flexbox
- CSS Custom Properties fallback
- localStorage fallback to sessionStorage or in-memory

## Extension Points

### 1. Adding New Components
- Clear patterns for new UI components
- CSS class naming conventions
- JavaScript component lifecycle

### 2. Customizing Themes
- Add new theme variables
- Create custom themes
- Override default styles

### 3. Integrating Real Backend
- Replace localStorage with API calls
- Add loading states
- Error handling for network requests