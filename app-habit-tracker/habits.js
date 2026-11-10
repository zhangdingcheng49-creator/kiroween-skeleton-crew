/**
 * Habit Tracker Application
 * 
 * Features:
 * 1. Add new habits by name
 * 2. Mark habits as done for today with checkboxes
 * 3. Calculate and display current streak in days
 * 4. Delete habits
 * 5. Mark all habits for today
 * 6. Export habits data
 */

class HabitTracker {
    constructor() {
        this.data = window.skeletonApp?.data || new DataLayer();
        this.habitsContainer = document.getElementById('habitsList');
        this.emptyState = document.getElementById('emptyState');
        this.habitForm = document.getElementById('habitForm');
        this.habitNameInput = document.getElementById('habitName');
        this.markAllTodayBtn = document.getElementById('markAllTodayBtn');
        this.exportDataBtn = document.getElementById('exportDataBtn');
        this.totalHabitsElement = document.getElementById('totalHabits');
        this.totalStreaksElement = document.getElementById('totalStreaks');
        
        this.init();
    }

    init() {
        this.migrateDemoData();
        this.loadHabits();
        this.bindEvents();
        this.updateStats();
    }

    /**
     * Migrate demo data from skeleton format to habit tracker format
     * Demo habits have 'streak' property but need 'completedDates'
     */
    migrateDemoData() {
        const habits = this.data.getAll('habits');
        let needsMigration = false;
        
        for (const habit of habits) {
            // Check if this is old format (has streak but no completedDates)
            if (habit.streak !== undefined && !habit.completedDates) {
                needsMigration = true;
                
                // Convert streak to completedDates
                // For demo purposes, create some fake completion dates
                const completedDates = [];
                const today = new Date();
                
                // Add dates for the streak length (starting from today going back)
                for (let i = 0; i < habit.streak; i++) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    completedDates.push(date.toISOString().split('T')[0]);
                }
                
                // Create a new habit object without the streak property
                const updatedHabit = {
                    ...habit,
                    completedDates: completedDates.sort()
                };
                delete updatedHabit.streak;
                
                // Replace the entire habit (since we need to remove a property)
                const habitsList = this.data.getAll('habits');
                const index = habitsList.findIndex(h => h.id === habit.id);
                if (index !== -1) {
                    habitsList[index] = updatedHabit;
                    this.data.set('habits', habitsList);
                }
            }
        }
        
