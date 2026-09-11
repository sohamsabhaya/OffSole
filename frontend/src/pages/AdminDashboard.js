import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import adminService from '../api/adminService';
import productService from '../api/productService';
import { formatCurrency } from '../utils/formatters';
import Loader from '../components/common/Loader';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

// Site palette — matches OffSole storefront exactly
const ACCENT = '#000000';       // black (nav/brand)
const ACCENT_PURPLE = '#667eea'; // active nav underline accent
const PAGE_BG = '#f8f9fa';
const CARD_BG = '#ffffff';
const BORDER = '#e9ecef';
const TEXT = '#333333';
const MUTED = '#6c757d';

const BRAND_PALETTE = ['#667eea', '#000000', '#764ba2', '#495057', '#28a745', '#dc3545', '#fd7e14', '#17a2b8', '#6f42c1'];
const PIE_GENDER  = ['#000000', '#667eea', '#495057'];
const PIE_COLOUR  = ['#343a40', '#adb5bd', '#667eea', '#764ba2', '#fd7e14', '#dc3545', '#28a745', '#17a2b8'];

const monthShort = (yyyymm) => {
  const [y, m] = yyyymm.split('-');
  return new Date(Number(y), Number(m) - 1).toLocaleString('default', { month: 'short', year: '2-digit' });
};

const pill = (label, bg, color) => (
  <span style={{ background: bg, color, padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: 0.2 }}>
    {label}
  </span>
);

const StatusPill = ({ status }) => {
  const cfg = {
    delivered:  { bg: '#d1fae5', color: '#065f46' },
    shipped:    { bg: '#dbeafe', color: '#1e40af' },
    processing: { bg: '#fef9c3', color: '#854d0e' },
    cancelled:  { bg: '#fee2e2', color: '#991b1b' },
  }[status] || { bg: '#f3f4f6', color: '#374151' };
  return pill(status.charAt(0).toUpperCase() + status.slice(1), cfg.bg, cfg.color);
};

// Shared card wrapper
const Card = ({ children, style = {}, padding = '20px 24px' }) => (
  <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', ...style }}>
    {children}
  </div>
);

// Section heading inside dashboard
const SectionTitle = ({ children }) => (
  <h2 style={{ fontSize: 15, fontWeight: 700, color: TEXT, margin: '0 0 18px', letterSpacing: 0.1 }}>{children}</h2>
);

