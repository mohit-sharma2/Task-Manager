import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (form.name.trim().length < 2) return 'Name must be at least 2 characters.';
    if (!form.email.includes('@')) return 'Enter a valid email address.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  };

  const submit = async () => {
    const err = validate();
    if (err) return setError(err);
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'radial-gradient(ellipse 60% 50% at 50% -10%, rgba(249,115,22,0.08) 0%, transparent 70%), var(--bg-primary)',
    }}>
      <div className="fade-in" style={{
        width: '100%',
        maxWidth: '400px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px 32px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '28px',
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
          }}>
            Task<span style={{ color: 'var(--accent)' }}>Manager</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
            Create your workspace
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
          {error && <p className="error-msg">{error}</p>}
          <button
            onClick={submit}
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: '4px', padding: '12px', fontSize: '15px' }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
