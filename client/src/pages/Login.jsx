import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ email, password });
      login(data);
      toast.success('Logged in!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-3" type="email" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="form-control mb-3" type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn btn-primary w-100" type="submit">Login</button>
      </form>
      <p className="mt-3">No account? <Link to="/register">Register</Link></p>
    </div>
  );
}

export default Login;