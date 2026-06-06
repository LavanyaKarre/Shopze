import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchProducts, fetchSettings, addToCartApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await fetchProducts({ search, category: activeCat });
      setProducts(data);
    } catch {
      toast.error('Could not load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings()
      .then(({ data }) => setCategories(['All', ...(data.categories || [])]))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 300); // debounce search
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [search, activeCat]);

  const handleAdd = async (product) => {
    if (!user) {
      toast.info('Please log in to add items');
      return navigate('/login');
    }
    try {
      await addToCartApi(product._id, 1);
      await refreshCart();
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error('Could not add to cart');
    }
  };

  return (
    <div>
      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ padding: '72px 24px 56px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 40, alignItems: 'center' }}>
          <div className="rise">
            <span className="tag tag-accent">New season · Curated picks</span>
            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', margin: '16px 0', letterSpacing: '-0.02em' }}>
              Everything you love,<br />
              <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>simply</span> shopped.
            </h1>
            <p className="muted" style={{ fontSize: '1.1rem', maxWidth: 460 }}>
              Browse a hand-picked catalog across electronics, fashion, home and more. Add to cart, check out in seconds.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <a href="#catalog" className="btn btn-primary">Start shopping</a>
              {!user && <button className="btn btn-outline" onClick={() => navigate('/register')}>Create account</button>}
            </div>
          </div>
          <div className="rise" style={{ animationDelay: '0.15s', position: 'relative' }}>
            <div style={{
              borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
              transform: 'rotate(2deg)',
            }}>
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80" alt="Shopping" style={{ width: '100%', height: 420, objectFit: 'cover' }} />
            </div>
            <div style={{
              position: 'absolute', bottom: -18, left: -18, background: 'var(--ink)', color: 'var(--paper)',
              padding: '14px 20px', borderRadius: 12, transform: 'rotate(-3deg)', boxShadow: 'var(--shadow)',
            }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 700 }}>Free shipping</div>
              <div style={{ fontSize: '0.82rem', opacity: 0.8 }}>on orders over ₹999</div>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="container" style={{ paddingBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <h2 style={{ fontSize: '2rem' }}>The Catalog</h2>
          <div style={{ position: 'relative', minWidth: 280 }}>
            <input
              className="input"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 42 }}
            />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="2"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>

        {/* category pills */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className="btn"
              style={{
                padding: '8px 18px', fontSize: '0.88rem',
                background: activeCat === cat ? 'var(--ink)' : 'transparent',
                color: activeCat === cat ? 'var(--paper)' : 'var(--ink)',
                border: activeCat === cat ? '1.5px solid var(--ink)' : '1.5px solid var(--line)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner" />
        ) : products.length === 0 ? (
          <div className="empty"><h3>No products found</h3><p className="muted">Try a different search or category.</p></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {products.map((p, i) => (
              <ProductCard key={p._id} product={p} onAdd={handleAdd} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
