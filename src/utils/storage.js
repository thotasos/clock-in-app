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

export function addEmployee(name) {
  const data = getAppData()
  const newEmployee = {
    id: generateId(),
    name: name.trim(),
  }
  data.employees.push(newEmployee)
  saveAppData(data)
  return newEmployee
}

export function deleteEmployee(id) {
  const data = getAppData()
  data.employees = data.employees.filter(e => e.id !== id)
  saveAppData(data)
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function resetToDemoData() {
  const data = getAppData()
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

      if (Math.random() < 0.2) continue

      const dayOfWeek = date.getDay()
      if (dayOfWeek === 0) continue

      const isShortDay = Math.random() < 0.3
      const hours = isShortDay ? 4 + Math.random() * 2 : 6 + Math.random() * 3

      const checkInHour = 8 + Math.floor(Math.random() * 3)
      const checkIn = new Date(date)
      checkIn.setHours(checkInHour, Math.floor(Math.random() * 60), 0, 0)

      const checkOut = new Date(checkIn)
      checkOut.setHours(checkInHour + Math.floor(hours), Math.floor(Math.random() * 60), 0, 0)

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

  const overnightDate = new Date('2026-02-15')
  overnightDate.setHours(22, 0, 0, 0)
  const overnightCheckOut = new Date(overnightDate)
  overnightCheckOut.setHours(6, 0, 0, 0)
  overnightCheckOut.setDate(overnightCheckOut.getDate() + 1)

  entries.push({
    id: generateId(),
    employeeId: '3',
    date: '2026-02-15',
    checkIn: overnightDate.toISOString(),
    checkOut: overnightCheckOut.toISOString(),
  })

  return entries
}
