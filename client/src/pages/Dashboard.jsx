import { useEffect, useState, useCallback } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import FilterBar from '../components/FilterBar';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, pagination, loading, error, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', sortBy: 'createdAt', order: 'desc' });
  const [editTask, setEditTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    const params = { page, limit: 9 };
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    params.sortBy = filters.sortBy;
    params.order = filters.order;
    fetchTasks(params);
  }, [filters, page, fetchTasks]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [filters]);

  const handleSave = async (data) => {
    if (editTask) {
      await updateTask(editTask._id, data);
    } else {
      await createTask(data);
    }
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await deleteTask(id);
    load();
  };

  const openCreate = () => { setEditTask(null); setShowModal(true); };
  const openEdit = (task) => { setEditTask(task); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditTask(null); };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  const totalTasks = pagination.total;
  const doneTasks = tasks.filter((t) => t.status === 'Done').length;
  const highPriority = tasks.filter((t) => t.priority === 'High').length;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '26px',
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
        }}>
          Good {greeting},{' '}
          <span style={{ color: 'var(--accent)' }}>{user?.name?.split(' ')[0]}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Here's what's on your plate today.
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '28px',
      }}>
        {[
          { label: 'Total Tasks', value: totalTasks, color: 'var(--accent)' },
          { label: 'Completed', value: doneTasks, color: '#22c55e' },
          { label: 'High Priority', value: highPriority, color: '#ef4444' },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
            }}
          >
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              {s.label}
            </p>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '28px',
              color: s.color,
            }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Actions Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px',
      }}>
        <FilterBar filters={filters} onChange={setFilters} />
        <button onClick={openCreate} className="btn-primary">
          + New Task
        </button>
      </div>

      {/* Task Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px',
          }} />
          Loading your tasks...
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>
          {error}
        </div>
      ) : tasks.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--text-muted)',
        }}>
          <p style={{ fontSize: '32px', marginBottom: '12px' }}>📭</p>
          <p style={{ fontSize: '15px' }}>
            {filters.search || filters.status || filters.priority
              ? 'No tasks match your filters.'
              : 'No tasks yet. Create your first one!'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '14px',
        }}>
          {tasks.map((t) => (
            <TaskCard key={t._id} task={t} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '28px' }}>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius)',
                border: p === page ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: p === page ? 'var(--accent-dim)' : 'transparent',
                color: p === page ? 'var(--accent)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <TaskModal task={editTask} onClose={closeModal} onSave={handleSave} />
      )}
    </div>
  );
}
