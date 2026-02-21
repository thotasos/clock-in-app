# Employee Timesheet & Time Tracker - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a React SPA with check-in/check-out kiosk pages and an admin dashboard with localStorage persistence.

**Architecture:** Client-side React app with React Router for routing. All data stored in localStorage. CSS variables for theming.

**Tech Stack:** React 18+, Vite, React Router v6, localStorage

---

## Task 1: Initialize Project with Vite + React

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/index.css`

**Step 1: Initialize project structure**

```bash
npm create vite@latest . -- --template react
npm install react-router-dom
```

**Step 2: Create vite.config.js**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**Step 3: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Time Tracker</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**Step 4: Create src/main.jsx**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

**Step 5: Create src/App.jsx**

```jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import CheckIn from './pages/CheckIn'
import CheckOut from './pages/CheckOut'
import Admin from './pages/Admin'

function App() {
  return (
    <Routes>
      <Route path="/checkin" element={<CheckIn />} />
      <Route path="/checkout" element={<CheckOut />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/" element={<Navigate to="/checkin" replace />} />
    </Routes>
  )
}

export default App
```

**Step 6: Create src/index.css with CSS variables**

```css
:root {
  --primary: #00855A;
  --primary-hover: #006B49;
  --background: #F7F7F5;
  --surface: #FFFFFF;
  --text: #1A1A1A;
  --text-secondary: #666666;
  --warning: #D4A017;
  --error: #C53030;
  --border: #E5E5E5;
  --border-radius: 12px;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--background);
  color: var(--text);
  min-height: 100vh;
}

button {
  cursor: pointer;
  border: none;
  font-family: inherit;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
```

**Step 7: Run and verify**

```bash
npm run dev
```

**Step 8: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Vite + React project"
```

---

## Task 2: Create Data Layer (localStorage)

**Files:**
- Create: `src/utils/storage.js`

**Step 1: Create storage utility**

```javascript
const STORAGE_KEY = 'timesheet-app-data'

const defaultData = {
  employees: [
    { id: '1', name: 'Maria Garcia' },
    { id: '2', name: 'James Wilson' },
    { id: '3', name: 'Sarah Chen' },
    { id: '4', name: 'Michael Brown' },
    { id: '5', name: 'Emily Davis' },
  ],
  timeEntries: [],
  adminPin: '1234',
}

export function getAppData() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return { ...defaultData }
}

export function saveAppData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function addTimeEntry(entry) {
  const data = getAppData()
  data.timeEntries.push(entry)
  saveAppData(data)
  return entry
}

export function updateTimeEntry(id, updates) {
  const data = getAppData()
  const index = data.timeEntries.findIndex(e => e.id === id)
  if (index !== -1) {
    data.timeEntries[index] = { ...data.timeEntries[index], ...updates }
    saveAppData(data)
  }
}

export function getActiveEntry(employeeId) {
  const data = getAppData()
  return data.timeEntries.find(
    e => e.employeeId === employeeId && e.checkOut === null
  )
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function resetToDemoData() {
  const data = getAppData()
  // Keep employees, reset entries
  data.timeEntries = generateDemoData()
  saveAppData(data)
}

function generateDemoData() {
  const entries = []
  const employees = [
    { id: '1', name: 'Maria Garcia' },
    { id: '2', name: 'James Wilson' },
    { id: '3', name: 'Sarah Chen' },
    { id: '4', name: 'Michael Brown' },
    { id: '5', name: 'Emily Davis' },
  ]

  const today = new Date('2026-02-21')
  const threeWeeksAgo = new Date(today)
  threeWeeksAgo.setDate(today.getDate() - 21)

  employees.forEach((emp, empIndex) => {
    for (let d = 0; d < 21; d++) {
      const date = new Date(threeWeeksAgo)
      date.setDate(threeWeeksAgo.getDate() + d)

      // Skip some days randomly for realism
      if (Math.random() < 0.2) continue

      const dayOfWeek = date.getDay()
      if (dayOfWeek === 0) continue // Skip Sundays

      const isShortDay = Math.random() < 0.3
      const hours = isShortDay ? 4 + Math.random() * 2 : 6 + Math.random() * 3

      const checkInHour = 8 + Math.floor(Math.random() * 3)
      const checkIn = new Date(date)
      checkIn.setHours(checkInHour, Math.floor(Math.random() * 60), 0, 0)

      const checkOut = new Date(checkIn)
      checkOut.setHours(checkInHour + Math.floor(hours), Math.floor(Math.random() * 60), 0, 0)

      // 2-3 incomplete entries
      const isIncomplete = (empIndex < 3 && d === 10) || (empIndex === 1 && d === 15)

      entries.push({
        id: generateId(),
        employeeId: emp.id,
        date: checkIn.toISOString().split('T')[0],
        checkIn: checkIn.toISOString(),
        checkOut: isIncomplete ? null : checkOut.toISOString(),
      })
    }
  })

  // Add one overnight shift
  const overnightDate = new Date('2026-02-15')
  entries.push({
    id: generateId(),
    employeeId: '3',
    date: overnightDate.toISOString().split('T')[0],
    checkIn: new Date(overnightDate.setHours(22, 0, 0, 0)).toISOString(),
    checkOut: new Date(overnightDate.setHours(6, 0, 0, 0)).toISOString(),
  })

  return entries
}
```

**Step 2: Initialize with demo data on first load**

Update `src/main.jsx` to seed demo data:

```jsx
import { useEffect } from 'react'
import { getAppData, resetToDemoData } from './utils/storage'

function InitializeDemoData() {
  useEffect(() => {
    const data = getAppData()
    if (data.timeEntries.length === 0) {
      resetToDemoData()
    }
  }, [])
  return null
}
```

Add to App.jsx inside Routes.

**Step 3: Commit**

```bash
git add src/utils/storage.js src/main.jsx
git commit -m "feat: add localStorage data layer with demo data"
```

---

## Task 3: Create Check-In Page

**Files:**
- Create: `src/pages/CheckIn.jsx`
- Create: `src/components/EmployeeCard.jsx`

**Step 1: Create EmployeeCard component**

```jsx
import './EmployeeCard.css'

function EmployeeCard({ employee, selected, onClick }) {
  return (
    <div
      className={`employee-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <span className="employee-avatar">
        {employee.name.split(' ').map(n => n[0]).join('')}
      </span>
      <span className="employee-name">{employee.name}</span>
    </div>
  )
}

