# Employee Timesheet & Time Tracker - Design Document

**Date:** 2026-02-21
**Project:** Employee Timesheet & Time Tracker Web App

---

## 1. Overview

A React single-page application for small businesses to track employee check-ins and check-outs. Features a kiosk-style interface for employees and a password-protected admin dashboard.

## 2. Architecture

### Tech Stack
- React 18+ with Vite
- React Router v6 for client-side routing
- LocalStorage for persistence
- Pure CSS with CSS variables

### Routes
- `/checkin` - Employee check-in page
- `/checkout` - Employee check-out page
- `/admin` - Admin dashboard (PIN-protected)

## 3. Data Model

### Employee
```typescript
{ id: string, name: string }
```

### TimeEntry
```typescript
{
  id: string,
  employeeId: string,
  date: string,        // YYYY-MM-DD
  checkIn: string,     // ISO timestamp
  checkOut: string | null  // null = incomplete
}
```

### Storage
Single localStorage key: `timesheet-app-data`

---

## 4. Pages

### 4.1 Check-In Page (`/checkin`)
- Grid of employee name cards (2-3 columns, mobile-friendly)
- Large tap targets (min 80px height)
- "Check In" button (disabled until selection)
- Success animation with name + time
- Auto-clear selection after 3 seconds

### 4.2 Check-Out Page (`/checkout`)
- Same UX as check-in
- Edge cases:
  - No active check-in → show warning modal
  - Overnight shifts → calculate hours across midnight
  - Double check-out prevention
- Success shows hours worked

### 4.3 Admin Page (`/admin`)
- PIN modal (default: `1234`)
- Filter controls: Day / Week / Month + date picker
- Summary table: total hours per employee
- Calendar grid view: employees × days
- Incomplete entries flagged in red
- Export CSV button
- Reset Demo Data button

---

## 5. Sample Data

### Employees (5)
- Maria Garcia
- James Wilson
- Sarah Chen
- Michael Brown
- Emily Davis

### 3 Weeks of Sample Data
- Realistic work patterns (5-6 days/week, 6-9 hour shifts)
- 2-3 incomplete entries for demo
- 1 overnight shift example

---

## 6. UI Theme

| Element | Value |
|---------|-------|
| Primary | `#00855A` |
| Background | `#F7F7F5` |
| Surface | `#FFFFFF` |
| Text | `#1A1A1A` |
| Warning | `#D4A017` |
| Error | `#C53030` |
| Border Radius | `12px` |

---

## 7. Decisions

1. **No backend** - All data in localStorage for simplicity
2. **Hardcoded PIN** - Simple auth, no user management
3. **Large tap targets** - Kiosk/tablet optimized
4. **Dual views in admin** - Table + Calendar for different preferences
5. **Demo reset option** - Allow returning to fresh state

---

## 8. Export CSV Format

```
Employee Name,Date,Check-In Time,Check-Out Time,Hours Worked
```

---

*Approved for implementation: 2026-02-21*
