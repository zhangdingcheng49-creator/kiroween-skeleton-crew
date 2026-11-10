# Skeleton Crew

A collection of vanilla HTML, CSS & JavaScript applications built on a shared skeleton framework. Created for the Kiroween 2026 Hackathon, Skeleton Crew category.

## 🎯 Project Overview

**Skeleton Crew** demonstrates how to build reusable, maintainable web applications without external frameworks. It features a core skeleton framework that provides shared components, styling, and functionality, with multiple example applications built on top of it.

### Built with Kiro

This project was created using [Kiro](https://kiro.dev), an AI-powered development environment built on VS Code. Kiro helped accelerate development by providing intelligent code suggestions, automated refactoring, and seamless collaboration with AI.

## 📁 Project Structure

```
kiroween-skeleton-crew/
├── index.html              # Landing page (you are here)
├── README.md               # Project documentation (this file)
├── LICENSE                 # MIT License
│
├── skeleton/               # Core framework
│   ├── index.html         # Framework demo page
│   ├── styles.css         # Shared CSS with theme system
│   ├── app.js             # Shared JavaScript utilities
│   └── test.html          # Framework test page
│
├── app-habit-tracker/      # Example application 1
│   ├── index.html         # Habit tracker app
│   ├── habits.js          # Habit-specific functionality
│   ├── README.md          # App documentation
│   └── test.html          # App test page
│
└── app-inventory/         # Example application 2
    ├── index.html         # Inventory management app
    ├── inventory.js       # Inventory-specific functionality
    ├── README.md          # App documentation
    └── test.html          # App test page
```

## 🚀 How the Skeleton Works

The **skeleton** folder contains the reusable foundation that all applications inherit:

### Shared Components
- **Responsive Header**: Navigation with logo, menu, and user actions
- **Mobile Navigation**: Hamburger menu for small screens
- **Footer**: Consistent footer across all pages
- **Hero Sections**: Standardized hero layouts
- **Feature Cards**: Reusable card components
- **Call-to-Action Sections**: Standard CTA layouts

### Theme System
- **Light/Dark Themes**: CSS custom properties for both themes
- **Theme Persistence**: User preference saved in localStorage
- **Theme Toggle**: One-click switching between themes
- **Consistent Colors**: CSS variables for all colors, spacing, and typography

### Core Functionality
- **Mock Authentication**: Simulated login/logout system
- **Data Layer**: Abstract localStorage CRUD operations
- **Responsive Design**: Mobile-first, works on all screen sizes
- **Accessibility**: WCAG 2.1 AA compliant
- **Print Styles**: Optimized for printing

## 🛠️ Example Applications

### 1. Habit Tracker
A daily habit tracking application that helps users build and maintain routines.

**Features:**
- Add/remove habits
- Daily completion tracking
- Streak calculation
- Data export to JSON
- Mark all habits for today

**Built on skeleton by:**
- Adding habit-specific styles in `<style>` tag
- Extending the data layer for habit storage
- Implementing habit-specific JavaScript logic
- Customizing navigation for the app

### 2. Shop Inventory
An inventory management system for tracking products and stock levels.

**Features:**
- Add/remove products
- Track stock quantities
- Set low stock alerts
- Price management
- Product categorization

**Built on skeleton by:**
- Adding inventory-specific styles
- Extending the data layer for product storage
- Implementing inventory-specific JavaScript logic
- Customizing the UI for inventory management

## 🏃 How to Run Locally

Since this is a vanilla web project with no build step, you can run it directly in any modern browser:

### Quick Start
1. **Clone or download** the project files
2. **Open** `index.html` in your browser
3. **Navigate** between applications using the top navigation

### Development
1. Open the project in your favorite code editor
2. Make changes to any HTML, CSS, or JavaScript file
3. Refresh the browser to see changes

### Testing
Each folder contains a `test.html` file with:
- Component demonstrations
- Style guides
- Interactive examples
- Documentation for the specific app/framework

## 🔧 How to Create Your Own App

To build a new application using the skeleton:

1. **Duplicate the skeleton folder**
   ```bash
   cp -r skeleton/ my-new-app/
   ```

2. **Update the HTML**
   - Modify `index.html` with your app's content
   - Update navigation links
   - Add any app-specific styles in a `<style>` tag

3. **Add custom JavaScript**
   - Create a new JavaScript file (e.g., `my-app.js`)
   - Import it after the skeleton's `app.js`
   - Extend the data layer for your app's data structure

4. **Test and refine**
   - Open your app in the browser
   - Use the test page to verify components
   - Add features incrementally

## 🎨 Design Philosophy

### Why Vanilla?
- **No Dependencies**: No npm, no build tools, no frameworks
- **Fast Loading**: Minimal JavaScript, optimized CSS
- **Easy to Understand**: No abstraction layers hiding how things work
- **Portable**: Works anywhere HTML/CSS/JS works
- **Educational**: Great for learning web fundamentals

### Architecture Principles
1. **Separation of Concerns**: HTML (structure), CSS (presentation), JS (behavior)
2. **Progressive Enhancement**: Works without JavaScript, enhanced with it
3. **Mobile First**: Responsive from smallest to largest screens
4. **Accessibility First**: Semantic HTML, ARIA labels, keyboard navigation
5. **Performance First**: Minimal assets, efficient code, lazy loading where possible

## 📚 What's Included

### In the Skeleton
- Modern CSS with custom properties (CSS variables)
- Responsive grid and flexbox layouts
- Interactive components (buttons, forms, cards)
- JavaScript utilities (theme manager, data layer, auth simulation)
- Cross-browser compatibility
- Accessibility features

### In Each App
- App-specific business logic
- Custom data models and storage
- Specialized UI components
- App-specific user flows
- Documentation and examples

## 🏆 Kiroween 2026 Hackathon

This project was created for **Kiroween 2026**, a hackathon focused on building with [Kiro](https://kiro.dev).

**Category**: Skeleton Crew  
**Goal**: Demonstrate how to create reusable application skeletons

### How Kiro Helped
- **Rapid Prototyping**: Generated initial skeleton structure
- **Code Refactoring**: Extracted shared components and styles
- **Documentation**: Assisted with comprehensive READMEs
- **Testing**: Helped create test pages for each component
- **Debugging**: Identified and fixed cross-browser issues

### Hackathon Features
- Multiple applications sharing a single codebase
- No external dependencies or build tools
- Production-ready with proper error handling
- Comprehensive documentation
- Demo-ready with polished UI

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright © 2026 Dingcheng Zhang

## 🙏 Acknowledgments

- Built for the Kiroween 2026 Hackathon
- Created with [Kiro](https://kiro.dev), the AI-powered development environment
- Inspired by modern web development best practices
- Thanks to the open source community for endless learning resources

## 🔗 Quick Links

- [Landing Page](index.html)
- [Skeleton Framework](skeleton/index.html)
- [Habit Tracker App](app-habit-tracker/index.html)
- [Shop Inventory App](app-inventory/index.html)
- [Project License](LICENSE)