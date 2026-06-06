import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchMyOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';

const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const statusColor = (s) => ({
  Pending: 'tag-mustard', Confirmed: 'tag-forest', Shipped: 'tag-mustard',
  Delivered: 'tag-forest', Cancelled: 'tag-accent',
}[s] || 'tag-forest');

function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders()
      .then(({ data }) => setOrders(data))
      .catch(() => toast.error('Could not load orders'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container section">
      {/* profile header */}
      <div className="card rise" style={{ padding: 28, display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: 'var(--ink)', color: 'var(--paper)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontFamily: 'Fraunces, serif', fontWeight: 700,
        }}>{user?.name?.[0]?.toUpperCase()}</div>
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>{user?.name}</h1>
          <p className="muted">{user?.email}</p>
        </div>
      </div>

      <h2 style={{ fontSize: '1.6rem', marginBottom: 20 }}>Order History</h2>

      {loading ? (
        <div className="spinner" />
      ) : orders.length === 0 ? (
        <div className="empty">
          <h3>No orders yet</h3>
          <p className="muted" style={{ marginBottom: 20 }}>When you place an order, it'll show up here.</p>
          <Link to="/" className="btn btn-primary">Start shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {orders.map((o) => (
            <div key={o._id} className="card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                <div>
                  <span className="muted" style={{ fontSize: '0.82rem' }}>Order placed {fmtDate(o.createdAt)}</span>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>#{o._id.slice(-8)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className={`tag ${statusColor(o.status)}`}>{o.status}</span>
                  <strong style={{ fontSize: '1.1rem' }}>{inr(o.totalPrice)}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {o.items.map((i, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--paper-2)', padding: '6px 10px', borderRadius: 8 }}>
                    <img src={i.image} alt={i.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6 }} />
                    <span style={{ fontSize: '0.85rem' }}>{i.name} <span className="muted">×{i.quantity}</span></span>
                  </div>
                ))}
              </div>
              <Link to={`/order-confirmation/${o._id}`} className="btn btn-ghost" style={{ marginTop: 12, paddingLeft: 0, color: 'var(--accent)' }}>
                View details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
