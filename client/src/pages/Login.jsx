import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

function AuthShell({ title, subtitle, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 72px)' }}>
      <div className="auth-art" style={{
        background: 'linear-gradient(135deg, var(--ink), #3a2c20)', color: 'var(--paper)',
        padding: 56, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 900, fontSize: '1.6rem' }}>
          Shop<span style={{ color: 'var(--accent)' }}>EZ</span>
        </div>
        <div>
          <h1 style={{ fontSize: '2.6rem', lineHeight: 1.1 }}>
            A marketplace<br />made <span style={{ fontStyle: 'italic', color: 'var(--mustard)' }}>simple.</span>
          </h1>
          <p style={{ opacity: 0.75, marginTop: 16, maxWidth: 360 }}>
            Sign in to browse the catalog, manage your cart, and track every order in one place.
          </p>
        </div>
        <p style={{ opacity: 0.5, fontSize: '0.85rem' }}>© {new Date().getFullYear()} ShopEZ</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div className="rise" style={{ width: '100%', maxWidth: 380 }}>
          <h2 style={{ fontSize: '1.9rem' }}>{title}</h2>
          <p className="muted" style={{ marginBottom: 28 }}>{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data);
      toast.success('Welcome back!');
      navigate(data.isAdmin ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your ShopEZ account.">
      <form onSubmit={submit}>
        <div className="field">
          <label>Email</label>
          <input className="input" type="email" required
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="field">
          <label>Password</label>
          <input className="input" type="password" required
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="muted" style={{ marginTop: 20, fontSize: '0.9rem' }}>
        New here? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Create an account</Link>
      </p>
      <div style={{ marginTop: 16, padding: 12, background: 'var(--paper-2)', borderRadius: 8, fontSize: '0.82rem' }} className="muted">
        Demo: admin@shopez.com / admin123 &nbsp;·&nbsp; user@shopez.com / user123
      </div>
    </AuthShell>
  );
}

export default Login;
export { AuthShell };
