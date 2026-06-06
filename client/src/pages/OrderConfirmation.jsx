import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchOrder } from '../services/api';

const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder(id)
      .then(({ data }) => setOrder(data))
      .catch(() => toast.error('Could not load order'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" />;
  if (!order) return <div className="empty"><h3>Order not found</h3></div>;

  return (
    <div className="container section" style={{ maxWidth: 760 }}>
      <div className="rise center" style={{ marginBottom: 32 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: 'var(--forest)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '2rem',
        }}>✓</div>
        <h1 style={{ fontSize: '2.2rem' }}>Order Confirmed!</h1>
        <p className="muted">Thank you for your purchase. Your order has been placed successfully.</p>
        <p className="muted" style={{ fontSize: '0.85rem', marginTop: 4 }}>Order ID: {order._id}</p>
      </div>

      <div className="card" style={{ padding: 28 }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: 18 }}>Order Details</h3>

        {/* items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          {order.items.map((i, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <img src={i.image} alt={i.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{i.name}</div>
                <div className="muted" style={{ fontSize: '0.85rem' }}>Qty {i.quantity} × {inr(i.price)}</div>
              </div>
              <span style={{ fontWeight: 600 }}>{inr(i.price * i.quantity)}</span>
            </div>
          ))}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '8px 0 16px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Shipping To</h4>
            <p style={{ fontSize: '0.92rem' }}>{order.shippingAddress.fullName}</p>
            <p className="muted" style={{ fontSize: '0.9rem' }}>{order.shippingAddress.address}</p>
            <p className="muted" style={{ fontSize: '0.9rem' }}>{order.shippingAddress.city} — {order.shippingAddress.postalCode}</p>
            <p className="muted" style={{ fontSize: '0.9rem' }}>📞 {order.shippingAddress.phone}</p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Payment & Status</h4>
            <p style={{ fontSize: '0.92rem' }}>{order.paymentMethod}</p>
            <span className="tag tag-forest" style={{ marginTop: 6 }}>{order.status}</span>
            {order.notes && <p className="muted" style={{ fontSize: '0.85rem', marginTop: 8 }}>Note: {order.notes}</p>}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '16px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong>Total Paid</strong><strong style={{ fontSize: '1.3rem' }}>{inr(order.totalPrice)}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center' }}>
        <Link to="/profile" className="btn btn-dark">View My Orders</Link>
        <Link to="/" className="btn btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;
