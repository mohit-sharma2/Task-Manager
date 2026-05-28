import { useState, useEffect } from 'react';

const empty = { title: '', description: '', dueDate: '', priority: 'Medium', status: 'To-Do' };

export default function TaskModal({ task, onClose, onSave }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate?.split('T')[0] || '',
        priority: task.priority,
        status: task.status,
      });
    } else {
      setForm(empty);
    }
  }, [task]);

  const handle = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    if (!form.title.trim()) return 'Title is required.';
    if (!form.dueDate) return 'Due date is required.';
    return null;
  };

  const submit = async () => {
    const err = validate();
    if (err) return setError(err);
    setError('');
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '16px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="fade-in"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          width: '100%',
          maxWidth: '480px',
        }}
      >
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '18px',
          marginBottom: '20px',
          color: 'var(--text-primary)',
        }}>
          {task ? 'Edit Task' : 'New Task'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Title *
            </label>
            <input
              value={form.title}
              onChange={(e) => handle('title', e.target.value)}
              placeholder="What needs to be done?"
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handle('description', e.target.value)}
              placeholder="Add more context..."
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Due Date *
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => handle('dueDate', e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Priority
              </label>
              <select value={form.priority} onChange={(e) => handle('priority', e.target.value)}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          {task && (
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Status
              </label>
              <select value={form.status} onChange={(e) => handle('status', e.target.value)}>
                <option>To-Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>
          )}

          {error && <p className="error-msg">{error}</p>}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button onClick={submit} className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
