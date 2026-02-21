# Timesheet App

A simple employee time tracking application built with React and Vite.

## Getting Started

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

## Features

- Check in/out employees
- Track time entries
- Admin dashboard with PIN protection
- View hours by day/week/month
- Calendar view
- CSV export
- Employee management (add/remove)
