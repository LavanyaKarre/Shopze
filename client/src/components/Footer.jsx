function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--line)', marginTop: 80, padding: '48px 0',
      background: 'var(--paper-2)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
        <div>
          <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 900, fontSize: '1.4rem' }}>
            Shop<span style={{ color: 'var(--accent)' }}>EZ</span>
          </div>
          <p className="muted" style={{ maxWidth: 280, marginTop: 8, fontSize: '0.9rem' }}>
            A modern marketplace built with the MERN stack. Discover, shop, and check out with ease.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap' }}>
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Shop</h4>
            <p className="muted" style={{ fontSize: '0.9rem' }}>Electronics</p>
            <p className="muted" style={{ fontSize: '0.9rem' }}>Fashion</p>
            <p className="muted" style={{ fontSize: '0.9rem' }}>Home & Living</p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Company</h4>
            <p className="muted" style={{ fontSize: '0.9rem' }}>About</p>
            <p className="muted" style={{ fontSize: '0.9rem' }}>Contact</p>
            <p className="muted" style={{ fontSize: '0.9rem' }}>Careers</p>
          </div>
        </div>
      </div>
      <div className="container" style={{ marginTop: 32, fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
        © {new Date().getFullYear()} ShopEZ. A student project.
      </div>
    </footer>
  );
}

export default Footer;