export default EmployeeCard
```

**Step 2: Create EmployeeCard.css**

```css
.employee-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 80px;
}

.employee-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.employee-card.selected {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.employee-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--background);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  color: var(--primary);
}

.employee-card.selected .employee-avatar {
  background: rgba(255,255,255,0.2);
  color: white;
}

.employee-name {
  font-size: 20px;
  font-weight: 500;
}
```

**Step 3: Create CheckIn page**

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAppData, addTimeEntry, generateId } from '../utils/storage'
import EmployeeCard from '../components/EmployeeCard'
import './CheckIn.css'

function CheckIn() {
  const [selectedId, setSelectedId] = useState(null)
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()

  const employees = getAppData().employees

  const handleCheckIn = () => {
    if (!selectedId) return

    const employee = employees.find(e => e.id === selectedId)
    const now = new Date()

    addTimeEntry({
      id: generateId(),
      employeeId: selectedId,
      date: now.toISOString().split('T')[0],
      checkIn: now.toISOString(),
      checkOut: null,
    })

    setSuccess({
      name: employee.name,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })

    setTimeout(() => {
      setSuccess(null)
      setSelectedId(null)
    }, 3000)
  }

  if (success) {
    return (
      <div className="page success-page">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h1>Welcome, {success.name}!</h1>
          <p>Checked in at {success.time}</p>
        </div>
        <nav className="bottom-nav">
          <button onClick={() => navigate('/checkout')}>Go to Check Out</button>
        </nav>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Check In</h1>
        <p>Select your name to clock in</p>
      </header>

      <div className="employee-grid">
        {employees.map(emp => (
          <EmployeeCard
            key={emp.id}
            employee={emp}
            selected={selectedId === emp.id}
            onClick={() => setSelectedId(emp.id)}
          />
        ))}
      </div>

      <div className="action-area">
        <button
          className="btn-primary"
          disabled={!selectedId}
          onClick={handleCheckIn}
        >
          Check In
        </button>
      </div>

      <nav className="bottom-nav">
        <button className="nav-link" onClick={() => navigate('/checkout')}>
          Switch to Check Out →
        </button>
      </nav>
    </div>
  )
}

export default CheckIn
```

