const priorityColors = {
  Low: '#22c55e',
  Medium: '#f59e0b',
  High: '#ef4444',
};

const statusColors = {
  'To-Do': '#6366f1',
  'In Progress': '#f97316',
  'Done': '#22c55e',
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const due = new Date(task.dueDate);
  const isOverdue = due < new Date() && task.status !== 'Done';

  return (
    <div
      className="fade-in"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'border-color 0.2s, background 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: '15px',
          color: 'var(--text-primary)',
          lineHeight: 1.3,
        }}>
          {task.title}
        </h3>
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button onClick={() => onEdit(task)} className="btn-ghost" style={{ padding: '4px 10px', fontSize: '12px' }}>
            Edit
          </button>
          <button
            onClick={() => onDelete(task._id)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#ef4444',
              padding: '4px 10px',
              borderRadius: 'var(--radius)',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Del
          </button>
        </div>
      </div>

      {task.description && (
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span
          className="badge"
          style={{
            background: `${priorityColors[task.priority]}20`,
            color: priorityColors[task.priority],
          }}
        >
          {task.priority}
        </span>
        <span
          className="badge"
          style={{
            background: `${statusColors[task.status]}20`,
            color: statusColors[task.status],
          }}
        >
          {task.status}
        </span>
        <span
          style={{
            fontSize: '12px',
            color: isOverdue ? '#ef4444' : 'var(--text-muted)',
            marginLeft: 'auto',
          }}
        >
          {isOverdue ? '⚠ ' : ''}Due {due.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
}
