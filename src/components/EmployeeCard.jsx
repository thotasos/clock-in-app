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