// Custom tooltip matching light theme
const ChartTooltip = ({ active, payload, label, currency }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: TEXT, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
      {label && <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || TEXT }}>
          {p.name}: <strong>{currency ? formatCurrency(p.value) : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { isAuthenticated, isAdmin, user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [salesLog, setSalesLog] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState(null);

  // Product modal
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const emptyForm = {
    name: '', brand: '', price: '', description: '',
    image: '/media/sneakers/images/nike_air_max_270.jpg',
    gender: 'Unisex', colour: '',
    available_sizes: { UK6: true, UK7: true, UK8: true, UK9: true, UK10: true, UK11: true },
  };
  const [formData, setFormData] = useState(emptyForm);

  // Sales log filters
  const [logSearch, setLogSearch] = useState('');
  const [logBrand, setLogBrand] = useState('All');

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) navigate('/login');
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [s, p, a, l] = await Promise.all([
        adminService.getStats(),
        productService.getProducts(),
        adminService.getAnalytics(),
        adminService.getSalesLog(),
      ]);
      setStats(s);
      setProducts(p.products || []);
      setAnalytics(a);
      setSalesLog(l.logs || []);
    } catch {
      showToast('danger', 'Could not load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (isAuthenticated && isAdmin) load(); }, [isAuthenticated, isAdmin, load]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  // Product CRUD
  const openAdd = () => { setEditingProduct(null); setFormData(emptyForm); setShowModal(true); };
  const openEdit = (p) => {
    setEditingProduct(p);
    setFormData({ name: p.name || '', brand: p.brand || '', price: p.price || '', description: p.description || '', image: p.image || '', gender: p.gender || 'Unisex', colour: p.colour || '', available_sizes: p.available_sizes || emptyForm.available_sizes });
    setShowModal(true);
  };
  const handleSave = async () => {
    try {
      const payload = { ...formData, price: parseFloat(formData.price) };
      if (editingProduct) { await adminService.updateProduct(editingProduct.id, payload); showToast('success', `"${formData.name}" updated.`); }
      else { await adminService.createProduct(payload); showToast('success', `"${formData.name}" added.`); }
      setShowModal(false);
      load();
    } catch { showToast('danger', 'Save failed — check all fields.'); }
  };
  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try { await adminService.deleteProduct(p.id); showToast('success', `"${p.name}" removed.`); load(); }
    catch { showToast('danger', 'Delete failed.'); }
  };

  const handleLogout = async () => { await logout(); navigate('/login'); };

  // Filtered log
  const brands = ['All', ...new Set(salesLog.map(l => l.brand))];
  const filteredLog = salesLog.filter(l => {
    const q = logSearch.toLowerCase();
    return (logBrand === 'All' || l.brand === logBrand)
      && (!q || [l.product, l.buyer, l.order_number].some(f => f.toLowerCase().includes(q)));
  });

  if (authLoading || loading) return <Loader />;

  const TABS = [
    { key: 'overview',  label: 'Overview' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'sales-log', label: 'Sales Log' },
    { key: 'catalog',   label: 'Catalog' },
    { key: 'orders',    label: 'Orders' },
  ];

  const inputStyle = {
    width: '100%', border: `1px solid ${BORDER}`, borderRadius: 7,
    padding: '9px 13px', fontSize: 14, color: TEXT, background: PAGE_BG, outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.4 };

  return (
    <div style={{ minHeight: '100vh', background: PAGE_BG, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: TEXT }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, background: toast.type === 'success' ? '#d1fae5' : '#fee2e2', color: toast.type === 'success' ? '#065f46' : '#991b1b', border: `1px solid ${toast.type === 'success' ? '#6ee7b7' : '#fca5a5'}`, padding: '11px 20px', borderRadius: 8, fontWeight: 600, fontSize: 14, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
          {toast.msg}
        </div>
      )}

      {/* Top bar — matches OffSole black navbar */}
      <header style={{ background: ACCENT, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {/* OffSole brand — links to storefront */}
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 900, fontSize: 20, letterSpacing: 1.5, fontFamily: "'Arial Black', sans-serif", textTransform: 'uppercase' }}>
            OffSole
          </Link>
          <span style={{ color: '#555', fontSize: 13 }}>/</span>
          <span style={{ color: '#ccc', fontSize: 14, fontWeight: 500 }}>Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={openAdd} style={{ background: ACCENT_PURPLE, border: 'none', color: '#fff', padding: '7px 18px', borderRadius: 7, fontWeight: 600, fontSize: 13, cursor: 'pointer', letterSpacing: 0.2 }}>
            + Add Sneaker
          </button>
          <span style={{ color: '#aaa', fontSize: 13 }}>{user}</span>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #444', color: '#ccc', padding: '6px 14px', borderRadius: 7, fontSize: 13, cursor: 'pointer' }}>
            Log out
          </button>
        </div>
      </header>

      {/* Tab strip */}
      <nav style={{ background: CARD_BG, borderBottom: `1px solid ${BORDER}`, display: 'flex', padding: '0 32px' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            background: 'none', border: 'none', borderBottom: activeTab === t.key ? `2px solid ${ACCENT_PURPLE}` : '2px solid transparent',
            color: activeTab === t.key ? ACCENT_PURPLE : MUTED, fontWeight: activeTab === t.key ? 700 : 500,
            padding: '14px 20px', cursor: 'pointer', fontSize: 14, transition: 'color 0.15s',
          }}>{t.label}</button>
        ))}
      </nav>

      <div style={{ padding: '28px 32px', maxWidth: 1300, margin: '0 auto' }}>

        {/* ── OVERVIEW ─────────────────────────────────────────── */}
        {activeTab === 'overview' && stats && (
          <>
            {/* 4 stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Total Revenue', val: formatCurrency(stats.total_revenue), sub: 'all time' },
                { label: 'Total Orders', val: stats.total_orders, sub: 'placed' },
                { label: 'Customers', val: stats.total_users, sub: 'registered' },
                { label: 'Products', val: stats.total_products, sub: 'in catalog' },
              ].map((c, i) => (
                <Card key={i} padding="20px 22px">
                  <div style={{ fontSize: 12, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{c.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: TEXT, lineHeight: 1.1 }}>{c.val}</div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{c.sub}</div>
                  <div style={{ height: 3, background: ACCENT_PURPLE, borderRadius: 2, marginTop: 14, width: 36, opacity: 0.5 }} />
                </Card>
              ))}
            </div>

            {/* Monthly revenue bar */}
            {analytics?.monthly_sales?.length > 0 && (
              <Card style={{ marginBottom: 20 }}>
                <SectionTitle>Monthly Revenue</SectionTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={analytics.monthly_sales.map(d => ({ ...d, month: monthShort(d.month) }))} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: MUTED, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: MUTED, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<ChartTooltip currency />} />
                    <Bar dataKey="revenue" name="Revenue" fill={ACCENT_PURPLE} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Brand units horizontal bar */}
            {analytics?.by_brand?.length > 0 && (
              <Card>
                <SectionTitle>Units Sold by Brand</SectionTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={analytics.by_brand} layout="vertical" barSize={16}>
                    <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
                    <XAxis type="number" tick={{ fill: MUTED, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fill: TEXT, fontSize: 13 }} width={108} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="units" radius={[0, 4, 4, 0]}>
                      {analytics.by_brand.map((_, i) => <Cell key={i} fill={BRAND_PALETTE[i % BRAND_PALETTE.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}
          </>
        )}

        {/* ── ANALYTICS ────────────────────────────────────────── */}
        {activeTab === 'analytics' && analytics && (
          <>
            {/* Full monthly bar */}
            <Card style={{ marginBottom: 20 }}>
              <SectionTitle>Monthly Sales Revenue — last 12 months</SectionTitle>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={analytics.monthly_sales.map(d => ({ ...d, month: monthShort(d.month) }))} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: MUTED, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: MUTED, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip currency />} />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill={ACCENT_PURPLE} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Two brand bars side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <Card>
                <SectionTitle>Revenue by Brand</SectionTitle>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={analytics.by_brand} layout="vertical" barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
                    <XAxis type="number" tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                    <YAxis dataKey="name" type="category" tick={{ fill: TEXT, fontSize: 12 }} width={105} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip currency />} />
                    <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                      {analytics.by_brand.map((_, i) => <Cell key={i} fill={BRAND_PALETTE[i % BRAND_PALETTE.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <SectionTitle>Units by Brand</SectionTitle>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={analytics.by_brand} layout="vertical" barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
                    <XAxis type="number" tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fill: TEXT, fontSize: 12 }} width={105} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="units" radius={[0, 4, 4, 0]}>
                      {analytics.by_brand.map((_, i) => <Cell key={i} fill={BRAND_PALETTE[i % BRAND_PALETTE.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Gender + Colour pie */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { title: 'Sales by Gender', data: analytics.by_gender, colors: PIE_GENDER },
                { title: 'Sales by Colour', data: analytics.by_colour, colors: PIE_COLOUR },
              ].map(({ title, data, colors }) => (
                <Card key={title}>
                  <SectionTitle>{title}</SectionTitle>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ResponsiveContainer width="55%" height={190}>
                      <PieChart>
                        <Pie data={data} cx="50%" cy="50%" innerRadius={48} outerRadius={76} dataKey="value" paddingAngle={3}>
                          {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                        </Pie>
                        <Tooltip content={<ChartTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {data.map((d, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: colors[i % colors.length], flexShrink: 0 }} />
                          <span style={{ color: TEXT, fontWeight: 500 }}>{d.name}</span>
                          <span style={{ color: MUTED, marginLeft: 'auto' }}>{d.value} units</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* ── SALES LOG ────────────────────────────────────────── */}
        {activeTab === 'sales-log' && (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <input placeholder="Search order, product, buyer…" value={logSearch} onChange={e => setLogSearch(e.target.value)}
                style={{ ...inputStyle, maxWidth: 280, background: CARD_BG }} />
              <select value={logBrand} onChange={e => setLogBrand(e.target.value)}
                style={{ ...inputStyle, width: 'auto', background: CARD_BG, cursor: 'pointer' }}>
                {brands.map(b => <option key={b}>{b}</option>)}
              </select>
              <span style={{ color: MUTED, fontSize: 13 }}>{filteredLog.length} entries</span>
            </div>
            <Card padding="0">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: PAGE_BG, borderBottom: `1px solid ${BORDER}` }}>
                      {['Order #', 'Date', 'Buyer', 'Product', 'Brand', 'Colour', 'Gender', 'Size', 'Qty', 'Unit Price', 'Total', 'Payment', 'Status'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.4, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLog.length === 0
                      ? <tr><td colSpan={13} style={{ textAlign: 'center', padding: 36, color: MUTED }}>No entries match your filter.</td></tr>
                      : filteredLog.map((r, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8f9fb'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '10px 14px', color: MUTED, fontFamily: 'monospace', fontSize: 12, whiteSpace: 'nowrap' }}>{r.order_number}</td>
                          <td style={{ padding: '10px 14px', color: MUTED, whiteSpace: 'nowrap' }}>{r.date}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>{r.buyer}</td>
                          <td style={{ padding: '10px 14px', minWidth: 160 }}>{r.product}</td>
                          <td style={{ padding: '10px 14px' }}>{pill(r.brand, '#f3f0ff', ACCENT_PURPLE)}</td>
                          <td style={{ padding: '10px 14px', color: MUTED, fontSize: 12 }}>{r.colour}</td>
                          <td style={{ padding: '10px 14px', color: MUTED }}>{r.gender}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>{r.size}</td>
                          <td style={{ padding: '10px 14px', textAlign: 'center' }}>{r.qty}</td>
                          <td style={{ padding: '10px 14px', color: MUTED }}>{formatCurrency(r.price)}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 700 }}>{formatCurrency(r.total)}</td>
                          <td style={{ padding: '10px 14px', color: MUTED, textTransform: 'capitalize' }}>{r.payment_method}</td>
                          <td style={{ padding: '10px 14px' }}><StatusPill status={r.order_status} /></td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {/* ── CATALOG ──────────────────────────────────────────── */}
        {activeTab === 'catalog' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Catalog <span style={{ color: MUTED, fontWeight: 400, fontSize: 14 }}>({products.length} sneakers)</span></h2>
              <button onClick={openAdd} style={{ background: ACCENT, color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 7, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>+ Add sneaker</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {products.map(p => (
                <Card key={p.id} padding="0" style={{ overflow: 'hidden', transition: 'box-shadow 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'}>
                  <div style={{ height: 160, background: PAGE_BG, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none'; }} />
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>{p.brand} · {p.gender}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: 16 }}>{formatCurrency(p.price)}</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(p)} style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, color: TEXT, padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Edit</button>
                        <button onClick={() => handleDelete(p)} style={{ background: '#fff0f0', border: '1px solid #fca5a5', color: '#dc3545', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Delete</button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* ── ORDERS ───────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <>
            <h2 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 700 }}>
              All Orders <span style={{ color: MUTED, fontWeight: 400, fontSize: 14 }}>({stats?.recent_orders?.length || 0})</span>
            </h2>
            <Card padding="0">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: PAGE_BG, borderBottom: `1px solid ${BORDER}` }}>
                      {['Order #', 'Date', 'Customer', 'Items', 'Total', 'Payment', 'Status'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: MUTED, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.4 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(stats?.recent_orders || []).map((o, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8f9fb'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '11px 16px', fontFamily: 'monospace', color: MUTED, fontSize: 12 }}>{o.order_number}</td>
                        <td style={{ padding: '11px 16px', color: MUTED, whiteSpace: 'nowrap' }}>{new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td style={{ padding: '11px 16px', fontWeight: 600 }}>{o.username}</td>
                        <td style={{ padding: '11px 16px', color: MUTED, maxWidth: 260 }}>{(o.items || []).map(it => `${it.name} (${it.size})`).join(', ')}</td>
                        <td style={{ padding: '11px 16px', fontWeight: 700 }}>{formatCurrency(o.total_amount)}</td>
                        <td style={{ padding: '11px 16px', color: MUTED, textTransform: 'capitalize' }}>{o.payment_method}</td>
                        <td style={{ padding: '11px 16px' }}><StatusPill status={o.order_status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

      </div>

      {/* ── MODAL ────────────────────────────────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: CARD_BG, borderRadius: 12, width: '100%', maxWidth: 520, border: `1px solid ${BORDER}`, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ padding: '18px 22px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{editingProduct ? 'Edit sneaker' : 'Add sneaker'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: MUTED, fontSize: 22, cursor: 'pointer', lineHeight: 1, padding: 0 }}>×</button>
            </div>
            <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Name', key: 'name', placeholder: 'e.g. Nike Air Max 97' },
                { label: 'Brand', key: 'brand', placeholder: 'e.g. Nike' },
                { label: 'Price (₹)', key: 'price', placeholder: '12999', type: 'number' },
                { label: 'Description', key: 'description', placeholder: 'Short product description…' },
                { label: 'Image path', key: 'image', placeholder: '/media/sneakers/images/file.jpg' },
                { label: 'Colour', key: 'colour', placeholder: 'e.g. Black / White' },
              ].map(f => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <input type={f.type || 'text'} placeholder={f.placeholder} value={formData[f.key]}
                    onChange={e => setFormData(fd => ({ ...fd, [f.key]: e.target.value }))}
                    style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Gender</label>
                <select value={formData.gender} onChange={e => setFormData(fd => ({ ...fd, gender: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {['Men', 'Women', 'Unisex'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Available sizes</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Object.keys(formData.available_sizes).map(s => (
                    <button key={s} type="button" onClick={() => setFormData(fd => ({ ...fd, available_sizes: { ...fd.available_sizes, [s]: !fd.available_sizes[s] } }))}
                      style={{ padding: '6px 13px', borderRadius: 6, border: `1px solid ${formData.available_sizes[s] ? ACCENT_PURPLE : BORDER}`, background: formData.available_sizes[s] ? '#f3f0ff' : CARD_BG, color: formData.available_sizes[s] ? ACCENT_PURPLE : MUTED, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ padding: '14px 22px', borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, color: TEXT, padding: '9px 20px', borderRadius: 7, cursor: 'pointer', fontWeight: 500, fontSize: 14 }}>Cancel</button>
              <button onClick={handleSave} style={{ background: ACCENT, border: 'none', color: '#fff', padding: '9px 22px', borderRadius: 7, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>{editingProduct ? 'Save changes' : 'Add sneaker'}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 5px; height: 5px; } ::-webkit-scrollbar-track { background: ${PAGE_BG}; } ::-webkit-scrollbar-thumb { background: ${BORDER}; border-radius: 4px; }`}</style>
    </div>
  );
};

export default AdminDashboard;
