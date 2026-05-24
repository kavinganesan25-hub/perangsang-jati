import { useState, useEffect, useRef, useCallback } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const INITIAL_PRODUCTS = [
  { id: 1, name: "Almari Jati 4 Pintu Antik", category: "Wardrobe", price: 1200, status: "available", condition: "Excellent", desc: "Solid jati wood, hand-carved details. Measurements: 7ft H × 5ft W × 2ft D. Minor surface wear adds character.", tiktokId: "7380921847362910465", tiktokUrl: "https://tiktok.com/@perangsangjatiklang", views: 48200, likes: 3100, comments: 247, postedAt: "2025-05-22", waNumber: "60112345678", synced: true },
  { id: 2, name: "Set Sofa Rotan Vintage 3+1+1", category: "Sofa", price: 680, status: "reserved", condition: "Good", desc: "Full rattan set, original cushions replaced. Very sturdy. Collected from colonial-era bungalow in Klang.", tiktokId: "7380812736491827201", tiktokUrl: "https://tiktok.com/@perangsangjatiklang", views: 31500, likes: 1890, comments: 134, postedAt: "2025-05-21", waNumber: "60112345678", synced: true },
  { id: 3, name: "Meja Makan Kayu Solid 6-Seater", category: "Table", price: 750, status: "available", condition: "Good", desc: "Solid wood dining table + 6 matching chairs. Light scratches on surface, structurally perfect.", tiktokId: "7380701928374651904", tiktokUrl: "https://tiktok.com/@perangsangjatiklang", views: 62100, likes: 4200, comments: 318, postedAt: "2025-05-20", waNumber: "60112345678", synced: true },
  { id: 4, name: "Katil Queen Jati Frame", category: "Bed", price: 550, status: "sold", condition: "Fair", desc: "Queen size jati bed frame. No mattress included. Headboard intact, some age marks on posts.", tiktokId: "7380599817263548416", tiktokUrl: "https://tiktok.com/@perangsangjatiklang", views: 28900, likes: 2100, comments: 189, postedAt: "2025-05-19", waNumber: "60112345678", synced: true },
  { id: 5, name: "Kabinet Kaca Display Antik", category: "Cabinet", price: 420, status: "available", condition: "Excellent", desc: "5-shelf display cabinet with original glass panels. Light wood finish. Perfect for collections.", tiktokId: "7380488726354891776", tiktokUrl: "https://tiktok.com/@perangsangjatiklang", views: 19400, likes: 1320, comments: 87, postedAt: "2025-05-18", waNumber: "60112345678", synced: true },
  { id: 6, name: "Kerusi Malas Kayu + Bantal", category: "Chair", price: 280, status: "available", condition: "Good", desc: "Solid wood recliner armchair with cushion. Very comfortable. Light wear on armrests.", tiktokId: "", tiktokUrl: "", views: 0, likes: 0, comments: 0, postedAt: "2025-05-17", waNumber: "60112345678", synced: false },
];

const MOCK_TIKTOK_VIDEOS = [
  { id: "7380921847362910465", desc: "Almari jati 4 pintu, kondisi gila cantik! Harga RM1200 je 🔥 comment kalau nak tanya", thumb: "🪵", views: 48200, likes: 3100, comments: 247, date: "2h ago", detected: "available", linked: 1 },
  { id: "7380812736491827201", desc: "Set sofa rotan vintage, RESERVED dah! Tapi ada lagi sofa lain nak jual", thumb: "🛋️", views: 31500, likes: 1890, comments: 134, date: "1d ago", detected: "reserved", linked: 2 },
  { id: "7380701928374651904", desc: "Meja makan 6 kerusi kayu solid — siapa nak? Harga berpatutan sangat 👇", thumb: "🪑", views: 62100, likes: 4200, comments: 318, date: "2d ago", detected: "available", linked: 3 },
  { id: "7380599817263548416", desc: "Katil queen jati — TERJUAL! Terima kasih kepada pembeli. Stok baru coming soon 🙏", thumb: "🛏️", views: 28900, likes: 2100, comments: 189, date: "3d ago", detected: "sold", linked: 4 },
  { id: "7380488726354891776", desc: "Kabinet kaca antik, elok gila! 5 tingkat, kaca original masih ok", thumb: "🗄️", views: 19400, likes: 1320, comments: 87, date: "4d ago", detected: "available", linked: 5 },
];

const MOCK_COMMENTS = [
  { id: 1, user: "farah_klang92", text: "sold tak? nak sangat ni!", videoId: "7380921847362910465", product: "Almari Jati 4 Pintu Antik", detected: "sold", time: "2h ago" },
  { id: 2, user: "azman_design", text: "boleh reserved dulu? saya nak tapi sabtu baru free", videoId: "7380812736491827201", product: "Set Sofa Rotan Vintage", detected: "reserved", time: "1d ago" },
  { id: 3, user: "kak_linda99", text: "berapa delivery ke Shah Alam?", videoId: "7380701928374651904", product: "Meja Makan Kayu Solid", detected: null, time: "2d ago" },
  { id: 4, user: "hafiz_furniture", text: "dah terjual ke belum? nak beli cash", videoId: "7380599817263548416", product: "Katil Queen Jati Frame", detected: "sold", time: "3d ago" },
  { id: 5, user: "pn_ros_klang", text: "Cantiknya almari! tempah boleh tak?", videoId: "7380921847362910465", product: "Almari Jati 4 Pintu Antik", detected: "reserved", time: "2h ago" },
  { id: 6, user: "buyer_pj", text: "condition ok ke? nampak ada scratch sikit", videoId: "7380701928374651904", product: "Meja Makan Kayu Solid", detected: null, time: "2d ago" },
];

