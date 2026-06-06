import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  fetchStats, fetchProducts, createProduct, updateProduct, deleteProduct,
  fetchAllOrders, updateOrderStatus, fetchSettings, updateSettings,
} from '../../services/api';

const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

const blankProduct = { name: '', description: '', price: '', discount: 0, category: '', image: '', stock: 0 };

function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({ totalOrders: 0, totalUsers: 0, revenue: 0 });

  useEffect(() => { fetchStats().then(({ data }) => setStats(data)).catch(() => {}); }, []);

  return (
    <div className="container section">
      <h1 style={{ fontSize: '2.2rem', marginBottom: 8 }}>Admin Dashboard</h1>
      <p className="muted" style={{ marginBottom: 28 }}>Manage your store, products, and orders.</p>

      {/* stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 32 }}>
        {[
          { label: 'Total Revenue', value: inr(stats.revenue), color: 'var(--forest)' },
          { label: 'Total Orders', value: stats.totalOrders, color: 'var(--accent)' },
          { label: 'Registered Users', value: stats.totalUsers, color: 'var(--mustard)' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: 24, borderLeft: `4px solid ${s.color}` }}>
            <div className="muted" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'Fraunces, serif', marginTop: 6 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--line)', marginBottom: 28 }}>
        {['overview', 'products', 'orders', 'settings'].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: 'none', padding: '12px 20px', fontWeight: 600, textTransform: 'capitalize',
            borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
            color: tab === t ? 'var(--accent)' : 'var(--ink-soft)', marginBottom: -1,
          }}>{t}</button>
        ))}
      </div>

      {tab === 'overview' && <Overview />}
      {tab === 'products' && <ProductsTab />}
      {tab === 'orders' && <OrdersTab />}
      {tab === 'settings' && <SettingsTab />}
    </div>
  );
}

/* ---------------- Overview ---------------- */
function Overview() {
  return (
    <div className="card" style={{ padding: 32 }}>
      <h3 style={{ fontSize: '1.4rem', marginBottom: 12 }}>Welcome, Admin 👋</h3>
      <p className="muted" style={{ maxWidth: 560 }}>
        Use the tabs above to manage your catalog, fulfil orders, and configure the homepage banners and categories.
        Switch to <strong>Products</strong> to add a new item, or <strong>Orders</strong> to update delivery status.
      </p>
    </div>
  );
}

/* ---------------- Products ---------------- */
function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(blankProduct);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchProducts().then(({ data }) => setProducts(data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), discount: Number(form.discount), stock: Number(form.stock) };
    try {
      if (editingId) { await updateProduct(editingId, payload); toast.success('Product updated'); }
      else { await createProduct(payload); toast.success('Product added'); }
      setForm(blankProduct); setEditingId(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
  };

  const edit = (p) => {
    setEditingId(p._id);
    setForm({ name: p.name, description: p.description, price: p.price, discount: p.discount, category: p.category, image: p.image, stock: p.stock });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await deleteProduct(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.3fr', gap: 28 }} className="cart-grid">
      {/* form */}
      <form onSubmit={submit} className="card" style={{ padding: 24, alignSelf: 'start', position: 'sticky', top: 90 }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>{editingId ? 'Edit Product' : 'Add Product'}</h3>
        <div className="field"><label>Name</label><input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="field"><label>Image URL</label><input className="input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
        <div className="field"><label>Category</label><input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field"><label>Price (₹)</label><input className="input" type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
          <div className="field"><label>Discount %</label><input className="input" type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} /></div>
        </div>
        <div className="field"><label>Stock</label><input className="input" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
        <div className="field"><label>Description</label><textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <button className="btn btn-primary btn-block">{editingId ? 'Update' : 'Add Product'}</button>
        {editingId && <button type="button" className="btn btn-ghost btn-block" style={{ marginTop: 8 }} onClick={() => { setForm(blankProduct); setEditingId(null); }}>Cancel edit</button>}
      </form>

      {/* list */}
      <div>
        {loading ? <div className="spinner" /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {products.map((p) => (
              <div key={p._id} className="card" style={{ display: 'flex', gap: 14, padding: 14, alignItems: 'center' }}>
                <img src={p.image} alt={p.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div className="muted" style={{ fontSize: '0.85rem' }}>{p.category} · {inr(p.price)} · stock {p.stock}</div>
                </div>
                <button className="btn btn-ghost" onClick={() => edit(p)}>Edit</button>
                <button className="btn btn-ghost" style={{ color: 'var(--accent)' }} onClick={() => remove(p._id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Orders ---------------- */
function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const statuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

  const load = () => { setLoading(true); fetchAllOrders().then(({ data }) => setOrders(data)).finally(() => setLoading(false)); };
  useEffect(load, []);

  const changeStatus = async (id, status) => {
    try { await updateOrderStatus(id, status); toast.success('Status updated'); load(); }
    catch { toast.error('Update failed'); }
  };

  if (loading) return <div className="spinner" />;
  if (orders.length === 0) return <div className="empty"><h3>No orders yet</h3></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {orders.map((o) => (
        <div key={o._id} className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 10 }}>
            <div>
              <strong>#{o._id.slice(-8)}</strong>
              <span className="muted" style={{ fontSize: '0.85rem', marginLeft: 10 }}>
                {o.user?.name} · {fmtDate(o.createdAt)}
              </span>
            </div>
            <strong style={{ fontSize: '1.1rem' }}>{inr(o.totalPrice)}</strong>
          </div>
          <div className="muted" style={{ fontSize: '0.88rem', marginBottom: 10 }}>
            {o.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
          </div>
          <div className="muted" style={{ fontSize: '0.85rem', marginBottom: 12 }}>
            Ship to: {o.shippingAddress.fullName}, {o.shippingAddress.city} · {o.paymentMethod}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status:</span>
            <select className="select" style={{ width: 'auto', padding: '8px 12px' }} value={o.status} onChange={(e) => changeStatus(o._id, e.target.value)}>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Settings (banners + categories) ---------------- */
function SettingsTab() {
  const [categories, setCategories] = useState('');
  const [banners, setBanners] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings().then(({ data }) => {
      setCategories((data.categories || []).join(', '));
      setBanners((data.bannerImages || []).join('\n'));
    }).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    try {
      await updateSettings({
        categories: categories.split(',').map((c) => c.trim()).filter(Boolean),
        bannerImages: banners.split('\n').map((b) => b.trim()).filter(Boolean),
      });
      toast.success('Settings saved');
    } catch { toast.error('Save failed'); }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="card" style={{ padding: 28, maxWidth: 640 }}>
      <h3 style={{ fontSize: '1.3rem', marginBottom: 18 }}>Store Settings</h3>
      <div className="field">
        <label>Categories (comma separated)</label>
        <input className="input" value={categories} onChange={(e) => setCategories(e.target.value)} placeholder="Electronics, Fashion, Home" />
      </div>
      <div className="field">
        <label>Banner image URLs (one per line)</label>
        <textarea className="textarea" style={{ minHeight: 120 }} value={banners} onChange={(e) => setBanners(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={save}>Save Settings</button>
    </div>
  );
}

export default AdminDashboard;
