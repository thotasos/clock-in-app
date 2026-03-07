import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAppData, resetToDemoData, addEmployee, deleteEmployee, getTheme, setTheme } from '../utils/storage'
import './Admin.css'

function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  const [filter, setFilter] = useState('week')
  const [viewDate, setViewDate] = useState(new Date('2026-02-21'))
  const [showCalendar, setShowCalendar] = useState(false)
  const [newEmployeeName, setNewEmployeeName] = useState('')
  const [showEmployees, setShowEmployees] = useState(false)
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

  const handlePinSubmit = () => {
    const data = getAppData()
    if (pin === data.adminPin) {
      setAuthenticated(true)
    } else {
      setPin('')
      alert('Invalid PIN')
    }
  }

  const handleAddEmployee = () => {
    if (newEmployeeName.trim()) {
      addEmployee(newEmployeeName)
      setNewEmployeeName('')
    }
  }

  const handleDeleteEmployee = (id) => {
    if (confirm('Delete this employee? Time entries will be preserved but show as "Unknown".')) {
      deleteEmployee(id)
    }
  }

  const data = getAppData()
  const { employees, timeEntries } = data

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
        <div className="header-top">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button className="btn-secondary" onClick={() => setAuthenticated(false)}>
              Lock
            </button>
          </div>
        </div>
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
        <button className="btn-secondary" onClick={() => setShowEmployees(!showEmployees)}>
          {showEmployees ? 'Hide Employees' : 'Manage Employees'}
        </button>
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

      {showEmployees && (
        <div className="employee-management">
          <h2>Manage Employees</h2>
          <div className="add-employee">
            <input
              type="text"
              value={newEmployeeName}
              onChange={e => setNewEmployeeName(e.target.value)}
              placeholder="Employee name"
              onKeyDown={e => e.key === 'Enter' && handleAddEmployee()}
            />
            <button className="btn-primary" onClick={handleAddEmployee}>
              Add
            </button>
          </div>
          <div className="employee-list">
            {employees.map(emp => (
              <div key={emp.id} className="employee-item">
                <span>{emp.name}</span>
                <button
                  className="btn-danger btn-small"
                  onClick={() => handleDeleteEmployee(emp.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
