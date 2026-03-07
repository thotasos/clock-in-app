import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAppData, addTimeEntry, generateId, getTheme, setTheme } from '../utils/storage'
import EmployeeCard from '../components/EmployeeCard'
import './CheckIn.css'

function CheckIn() {
  const [selectedId, setSelectedId] = useState(null)
  const [success, setSuccess] = useState(null)
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
        <div className="header-top">
          <div>
            <h1>Check In</h1>
            <p>Select your name to clock in</p>
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
