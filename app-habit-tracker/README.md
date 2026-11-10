# Habit Tracker App

A simple habit tracking application built with the Skeleton Crew framework. Track your daily habits, maintain streaks, and build lasting routines.

## Features

- **Add New Habits**: Create habits by entering their names
- **Daily Tracking**: Mark habits as completed for today with checkboxes
- **Streak Calculation**: Automatically calculates current streak in days
- **Habit Management**: Delete habits you no longer want to track
- **Mark All for Today**: Quickly mark all habits as completed for the current day
- **Data Export**: Export your habits data as JSON for backup or analysis

## Data Structure

Each habit is stored with the following properties:

```javascript
{
  id: "unique-id",
  name: "Habit Name",
  completedDates: ["2025-01-01", "2025-01-02", ...], // Array of YYYY-MM-DD dates
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z"
}
```

## Streak Calculation

The app calculates streaks intelligently:
- A streak continues as long as the habit is completed on consecutive days
- If you miss a day, the streak resets to 0
- Streaks are calculated automatically based on the `completedDates` array
- The app checks for the longest consecutive sequence of dates ending with today or yesterday

## Usage

### Adding a Habit
1. Enter a habit name in the "Add New Habit" form
2. Click "Add Habit"
3. The habit appears in your habits list

### Completing a Habit
1. Check the checkbox next to "Completed today" for any habit
2. The app records today's date in the habit's completion history
3. The streak counter updates automatically

### Deleting a Habit
1. Click the trash icon on any habit card
2. Confirm the deletion
3. The habit is permanently removed

### Mark All for Today
1. Click the "Mark All for Today" button in the CTA section
2. All habits are marked as completed for today
3. Streaks are updated for all habits

### Exporting Data
1. Click the "Export Habits Data" button
2. A JSON file containing all your habits data is downloaded
3. Use this for backup or data analysis

## Technical Details

### Integration with Skeleton Crew
This app uses the Skeleton Crew framework's shared components:
- **Shared Layout**: Header, navigation, and footer from the skeleton
- **Shared Styles**: CSS from `../skeleton/styles.css`
- **Shared Scripts**: Theme manager, authentication, and data layer from `../skeleton/app.js`

### Navigation
The app features updated navigation with:
- "Habits" link marked as active
- Links to the skeleton home page
- Link to the inventory app (when created)

### Data Layer
The app uses the Skeleton Crew DataLayer class with:
- Collection name: `habits`
- LocalStorage persistence
- Automatic ID generation
- Timestamp tracking

## LocalStorage Keys

- `skeleton-habits`: Stores all habit data
- `skeleton-theme`: User's theme preference
- `skeleton-user`: User authentication data

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript
- LocalStorage API
- CSS Custom Properties (variables)
- Flexbox and Grid layout

## Development

To modify this app:

1. Edit `index.html` for layout changes
2. Edit `habits.js` for functionality changes
3. Add custom CSS to `index.html` if needed (though most styling comes from the shared stylesheet)

The app automatically inherits all Skeleton Crew features:
- Light/dark theme switching
- Mock authentication
- Responsive design
- Mobile navigation

## Future Enhancements

Potential features to add:

1. **Habit categories** (health, work, personal, etc.)
2. **Reminder notifications**
3. **Habit frequency settings** (daily, weekly, custom)
4. **Progress charts and statistics**
5. **Habit sharing or social features**
6. **Import habits from CSV/JSON**
7. **Archive completed habits**
8. **Habit templates** (pre-defined common habits)

## License

Part of the Skeleton Crew project. See main project for licensing details.