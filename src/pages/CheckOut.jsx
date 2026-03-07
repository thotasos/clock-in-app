import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAppData, updateTimeEntry, getActiveEntry, getTheme, setTheme } from '../utils/storage'
import EmployeeCard from '../components/EmployeeCard'
import './CheckOut.css'

function CheckOut() {
  const [selectedId, setSelectedId] = useState(null)
  const [success, setSuccess] = useState(null)
  const [warning, setWarning] = useState(null)
  const [theme, setThemeState] = useState('light')
  const navigate = useNavigate()

  useEffect(() => {
    setThemeState(getTheme())
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    setThemeState(newTheme)
  }

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

    let hoursWorked = (now - checkInTime) / (1000 * 60 * 60)
    if (hoursWorked < 0) {
      hoursWorked += 24
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
        <div className="header-top">
          <div>
            <h1>Check Out</h1>
            <p>Select your name to clock out</p>
          </div>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
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
