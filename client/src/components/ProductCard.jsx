import { Link } from 'react-router-dom';

const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

function ProductCard({ product, onAdd, index = 0 }) {
  const final = Math.round(product.price * (1 - product.discount / 100));
  return (
    <div
      className="card rise"
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', animationDelay: `${index * 0.05}s` }}
    >
      <Link to={`/product/${product._id}`} style={{ position: 'relative', display: 'block' }}>
        <div style={{ aspectRatio: '1/1', overflow: 'hidden', background: 'var(--paper-2)' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>
        {product.discount > 0 && (
          <span style={{
            position: 'absolute', top: 12, left: 12, background: 'var(--accent)', color: '#fff',
            fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: 999,
          }}>-{product.discount}%</span>
        )}
      </Link>

      <div style={{ padding: '16px 16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span className="tag tag-forest" style={{ alignSelf: 'flex-start', marginBottom: 8 }}>{product.category}</span>
        <Link to={`/product/${product._id}`}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.25 }}>{product.name}</h3>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '6px 0 12px', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--mustard)' }}>★</span>
          <span className="muted">{product.rating?.toFixed(1) || '0.0'} · {product.numReviews || 0} reviews</span>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: '1.15rem' }}>{inr(final)}</span>
            {product.discount > 0 && <span className="strike" style={{ marginLeft: 6, fontSize: '0.85rem' }}>{inr(product.price)}</span>}
          </div>
          {onAdd && (
            <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }} onClick={() => onAdd(product)}>
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
