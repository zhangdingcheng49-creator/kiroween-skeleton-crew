/**
 * Skeleton Crew Application JavaScript
 * 
 * Features:
 * 1. Theme manager with localStorage persistence
 * 2. Mock authentication with localStorage storage
 * 3. Data layer with CRUD operations
 * 4. Event handling for existing UI elements
 */

// ============================================================================
// Theme Manager
// ============================================================================

class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle?.querySelector('.theme-icon i');
        this.body = document.body;
        this.init();
    }

    init() {
        // Load saved theme preference or default to light
        const savedTheme = localStorage.getItem('skeleton-theme');
        if (savedTheme === 'dark') {
            this.body.classList.replace('theme-light', 'theme-dark');
        }
        
        this.updateIcon();
        this.bindEvents();
    }

    bindEvents() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        const isDark = this.body.classList.contains('theme-dark');
        
        if (isDark) {
            this.body.classList.replace('theme-dark', 'theme-light');
            localStorage.setItem('skeleton-theme', 'light');
        } else {
            this.body.classList.replace('theme-light', 'theme-dark');
            localStorage.setItem('skeleton-theme', 'dark');
        }
        
        this.updateIcon();
    }

    updateIcon() {
        if (!this.themeIcon) return;
        
        const isDark = this.body.classList.contains('theme-dark');
        if (isDark) {
            this.themeIcon.classList.remove('fa-moon');
            this.themeIcon.classList.add('fa-sun');
            this.themeToggle?.setAttribute('aria-label', 'Switch to light theme');
        } else {
            this.themeIcon.classList.remove('fa-sun');
            this.themeIcon.classList.add('fa-moon');
            this.themeToggle?.setAttribute('aria-label', 'Switch to dark theme');
        }
    }
}

// ============================================================================
// Mock Authentication
// ============================================================================

class MockAuth {
    constructor() {
        this.signinBtn = document.getElementById('signinBtn');
        this.user = null;
        this.init();
    }

    init() {
        // Load user from localStorage
        const savedUser = localStorage.getItem('skeleton-user');
        if (savedUser) {
            try {
                this.user = JSON.parse(savedUser);
                this.updateUI();
            } catch (e) {
                console.error('Failed to parse saved user:', e);
                localStorage.removeItem('skeleton-user');
            }
        }
        
        this.bindEvents();
    }

    bindEvents() {
        if (this.signinBtn) {
            this.signinBtn.addEventListener('click', () => {
                if (this.user) {
                    this.signOut();
                } else {
                    this.signIn();
                }
            });
        }
    }

    signIn() {
        const displayName = prompt('Enter your display name (for demo purposes):');
        if (!displayName?.trim()) {
            alert('Display name is required');
            return;
        }
        
        this.user = {
            id: Date.now().toString(),
            displayName: displayName.trim(),
            signedInAt: new Date().toISOString()
        };
        
        localStorage.setItem('skeleton-user', JSON.stringify(this.user));
        this.updateUI();
        
        console.log('User signed in:', this.user);
    }

    signOut() {
        if (confirm(`Sign out as ${this.user.displayName}?`)) {
            this.user = null;
            localStorage.removeItem('skeleton-user');
            this.updateUI();
            console.log('User signed out');
        }
    }

    updateUI() {
        if (!this.signinBtn) return;
        
        const icon = this.signinBtn.querySelector('i');
        const textSpan = this.signinBtn.querySelector('span');
        
        if (this.user) {
            // User is signed in - show name and sign out option
            if (icon) {
                icon.className = 'fas fa-user-check';
            }
            if (textSpan) {
                textSpan.textContent = this.user.displayName;
            }
            this.signinBtn.title = 'Click to sign out';
        } else {
            // User is not signed in
            if (icon) {
                icon.className = 'fas fa-user';
            }
            if (textSpan) {
                textSpan.textContent = 'Sign In';
            }
            this.signinBtn.title = 'Click to sign in';
        }
    }
    
    getUser() {
        return this.user;
    }
    
    isAuthenticated() {
        return !!this.user;
    }
}

// ============================================================================
// Data Layer
// ============================================================================

class DataLayer {
    constructor(prefix = 'skeleton') {
        this.prefix = prefix;
    }

