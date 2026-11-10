/**
 * Shop Inventory Manager - Inventory JavaScript
 * 
 * Features:
 * 1. Inventory CRUD operations using the skeleton DataLayer
 * 2. Search/filter functionality
 * 3. Quantity adjustment (plus/minus buttons)
 * 4. Inventory statistics (total items, total value, low stock alerts)
 * 5. Data export functionality
 */

class InventoryManager {
    constructor() {
        this.dataLayer = new DataLayer();
        this.collectionName = 'inventory';
        this.currentItems = [];
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.loadInventory();
        this.bindEvents();
        this.renderInventory();
        this.updateStats();
    }

    loadInventory() {
        this.currentItems = this.dataLayer.getAll(this.collectionName);
        console.log('Loaded inventory:', this.currentItems);
    }

    bindEvents() {
        // Add item form
        const addItemForm = document.getElementById('addItemForm');
        if (addItemForm) {
            addItemForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddItem();
            });
        }

        // Clear form button
        const clearFormBtn = document.getElementById('clearFormBtn');
        if (clearFormBtn) {
            clearFormBtn.addEventListener('click', () => this.clearForm());
        }

        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase().trim();
                this.renderInventory();
                this.updateStats();
            });
        }

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        // Theme and auth are handled by skeleton/app.js
    }

    handleAddItem() {
        const nameInput = document.getElementById('itemName');
        const priceInput = document.getElementById('itemPrice');
        const quantityInput = document.getElementById('itemQuantity');

        const name = nameInput.value.trim();
        const price = parseFloat(priceInput.value);
        const quantity = parseInt(quantityInput.value);

        // Validation
        if (!name) {
            alert('Please enter an item name');
            nameInput.focus();
            return;
        }

        if (isNaN(price) || price < 0) {
            alert('Please enter a valid price (0 or greater)');
            priceInput.focus();
            return;
        }

        if (isNaN(quantity) || quantity < 0) {
            alert('Please enter a valid quantity (0 or greater)');
            quantityInput.focus();
            return;
        }

        // Create new item
        const newItem = {
            name: name,
            price: price,
            quantity: quantity,
            createdAt: new Date().toISOString()
        };

        // Add to data layer
        const addedItem = this.dataLayer.add(this.collectionName, newItem);
        console.log('Added item:', addedItem);

        // Reload and render
        this.loadInventory();
        this.renderInventory();
        this.updateStats();

        // Clear form
        this.clearForm();

        // Show success message
        this.showNotification(`Added "${name}" to inventory`, 'success');
    }

    clearForm() {
        document.getElementById('itemName').value = '';
        document.getElementById('itemPrice').value = '';
        document.getElementById('itemQuantity').value = '';
        document.getElementById('itemName').focus();
    }

    updateQuantity(itemId, change) {
        const item = this.dataLayer.get(this.collectionName, itemId);
        if (!item) return;

        const newQuantity = Math.max(0, item.quantity + change);

        if (newQuantity !== item.quantity) {
            this.dataLayer.update(this.collectionName, itemId, { quantity: newQuantity });
            this.loadInventory();
            this.renderInventory();
            this.updateStats();

            const action = change > 0 ? 'increased' : 'decreased';
            this.showNotification(`Quantity ${action} for "${item.name}"`, 'info');
        }
    }

    deleteItem(itemId) {
        const item = this.dataLayer.get(this.collectionName, itemId);
        if (!item) return;

        if (confirm(`Are you sure you want to delete "${item.name}" from inventory?`)) {
            const deleted = this.dataLayer.remove(this.collectionName, itemId);
            if (deleted) {
                this.loadInventory();
                this.renderInventory();
                this.updateStats();
                this.showNotification(`Deleted "${item.name}" from inventory`, 'success');
            }
        }
    }

    getFilteredItems() {
        if (!this.searchTerm) {
            return this.currentItems;
        }

        return this.currentItems.filter(item => 
            item.name.toLowerCase().includes(this.searchTerm)
        );
    }

    getStockStatus(quantity) {
        if (quantity === 0) {
            return { text: 'Out of Stock', class: 'low' };
        } else if (quantity <= 5) {
            return { text: 'Low Stock', class: 'medium' };
        } else {
            return { text: 'In Stock', class: 'high' };
        }
    }

    renderInventory() {
        const items = this.getFilteredItems();
        const tableBody = document.getElementById('inventoryTableBody');
        const emptyState = document.getElementById('emptyState');
        const inventoryTable = document.getElementById('inventoryTable');

        if (!tableBody || !emptyState || !inventoryTable) return;

        // Clear existing rows
        tableBody.innerHTML = '';

        if (items.length === 0) {
            // Show empty state
            emptyState.style.display = 'block';
            inventoryTable.style.display = 'none';

            // Update empty state message based on search
            const messageElement = emptyState.querySelector('.empty-state-message');
            const subtitleElement = emptyState.querySelector('.empty-state-subtitle');
            
            if (this.searchTerm) {
                messageElement.textContent = 'No matching items found';
                subtitleElement.textContent = 'Try adjusting your search terms';
            } else {
                messageElement.textContent = 'No inventory items yet';
                subtitleElement.textContent = 'Add your first item using the form above';
            }
        } else {
            // Hide empty state, show table
            emptyState.style.display = 'none';
            inventoryTable.style.display = 'table';

            // Add rows for each item
            items.forEach(item => {
                const stockStatus = this.getStockStatus(item.quantity);
                const totalValue = (item.price * item.quantity).toFixed(2);
                const row = document.createElement('tr');
                row.setAttribute('data-item-id', item.id);
                row.innerHTML = `
                    <td class="item-name">${this.escapeHtml(item.name)}</td>
                    <td class="item-price">$${item.price.toFixed(2)}</td>
                    <td class="item-quantity">${item.quantity}</td>
                    <td>
                        <span class="item-stock ${stockStatus.class}">
                            ${stockStatus.text}
                        </span>
                    </td>
                    <td class="item-price">$${totalValue}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-icon" 
                                    title="Increase quantity"
                                    data-action="increase"
                                    aria-label="Increase quantity for ${this.escapeHtml(item.name)}">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="btn-icon" 
                                    title="Decrease quantity"
                                    data-action="decrease"
                                    aria-label="Decrease quantity for ${this.escapeHtml(item.name)}">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="btn-icon danger" 
                                    title="Delete item"
                                    data-action="delete"
                                    aria-label="Delete ${this.escapeHtml(item.name)} from inventory">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Bind action button events
            this.bindActionButtons();
        }
    }

    bindActionButtons() {
        const actionButtons = document.querySelectorAll('.action-buttons .btn-icon');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                if (!row) return;

                const itemId = row.getAttribute('data-item-id');
                const action = button.getAttribute('data-action');

                if (action === 'increase') {
                    this.updateQuantity(itemId, 1);
                } else if (action === 'decrease') {
                    this.updateQuantity(itemId, -1);
                } else if (action === 'delete') {
                    this.deleteItem(itemId);
                }
            });
        });
    }

    updateStats() {
        const items = this.getFilteredItems();
        const allItems = this.currentItems;

        // Calculate statistics
        const totalItems = items.length;
        const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const lowStockItems = allItems.filter(item => item.quantity > 0 && item.quantity <= 5).length;
        const outOfStockItems = allItems.filter(item => item.quantity === 0).length;

        // Update UI
        this.updateElementText('totalItems', totalItems);
        this.updateElementText('totalValue', `$${totalValue.toFixed(2)}`);
        this.updateElementText('lowStockItems', lowStockItems);
        this.updateElementText('outOfStockItems', outOfStockItems);
    }

    updateElementText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }

    exportData() {
        const items = this.currentItems;
        if (items.length === 0) {
            alert('No inventory data to export');
            return;
        }

        // Format data for export
        const exportData = items.map(item => ({
            Name: item.name,
            Price: `$${item.price.toFixed(2)}`,
            Quantity: item.quantity,
            'Total Value': `$${(item.price * item.quantity).toFixed(2)}`,
            'Stock Status': this.getStockStatus(item.quantity).text,
            'Added Date': new Date(item.createdAt).toLocaleDateString()
        }));

        // Create CSV content
        const headers = Object.keys(exportData[0]);
        const csvRows = [
            headers.join(','),
            ...exportData.map(row => 
                headers.map(header => {
                    const value = row[header];
                    // Escape quotes and wrap in quotes if contains comma
                    const escaped = String(value).replace(/"/g, '""');
                    return escaped.includes(',') ? `"${escaped}"` : escaped;
                }).join(',')
            )
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `inventory-export-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification('Inventory data exported successfully', 'success');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-text">${this.escapeHtml(message)}</span>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add styles if not already present
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: var(--spacing-md) var(--spacing-lg);
                    border-radius: var(--radius-md);
                    background-color: var(--bg-surface);
                    border: 1px solid var(--border-color);
                    box-shadow: var(--shadow-lg);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--spacing-md);
                    max-width: 400px;
                    z-index: 1000;
                    animation: slideIn 0.3s ease-out;
                    font-size: var(--font-size-sm);
                }
                
                .notification-info {
                    border-left: 4px solid var(--color-info);
                }
                
                .notification-success {
                    border-left: 4px solid var(--color-success);
                }
                
                .notification-warning {
                    border-left: 4px solid var(--color-warning);
                }
                
                .notification-error {
                    border-left: 4px solid var(--color-danger);
                }
                
                .notification-text {
                    flex: 1;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: var(--spacing-xs);
                    border-radius: var(--radius-sm);
                    transition: background-color var(--transition-fast) var(--transition-timing);
                }
                
                .notification-close:hover {
                    background-color: var(--bg-secondary);
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Add to document
        document.body.appendChild(notification);

        // Bind close button
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                notification.style.animation = 'slideOut 0.3s ease-in forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            });
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the inventory manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.inventoryManager = new InventoryManager();
});