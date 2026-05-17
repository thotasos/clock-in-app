# Clock-In App

A timesheet tracking web application with kiosk-style employee check-in and password-protected admin dashboard.

## Features

- **Employee Check-In/Check-Out**: Kiosk-style interface for employees to record work hours
- **Admin Dashboard**: Password-protected dashboard to view employee timesheets
- **Flexible Filtering**: View data by day, week, or month
- **CSV Export**: Export timesheet data for payroll processing
- **Demo Mode**: Pre-loaded with sample employee data for testing

## Tech Stack

- **React 18** with React Router 6
- **Vite** for development and building
- **localStorage** for data persistence

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at:
- Local: http://localhost:5194
- Network: http://[your-ip]:5194

### Production Build

```bash
npm run build
npm run preview
```

## Usage

### Employee Check-In

1. Navigate to the home page
2. Select your name from the employee list
3. Click **Check In** to start your shift
4. Click **Check Out** when your shift ends

### Admin Dashboard

1. Click **Admin** in the navigation
2. Enter the admin PIN (default: derived from stored adminPin in localStorage)
3. View employee hours by day/week/month
4. Export data to CSV for payroll

### Data Reset

To reset all data to demo values:
1. Go to Admin dashboard
2. Click **Reset to Demo**
3. Confirm when prompted

## Project Structure

```
src/
├── App.jsx            # Main app with routing
├── main.jsx           # React mount
├── pages/
│   ├── CheckIn.jsx    # Employee check-in page
│   ├── Admin.jsx      # Admin dashboard
│   └── ...
├── components/        # Reusable UI components
├── context/           # State management
├── hooks/             # Custom React hooks
├── styles/            # CSS styles
└── utils/
    └── storage.js     # localStorage utilities
```

## Configuration

### Changing the Port

Edit `vite.config.js` to change the development server port.

### Default Admin PIN

The admin PIN is stored in localStorage and can be set via the admin interface. If you need to reset it, use the "Reset to Demo" function in the admin dashboard.

## Security Notes

- Admin PIN is stored in localStorage (client-side only)
- No backend authentication - PIN verification is client-side
- Data is stored locally and not transmitted

## License

MIT