export default function EmptyState({ icon = '∅', title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h4>{title}</h4>
      <p>{message}</p>
      {action && <div className="mt-16">{action}</div>}
    </div>
  )
}
