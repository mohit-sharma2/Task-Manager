import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Navbar({ darkMode, toggleDark }) {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(12px)',
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '20px',
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}>
          Task<span style={{ color: 'var(--accent)' }}>Manager</span>
        </span>
      </Link>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {user.name}
          </span>
          <button
            onClick={toggleDark}
            className="btn-ghost"
            style={{ padding: '6px 12px', fontSize: '15px' }}
            title="Toggle theme"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={logout} className="btn-ghost">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