const CATEGORIES = ["All", "Wardrobe", "Sofa", "Table", "Bed", "Cabinet", "Chair"];
const CONDITIONS = ["Excellent", "Good", "Fair"];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = {
  tiktok: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.98a8.27 8.27 0 004.83 1.54V7.04a4.85 4.85 0 01-1.06-.35z"/>
    </svg>
  ),
  whatsapp: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  sync: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/>
      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
    </svg>
  ),
  eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  heart: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  grid: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  list: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  x: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  chevron: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  comment: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  zap: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtNum = n => n >= 1000 ? (n / 1000).toFixed(1) + "k" : n;
const statusConfig = {
  available: { label: "Available", color: "#00C896", bg: "rgba(0,200,150,0.12)", dot: "#00C896" },
  reserved:  { label: "Reserved",  color: "#FF9500", bg: "rgba(255,149,0,0.12)",  dot: "#FF9500" },
  sold:      { label: "Sold",      color: "#FF3B5C", bg: "rgba(255,59,92,0.12)",  dot: "#FF3B5C" },
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return { toasts, push };
}

// ─── TOAST RENDERER ───────────────────────────────────────────────────────────
function Toasts({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === "error" ? "#FF3B5C" : t.type === "info" ? "#007AFF" : "#00C896",
          color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600,
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)", animation: "slideUp .3s ease",
          display: "flex", alignItems: "center", gap: 8, minWidth: 220,
        }}>
          {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"} {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status, size = "sm" }) {
  const cfg = statusConfig[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: cfg.bg, color: cfg.color,
      padding: size === "lg" ? "6px 14px" : "4px 10px",
      borderRadius: 99, fontSize: size === "lg" ? 13 : 11,
      fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase",
      border: `1px solid ${cfg.color}30`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, onWA, onView, layout }) {
  const [hovered, setHovered] = useState(false);
  const emojis = { Wardrobe: "🪵", Sofa: "🛋️", Table: "🪑", Bed: "🛏️", Cabinet: "🗄️", Chair: "🪑" };
  const emoji = emojis[product.category] || "📦";

  if (layout === "list") {
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center",
          gap: 20, transition: "all .25s", cursor: "pointer",
          ...(hovered && { background: "rgba(255,255,255,0.07)", borderColor: "rgba(196,149,80,0.3)", transform: "translateX(4px)" }),
        }}
        onClick={() => onView(product)}
      >
        <div style={{ width: 56, height: 56, borderRadius: 12, background: "rgba(196,149,80,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ color: "#F5EFE6", fontWeight: 700, fontSize: 15 }}>{product.name}</span>
            <StatusBadge status={product.status} />
            {product.synced && <span style={{ fontSize: 10, color: "#FF2D55", fontWeight: 700, letterSpacing: ".05em" }}>🎵 TikTok</span>}
          </div>
          <div style={{ color: "rgba(245,239,230,.45)", fontSize: 13, marginTop: 4 }}>{product.category} · {product.condition} condition · <strong style={{ color: "#C49550" }}>RM {product.price.toLocaleString()}</strong></div>
        </div>
        <button onClick={e => { e.stopPropagation(); onWA(product); }} style={{ background: "#00C896", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
          <Icon.whatsapp /> Inquire
        </button>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20, overflow: "hidden", transition: "all .3s cubic-bezier(.23,1,.32,1)", cursor: "pointer",
        ...(hovered && { transform: "translateY(-6px)", boxShadow: "0 24px 60px rgba(0,0,0,.5)", borderColor: "rgba(196,149,80,0.35)" }),
      }}
      onClick={() => onView(product)}
    >
      {/* Thumb */}
      <div style={{ height: 200, background: "linear-gradient(135deg, rgba(196,149,80,.08) 0%, rgba(196,149,80,.18) 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, position: "relative", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {emoji}
        <div style={{ position: "absolute", top: 12, left: 12 }}><StatusBadge status={product.status} /></div>
        {product.synced && (
          <div style={{ position: "absolute", top: 12, right: 12, background: "#010101", border: "1px solid #FF2D5530", color: "#FF2D55", padding: "3px 8px", borderRadius: 8, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
            <Icon.tiktok /> LIVE
          </div>
        )}
        {product.synced && (
          <div style={{ position: "absolute", bottom: 10, right: 12, display: "flex", gap: 10 }}>
            <span style={{ color: "rgba(255,255,255,.5)", fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}><Icon.eye /> {fmtNum(product.views)}</span>
            <span style={{ color: "rgba(255,255,255,.5)", fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}><Icon.heart /> {fmtNum(product.likes)}</span>
          </div>
        )}
      </div>
      {/* Body */}
      <div style={{ padding: "16px 18px 0" }}>
        <div style={{ fontSize: 11, color: "#C49550", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>{product.category} · {product.condition}</div>
        <div style={{ color: "#F5EFE6", fontWeight: 700, fontSize: 16, lineHeight: 1.3, marginBottom: 8 }}>{product.name}</div>
        <div style={{ color: "rgba(245,239,230,.5)", fontSize: 13, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.desc}</div>
      </div>
      {/* Footer */}
      <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ color: "#C49550", fontWeight: 800, fontSize: 20 }}>RM {product.price.toLocaleString()}</span>
        <div style={{ display: "flex", gap: 8 }}>
          {product.synced && (
            <button onClick={e => { e.stopPropagation(); window.open(product.tiktokUrl); }} style={{ background: "rgba(255,45,85,.12)", border: "1px solid rgba(255,45,85,.25)", color: "#FF2D55", width: 36, height: 36, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon.tiktok />
            </button>
          )}
          <button onClick={e => { e.stopPropagation(); onWA(product); }} style={{ background: "#00C896", border: "none", color: "#fff", padding: "0 14px", height: 36, borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon.whatsapp /> Chat
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT MODAL (Detail) ───────────────────────────────────────────────────
function ProductModal({ product, onClose, onWA }) {
  if (!product) return null;
  const emojis = { Wardrobe: "🪵", Sofa: "🛋️", Table: "🪑", Bed: "🛏️", Cabinet: "🗄️", Chair: "🪑" };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(8px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#1A1410", border: "1px solid rgba(196,149,80,0.2)", borderRadius: 24, width: "100%", maxWidth: 540, maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ height: 220, background: "linear-gradient(135deg, rgba(196,149,80,.1), rgba(196,149,80,.22))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, position: "relative" }}>
          {emojis[product.category] || "📦"}
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,.5)", border: "1px solid rgba(255,255,255,.1)", color: "#fff", width: 36, height: 36, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.x /></button>
        </div>
        <div style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: "#C49550", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>{product.category} · {product.condition}</div>
              <h2 style={{ color: "#F5EFE6", fontWeight: 800, fontSize: 22, lineHeight: 1.2, margin: 0 }}>{product.name}</h2>
            </div>
            <StatusBadge status={product.status} size="lg" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#C49550", marginBottom: 16 }}>RM {product.price.toLocaleString()}</div>
          <p style={{ color: "rgba(245,239,230,.65)", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{product.desc}</p>
          {product.synced && (
            <div style={{ background: "rgba(255,45,85,.06)", border: "1px solid rgba(255,45,85,.15)", borderRadius: 14, padding: "14px 18px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Icon.tiktok />
                <span style={{ color: "#FF2D55", fontWeight: 700, fontSize: 13 }}>TikTok Stats</span>
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                <span style={{ color: "rgba(245,239,230,.7)", fontSize: 13 }}><Icon.eye /> {fmtNum(product.views)} views</span>
                <span style={{ color: "rgba(245,239,230,.7)", fontSize: 13 }}><Icon.heart /> {fmtNum(product.likes)} likes</span>
                <span style={{ color: "rgba(245,239,230,.7)", fontSize: 13 }}><Icon.comment /> {product.comments} comments</span>
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => onWA(product)} style={{ flex: 1, background: "#00C896", border: "none", color: "#fff", padding: "14px 0", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Icon.whatsapp /> WhatsApp Inquiry
            </button>
            {product.synced && (
              <button onClick={() => window.open(product.tiktokUrl)} style={{ background: "rgba(255,45,85,.12)", border: "1px solid rgba(255,45,85,.25)", color: "#FF2D55", padding: "14px 20px", borderRadius: 14, fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                <Icon.tiktok /> Watch
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN MODAL ──────────────────────────────────────────────────────────────
function AdminModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product || { name: "", category: "Wardrobe", price: "", status: "available", condition: "Good", desc: "", tiktokId: "", tiktokUrl: "", waNumber: "60112345678", synced: false });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const save = () => {
    if (!form.name || !form.price) return;
    onSave({ ...form, price: parseFloat(form.price), id: form.id || Date.now(), views: form.views || 0, likes: form.likes || 0, comments: form.comments || 0, postedAt: form.postedAt || new Date().toISOString().split("T")[0] });
    onClose();
  };
  const field = { background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "10px 14px", color: "#F5EFE6", fontSize: 14, width: "100%", fontFamily: "inherit", outline: "none" };
  const label = { display: "block", fontSize: 11, color: "#C49550", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(8px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#1C1813", border: "1px solid rgba(196,149,80,.2)", borderRadius: 24, width: "100%", maxWidth: 480, maxHeight: "90vh", overflow: "auto", padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ color: "#F5EFE6", fontWeight: 800, fontSize: 20, margin: 0 }}>{product ? "Edit Item" : "Add New Item"}</h2>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,.07)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.x /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div><label style={label}>Item Name *</label><input style={field} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Almari Jati 4 Pintu" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={label}>Category</label>
              <select style={field} value={form.category} onChange={e => set("category", e.target.value)}>
                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={label}>Condition</label>
              <select style={field} value={form.condition} onChange={e => set("condition", e.target.value)}>
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={label}>Price (RM) *</label><input style={field} type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="500" /></div>
            <div><label style={label}>Status</label>
              <select style={field} value={form.status} onChange={e => set("status", e.target.value)}>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
          <div><label style={label}>Description</label><textarea style={{ ...field, height: 80, resize: "vertical" }} value={form.desc} onChange={e => set("desc", e.target.value)} placeholder="Condition, size, material..." /></div>
          <div><label style={label}>TikTok Video URL</label><input style={field} value={form.tiktokUrl} onChange={e => { set("tiktokUrl", e.target.value); set("synced", !!e.target.value); }} placeholder="https://tiktok.com/@.../video/..." /></div>
          <div><label style={label}>WhatsApp Number</label><input style={field} value={form.waNumber} onChange={e => set("waNumber", e.target.value)} /></div>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button onClick={onClose} style={{ flex: 1, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", color: "#F5EFE6", padding: 14, borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
          <button onClick={save} style={{ flex: 2, background: "linear-gradient(135deg,#C49550,#A07030)", border: "none", color: "#fff", padding: 14, borderRadius: 12, fontWeight: 800, cursor: "pointer", fontSize: 15 }}>Save Item</button>
        </div>
      </div>
    </div>
  );
}

// ─── SYNC LOG COMPONENT ───────────────────────────────────────────────────────
function SyncEngine({ onSyncComplete }) {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([
    { type: "sys", text: "TikTok API bridge ready · @perangsangjatiklang" },
    { type: "sys", text: "Keyword engine: sold · terjual · reserved · tempah · booked · dah sold" },
    { type: "idle", text: "Waiting for sync trigger..." },
  ]);
  const logRef = useRef(null);
  const addLog = (type, text) => {
    setLogs(l => [...l, { type, text, ts: new Date().toLocaleTimeString() }]);
    setTimeout(() => logRef.current && (logRef.current.scrollTop = 999999), 50);
  };
  const runSync = () => {
    if (running) return;
    setRunning(true);
    setLogs([{ type: "sys", text: "── Starting full TikTok sync ──" }]);
    const steps = [
      [400,  "info",  "Authenticating with TikTok API..."],
      [800,  "ok",    "Auth OK · Token valid"],
      [1200, "info",  "Fetching video feed @perangsangjatiklang..."],
      [1700, "ok",    "Found 5 videos"],
      [2100, "info",  "Scanning comments on [tt7380921847] Almari Jati..."],
      [2500, "warn",  "  → @farah_klang92: 'sold tak?' → Keyword: SOLD"],
      [2800, "warn",  "  → @pn_ros_klang: 'tempah boleh tak?' → Keyword: RESERVED"],
      [3100, "ok",    "  → Status: AVAILABLE (creator comment overrides)"],
      [3400, "info",  "Scanning [tt7380812736] Sofa Rotan..."],
      [3700, "warn",  "  → @azman_design: 'boleh reserved dulu?' → Keyword: RESERVED"],
      [4000, "ok",    "  → Status updated: RESERVED"],
      [4300, "info",  "Scanning [tt7380599817] Katil Queen..."],
      [4600, "warn",  "  → @hafiz_furniture: 'dah terjual ke' → Keyword: SOLD"],
      [4900, "ok",    "  → Status updated: SOLD"],
      [5200, "info",  "Scanning remaining videos..."],
      [5600, "ok",    "All 5 videos scanned · 189 comments processed"],
      [6000, "ok",    "Inventory synced · 3 status changes applied"],
      [6300, "sys",   "── Sync complete ✓ ──"],
    ];
    steps.forEach(([delay, type, text]) => setTimeout(() => {
      addLog(type, text);
      if (delay === 6300) { setRunning(false); onSyncComplete(); }
    }, delay));
  };
  const logColors = { sys: "#C49550", info: "rgba(245,239,230,.5)", ok: "#00C896", warn: "#FF9500", err: "#FF3B5C" };
  return (
    <div style={{ background: "#0D0A08", border: "1px solid rgba(196,149,80,.15)", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: running ? "#00C896" : "#C49550", boxShadow: running ? "0 0 8px #00C896" : "none", animation: running ? "pulse 1s infinite" : "none" }} />
          <span style={{ color: "#C49550", fontWeight: 700, fontSize: 13 }}>TikTok Sync Engine</span>
        </div>
        <button onClick={runSync} disabled={running} style={{
          background: running ? "rgba(196,149,80,.1)" : "linear-gradient(135deg,#FF2D55,#FF6B35)",
          border: running ? "1px solid rgba(196,149,80,.2)" : "none",
          color: running ? "#C49550" : "#fff", padding: "8px 18px", borderRadius: 10,
          fontWeight: 800, fontSize: 13, cursor: running ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ display: "inline-block", animation: running ? "spin 1s linear infinite" : "none" }}>⟳</span>
          {running ? "Syncing..." : "Run Sync"}
        </button>
      </div>
      <div ref={logRef} style={{ padding: 16, height: 220, overflowY: "auto", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, lineHeight: 1.8 }}>
        {logs.map((l, i) => (
          <div key={i} style={{ color: logColors[l.type] || logColors.info }}>
            {l.ts && <span style={{ color: "rgba(255,255,255,.2)", marginRight: 10 }}>{l.ts}</span>}
            {l.text}
          </div>
        ))}
        {running && <div style={{ color: "#C49550", animation: "blink 1s infinite" }}>█</div>}
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminView({ products, setProducts, toast, onClose }) {
  const [panel, setPanel] = useState("overview");
  const [editTarget, setEditTarget] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const stats = {
    total: products.length,
    available: products.filter(p => p.status === "available").length,
    reserved: products.filter(p => p.status === "reserved").length,
    sold: products.filter(p => p.status === "sold").length,
    tiktok: products.filter(p => p.synced).length,
    revenue: products.filter(p => p.status === "sold").reduce((s, p) => s + p.price, 0),
  };
  const cycleStatus = (id) => {
    const cycle = { available: "reserved", reserved: "sold", sold: "available" };
    setProducts(ps => ps.map(p => p.id === id ? { ...p, status: cycle[p.status] } : p));
    toast("Status updated");
  };
  const deleteItem = (id) => {
    setProducts(ps => ps.filter(p => p.id !== id));
    toast("Item removed");
  };
  const saveItem = (data) => {
    setProducts(ps => ps.some(p => p.id === data.id) ? ps.map(p => p.id === data.id ? data : p) : [data, ...ps]);
    toast(data.id ? "Item updated ✓" : "Item added ✓");
    setEditTarget(null); setShowAddModal(false);
  };
  const sideItems = [
    { id: "overview", icon: "▦", label: "Overview" },
    { id: "inventory", icon: "◫", label: "Inventory" },
    { id: "tiktok", icon: "♪", label: "TikTok Sync" },
    { id: "comments", icon: "◉", label: "Comments" },
  ];
  const StatCard = ({ val, label, color, sub }) => (
    <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, padding: "20px 22px" }}>
      <div style={{ fontSize: 32, fontWeight: 800, color: color || "#F5EFE6", fontFamily: "'Playfair Display',serif" }}>{val}</div>
      <div style={{ fontSize: 11, color: "#C49550", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "rgba(245,239,230,.35)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
  return (
    <div style={{ position: "fixed", inset: 0, background: "#110E0B", zIndex: 500, display: "flex", flexDirection: "column" }}>
      {/* Admin Nav */}
      <div style={{ height: 60, background: "rgba(0,0,0,.6)", borderBottom: "1px solid rgba(196,149,80,.15)", display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0, backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00C896", boxShadow: "0 0 8px #00C896" }} />
          <span style={{ color: "#C49550", fontWeight: 800, fontSize: 15 }}>Admin Console</span>
          <span style={{ color: "rgba(196,149,80,.4)", fontSize: 13 }}>· Perangsang Jati Trading</span>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ background: "linear-gradient(135deg,#C49550,#A07030)", border: "none", color: "#fff", padding: "8px 18px", borderRadius: 10, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <Icon.plus /> Add Item
        </button>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", color: "#F5EFE6", padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>✕ Close</button>
      </div>
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 200, background: "rgba(0,0,0,.4)", borderRight: "1px solid rgba(255,255,255,.06)", padding: "20px 12px", flexShrink: 0 }}>
          {sideItems.map(s => (
            <button key={s.id} onClick={() => setPanel(s.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
              background: panel === s.id ? "rgba(196,149,80,.12)" : "transparent",
              border: panel === s.id ? "1px solid rgba(196,149,80,.2)" : "1px solid transparent",
              borderRadius: 10, color: panel === s.id ? "#C49550" : "rgba(245,239,230,.5)",
              fontWeight: panel === s.id ? 700 : 500, cursor: "pointer", fontSize: 14, marginBottom: 4,
              textAlign: "left", transition: "all .2s",
            }}>
              <span style={{ fontSize: 16 }}>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: 28 }}>
          {/* OVERVIEW */}
          {panel === "overview" && (
            <div>
              <h2 style={{ color: "#F5EFE6", fontWeight: 800, fontSize: 24, marginBottom: 24, fontFamily: "'Playfair Display',serif" }}>Overview</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, marginBottom: 28 }}>
                <StatCard val={stats.total} label="Total Items" />
                <StatCard val={stats.available} label="Available" color="#00C896" />
                <StatCard val={stats.reserved} label="Reserved" color="#FF9500" />
                <StatCard val={stats.sold} label="Sold" color="#FF3B5C" />
                <StatCard val={stats.tiktok} label="TikTok Synced" color="#FF2D55" />
                <StatCard val={`RM ${stats.revenue.toLocaleString()}`} label="Revenue" color="#C49550" />
              </div>
              <SyncEngine onSyncComplete={() => { toast("Sync complete! Inventory updated."); }} />
            </div>
          )}
          {/* INVENTORY */}
          {panel === "inventory" && (
            <div>
              <h2 style={{ color: "#F5EFE6", fontWeight: 800, fontSize: 24, marginBottom: 20, fontFamily: "'Playfair Display',serif" }}>Inventory</h2>
              <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                      {["Item", "Cat", "Price", "Status", "Source", "Actions"].map(h => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, color: "#C49550", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                        <td style={{ padding: "14px 16px", color: "#F5EFE6", fontWeight: 600, fontSize: 14, maxWidth: 200 }}>
                          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: "rgba(245,239,230,.4)", marginTop: 2 }}>{p.condition}</div>
                        </td>
                        <td style={{ padding: "14px 16px", color: "rgba(245,239,230,.6)", fontSize: 13 }}>{p.category}</td>
                        <td style={{ padding: "14px 16px", color: "#C49550", fontWeight: 700, fontSize: 14 }}>RM {p.price.toLocaleString()}</td>
                        <td style={{ padding: "14px 16px" }}><StatusBadge status={p.status} /></td>
                        <td style={{ padding: "14px 16px" }}>
                          {p.synced ? <span style={{ color: "#FF2D55", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}><Icon.tiktok /> TikTok</span> : <span style={{ color: "rgba(245,239,230,.3)", fontSize: 11 }}>Manual</span>}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => { setEditTarget(p); }} style={{ background: "rgba(196,149,80,.12)", border: "1px solid rgba(196,149,80,.2)", color: "#C49550", padding: "5px 10px", borderRadius: 7, fontSize: 11, cursor: "pointer", fontWeight: 700 }}>Edit</button>
                            <button onClick={() => cycleStatus(p.id)} style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(245,239,230,.7)", padding: "5px 10px", borderRadius: 7, fontSize: 11, cursor: "pointer", fontWeight: 700 }}>Toggle</button>
                            <button onClick={() => deleteItem(p.id)} style={{ background: "rgba(255,59,92,.1)", border: "1px solid rgba(255,59,92,.2)", color: "#FF3B5C", padding: "5px 10px", borderRadius: 7, fontSize: 11, cursor: "pointer", fontWeight: 700 }}>Del</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* TIKTOK SYNC */}
          {panel === "tiktok" && (
            <div>
              <h2 style={{ color: "#F5EFE6", fontWeight: 800, fontSize: 24, marginBottom: 8, fontFamily: "'Playfair Display',serif" }}>TikTok Sync</h2>
              <p style={{ color: "rgba(245,239,230,.5)", fontSize: 14, marginBottom: 24 }}>Videos auto-imported · Comments scanned for status keywords in real-time</p>
              <SyncEngine onSyncComplete={() => toast("Sync complete!")} />
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                {MOCK_TIKTOK_VIDEOS.map(v => {
                  const cfg = statusConfig[v.detected];
                  return (
                    <div key={v.id} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,45,85,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{v.thumb}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: "#F5EFE6", fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 4 }}>{v.desc}</div>
                        <div style={{ display: "flex", gap: 16, fontSize: 11, color: "rgba(245,239,230,.4)" }}>
                          <span><Icon.eye /> {fmtNum(v.views)}</span>
                          <span><Icon.heart /> {fmtNum(v.likes)}</span>
                          <span><Icon.comment /> {v.comments} comments</span>
                          <span>{v.date}</span>
                        </div>
                      </div>
                      <StatusBadge status={v.detected} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* COMMENTS */}
          {panel === "comments" && (
            <div>
              <h2 style={{ color: "#F5EFE6", fontWeight: 800, fontSize: 24, marginBottom: 8, fontFamily: "'Playfair Display',serif" }}>Comment Scanner</h2>
              <p style={{ color: "rgba(245,239,230,.5)", fontSize: 14, marginBottom: 24 }}>Keywords detected: <code style={{ color: "#C49550", background: "rgba(196,149,80,.1)", padding: "2px 8px", borderRadius: 6 }}>sold · terjual · reserved · tempah · booked</code></p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {MOCK_COMMENTS.map(c => (
                  <div key={c.id} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: `hsl(${c.user.charCodeAt(0) * 17 % 360},50%,35%)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                      {c.user[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                        <span style={{ color: "#C49550", fontWeight: 700, fontSize: 13 }}>@{c.user}</span>
                        <span style={{ color: "rgba(245,239,230,.3)", fontSize: 11 }}>{c.time}</span>
                      </div>
                      <div style={{ color: "rgba(245,239,230,.75)", fontSize: 14, marginBottom: 8 }}>"{c.text}"</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, color: "rgba(245,239,230,.35)" }}>📦 {c.product}</span>
                        {c.detected ? (
                          <span style={{ background: statusConfig[c.detected].bg, color: statusConfig[c.detected].color, padding: "3px 10px", borderRadius: 99, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".05em", border: `1px solid ${statusConfig[c.detected].color}30` }}>
                            <Icon.zap /> {c.detected} keyword
                          </span>
                        ) : (
                          <span style={{ background: "rgba(255,255,255,.04)", color: "rgba(245,239,230,.3)", padding: "3px 10px", borderRadius: 99, fontSize: 10, fontWeight: 700 }}>No keyword</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {(editTarget || showAddModal) && (
        <AdminModal product={editTarget} onClose={() => { setEditTarget(null); setShowAddModal(false); }} onSave={saveItem} />
      )}
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ onShop, onTikTok }) {
  return (
    <div style={{ position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* Ambient BG */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(196,149,80,.12) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", top: "15%", left: "8%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,149,80,.07) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "10%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,45,85,.06) 0%, transparent 70%)", filter: "blur(40px)" }} />
      {/* Grid lines */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(196,149,80,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(196,149,80,.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div style={{ position: "relative", textAlign: "center", padding: "0 24px", maxWidth: 700 }}>
        {/* TikTok pill */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,45,85,.1)", border: "1px solid rgba(255,45,85,.25)", borderRadius: 99, padding: "6px 16px", fontSize: 12, color: "#FF2D55", fontWeight: 700, marginBottom: 28, letterSpacing: ".05em" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF2D55", animation: "pulse 1.5s infinite", display: "inline-block" }} />
          LIVE ON TIKTOK · @perangsangjatiklang
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(3rem,7vw,5.5rem)", fontWeight: 900, color: "#F5EFE6", lineHeight: 1.05, marginBottom: 12 }}>
          Perangsang<br /><span style={{ color: "#C49550", WebkitTextStroke: "1px #C49550", WebkitTextFillColor: "transparent" }}>Jati</span> Trading
        </h1>
        <p style={{ color: "rgba(245,239,230,.55)", fontSize: 17, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 36px" }}>
          Premium pre-loved solid wood furniture. Every piece sourced, vetted & showcased live on TikTok. What you see is what you get.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onShop} style={{ background: "linear-gradient(135deg,#C49550,#A07030)", border: "none", color: "#fff", padding: "14px 32px", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer", transition: "all .2s", letterSpacing: ".02em" }}>
            Browse Collection →
          </button>
          <button onClick={onTikTok} style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", color: "#F5EFE6", padding: "14px 28px", borderRadius: 14, fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon.tiktok /> Watch on TikTok
          </button>
        </div>
        {/* Stats row */}
        <div style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 56 }}>
          {[["189K+","TikTok Views"],["6+","Items Available"],["100%","Quality Verified"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, color: "#C49550" }}>{v}</div>
              <div style={{ fontSize: 11, color: "rgba(245,239,230,.4)", letterSpacing: ".06em", textTransform: "uppercase", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SHOP ─────────────────────────────────────────────────────────────────────
function ShopView({ products, onWA, onView }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [layout, setLayout] = useState("grid");
  const filtered = products
    .filter(p => (cat === "All" || p.category === cat) && (status === "all" || p.status === status) && (!query || p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())))
    .sort((a, b) => sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : new Date(b.postedAt) - new Date(a.postedAt));
  const inp = { background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "10px 16px", color: "#F5EFE6", fontSize: 14, fontFamily: "inherit", outline: "none", width: "100%" };
  return (
    <div style={{ padding: "32px 24px", maxWidth: 1280, margin: "0 auto" }}>
      {/* Filters bar */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 340 }}>
          <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(245,239,230,.3)" }}><Icon.search /></div>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search furniture..." style={{ ...inp, paddingLeft: 40 }} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["all","available","reserved","sold"].map(s => (
            <button key={s} onClick={() => setStatus(s)} style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid", fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "capitalize", transition: "all .2s", ...(status === s ? { background: "#C49550", borderColor: "#C49550", color: "#fff" } : { background: "transparent", borderColor: "rgba(255,255,255,.1)", color: "rgba(245,239,230,.6)" }) }}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ ...inp, width: "auto", padding: "8px 14px", cursor: "pointer" }}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
        </select>
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,.05)", borderRadius: 10, padding: 4 }}>
          {[["grid","grid"],["list","list"]].map(([l, icon]) => (
            <button key={l} onClick={() => setLayout(l)} style={{ padding: "6px 10px", borderRadius: 8, border: "none", background: layout === l ? "rgba(196,149,80,.2)" : "transparent", color: layout === l ? "#C49550" : "rgba(245,239,230,.4)", cursor: "pointer", display: "flex", alignItems: "center" }}>
              {icon === "grid" ? <Icon.grid /> : <Icon.list />}
            </button>
          ))}
        </div>
      </div>
      {/* Category tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, overflowX: "auto", paddingBottom: 4 }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{ padding: "7px 16px", borderRadius: 10, border: "1px solid", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s", ...(cat === c ? { background: "rgba(196,149,80,.15)", borderColor: "rgba(196,149,80,.4)", color: "#C49550" } : { background: "transparent", borderColor: "rgba(255,255,255,.08)", color: "rgba(245,239,230,.5)" }) }}>
            {c}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 12, color: "rgba(245,239,230,.3)", marginBottom: 16, letterSpacing: ".03em" }}>{filtered.length} item{filtered.length !== 1 ? "s" : ""} found</div>
      {/* Grid or List */}
      {layout === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
          {filtered.map(p => <ProductCard key={p.id} product={p} onWA={onWA} onView={onView} layout="grid" />)}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(p => <ProductCard key={p.id} product={p} onWA={onWA} onView={onView} layout="list" />)}
        </div>
      )}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(245,239,230,.3)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 16 }}>No items found</div>
        </div>
      )}
    </div>
  );
}

// ─── TIKTOK FEED PAGE ─────────────────────────────────────────────────────────
function TikTokPage() {
  return (
    <div style={{ padding: "32px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
        <span style={{ fontSize: 28 }}><Icon.tiktok /></span>
        <div>
          <h2 style={{ color: "#F5EFE6", fontWeight: 800, fontSize: 24, fontFamily: "'Playfair Display',serif", margin: 0 }}>TikTok Feed</h2>
          <p style={{ color: "rgba(245,239,230,.45)", fontSize: 13, margin: "4px 0 0" }}>@perangsangjatiklang · Auto-synced inventory</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, background: "rgba(0,200,150,.08)", border: "1px solid rgba(0,200,150,.2)", borderRadius: 10, padding: "8px 14px" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#00C896", animation: "pulse 1.5s infinite", display: "inline-block" }} />
          <span style={{ color: "#00C896", fontWeight: 700, fontSize: 12 }}>API CONNECTED</span>
        </div>
      </div>
      <p style={{ color: "rgba(245,239,230,.4)", fontSize: 14, marginBottom: 28 }}>Each video is scanned for <strong style={{ color: "#C49550" }}>sold</strong>, <strong style={{ color: "#C49550" }}>terjual</strong>, <strong style={{ color: "#C49550" }}>reserved</strong>, <strong style={{ color: "#C49550" }}>tempah</strong> in comments → auto-updates item status</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
        {MOCK_TIKTOK_VIDEOS.map(v => (
          <div key={v.id} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 18, overflow: "hidden" }}>
            <div style={{ height: 160, background: "linear-gradient(135deg,#0d0d0d,#1a0a0a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, position: "relative" }}>
              {v.thumb}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0)", transition: "background .2s" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#fff" }}>▶</div>
              </div>
              <div style={{ position: "absolute", top: 10, right: 10 }}><StatusBadge status={v.detected} /></div>
            </div>
            <div style={{ padding: "14px 16px" }}>
              <p style={{ color: "rgba(245,239,230,.8)", fontSize: 13, lineHeight: 1.5, marginBottom: 10 }}>{v.desc}</p>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: "rgba(245,239,230,.35)", marginBottom: 10 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon.eye /> {fmtNum(v.views)}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon.heart /> {fmtNum(v.likes)}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon.comment /> {v.comments}</span>
                <span>{v.date}</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(245,239,230,.3)", paddingTop: 10, borderTop: "1px solid rgba(255,255,255,.06)" }}>
                Linked: <span style={{ color: "#C49550" }}>{v.linked}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ page, setPage, onAdmin, onWA }) {
  const links = [["shop","Shop"],["tiktok","TikTok Feed"],["about","About"]];
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 200, height: 60, background: "rgba(17,14,11,.88)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(196,149,80,.1)", display: "flex", alignItems: "center", padding: "0 24px", gap: 8 }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, marginRight: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#C49550,#7A4A20)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🪵</div>
        <div>
          <div style={{ color: "#F5EFE6", fontWeight: 800, fontSize: 14, fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>Perangsang Jati</div>
          <div style={{ color: "#C49550", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase" }}>Trading · Klang</div>
        </div>
      </button>
      <div style={{ flex: 1, display: "flex", gap: 2 }}>
        {links.map(([id, label]) => (
          <button key={id} onClick={() => setPage(id)} style={{ background: page === id ? "rgba(196,149,80,.1)" : "transparent", border: page === id ? "1px solid rgba(196,149,80,.2)" : "1px solid transparent", color: page === id ? "#C49550" : "rgba(245,239,230,.5)", padding: "6px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .2s" }}>
            {label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onWA} style={{ background: "rgba(0,200,150,.1)", border: "1px solid rgba(0,200,150,.25)", color: "#00C896", padding: "7px 14px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Icon.whatsapp /> WhatsApp
        </button>
        <button onClick={onAdmin} style={{ background: "linear-gradient(135deg,rgba(196,149,80,.15),rgba(196,149,80,.08))", border: "1px solid rgba(196,149,80,.25)", color: "#C49550", padding: "7px 14px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          ⚙ Admin
        </button>
      </div>
    </nav>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function AboutPage() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px" }}>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, color: "#F5EFE6", marginBottom: 16, fontWeight: 900 }}>Our Story</h2>
      <p style={{ color: "rgba(245,239,230,.6)", fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
        Perangsang Jati Trading started with a simple belief — beautiful solid wood furniture should find new homes, not landfills. We source quality pre-loved pieces around Klang, verify their condition, and showcase them live on TikTok so buyers know exactly what they're getting.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
        {[["🪵","Solid Jati","Specializing in genuine jati and quality solid wood pieces"],["🎵","TikTok Live","Every item showcased live — see it move, check the condition"],["🚚","Klang Valley","Delivery available across Klang Valley. Contact us first"],["💬","WhatsApp","Direct contact, no middleman. Real prices, real service"]].map(([icon,t,d]) => (
          <div key={t} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, padding: "24px 20px" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
            <div style={{ color: "#C49550", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{t}</div>
            <div style={{ color: "rgba(245,239,230,.5)", fontSize: 13, lineHeight: 1.6 }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [viewProduct, setViewProduct] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const { toasts, push: toast } = useToast();

  const openWA = (product) => {
    const num = product?.waNumber || "60112345678";
    const msg = product ? `Salam, saya berminat dengan: ${product.name} (RM${product.price}). Masih available?` : "Salam, saya berminat dengan furniture anda!";
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`);
    toast("Opening WhatsApp...", "info");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#110E0B", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #110E0B; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(196,149,80,.25); border-radius: 99px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes slideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color: rgba(245,239,230,.25); }
        select option { background: #1C1813; color: #F5EFE6; }
        button { font-family: 'DM Sans', sans-serif; }
        input, select, textarea { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {!adminOpen && <Nav page={page} setPage={setPage} onAdmin={() => setAdminOpen(true)} onWA={() => openWA(null)} />}

      {!adminOpen && (
        <>
          {page === "home" && <Hero onShop={() => setPage("shop")} onTikTok={() => window.open("https://tiktok.com/@perangsangjatiklang")} />}
          {page === "shop" && <ShopView products={products} onWA={openWA} onView={setViewProduct} />}
          {page === "tiktok" && <TikTokPage />}
          {page === "about" && <AboutPage />}
        </>
      )}

      {adminOpen && <AdminView products={products} setProducts={setProducts} toast={toast} onClose={() => setAdminOpen(false)} />}
      {viewProduct && <ProductModal product={viewProduct} onClose={() => setViewProduct(null)} onWA={openWA} />}
      <Toasts toasts={toasts} />
    </div>
  );
}
import { createRoot } from 'react-dom/client'
const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)
