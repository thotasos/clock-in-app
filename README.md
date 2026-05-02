# Timesheet App

A simple employee time tracking application built with React and Vite. Track employee check-ins and check-outs, view hours worked, and manage your team with an admin dashboard.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **LocalStorage** - Data persistence

## Getting Started

### Prerequisites

- Node.js 18+

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5192`

### Access from Other Devices

To access the app from other devices on your network, use:

```bash
npm run dev -- --host
```

This will start the server on port 5192 and bind to all network interfaces, allowing access via your IP address (e.g., `http://192.168.1.x:5192`).

### Build for Production

```bash
npm run build
```

The production build will be generated in the `dist` folder.

## Features

- Check in/out employees with one click
- Track time entries with automatic date detection
- Admin dashboard with PIN protection
- View hours by day/week/month
- Calendar view for visualizing work schedules
- CSV export for reporting
- Employee management (add/remove employees)
- Light/Dark theme toggle
- Responsive design for mobile and desktop
- Demo data generation for testing

## Project Structure

```
src/
├── App.jsx              # Main app with routing
├── main.jsx             # Entry point
├── index.css            # Global styles and CSS variables
├── components/
│   └── EmployeeCard.jsx # Employee selection card component
├── pages/
│   ├── CheckIn.jsx      # Check-in page
│   ├── CheckOut.jsx     # Check-out page
│   └── Admin.jsx        # Admin dashboard
└── utils/
    └── storage.js       # LocalStorage data management
```

## Data Storage

All data is stored in the browser's LocalStorage:

- **timesheet-app-data** - Employee list and time entries
- **timesheet-app-theme** - User's theme preference (light/dark)

### Data Schema

```javascript
{
  employees: [
    { id: 'string', name: 'string' }
  ],
  timeEntries: [
    {
      id: 'string',
      employeeId: 'string',
      date: 'YYYY-MM-DD',
      checkIn: 'ISO timestamp',
      checkOut: 'ISO timestamp | null'
    }
  ],
  adminPin: '1234'
}
```

## Admin Access

### Default PIN

The default admin PIN is: **1234**

### Changing the Admin PIN

The admin PIN is stored in `src/utils/storage.js` in the `defaultData` object:

```javascript
const defaultData = {
  // ...
  adminPin: '1234',
}
```

To change the PIN, edit the value in this file.

### Accessing Admin Dashboard

1. Navigate to `/admin` or click "Admin" on the home page
2. Enter the 4-digit PIN to access the dashboard
3. From the dashboard you can:
   - View employee hours (day/week/month)
   - View calendar view
   - Export data to CSV
   - Add/remove employees
   - Reset to demo data
   - Toggle light/dark theme

## Development

### Running Tests

Currently, this project does not have automated tests. To add tests, consider using Vitest or Jest with React Testing Library.

### Adding New Features

1. Create a new branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Test locally with `npm run dev`
4. Build with `npm run build`
5. Commit and push your changes

## License

MIT
