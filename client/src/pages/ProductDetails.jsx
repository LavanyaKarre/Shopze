import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchProduct, addToCartApi, addReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

function Stars({ value }) {
  return (
    <span style={{ color: 'var(--mustard)', letterSpacing: 2 }}>
      {'★'.repeat(Math.round(value))}<span style={{ color: 'var(--line)' }}>{'★'.repeat(5 - Math.round(value))}</span>
    </span>
  );
}

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await fetchProduct(id);
      setProduct(data);
    } catch {
      toast.error('Product not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const requireLogin = () => {
    if (!user) { toast.info('Please log in first'); navigate('/login'); return false; }
    return true;
  };

  const handleAddToCart = async () => {
    if (!requireLogin()) return;
    try {
      await addToCartApi(product._id, qty);
      await refreshCart();
      toast.success('Added to cart');
    } catch { toast.error('Could not add to cart'); }
  };

  // "Shop Now" -> add to cart then go straight to checkout
  const handleShopNow = async () => {
    if (!requireLogin()) return;
    try {
      await addToCartApi(product._id, qty);
      await refreshCart();
      navigate('/checkout');
    } catch { toast.error('Something went wrong'); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!requireLogin()) return;
    try {
      await addReview(product._id, review);
      toast.success('Review posted');
      setReview({ rating: 5, comment: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not post review');
    }
  };

  if (loading || !product) return <div className="spinner" />;

  const final = Math.round(product.price * (1 - product.discount / 100));

  return (
    <div className="container section">
      <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 20, paddingLeft: 0 }}>← Back</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }} className="pd-grid">
        {/* Image */}
        <div className="card rise" style={{ overflow: 'hidden', padding: 0 }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: 480, objectFit: 'cover' }} />
        </div>

        {/* Info */}
        <div className="rise" style={{ animationDelay: '0.1s' }}>
          <span className="tag tag-forest">{product.category}</span>
          <h1 style={{ fontSize: '2.4rem', margin: '14px 0 10px' }}>{product.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <Stars value={product.rating} />
            <span className="muted" style={{ fontSize: '0.9rem' }}>{product.rating?.toFixed(1)} · {product.numReviews} reviews</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: '2rem', fontWeight: 700 }}>{inr(final)}</span>
            {product.discount > 0 && (
              <>
                <span className="strike" style={{ fontSize: '1.1rem' }}>{inr(product.price)}</span>
                <span className="tag tag-accent">Save {product.discount}%</span>
              </>
            )}
          </div>

          <p style={{ color: 'var(--ink-soft)', marginBottom: 24, lineHeight: 1.7 }}>{product.description}</p>

          <div style={{ marginBottom: 24 }}>
            {product.stock > 0
              ? <span className="tag tag-forest">In stock · {product.stock} available</span>
              : <span className="tag tag-accent">Out of stock</span>}
          </div>

          {/* quantity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <span style={{ fontWeight: 600 }}>Quantity</span>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--line)', borderRadius: 999, overflow: 'hidden' }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: 'none', padding: '8px 16px', fontSize: '1.1rem' }}>−</button>
              <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 600 }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ background: 'none', padding: '8px 16px', fontSize: '1.1rem' }}>+</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleShopNow} disabled={product.stock === 0}>
              Shop Now
            </button>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={handleAddToCart} disabled={product.stock === 0}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div style={{ marginTop: 64, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48 }} className="pd-grid">
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: 20 }}>Customer Reviews</h2>
          {product.reviews.length === 0 ? (
            <p className="muted">No reviews yet. Be the first to review this product.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {product.reviews.map((r) => (
                <div key={r._id} className="card" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{r.name || 'Anonymous'}</strong>
                    <Stars value={r.rating} />
                  </div>
                  <p className="muted" style={{ marginTop: 8 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: 20 }}>Write a Review</h2>
          <form onSubmit={submitReview} className="card" style={{ padding: 24 }}>
            <div className="field">
              <label>Rating</label>
              <select className="select" value={review.rating} onChange={(e) => setReview({ ...review, rating: e.target.value })}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Comment</label>
              <textarea className="textarea" value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} required />
            </div>
            <button className="btn btn-dark btn-block">Post Review</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
