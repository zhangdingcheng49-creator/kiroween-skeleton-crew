# Shop Inventory Manager

A shop inventory management application built on the Skeleton Crew framework.

## Overview

The Shop Inventory Manager is a vanilla HTML, CSS, and JavaScript application that allows you to track and manage inventory for a small shop or store. It provides a clean, responsive interface for adding, updating, and removing inventory items.

## Features

### Core Inventory Management
- **Add Items**: Add new inventory items with name, price, and quantity
- **Edit Quantities**: Use plus/minus buttons to adjust item quantities
- **Delete Items**: Remove items from inventory with confirmation
- **Search**: Filter inventory by item name in real-time

### Inventory Statistics
- **Total Items**: Count of all inventory items
- **Total Value**: Combined value of all inventory (price × quantity)
- **Stock Alerts**: Track low stock (≤5 items) and out-of-stock items
- **Stock Status Indicators**: Visual indicators for inventory levels

### Data Management
- **Local Storage**: All data persists in browser's localStorage
- **Data Export**: Export inventory to CSV format for backup or analysis
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technical Details

### Data Structure
Each inventory item has the following properties:
- `id`: Unique identifier (auto-generated)
- `name`: Item name (string)
- `price`: Item price (number, decimal)
- `quantity`: Stock quantity (number, integer)
- `createdAt`: Creation timestamp (ISO string)
- `updatedAt`: Last update timestamp (ISO string, optional)

### Stock Status Levels
- **In Stock**: Quantity > 5 items
- **Low Stock**: Quantity 1-5 items
- **Out of Stock**: Quantity = 0 items

## Usage Instructions

### Adding Items
1. Fill in the "Item Name", "Price ($)", and "Quantity" fields
2. Click "Add Item" to add to inventory
3. The form will clear and focus returns to the name field

### Managing Items
- **Increase Quantity**: Click the green "+" button
- **Decrease Quantity**: Click the orange "-" button
- **Delete Item**: Click the red trash can button
- **Search**: Type in the search box to filter items by name

### Exporting Data
1. Click the "Export Data" button
2. A CSV file will download with all inventory items
3. File includes: Name, Price, Quantity, Total Value, Stock Status, and Added Date

## Project Structure

```
app-inventory/
├── index.html          # Main HTML file with responsive layout
├── inventory.js        # Inventory management logic
├── README.md          # This documentation file
└── (test.html)        # Test page (optional)
```

## Dependencies

- **Skeleton Crew Framework**: Uses shared CSS and JavaScript from `../skeleton/`
  - `../skeleton/styles.css`: Shared styles and theme system
  - `../skeleton/app.js`: Theme manager, authentication, and data layer
- **Font Awesome 6.4.0**: Icon library via CDN
- **Google Fonts**: Inter and Roboto Mono fonts

## Data Layer Integration

This app uses the Skeleton Crew DataLayer class for all CRUD operations:

```javascript
// Initialize data layer
const dataLayer = new DataLayer();

// Add item
dataLayer.add('inventory', {
    name: 'Product Name',
    price: 19.99,
    quantity: 10
});

// Get all items
const items = dataLayer.getAll('inventory');

// Update item
dataLayer.update('inventory', itemId, { quantity: newQuantity });

// Delete item
dataLayer.remove('inventory', itemId);
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome for Android)

## Testing

Open `index.html` in a web browser. The app includes sample data that can be added via the form or by using the browser's developer console.

### Manual Testing
1. **Add Items**: Test form validation (empty fields, invalid numbers)
2. **Quantity Adjustment**: Ensure plus/minus buttons work correctly
3. **Search Functionality**: Test filtering with various search terms
4. **Data Persistence**: Refresh page to verify data persists
5. **Export Function**: Verify CSV download works

## Extending the App

### Adding Features
1. **Barcode Support**: Add barcode scanning with webcam API
2. **Supplier Management**: Track item suppliers and reorder points
3. **Advanced Reporting**: Generate sales reports and analytics
4. **Image Support**: Upload and display product images
5. **Categories**: Organize items by category or department

### Integration Possibilities
- **Backend API**: Replace localStorage with REST API calls
- **Print Labels**: Generate printable inventory labels
- **Email Alerts**: Send low stock notifications
- **Multi-User**: Add user accounts with permissions

## License

Part of the Skeleton Crew example applications. See the main Skeleton Crew repository for licensing information.

## Related Projects

- **[Skeleton Crew](../skeleton/)**: Main framework with shared components
- **[Habit Tracker](../app-habit-tracker/)**: Another example application built on Skeleton Crew

## Support

For issues or questions:
1. Check the browser console for error messages
2. Clear browser localStorage if experiencing data issues
3. Refer to the Skeleton Crew documentation
4. Open an issue in the project repository