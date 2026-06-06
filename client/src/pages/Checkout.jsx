import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchCart, placeOrder } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
const priceOf = (p) => Math.round(p.price * (1 - p.discount / 100));

function Checkout() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  const [ship, setShip] = useState({ fullName: user?.name || '', address: '', city: '', postalCode: '', phone: '' });
  const [payment, setPayment] = useState('Cash on Delivery');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchCart()
      .then(({ data }) => {
        const valid = (data.items || []).filter((i) => i.product);
        setItems(valid);
        if (valid.length === 0) { toast.info('Your cart is empty'); navigate('/'); }
      })
      .catch(() => toast.error('Could not load cart'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  const subtotal = items.reduce((s, i) => s + priceOf(i.product) * i.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 49;
  const total = subtotal + shipping;

  const submit = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const orderItems = items.map((i) => ({
        product: i.product._id,
        name: i.product.name,
        image: i.product.image,
        price: priceOf(i.product),
        quantity: i.quantity,
      }));
      const { data } = await placeOrder({
        items: orderItems,
        shippingAddress: ship,
        paymentMethod: payment,
        notes,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        totalPrice: total,
      });
      await refreshCart();
      navigate(`/order-confirmation/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="container section">
      <h1 style={{ fontSize: '2.2rem', marginBottom: 28 }}>Checkout</h1>
      <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.9fr', gap: 32 }} className="cart-grid">
        {/* left: forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 18 }}>Shipping Address</h3>
            <div className="field">
              <label>Full name</label>
              <input className="input" required value={ship.fullName} onChange={(e) => setShip({ ...ship, fullName: e.target.value })} />
            </div>
            <div className="field">
              <label>Address</label>
              <input className="input" required value={ship.address} onChange={(e) => setShip({ ...ship, address: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="field">
                <label>City</label>
                <input className="input" required value={ship.city} onChange={(e) => setShip({ ...ship, city: e.target.value })} />
              </div>
              <div className="field">
                <label>Postal code</label>
                <input className="input" required value={ship.postalCode} onChange={(e) => setShip({ ...ship, postalCode: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label>Phone</label>
              <input className="input" required value={ship.phone} onChange={(e) => setShip({ ...ship, phone: e.target.value })} />
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 18 }}>Payment Method</h3>
            {['Cash on Delivery', 'UPI', 'Credit / Debit Card'].map((m) => (
              <label key={m} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', marginBottom: 10,
                border: `1.5px solid ${payment === m ? 'var(--accent)' : 'var(--line)'}`, borderRadius: 10, cursor: 'pointer',
                background: payment === m ? 'rgba(214,73,47,0.05)' : 'transparent',
              }}>
                <input type="radio" name="payment" checked={payment === m} onChange={() => setPayment(m)} />
                <span style={{ fontWeight: 600 }}>{m}</span>
              </label>
            ))}
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 14 }}>Special Requirements</h3>
            <textarea className="textarea" placeholder="Any delivery notes or product requests (optional)"
              value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        {/* right: order summary */}
        <div className="card" style={{ padding: 24, alignSelf: 'start', position: 'sticky', top: 90 }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 18 }}>Your Order</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {items.map((i) => (
              <div key={i.product._id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <img src={i.product.image} alt={i.product.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ flex: 1, fontSize: '0.88rem' }}>
                  <div style={{ fontWeight: 600 }}>{i.product.name}</div>
                  <div className="muted">Qty {i.quantity}</div>
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{inr(priceOf(i.product) * i.quantity)}</span>
              </div>
            ))}
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '8px 0 14px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span className="muted">Subtotal</span><span>{inr(subtotal)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span className="muted">Shipping</span><span>{shipping === 0 ? 'Free' : inr(shipping)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '14px 0 20px' }}><strong>Total</strong><strong style={{ fontSize: '1.2rem' }}>{inr(total)}</strong></div>
          <button className="btn btn-primary btn-block" disabled={placing}>{placing ? 'Placing order…' : 'Place Order'}</button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
