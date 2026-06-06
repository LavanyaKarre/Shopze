import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchCart, updateCartQty, removeCartItem } from '../services/api';
import { useCart } from '../context/CartContext';

const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
const priceOf = (p) => Math.round(p.price * (1 - p.discount / 100));

function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await fetchCart();
      setItems((data.items || []).filter((i) => i.product)); // skip deleted products
    } catch {
      toast.error('Could not load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const changeQty = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const { data } = await updateCartQty(productId, quantity);
      setItems((data.items || []).filter((i) => i.product));
      refreshCart();
    } catch { toast.error('Update failed'); }
  };

  const remove = async (productId) => {
    try {
      const { data } = await removeCartItem(productId);
      setItems((data.items || []).filter((i) => i.product));
      refreshCart();
      toast.success('Item removed');
    } catch { toast.error('Remove failed'); }
  };

  const subtotal = items.reduce((s, i) => s + priceOf(i.product) * i.quantity, 0);
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 49;

  if (loading) return <div className="spinner" />;

  if (items.length === 0)
    return (
      <div className="empty">
        <h3>Your cart is empty</h3>
        <p className="muted" style={{ marginBottom: 20 }}>Looks like you haven't added anything yet.</p>
        <Link to="/" className="btn btn-primary">Browse products</Link>
      </div>
    );

  return (
    <div className="container section">
      <h1 style={{ fontSize: '2.2rem', marginBottom: 28 }}>Your Cart</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 0.8fr', gap: 32 }} className="cart-grid">
        {/* items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map((item) => (
            <div key={item.product._id} className="card" style={{ display: 'flex', gap: 16, padding: 16, alignItems: 'center' }}>
              <img src={item.product.image} alt={item.product.name}
                style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 10 }} />
              <div style={{ flex: 1 }}>
                <Link to={`/product/${item.product._id}`}><h3 style={{ fontSize: '1.05rem' }}>{item.product.name}</h3></Link>
                <p className="muted" style={{ fontSize: '0.85rem' }}>{item.product.category}</p>
                <p style={{ fontWeight: 700, marginTop: 4 }}>{inr(priceOf(item.product))}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--line)', borderRadius: 999 }}>
                <button onClick={() => changeQty(item.product._id, item.quantity - 1)} style={{ background: 'none', padding: '6px 14px' }}>−</button>
                <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                <button onClick={() => changeQty(item.product._id, item.quantity + 1)} style={{ background: 'none', padding: '6px 14px' }}>+</button>
              </div>
              <button className="btn btn-ghost" onClick={() => remove(item.product._id)} style={{ color: 'var(--accent)' }}>Remove</button>
            </div>
          ))}
        </div>

        {/* summary */}
        <div className="card" style={{ padding: 24, alignSelf: 'start', position: 'sticky', top: 90 }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: 18 }}>Order Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span className="muted">Subtotal</span><span style={{ fontWeight: 600 }}>{inr(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span className="muted">Shipping</span><span style={{ fontWeight: 600 }}>{shipping === 0 ? 'Free' : inr(shipping)}</span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '14px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <strong>Total</strong><strong style={{ fontSize: '1.2rem' }}>{inr(subtotal + shipping)}</strong>
          </div>
          <button className="btn btn-primary btn-block" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