**Step 4: Create CheckIn.css**

```css
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 24px;
  padding-bottom: 100px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
}

.page-header p {
  color: var(--text-secondary);
  font-size: 18px;
}

.employee-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  flex: 1;
}

.action-area {
  margin-top: 24px;
}

.btn-primary {
  width: 100%;
  padding: 20px;
  background: var(--primary);
  color: white;
  font-size: 20px;
  font-weight: 600;
  border-radius: var(--border-radius);
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bottom-nav {
  margin-top: auto;
  padding-top: 24px;
  text-align: center;
}

.nav-link {
  background: none;
  color: var(--primary);
  font-size: 16px;
  font-weight: 500;
}

/* Success state */
.success-page {
  justify-content: center;
  align-items: center;
  text-align: center;
}

.success-content {
  animation: fadeIn 0.3s ease;
}

.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.success-content h1 {
  font-size: 32px;
  margin-bottom: 8px;
}

.success-content p {
  font-size: 20px;
  color: var(--text-secondary);
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

**Step 5: Commit**

```bash
git add src/pages/CheckIn.jsx src/pages/CheckIn.css src/components/EmployeeCard.jsx src/components/EmployeeCard.css
git commit -m "feat: add check-in page with employee selection"
```

---

## Task 4: Create Check-Out Page

**Files:**
- Create: `src/pages/CheckOut.jsx`

**Step 1: Create CheckOut page with edge case handling**

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAppData, addTimeEntry, updateTimeEntry, getActiveEntry, generateId } from '../utils/storage'
import EmployeeCard from '../components/EmployeeCard'
import './CheckOut.css'

function CheckOut() {
  const [selectedId, setSelectedId] = useState(null)
  const [success, setSuccess] = useState(null)
  const [warning, setWarning] = useState(null)
  const navigate = useNavigate()

  const employees = getAppData().employees

  const handleCheckOut = () => {
    if (!selectedId) return

    const employee = employees.find(e => e.id === selectedId)
    const activeEntry = getActiveEntry(selectedId)

    if (!activeEntry) {
      setWarning({
        title: 'No Active Check-In',
        message: `${employee.name} hasn't checked in yet today.`,
      })
      return
    }

    const now = new Date()
    const checkInTime = new Date(activeEntry.checkIn)

    // Handle overnight shifts
    let hoursWorked = (now - checkInTime) / (1000 * 60 * 60)
    if (hoursWorked < 0) {
      hoursWorked += 24 // Overnight
    }

    updateTimeEntry(activeEntry.id, { checkOut: now.toISOString() })

    setSuccess({
      name: employee.name,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hours: hoursWorked.toFixed(1),
    })

    setTimeout(() => {
      setSuccess(null)
      setSelectedId(null)
    }, 3000)
  }

  const dismissWarning = () => setWarning(null)

  if (success) {
    return (
      <div className="page success-page">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h1>Goodbye, {success.name}!</h1>
          <p>Checked out at {success.time}</p>
          <p className="hours-worked">{success.hours} hours worked</p>
        </div>
        <nav className="bottom-nav">
          <button onClick={() => navigate('/checkin')}>Go to Check In</button>
        </nav>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Check Out</h1>
        <p>Select your name to clock out</p>
      </header>

      <div className="employee-grid">
        {employees.map(emp => {
          const hasActive = getActiveEntry(emp.id)
          return (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              selected={selectedId === emp.id}
              onClick={() => setSelectedId(emp.id)}
            />
          )
        })}
      </div>

      <div className="action-area">
        <button
          className="btn-primary"
          disabled={!selectedId}
          onClick={handleCheckOut}
        >
          Check Out
        </button>
      </div>

      <nav className="bottom-nav">
        <button className="nav-link" onClick={() => navigate('/checkin')}>
          ← Switch to Check In
        </button>
      </nav>

      {warning && (
        <div className="modal-overlay" onClick={dismissWarning}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-icon warning">!</div>
            <h2>{warning.title}</h2>
            <p>{warning.message}</p>
            <button className="btn-primary" onClick={dismissWarning}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckOut
```

**Step 2: Create CheckOut.css (add modal styles)**

```css
/* Add to CheckIn.css or create new */
.hours-worked {
  font-size: 24px;
  font-weight: 600;
  color: var(--primary);
  margin-top: 8px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: fadeIn 0.2s ease;
}

.modal {
  background: var(--surface);
  border-radius: var(--border-radius);
  padding: 32px;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.modal-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.modal-icon.warning {
  background: var(--warning);
  color: white;
}

.modal h2 {
  margin-bottom: 8px;
}

.modal p {
  color: var(--text-secondary);
  margin-bottom: 24px;
}
```

**Step 3: Commit**

```bash
git add src/pages/CheckOut.jsx src/pages/CheckOut.css
git commit -m "feat: add check-out page with edge case handling"
```

---

## Task 5: Create Admin Dashboard

**Files:**
- Create: `src/pages/Admin.jsx`
- Create: `src/pages/Admin.css`

**Step 1: Create Admin page with PIN, filters, table, calendar, export**

```jsx
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAppData, resetToDemoData } from '../utils/storage'
import './Admin.css'

function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  const [filter, setFilter] = useState('week')
  const [viewDate, setViewDate] = useState(new Date('2026-02-21'))
  const [showCalendar, setShowCalendar] = useState(false)

  const navigate = useNavigate()

  const handlePinSubmit = () => {
    const data = getAppData()
    if (pin === data.adminPin) {
      setAuthenticated(true)
    } else {
      setPin('')
      alert('Invalid PIN')
    }
  }

  const data = getAppData()
  const { employees, timeEntries } = data

  // Filter entries based on selected period
  const filteredEntries = useMemo(() => {
    const now = new Date(viewDate)
    let startDate, endDate

    if (filter === 'day') {
      startDate = new Date(now)
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date(now)
      endDate.setHours(23, 59, 59, 999)
    } else if (filter === 'week') {
      startDate = new Date(now)
      startDate.setDate(now.getDate() - now.getDay())
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)
      endDate.setHours(23, 59, 59, 999)
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    }

    return timeEntries.filter(e => {
      const entryDate = new Date(e.checkIn)
      return entryDate >= startDate && entryDate <= endDate
    })
  }, [timeEntries, filter, viewDate])

  // Calculate totals per employee
  const employeeTotals = useMemo(() => {
    const totals = {}
    employees.forEach(emp => {
      totals[emp.id] = { hours: 0, shifts: 0, incomplete: 0 }
    })

    filteredEntries.forEach(entry => {
      if (entry.checkOut) {
        const hours = (new Date(entry.checkOut) - new Date(entry.checkIn)) / (1000 * 60 * 60)
        totals[entry.employeeId].hours += hours
        totals[entry.employeeId].shifts++
      } else {
        totals[entry.employeeId].incomplete++
      }
    })

    return totals
  }, [filteredEntries, employees])

  const handleExport = () => {
    const headers = ['Employee Name', 'Date', 'Check-In Time', 'Check-Out Time', 'Hours Worked']
    const rows = filteredEntries.map(entry => {
      const emp = employees.find(e => e.id === entry.employeeId)
      const checkIn = new Date(entry.checkIn)
      const checkOut = entry.checkOut ? new Date(entry.checkOut) : null
      const hours = checkOut ? ((checkOut - checkIn) / (1000 * 60 * 60)).toFixed(2) : 'N/A'

      return [
        emp?.name || 'Unknown',
        entry.date,
        checkIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        checkOut ? checkOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        hours,
      ]
    })

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `timesheet-${viewDate.toISOString().split('T')[0]}.csv`
    a.click()
  }

  const handleReset = () => {
    if (confirm('Reset all data to demo? This cannot be undone.')) {
      resetToDemoData()
      window.location.reload()
    }
  }

  // Generate calendar data
  const calendarData = useMemo(() => {
    const startDate = new Date(viewDate)
    startDate.setDate(1)
    const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate()

    const grid = []
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(startDate.getFullYear(), startDate.getMonth(), day)
      const dateStr = date.toISOString().split('T')[0]
      const dayEntries = timeEntries.filter(e => e.date === dateStr)

      const dayData = {}
      employees.forEach(emp => {
        const entry = dayEntries.find(e => e.employeeId === emp.id)
        if (entry && entry.checkOut) {
          dayData[emp.id] = ((new Date(entry.checkOut) - new Date(entry.checkIn)) / (1000 * 60 * 60)).toFixed(1)
        } else if (entry) {
          dayData[emp.id] = '—'
        } else {
          dayData[emp.id] = ''
        }
      })

      grid.push({ date: dateStr, day, data: dayData })
    }
    return grid
  }, [viewDate, timeEntries, employees])

  // PIN Entry Screen
  if (!authenticated) {
    return (
      <div className="page admin-auth">
        <div className="auth-box">
          <h1>Admin Access</h1>
          <p>Enter PIN to continue</p>
          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            placeholder="PIN"
            maxLength={4}
            onKeyDown={e => e.key === 'Enter' && handlePinSubmit()}
          />
          <button className="btn-primary" onClick={handlePinSubmit}>
            Enter
          </button>
          <button className="nav-link" onClick={() => navigate('/checkin')}>
            ← Back to Check In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page admin-page">
      <header className="page-header">
        <h1>Admin Dashboard</h1>
        <button className="btn-secondary" onClick={() => setAuthenticated(false)}>
          Lock
        </button>
      </header>

      <div className="filters">
        <div className="filter-group">
          <button
            className={filter === 'day' ? 'active' : ''}
            onClick={() => setFilter('day')}
          >
            Day
          </button>
          <button
            className={filter === 'week' ? 'active' : ''}
            onClick={() => setFilter('week')}
          >
            Week
          </button>
          <button
            className={filter === 'month' ? 'active' : ''}
            onClick={() => setFilter('month')}
          >
            Month
          </button>
        </div>

        <input
          type="date"
          value={viewDate.toISOString().split('T')[0]}
          onChange={e => setViewDate(new Date(e.target.value))}
        />
      </div>

      <div className="admin-actions">
        <button className="btn-secondary" onClick={() => setShowCalendar(!showCalendar)}>
          {showCalendar ? 'Show Table' : 'Show Calendar'}
        </button>
        <button className="btn-secondary" onClick={handleExport}>
          Export CSV
        </button>
        <button className="btn-danger" onClick={handleReset}>
          Reset Demo Data
        </button>
      </div>

      {!showCalendar ? (
        <div className="summary-table">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Hours</th>
                <th>Shifts</th>
                <th>Incomplete</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} className={employeeTotals[emp.id].incomplete > 0 ? 'incomplete' : ''}>
                  <td>{emp.name}</td>
                  <td>{employeeTotals[emp.id].hours.toFixed(1)}</td>
                  <td>{employeeTotals[emp.id].shifts}</td>
                  <td>
                    {employeeTotals[emp.id].incomplete > 0 && (
                      <span className="badge warning">{employeeTotals[emp.id].incomplete}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td><strong>Total</strong></td>
                <td>
                  {Object.values(employeeTotals).reduce((sum, t) => sum + t.hours, 0).toFixed(1)}
                </td>
                <td>
                  {Object.values(employeeTotals).reduce((sum, t) => sum + t.shifts, 0)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="calendar-view">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                {calendarData.slice(0, 14).map(d => (
                  <th key={d.date} className={d.day === viewDate.getDate() ? 'today' : ''}>
                    {d.day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td className="emp-name">{emp.name}</td>
                  {calendarData.slice(0, 14).map(d => (
                    <td
                      key={d.date}
                      className={`${d.data[emp.id] === '—' ? 'incomplete' : ''} ${d.data[emp.id] && d.data[emp.id] !== '—' ? 'has-hours' : ''}`}
                    >
                      {d.data[emp.id]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <nav className="bottom-nav">
        <button className="nav-link" onClick={() => navigate('/checkin')}>
          ← Back to Check In
        </button>
      </nav>
    </div>
  )
}

export default Admin
```

**Step 2: Create Admin.css**

```css
.admin-page {
  padding-bottom: 80px;
}

.admin-page .page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-secondary {
  padding: 10px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.btn-danger {
  padding: 10px 16px;
  background: var(--error);
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  background: var(--surface);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.filter-group button {
  padding: 10px 16px;
  background: var(--surface);
  border: none;
  font-size: 14px;
}

.filter-group button.active {
  background: var(--primary);
  color: white;
}

.filters input[type="date"] {
  padding: 10px 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
}

.admin-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

/* Table */
.summary-table {
  background: var(--surface);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.summary-table table {
  width: 100%;
  border-collapse: collapse;
}

.summary-table th,
.summary-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.summary-table th {
  background: var(--background);
  font-weight: 600;
}

.summary-table tr.incomplete {
  background: rgba(197, 48, 48, 0.05);
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.badge.warning {
  background: var(--warning);
  color: white;
}

/* Calendar */
.calendar-view {
  background: var(--surface);
  border-radius: var(--border-radius);
  overflow: auto;
  box-shadow: var(--shadow);
}

.calendar-view table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.calendar-view th,
.calendar-view td {
  padding: 12px 8px;
  text-align: center;
  border: 1px solid var(--border);
}

.calendar-view th {
  background: var(--background);
  font-weight: 600;
}

.calendar-view th.today {
  background: var(--primary);
  color: white;
}

.calendar-view .emp-name {
  text-align: left;
  font-weight: 500;
  min-width: 120px;
}

.calendar-view td.has-hours {
  background: rgba(0, 133, 90, 0.1);
}

.calendar-view td.incomplete {
  background: rgba(197, 48, 48, 0.1);
  color: var(--error);
}

/* Auth */
.admin-auth {
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-box {
  background: var(--surface);
  padding: 40px;
  border-radius: var(--border-radius);
  text-align: center;
  max-width: 320px;
  width: 100%;
  box-shadow: var(--shadow);
}

.auth-box h1 {
  margin-bottom: 8px;
}

.auth-box p {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.auth-box input {
  width: 100%;
  padding: 16px;
  font-size: 24px;
  text-align: center;
  border: 2px solid var(--border);
  border-radius: 8px;
  margin-bottom: 16px;
  letter-spacing: 8px;
}

.auth-box input:focus {
  outline: none;
  border-color: var(--primary);
}

.auth-box .btn-primary {
  margin-bottom: 16px;
}
```

**Step 3: Commit**

```bash
git add src/pages/Admin.jsx src/pages/Admin.css
git commit -m "feat: add admin dashboard with PIN, filters, table, calendar, export"
```

---

## Task 6: Final Verification & Git Setup

**Step 1: Test the app**

```bash
npm run build
npm run preview
```

**Step 2: Verify all routes work**

- `/checkin` - Employee grid, check-in works
- `/checkout` - Edge cases handled
- `/admin` - PIN (1234), filters, calendar, export

**Step 3: Commit and push**

```bash
git add .
git commit -m "feat: complete timesheet app with all features"
git branch -M main
git remote add origin https://github.com/username/timesheet-app.git
git push -u origin main
```

---

## Plan Complete

**Tasks Summary:**
1. ✅ Initialize Vite + React project
2. ✅ Create localStorage data layer with demo data
3. ✅ Build Check-In page
4. ✅ Build Check-Out page with edge cases
5. ✅ Build Admin dashboard with all features
6. ✅ Verify and push to git