        if (needsMigration) {
            console.log('Migrated demo habits to new format');
        }
    }

    bindEvents() {
        // Habit form submission
        if (this.habitForm) {
            this.habitForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addHabit();
            });
        }

        // Mark all for today button
        if (this.markAllTodayBtn) {
            this.markAllTodayBtn.addEventListener('click', () => {
                this.markAllForToday();
            });
        }

        // Export data button
        if (this.exportDataBtn) {
            this.exportDataBtn.addEventListener('click', () => {
                this.exportHabitsData();
            });
        }
    }

    /**
     * Get today's date in YYYY-MM-DD format
     */
    getTodayDate() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    /**
     * Calculate streak for a habit based on completed dates
     * @param {Object} habit - Habit object with completedDates
     * @returns {number} Current streak in days
     */
    calculateStreak(habit) {
        if (!habit.completedDates || !Array.isArray(habit.completedDates)) {
            return 0;
        }

        const sortedDates = [...habit.completedDates].sort().reverse();
        if (sortedDates.length === 0) return 0;

        const today = this.getTodayDate();
        let streak = 0;
        let currentDate = today;

        // Check if habit was completed today
        const hasToday = sortedDates.includes(today);
        
        // If not completed today, start from yesterday
        if (!hasToday && sortedDates[0] !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            currentDate = yesterday.toISOString().split('T')[0];
        }

        for (const date of sortedDates) {
            const expectedDate = currentDate;
            if (date === expectedDate) {
                streak++;
                // Move to previous day
                const prevDate = new Date(currentDate);
                prevDate.setDate(prevDate.getDate() - 1);
                currentDate = prevDate.toISOString().split('T')[0];
            } else {
                // Streak broken
                break;
            }
        }

        return streak;
    }

    /**
     * Check if habit is completed for today
     * @param {Object} habit - Habit object with completedDates
     * @returns {boolean} True if completed today
     */
    isCompletedToday(habit) {
        if (!habit.completedDates || !Array.isArray(habit.completedDates)) {
            return false;
        }
        const today = this.getTodayDate();
        return habit.completedDates.includes(today);
    }

    /**
     * Load habits from data layer and render them
     */
    loadHabits() {
        const habits = this.data.getAll('habits');
        
        if (habits.length === 0) {
            this.showEmptyState();
            return;
        }

        this.hideEmptyState();
        this.renderHabits(habits);
    }

    /**
     * Show empty state when no habits exist
     */
    showEmptyState() {
        if (this.emptyState) {
            this.emptyState.style.display = 'block';
        }
        if (this.habitsContainer) {
            this.habitsContainer.innerHTML = '';
            this.habitsContainer.appendChild(this.emptyState);
        }
    }

    /**
     * Hide empty state
     */
    hideEmptyState() {
        if (this.emptyState) {
            this.emptyState.style.display = 'none';
        }
    }

    /**
     * Render list of habits
     * @param {Array} habits - Array of habit objects
     */
    renderHabits(habits) {
        if (!this.habitsContainer) return;

        // Clear current list
        this.habitsContainer.innerHTML = '';

        // Render each habit
        habits.forEach(habit => {
            const habitElement = this.createHabitElement(habit);
            this.habitsContainer.appendChild(habitElement);
        });
    }

    /**
     * Create HTML element for a habit
     * @param {Object} habit - Habit object
     * @returns {HTMLElement} Habit element
     */
    createHabitElement(habit) {
        const streak = this.calculateStreak(habit);
        const isCompletedToday = this.isCompletedToday(habit);
        const today = this.getTodayDate();

        const habitCard = document.createElement('div');
        habitCard.className = 'feature-card habit-card';
        habitCard.dataset.habitId = habit.id;

        habitCard.innerHTML = `
            <div class="habit-card-header">
                <div class="habit-info">
                    <h5 class="habit-name">${this.escapeHtml(habit.name)}</h5>
                    <div class="habit-meta">
                        <span class="habit-streak ${streak >= 7 ? 'streak-high' : ''}">
                            <i class="fas fa-fire"></i> ${streak} day${streak !== 1 ? 's' : ''} streak
                        </span>
                        <span class="habit-last-completed">
                            <i class="fas fa-calendar"></i> ${habit.completedDates && habit.completedDates.length > 0 ? 'Last: ' + habit.completedDates[habit.completedDates.length - 1] : 'Never completed'}
                        </span>
                    </div>
                </div>
                <div class="habit-actions">
                    <button class="btn btn-icon btn-danger delete-habit-btn" title="Delete habit" data-habit-id="${habit.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="habit-card-content">
                <div class="habit-today">
                    <div class="checkbox-container">
                        <input type="checkbox" id="habit-${habit.id}" class="habit-checkbox" ${isCompletedToday ? 'checked' : ''}>
                        <label for="habit-${habit.id}" class="checkbox-label">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-text">Completed today (${today})</span>
                        </label>
                    </div>
                    <div class="completion-info">
                        <span class="completion-count">
                            <i class="fas fa-check-circle"></i> ${habit.completedDates ? habit.completedDates.length : 0} total completions
                        </span>
                    </div>
                </div>
                <div class="habit-dates">
                    <div class="dates-header">
                        <span class="dates-title">Recent completions:</span>
                    </div>
                    <div class="dates-list">
                        ${this.renderRecentDates(habit.completedDates)}
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        const checkbox = habitCard.querySelector(`#habit-${habit.id}`);
        if (checkbox) {
            checkbox.addEventListener('change', () => {
                this.toggleHabitCompletion(habit.id, checkbox.checked);
            });
        }

        const deleteBtn = habitCard.querySelector('.delete-habit-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteHabit(habit.id);
            });
        }

        return habitCard;
    }

    /**
     * Render recent completion dates
     * @param {Array} dates - Array of date strings
     * @returns {string} HTML string for dates
     */
    renderRecentDates(dates) {
        if (!dates || !Array.isArray(dates) || dates.length === 0) {
            return '<span class="no-dates">No completions yet</span>';
        }

        // Get last 5 dates, most recent first
        const recentDates = [...dates].sort().reverse().slice(0, 5);
        
        return recentDates.map(date => {
            return `<span class="date-badge">${date}</span>`;
        }).join('');
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Add a new habit
     */
    addHabit() {
        const name = this.habitNameInput?.value.trim();
        
        if (!name) {
            alert('Please enter a habit name');
            return;
        }

        const habit = {
            name: name,
            completedDates: [], // Start with empty completed dates
            createdAt: new Date().toISOString()
        };

        const addedHabit = this.data.add('habits', habit);
        
        // Clear form
        if (this.habitNameInput) {
            this.habitNameInput.value = '';
        }
        
        // Reload habits
        this.loadHabits();
        this.updateStats();
        
        console.log('Habit added:', addedHabit);
    }

    /**
     * Toggle completion status for a habit
     * @param {string} habitId - Habit ID
     * @param {boolean} completed - Whether habit is completed today
     */
    toggleHabitCompletion(habitId, completed) {
        const habit = this.data.get('habits', habitId);
        if (!habit) return;

        const today = this.getTodayDate();
        let completedDates = habit.completedDates || [];

        if (completed) {
            // Add today's date if not already present
            if (!completedDates.includes(today)) {
                completedDates.push(today);
            }
        } else {
            // Remove today's date
            completedDates = completedDates.filter(date => date !== today);
        }

        // Sort dates chronologically
        completedDates.sort();

        // Update habit
        this.data.update('habits', habitId, {
            completedDates: completedDates,
            updatedAt: new Date().toISOString()
        });

        // Refresh the display
        this.loadHabits();
        this.updateStats();
        
        console.log(`Habit ${habitId} ${completed ? 'completed' : 'unchecked'} for ${today}`);
    }

    /**
     * Mark all habits as completed for today
     */
    markAllForToday() {
        const habits = this.data.getAll('habits');
        const today = this.getTodayDate();
        let updatedCount = 0;

        habits.forEach(habit => {
            const completedDates = habit.completedDates || [];
            
            // Only add today if not already present
            if (!completedDates.includes(today)) {
                completedDates.push(today);
                completedDates.sort();
                
                this.data.update('habits', habit.id, {
                    completedDates: completedDates,
                    updatedAt: new Date().toISOString()
                });
                
                updatedCount++;
            }
        });

        // Refresh display
        this.loadHabits();
        this.updateStats();
        
        alert(`Marked ${updatedCount} habit${updatedCount !== 1 ? 's' : ''} as completed for today.`);
    }

    /**
     * Delete a habit
     * @param {string} habitId - Habit ID to delete
     */
    deleteHabit(habitId) {
        if (!confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
            return;
        }

        const success = this.data.remove('habits', habitId);
        
        if (success) {
            this.loadHabits();
            this.updateStats();
            console.log(`Habit ${habitId} deleted`);
        } else {
            alert('Failed to delete habit. It may have already been removed.');
        }
    }

    /**
     * Export habits data as JSON file
     */
    exportHabitsData() {
        const habits = this.data.getAll('habits');
        const exportData = {
            exportedAt: new Date().toISOString(),
            count: habits.length,
            habits: habits
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(dataBlob);
        downloadLink.download = `habits-export-${this.getTodayDate()}.json`;
        downloadLink.click();
        
        URL.revokeObjectURL(downloadLink.href);
        
        console.log('Habits data exported');
    }

    /**
     * Update statistics display
     */
    updateStats() {
        const habits = this.data.getAll('habits');
        const totalHabits = habits.length;
        
        // Calculate total streak days
        let totalStreaks = 0;
        habits.forEach(habit => {
            totalStreaks += this.calculateStreak(habit);
        });

        // Update DOM elements
        if (this.totalHabitsElement) {
            this.totalHabitsElement.textContent = totalHabits;
        }
        
        if (this.totalStreaksElement) {
            this.totalStreaksElement.textContent = totalStreaks;
        }
    }
}

// ============================================================================
// Initialize Habit Tracker when DOM is ready
// ============================================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.habitTracker = new HabitTracker();
    });
} else {
    window.habitTracker = new HabitTracker();
}