    /**
     * Get all items from a collection
     * @param {string} collectionName - Name of the collection
     * @returns {Array} Array of items
     */
    getAll(collectionName) {
        const key = `${this.prefix}-${collectionName}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    /**
     * Get a single item by ID
     * @param {string} collectionName - Name of the collection
     * @param {string|number} id - Item ID
     * @returns {Object|null} The item or null if not found
     */
    get(collectionName, id) {
        const items = this.getAll(collectionName);
        return items.find(item => item.id === id) || null;
    }

    /**
     * Set/replace entire collection
     * @param {string} collectionName - Name of the collection
     * @param {Array} items - Array of items
     */
    set(collectionName, items) {
        const key = `${this.prefix}-${collectionName}`;
        localStorage.setItem(key, JSON.stringify(items));
        return items;
    }

    /**
     * Add a new item to collection
     * @param {string} collectionName - Name of the collection
     * @param {Object} item - Item to add (will be assigned an ID if not provided)
     * @returns {Object} The added item with ID
     */
    add(collectionName, item) {
        const items = this.getAll(collectionName);
        
        // Ensure item has an ID
        if (!item.id) {
            item.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        }
        
        // Ensure createdAt timestamp
        if (!item.createdAt) {
            item.createdAt = new Date().toISOString();
        }
        
        items.push(item);
        this.set(collectionName, items);
        return item;
    }

    /**
     * Update an existing item
     * @param {string} collectionName - Name of the collection
     * @param {string|number} id - Item ID
     * @param {Object} updates - Updates to apply
     * @returns {Object|null} Updated item or null if not found
     */
    update(collectionName, id, updates) {
        const items = this.getAll(collectionName);
        const index = items.findIndex(item => item.id === id);
        
        if (index === -1) return null;
        
        // Preserve ID and createdAt, update other properties
        const updatedItem = {
            ...items[index],
            ...updates,
            id: items[index].id, // Ensure ID doesn't change
            updatedAt: new Date().toISOString()
        };
        
        items[index] = updatedItem;
        this.set(collectionName, items);
        return updatedItem;
    }

    /**
     * Remove an item from collection
     * @param {string} collectionName - Name of the collection
     * @param {string|number} id - Item ID
     * @returns {boolean} True if item was removed, false if not found
     */
    remove(collectionName, id) {
        const items = this.getAll(collectionName);
        const filteredItems = items.filter(item => item.id !== id);
        
        if (filteredItems.length === items.length) {
            return false; // Item not found
        }
        
        this.set(collectionName, filteredItems);
        return true;
    }

    /**
     * Clear entire collection
     * @param {string} collectionName - Name of the collection
     */
    clear(collectionName) {
        const key = `${this.prefix}-${collectionName}`;
        localStorage.removeItem(key);
    }

    /**
     * Get collection statistics
     * @param {string} collectionName - Name of the collection
     * @returns {Object} Statistics object
     */
    getStats(collectionName) {
        const items = this.getAll(collectionName);
        return {
            count: items.length,
            lastUpdated: items.length > 0 
                ? new Date(Math.max(...items.map(item => new Date(item.updatedAt || item.createdAt))))
                : null
        };
    }

    /**
     * Export collection as JSON string
     * @param {string} collectionName - Name of the collection
     * @returns {string} JSON string
     */
    export(collectionName) {
        const items = this.getAll(collectionName);
        return JSON.stringify(items, null, 2);
    }

    /**
     * Import data into collection (replaces existing)
     * @param {string} collectionName - Name of the collection
     * @param {string} jsonData - JSON string to import
     * @returns {Array} Imported items
     */
    import(collectionName, jsonData) {
        try {
            const items = JSON.parse(jsonData);
            // Validate it's an array
            if (!Array.isArray(items)) {
                throw new Error('Imported data must be an array');
            }
            this.set(collectionName, items);
            return items;
        } catch (error) {
            console.error('Failed to import data:', error);
            throw error;
        }
    }
}

// ============================================================================
// Mobile Navigation
// ============================================================================

class MobileNavigation {
    constructor() {
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.mobileNav = document.getElementById('mobileNav');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (this.mobileNav?.classList.contains('active') && 
                !this.mobileNav.contains(event.target) && 
                !this.mobileMenuToggle?.contains(event.target)) {
                this.closeMenu();
            }
        });
        
        // Close menu when pressing Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.mobileNav?.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (!this.mobileNav) return;
        
        if (this.mobileNav.classList.contains('active')) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.mobileNav.classList.add('active');
        this.mobileMenuToggle?.setAttribute('aria-expanded', 'true');
        this.mobileMenuToggle?.querySelector('i')?.classList.replace('fa-bars', 'fa-times');
    }

    closeMenu() {
        this.mobileNav.classList.remove('active');
        this.mobileMenuToggle?.setAttribute('aria-expanded', 'false');
        this.mobileMenuToggle?.querySelector('i')?.classList.replace('fa-times', 'fa-bars');
    }
}

// ============================================================================
// Application Initialization
// ============================================================================

class SkeletonApp {
    constructor() {
        this.themeManager = null;
        this.auth = null;
        this.data = null;
        this.mobileNav = null;
        this.init();
    }

    init() {
        // Initialize all components
        this.themeManager = new ThemeManager();
        this.auth = new MockAuth();
        this.data = new DataLayer();
        this.mobileNav = new MobileNavigation();
        
        // Setup demo data if collections are empty
        this.setupDemoData();
        
        // Log initialization
        console.log('Skeleton Crew app initialized');
        console.log('Available methods:', {
            theme: this.themeManager,
            auth: this.auth,
            data: this.data,
            mobileNav: this.mobileNav
        });
        
        // Expose data layer globally for debugging (optional)
        window.skeletonData = this.data;
    }

    setupDemoData() {
        // Setup demo habits if empty
        const habits = this.data.getAll('habits');
        if (habits.length === 0) {
            const demoHabits = [
                {
                    id: 'habit-1',
                    name: 'Drink Water',
                    description: 'Drink 8 glasses of water daily',
                    frequency: 'daily',
                    streak: 5,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'habit-2',
                    name: 'Exercise',
                    description: '30 minutes of exercise',
                    frequency: 'daily',
                    streak: 3,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'habit-3',
                    name: 'Read',
                    description: 'Read 20 pages',
                    frequency: 'daily',
                    streak: 7,
                    createdAt: new Date().toISOString()
                }
            ];
            
            demoHabits.forEach(habit => this.data.add('habits', habit));
            console.log('Demo habits created');
        }
        
        // Setup demo inventory if empty
        const inventory = this.data.getAll('inventory');
        if (inventory.length === 0) {
            const demoInventory = [
                {
                    id: 'item-1',
                    name: 'Laptop',
                    category: 'Electronics',
                    quantity: 2,
                    status: 'in-stock',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'item-2',
                    name: 'Notebook',
                    category: 'Stationery',
                    quantity: 10,
                    status: 'in-stock',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'item-3',
                    name: 'Coffee Mug',
                    category: 'Kitchen',
                    quantity: 5,
                    status: 'low-stock',
                    createdAt: new Date().toISOString()
                }
            ];
            
            demoInventory.forEach(item => this.data.add('inventory', item));
            console.log('Demo inventory created');
        }
    }
}

// ============================================================================
// Initialize the application when DOM is ready
// ============================================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.skeletonApp = new SkeletonApp();
    });
} else {
    window.skeletonApp = new SkeletonApp();
}

// ============================================================================
// Public API (optional, for external use)
// ============================================================================

window.SkeletonCrew = {
    // Theme methods
    toggleTheme: () => window.skeletonApp?.themeManager?.toggleTheme(),
    getCurrentTheme: () => {
        const body = document.body;
        return body.classList.contains('theme-dark') ? 'dark' : 'light';
    },
    
    // Auth methods
    signIn: () => window.skeletonApp?.auth?.signIn(),
    signOut: () => window.skeletonApp?.auth?.signOut(),
    getUser: () => window.skeletonApp?.auth?.getUser(),
    isAuthenticated: () => window.skeletonApp?.auth?.isAuthenticated(),
    
    // Data layer methods
    getDataLayer: () => window.skeletonApp?.data,
    
    // Helper to check localStorage usage
    getStorageInfo: () => {
        const info = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('skeleton-')) {
                try {
                    const value = localStorage.getItem(key);
                    const parsed = JSON.parse(value);
                    info[key] = {
                        type: Array.isArray(parsed) ? 'array' : typeof parsed,
                        count: Array.isArray(parsed) ? parsed.length : 1,
                        size: new Blob([value]).size
                    };
                } catch {
                    info[key] = { type: 'string', size: new Blob([value]).size };
                }
            }
        }
        return info;
    },
    
    // Clear all skeleton data (for debugging/reset)
    clearAllData: () => {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('skeleton-')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        location.reload();
    }
};