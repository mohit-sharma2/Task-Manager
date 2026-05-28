export default function FilterBar({ filters, onChange }) {
  const handle = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Search tasks..."
        value={filters.search || ''}
        onChange={(e) => handle('search', e.target.value)}
        style={{ maxWidth: '200px' }}
      />
      <select
        value={filters.status || ''}
        onChange={(e) => handle('status', e.target.value)}
        style={{ maxWidth: '140px' }}
      >
        <option value="">All Status</option>
        <option value="To-Do">To-Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <select
        value={filters.priority || ''}
        onChange={(e) => handle('priority', e.target.value)}
        style={{ maxWidth: '140px' }}
      >
        <option value="">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <select
        value={filters.sortBy || 'createdAt'}
        onChange={(e) => handle('sortBy', e.target.value)}
        style={{ maxWidth: '150px' }}
      >
        <option value="createdAt">Sort: Created</option>
        <option value="dueDate">Sort: Due Date</option>
      </select>
      <select
        value={filters.order || 'desc'}
        onChange={(e) => handle('order', e.target.value)}
        style={{ maxWidth: '130px' }}
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </div>
  );
}
