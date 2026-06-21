import { useState, useEffect, useCallback } from "react";

// ─── PALETTE ────────────────────────────────────────────────────────────────
const T = {
  bg: "#0B0E17",
  sidebar: "#0F1320",
  card: "#141928",
  cardHover: "#1A2035",
  border: "#1E2640",
  borderLight: "#252D45",
  accent: "#4F8EF7",        // blue — analytical, trustworthy
  accentGlow: "#4F8EF722",
  win: "#22C987",
  winDim: "#22C98720",
  loss: "#F75050",
  lossDim: "#F7505020",
  draw: "#F7A430",
  drawDim: "#F7A43020",
  pending: "#8B7CF7",
  pendingDim: "#8B7CF720",
  text: "#DDE4F5",
  textSub: "#8A95B8",
  textMuted: "#4A5272",
  pill: "#1A2240",
};

// ─── ICONS (inline SVG as components) ───────────────────────────────────────
const Icon = ({ d, size = 16, color = "currentColor", ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d={d} />
  </svg>
);

const icons = {
  dashboard: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  bets: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2",
  bankroll: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
  wallet: "M21 12V7H5a2 2 0 0 1 0-4h14v4M21 12v5H5a2 2 0 0 0 0 4h14v-4",
  strategy: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  reports: "M18 20V10M12 20V4M6 20v-6",
  ai: "M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2zM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z",
  plus: "M12 5v14M5 12h14",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  chevron: "M6 9l6 6 6-6",
  close: "M18 6L6 18M6 6l12 12",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  deposit: "M12 5v14M5 12h14",
  withdraw: "M5 12h14",
  target: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
  competition: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  info: "M12 16v-4M12 8h.01",
};

// ─── CUSTOM ICONS ────────────────────────────────────────────────────────────
const COMPETITION_ICONS = {
  trophy: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="38" r="32" fill="#F5A800"/>
      <ellipse cx="38" cy="22" rx="13" ry="11" fill="#FFE566" opacity="0.85"/>
      <ellipse cx="62" cy="18" rx="9" ry="8" fill="#FFE566" opacity="0.7"/>
      <circle cx="47" cy="32" r="10" fill="#FFD700" opacity="0.5"/>
      <path d="M38 68 Q30 80 32 95 Q36 100 50 100 Q64 100 68 95 Q70 80 62 68 Q56 72 50 72 Q44 72 38 68z" fill="#F5A800"/>
      <path d="M44 75 Q43 85 44 95" stroke="#D4800A" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
      <path d="M54 73 Q56 84 55 94" stroke="#D4800A" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5"/>
      <ellipse cx="50" cy="68" rx="12" ry="5" fill="#E09200"/>
      <rect x="18" y="100" width="64" height="22" rx="5" fill="#4CAF7D"/>
      <rect x="27" y="113" width="18" height="6" rx="3" fill="#F5C518"/>
      <rect x="55" y="113" width="18" height="6" rx="3" fill="#F5C518"/>
      <ellipse cx="50" cy="67" rx="19" ry="7" fill="#F5A800"/>
    </svg>
  ),
};

function CompetitionIcon({ icon, size = 20 }) {
  const Comp = COMPETITION_ICONS[icon];
  return Comp ? <Comp size={size} /> : null;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const today = () => new Date().toISOString().slice(0, 10);
const fmt = (n, d = 2) =>
  (n >= 0 ? "+" : "") + new Intl.NumberFormat("pt-PT", { minimumFractionDigits: d, maximumFractionDigits: d }).format(n) + " €";
const fmtAbs = (n) =>
  new Intl.NumberFormat("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n)) + " €";
const pct = (n) => (isNaN(n) || !isFinite(n) ? "—" : (n >= 0 ? "+" : "") + n.toFixed(2) + "%");
const SPORTS = ["⚽ Futebol"];
const RESULTS = ["Em aberto", "Ganhou", "Perdeu", "Void"];
const BET_TYPES = ["Simples", "Múltipla"];
const TIMINGS = ["Pré Live", "0' a 15'", "16' a 30'", "31' a 45'", "Intervalo", "46' a 60'", "61' a 75'", "76' a 90'", "Prolongamento"];
const RES_COLOR = { Ganhou: T.win, Perdeu: T.loss, Empate: T.draw, "Em aberto": T.pending, Void: T.textMuted };
const RES_BG = { Ganhou: T.winDim, Perdeu: T.lossDim, Empate: T.drawDim, "Em aberto": T.pendingDim, Void: "#ffffff10" };
const RES_LABEL = { Ganhou: "✓ Ganhou", Perdeu: "✗ Perdeu", Empate: "≈ Empate", "Em aberto": "⏳ Em aberto", Void: "∅ Void" };

const KEY = "bettrack_v3";

const DEFAULT_COMPETITIONS = [
  { id: "wc2026", name: "FIFA World Cup 2026", sport: "⚽ Futebol", country: "USA / Canada / México", notes: "", icon: "trophy" },
];

const SUPABASE_URL = "https://xffzpvmcznwjyxancrna.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZnpwdm1jem53anl4YW5jcm5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNDQwOTIsImV4cCI6MjA5NzYyMDA5Mn0.Q14Bq0szQDEkJOySwKQAPlojXoPIUtJ_PATUyM9d2lE";

async function loadRemote() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/app_state?id=eq.main&select=data`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
      },
    });
    const rows = await res.json();
    const stored = rows?.[0]?.data;
    if (!stored) return defaultState();
    const existingIds = (stored.competitions || []).map(c => c.id);
    const missing = DEFAULT_COMPETITIONS.filter(c => !existingIds.includes(c.id));
    if (missing.length > 0) {
      const next = { ...stored, competitions: [...(stored.competitions || []), ...missing] };
      saveRemote(next);
      return next;
    }
    return { ...defaultState(), ...stored };
  } catch (e) {
    console.error("Erro ao carregar dados:", e);
    return defaultState();
  }
}

function defaultState() {
  return {
    bankrolls: [{ id: uid(), name: "Principal", balance: 0, currency: "€", color: T.accent }],
    bets: [],
    transactions: [],
    strategies: [],
    targets: [],
    competitions: [...DEFAULT_COMPETITIONS],
    markets: [],
    sports: [],
  };
}

let saveTimeout = null;
function saveRemote(state) {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/app_state?id=eq.main`, {
        method: "PATCH",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({ data: state, updated_at: new Date().toISOString() }),
      });
    } catch (e) {
      console.error("Erro ao guardar dados:", e);
    }
  }, 600); // debounce — evita gravar a cada tecla
}

function betProfit(bet) {
  if (bet.result === "Ganhou") return bet.stake * (bet.odds - 1);
  if (bet.result === "Perdeu") return -bet.stake;
  if (bet.result === "Empate" || bet.result === "Void") return 0;
  return null;
}

// ─── UI ATOMS ────────────────────────────────────────────────────────────────
const inp = {
  background: T.card,
  border: `1px solid ${T.border}`,
  borderRadius: 8,
  padding: "9px 13px",
  color: T.text,
  fontSize: 14,
  width: "100%",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};
const lbl = { color: T.textSub, fontSize: 12, marginBottom: 5, display: "block", letterSpacing: 0.3 };

function Input({ label, ...props }) {
  return (
    <div>
      {label && <label style={lbl}>{label}</label>}
      <input style={inp} {...props} />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      {label && <label style={lbl}>{label}</label>}
      <select style={inp} {...props}>
        {options.map(o => typeof o === "string"
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.v} value={o.v}>{o.l}</option>
        )}
      </select>
    </div>
  );
}

function Btn({ children, variant = "ghost", style: s, ...p }) {
  const base = { border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", transition: "opacity .15s" };
  const variants = {
    primary: { background: T.accent, color: "#fff" },
    danger: { background: T.loss, color: "#fff" },
    ghost: { background: T.pill, color: T.textSub },
    win: { background: T.win, color: "#0B0E17" },
  };
  return <button style={{ ...base, ...variants[variant], ...s }} {...p}>{children}</button>;
}

function Badge({ result }) {
  return (
    <span style={{
      background: RES_BG[result], color: RES_COLOR[result],
      borderRadius: 20, padding: "3px 11px", fontSize: 12, fontWeight: 700,
      whiteSpace: "nowrap",
    }}>{RES_LABEL[result]}</span>
  );
}

function StatBox({ label, value, sub, color, small }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 20px", flex: "1 1 130px", minWidth: 0 }}>
      <div style={{ color: T.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ color: color || T.text, fontSize: small ? 18 : 22, fontWeight: 800, fontFamily: "'Courier New', monospace", letterSpacing: -1, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ color: T.textMuted, fontSize: 11, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ─── SPARKLINE ───────────────────────────────────────────────────────────────
function Sparkline({ data, color, height = 60 }) {
  if (!data || data.length < 2) return null;
  const W = 300, H = height, P = 4;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const x = (i) => P + (i / (data.length - 1)) * (W - 2 * P);
  const y = (v) => H - P - ((v - min) / range) * (H - 2 * P);
  const d = data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${d} L${x(data.length - 1).toFixed(1)},${H} L${P},${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: "block" }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg${color?.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg${color?.replace("#","")})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, width = 580 }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000C", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 16, width: `min(${width}px, 100%)`, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 24px 64px #0008" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 0" }}>
          <h3 style={{ margin: 0, fontSize: 16, color: T.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.textSub, padding: 4 }}>
            <Icon d={icons.close} size={18} />
          </button>
        </div>
        <div style={{ padding: "20px 24px 24px" }}>{children}</div>
      </div>
    </div>
  );
}

// ─── CONFIRM DIALOG ──────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000C", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 14, padding: "24px 28px", width: "min(360px,100%)", boxShadow: "0 24px 64px #0008" }}>
        <div style={{ color: T.text, fontSize: 15, marginBottom: 20, lineHeight: 1.5 }}>{message}</div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Btn onClick={onCancel}>Cancelar</Btn>
          <Btn variant="danger" onClick={onConfirm}>Apagar</Btn>
        </div>
      </div>
    </div>
  );
}


// ─── COMPETITION DROPDOWN (custom — supports icons) ───────────────────────────
function CompetitionDropdown({ label, value, onChange, competitions, onAdd }) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newVal, setNewVal] = useState("");

  const selected = competitions.find(c => c.name === value);

  const confirm = () => {
    const trimmed = newVal.trim();
    if (trimmed) { onAdd(trimmed); onChange(trimmed); }
    setNewVal(""); setAdding(false); setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <label style={lbl}>{label}</label>
      <div style={{ display: "flex", gap: 6 }}>
        {/* trigger */}
        <div
          onClick={() => { setOpen(o => !o); setAdding(false); }}
          style={{
            ...inp, flex: 1, display: "flex", alignItems: "center", gap: 8,
            cursor: "pointer", userSelect: "none",
          }}
        >
          {selected?.icon
            ? <CompetitionIcon icon={selected.icon} size={18} />
            : <span style={{ color: T.textMuted, fontSize: 13 }}>—</span>
          }
          <span style={{ flex: 1, color: value ? T.text : T.textMuted, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {value || "— Sem competição —"}
          </span>
          <Icon d={icons.chevron} size={14} color={T.textMuted} style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: ".15s" }} />
        </div>
        {/* + button */}
        <button
          onClick={() => { setAdding(a => !a); setOpen(false); setNewVal(""); }}
          style={{
            background: adding ? T.accent : T.pill, color: adding ? "#fff" : T.textSub,
            border: "none", borderRadius: 8, width: 34, height: 34,
            cursor: "pointer", fontSize: 18, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>+</button>
      </div>

      {/* dropdown list */}
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 44, zIndex: 500,
          background: T.card, border: `1px solid ${T.borderLight}`,
          borderRadius: 10, marginTop: 4, boxShadow: "0 8px 32px #0006",
          maxHeight: 220, overflowY: "auto",
        }}>
          {/* empty option */}
          <div
            onClick={() => { onChange(""); setOpen(false); }}
            style={{
              padding: "10px 14px", cursor: "pointer", color: T.textMuted, fontSize: 13,
              borderBottom: `1px solid ${T.border}`,
              background: value === "" ? T.pill : "none",
            }}
          >— Sem competição —</div>
          {competitions.map(c => (
            <div
              key={c.id}
              onClick={() => { onChange(c.name); setOpen(false); }}
              style={{
                padding: "10px 14px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10,
                background: value === c.name ? T.pill : "none",
                borderBottom: `1px solid ${T.border}`,
              }}
              onMouseEnter={e => e.currentTarget.style.background = T.pill}
              onMouseLeave={e => e.currentTarget.style.background = value === c.name ? T.pill : "none"}
            >
              {c.icon
                ? <CompetitionIcon icon={c.icon} size={18} />
                : <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.color || T.accent, flexShrink: 0 }} />
              }
              <span style={{ color: T.text, fontSize: 14 }}>{c.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* add new inline */}
      {adding && (
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          <input
            autoFocus
            value={newVal}
            onChange={e => setNewVal(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") confirm(); if (e.key === "Escape") setAdding(false); }}
            placeholder="Nome da competição…"
            style={{ ...inp, flex: 1, fontSize: 13, padding: "7px 11px" }}
          />
          <button onClick={confirm} disabled={!newVal.trim()}
            style={{ background: T.accent, color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 700, fontSize: 13, opacity: newVal.trim() ? 1 : 0.4 }}>
            OK
          </button>
          <button onClick={() => setAdding(false)}
            style={{ background: T.pill, color: T.textSub, border: "none", borderRadius: 8, padding: "7px 10px", cursor: "pointer", fontSize: 13 }}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

// ─── BET FORM ────────────────────────────────────────────────────────────────

// Small inline widget: dropdown + + button to add a new item on the fly
function SelectWithAdd({ label, value, onChange, options, placeholder, onAdd }) {
  const [adding, setAdding] = useState(false);
  const [newVal, setNewVal] = useState("");

  const confirm = () => {
    const trimmed = newVal.trim();
    if (trimmed) { onAdd(trimmed); onChange({ target: { value: trimmed } }); }
    setNewVal(""); setAdding(false);
  };

  return (
    <div>
      <label style={lbl}>{label}</label>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <select value={value} onChange={onChange} style={{ ...inp, flex: 1 }}>
          {options.map(o => typeof o === "string"
            ? <option key={o} value={o}>{o}</option>
            : <option key={o.v} value={o.v}>{o.l}</option>
          )}
        </select>
        <button
          onClick={() => { setAdding(a => !a); setNewVal(""); }}
          title="Adicionar novo"
          style={{
            background: adding ? T.accent : T.pill,
            color: adding ? "#fff" : T.textSub,
            border: "none", borderRadius: 8, width: 34, height: 34,
            cursor: "pointer", fontSize: 18, lineHeight: 1, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>+</button>
      </div>
      {adding && (
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          <input
            autoFocus
            value={newVal}
            onChange={e => setNewVal(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") confirm(); if (e.key === "Escape") setAdding(false); }}
            placeholder={placeholder || "Novo item…"}
            style={{ ...inp, flex: 1, fontSize: 13, padding: "7px 11px" }}
          />
          <button onClick={confirm} disabled={!newVal.trim()}
            style={{ background: T.accent, color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 700, fontSize: 13, opacity: newVal.trim() ? 1 : 0.4 }}>
            OK
          </button>
          <button onClick={() => setAdding(false)}
            style={{ background: T.pill, color: T.textSub, border: "none", borderRadius: 8, padding: "7px 10px", cursor: "pointer", fontSize: 13 }}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

function BetForm({ initial, bankrolls, strategies, competitions, markets, sports, onSave, onClose, onAddMarket, onAddCompetition, onAddStrategy, onAddSport }) {
  const blank = {
    date: today(), bankrollId: bankrolls[0]?.id || "",
    sport: SPORTS[0], competition: "", description: "", market: "",
    betType: BET_TYPES[0], bookmaker: "", strategyId: "",
    odds: "", stake: "", result: "Em aberto", timing: TIMINGS[0], gameResult: "", notes: "",
  };
  const [f, setF] = useState(initial ? { ...blank, ...initial } : blank);
  const set = (k) => (e) => setF(p => ({ ...p, [k]: e.target.value }));
  const valid = f.description.trim() && parseFloat(f.odds) > 1 && parseFloat(f.stake) > 0 && f.bankrollId;

  // competitions filtered by sport
  const compList = (() => {
    const filtered = (competitions || []).filter(c => c.sport === f.sport);
    return filtered.length > 0 ? filtered : (competitions || []);
  })();

  const marketOptions = [{ v: "", l: "— Sem mercado —" }, ...(markets || []).map(m => ({ v: m, l: m }))];
  const strategyOptions = [{ v: "", l: "— Sem estratégia —" }, ...(strategies || []).map(s => ({ v: s.id, l: s.name }))];
  const sportOptions = [...SPORTS, ...(sports || [])].map(s => ({ v: s, l: s }));

  return (
    <Modal title={initial ? "Editar aposta" : "Registar aposta"} onClose={onClose} width={640}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Input label="Data" type="date" value={f.date} onChange={set("date")} />
        <Select label="Bankroll" value={f.bankrollId} onChange={set("bankrollId")}
          options={bankrolls.map(b => ({ v: b.id, l: b.name }))} />

        <SelectWithAdd
          label="Desporto"
          value={f.sport}
          onChange={e => setF(p => ({ ...p, sport: e.target.value, competition: "" }))}
          options={sportOptions}
          placeholder="Ex: 🏀 Basquetebol"
          onAdd={(s) => onAddSport && onAddSport(s)}
        />

        <CompetitionDropdown
          label="Competição / Liga"
          value={f.competition}
          onChange={(v) => setF(p => ({ ...p, competition: v }))}
          competitions={compList}
          onAdd={(name) => { onAddCompetition && onAddCompetition({ id: uid(), name, sport: f.sport, country: "", notes: "" }); setF(p => ({ ...p, competition: name })); }}
        />

        <div style={{ gridColumn: "1/-1" }}>
          <Input label="Evento / Jogo" value={f.description} onChange={set("description")} placeholder="Ex: Benfica vs Porto" />
        </div>

        <SelectWithAdd
          label="Mercado"
          value={f.market}
          onChange={set("market")}
          options={marketOptions}
          placeholder="Ex: Resultado final, Over 2.5…"
          onAdd={(m) => onAddMarket && onAddMarket(m)}
        />

        <Select label="Tipo de aposta" value={f.betType} onChange={set("betType")} options={BET_TYPES} />

        <Input label="Odds" type="number" min="1.01" step="0.01" value={f.odds} onChange={set("odds")} placeholder="2.50" />
        <Input label="Valor apostado (€)" type="number" min="0.01" step="0.01" value={f.stake} onChange={set("stake")} placeholder="10.00" />

        <Input label="Casa de apostas" value={f.bookmaker} onChange={set("bookmaker")} placeholder="Betclic, Bet365…" />

        <SelectWithAdd
          label="Estratégia"
          value={f.strategyId}
          onChange={set("strategyId")}
          options={strategyOptions}
          placeholder="Ex: Value Betting"
          onAdd={(name) => onAddStrategy && onAddStrategy({ id: uid(), name, description: "" })}
        />

        <Select label="Resultado" value={f.result} onChange={set("result")} options={RESULTS} />
        <Select label="Timing" value={f.timing} onChange={set("timing")} options={TIMINGS} />
        <Input label="Resultado do Jogo" value={f.gameResult} onChange={set("gameResult")} placeholder="Ex: 2-1" />

        <div style={{ gridColumn: "1/-1" }}>
          <label style={lbl}>Notas / Argumentação</label>
          <textarea value={f.notes} onChange={set("notes")} style={{ ...inp, resize: "vertical", minHeight: 72 }}
            placeholder="Contexto da aposta, análise…" />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
        <Btn onClick={onClose}>Cancelar</Btn>
        <Btn variant="primary" disabled={!valid}
          onClick={() => valid && onSave({ ...f, id: initial?.id || uid(), odds: parseFloat(f.odds), stake: parseFloat(f.stake) })}>
          Guardar aposta
        </Btn>
      </div>
    </Modal>
  );
}

// ─── TRANSACTION FORM ────────────────────────────────────────────────────────
function TxForm({ bankrolls, onSave, onClose }) {
  const [f, setF] = useState({ date: today(), bankrollId: bankrolls[0]?.id || "", type: "Depósito", amount: "", note: "" });
  const set = (k) => (e) => setF(p => ({ ...p, [k]: e.target.value }));
  const valid = parseFloat(f.amount) > 0 && f.bankrollId;
  return (
    <Modal title="Registo de movimento" onClose={onClose} width={440}>
      <div style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Input label="Data" type="date" value={f.date} onChange={set("date")} />
          <Select label="Bankroll" value={f.bankrollId} onChange={set("bankrollId")}
            options={bankrolls.map(b => ({ v: b.id, l: b.name }))} />
        </div>
        <Select label="Tipo" value={f.type} onChange={set("type")} options={["Depósito", "Levantamento"]} />
        <Input label="Valor (€)" type="number" min="0.01" step="0.01" value={f.amount} onChange={set("amount")} placeholder="100.00" />
        <Input label="Nota" value={f.note} onChange={set("note")} placeholder="Opcional…" />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
        <Btn onClick={onClose}>Cancelar</Btn>
        <Btn variant="primary" disabled={!valid}
          onClick={() => valid && onSave({ ...f, id: uid(), amount: parseFloat(f.amount) })}>
          Registar
        </Btn>
      </div>
    </Modal>
  );
}

// ─── STRATEGY FORM ───────────────────────────────────────────────────────────
function StrategyForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial || { name: "", description: "" });
  return (
    <Modal title={initial ? "Editar estratégia" : "Nova estratégia"} onClose={onClose} width={420}>
      <div style={{ display: "grid", gap: 14 }}>
        <Input label="Nome" value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Value Betting" />
        <div>
          <label style={lbl}>Descrição</label>
          <textarea value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))}
            style={{ ...inp, resize: "vertical", minHeight: 80 }} placeholder="Descreve a tua estratégia…" />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
        <Btn onClick={onClose}>Cancelar</Btn>
        <Btn variant="primary" disabled={!f.name.trim()}
          onClick={() => f.name.trim() && onSave({ ...f, id: initial?.id || uid() })}>
          Guardar
        </Btn>
      </div>
    </Modal>
  );
}

// ─── BANKROLL FORM ───────────────────────────────────────────────────────────
function BankrollForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial ? { ...initial, balance: String(initial.balance ?? 0) } : { name: "", balance: "" });
  return (
    <Modal title={initial ? "Editar bankroll" : "Novo bankroll"} onClose={onClose} width={400}>
      <div style={{ display: "grid", gap: 14 }}>
        <Input label="Nome" value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Futebol" />
        <Input label="Saldo inicial (€)" type="number" placeholder="0.00" value={f.balance} onChange={e => setF(p => ({ ...p, balance: e.target.value }))} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
        <Btn onClick={onClose}>Cancelar</Btn>
        <Btn variant="primary" disabled={!f.name.trim()}
          onClick={() => f.name.trim() && onSave({ ...f, balance: parseFloat(f.balance) || 0, id: initial?.id || uid() })}>
          Guardar
        </Btn>
      </div>
    </Modal>
  );
}

// ─── AI INSIGHTS ─────────────────────────────────────────────────────────────
function AIInsights({ bets, bankrolls }) {
  const [insight, setInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);

  // Build a compact context string from bets to inject in every call
  const buildContext = () => {
    const settled = bets.filter(b => b.result !== "Em aberto");
    const profit = settled.reduce((s, b) => s + (betProfit(b) ?? 0), 0);
    const wins = settled.filter(b => b.result === "Ganhou").length;
    const byComp = {};
    const byStrat = {};
    settled.forEach(b => {
      const c = b.competition || "Sem competição";
      byComp[c] = byComp[c] || { profit: 0, count: 0 };
      byComp[c].profit += betProfit(b) ?? 0;
      byComp[c].count++;
      const s = b.strategyId || "Sem estratégia";
      byStrat[s] = byStrat[s] || { profit: 0, count: 0 };
      byStrat[s].profit += betProfit(b) ?? 0;
      byStrat[s].count++;
    });
    const recentBets = [...bets].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20)
      .map(b => `${b.date} | ${b.description} | ${b.competition || "-"} | odds ${b.odds} | stake €${b.stake} | ${b.result}${b.gameResult ? ` (${b.gameResult})` : ""}${b.timing ? ` | timing: ${b.timing}` : ""}`).join("\n");
    return `DADOS DAS APOSTAS:
Total apostas: ${bets.length} (${settled.length} resolvidas)
Vitórias: ${wins} | Derrotas: ${settled.length - wins}
Lucro/Perda total: €${profit.toFixed(2)}
ROI: ${settled.reduce((s,b)=>s+b.stake,0) ? ((profit/settled.reduce((s,b)=>s+b.stake,0))*100).toFixed(2) : 0}%
Por competição: ${Object.entries(byComp).map(([k,v])=>`${k}: ${v.count} apostas €${v.profit.toFixed(2)}`).join(", ") || "sem dados"}
Últimas apostas:
${recentBets || "sem apostas"}`;
  };

  const getInsight = async () => {
    setLoadingInsight(true);
    setInsight("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `És um analista de apostas desportivas experiente. Analisa os dados fornecidos e dá insights concisos e práticos em português de Portugal. Sê direto, específico e útil. Usa bullet points. Máximo 300 palavras.\n\n${buildContext()}`,
          messages: [{ role: "user", content: "Analisa as minhas apostas e dá-me os principais insights e padrões que identifies." }]
        })
      });
      const data = await res.json();
      setInsight(data.content?.map(c => c.text || "").join("") || "Sem resposta.");
    } catch {
      setInsight("Erro ao obter insights. Tenta novamente.");
    }
    setLoadingInsight(false);
  };

  const askQuestion = async () => {
    const q = question.trim();
    if (!q) return;
    setQuestion("");
    const newHistory = [...chatHistory, { role: "user", content: q }];
    setChatHistory(newHistory);
    setLoadingChat(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `És um analista de apostas desportivas experiente. Responde em português de Portugal de forma direta e útil. Tens acesso aos seguintes dados:\n\n${buildContext()}`,
          messages: newHistory,
        })
      });
      const data = await res.json();
      const answer = data.content?.map(c => c.text || "").join("") || "Sem resposta.";
      setChatHistory([...newHistory, { role: "assistant", content: answer }]);
    } catch {
      setChatHistory([...newHistory, { role: "assistant", content: "Erro ao obter resposta. Tenta novamente." }]);
    }
    setLoadingChat(false);
  };

  const hasEnoughData = bets.filter(b => b.result !== "Em aberto").length >= 3;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, color: T.text }}>Insights IA</h2>
          <p style={{ margin: "4px 0 0", color: T.textSub, fontSize: 13 }}>Análise e chat sobre as tuas apostas</p>
        </div>
        <Btn variant="primary" onClick={getInsight} disabled={loadingInsight || !hasEnoughData}>
          {loadingInsight ? "A analisar…" : "✨ Analisar agora"}
        </Btn>
      </div>

      {!hasEnoughData && (
        <div style={{ background: T.pendingDim, border: `1px solid ${T.pending}22`, borderRadius: 10, padding: "14px 18px", color: T.textSub, fontSize: 13, marginBottom: 20 }}>
          Precisas de pelo menos 3 apostas resolvidas para obter insights.
        </div>
      )}

      {/* Auto analysis result */}
      {loadingInsight && (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <div style={{ color: T.textSub, fontSize: 14 }}>🤖 A analisar os teus padrões de aposta…</div>
          <div style={{ marginTop: 12, background: T.border, borderRadius: 4, height: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "60%", background: T.accent, borderRadius: 4 }} />
          </div>
        </div>
      )}

      {insight && !loadingInsight && (
        <div style={{ background: T.card, border: `1px solid ${T.accent}44`, borderRadius: 12, padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center" }}>
            <div style={{ background: T.accent, borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>✨</div>
            <div style={{ color: T.textSub, fontSize: 12 }}>Análise automática gerada por IA</div>
          </div>
          <div style={{ color: T.text, fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{insight}</div>
        </div>
      )}

      {/* Chat section */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: T.accent, borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>💬</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>Pergunta à IA</div>
            <div style={{ color: T.textMuted, fontSize: 12 }}>Faz qualquer pergunta sobre as tuas apostas</div>
          </div>
          {chatHistory.length > 0 && (
            <button onClick={() => setChatHistory([])} style={{ marginLeft: "auto", background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 12 }}>
              Limpar
            </button>
          )}
        </div>

        {/* Chat messages */}
        {chatHistory.length > 0 && (
          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12, maxHeight: 400, overflowY: "auto" }}>
            {chatHistory.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "80%",
                  background: msg.role === "user" ? T.accent : T.bg,
                  border: msg.role === "assistant" ? `1px solid ${T.border}` : "none",
                  color: msg.role === "user" ? "#fff" : T.text,
                  borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  padding: "10px 14px",
                  fontSize: 14,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loadingChat && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: "14px 14px 14px 4px", padding: "10px 16px", color: T.textMuted, fontSize: 14 }}>
                  A pensar…
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: "14px 20px", borderTop: chatHistory.length > 0 ? `1px solid ${T.border}` : "none", display: "flex", gap: 8 }}>
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (!loadingChat && question.trim()) askQuestion(); } }}
            placeholder="Ex: Em que competição tenho melhor ROI? Quais as apostas que perdi com odds mais baixas?"
            style={{ ...inp, flex: 1, resize: "none", height: 60, fontSize: 13, lineHeight: 1.5 }}
            disabled={loadingChat}
          />
          <button
            onClick={askQuestion}
            disabled={loadingChat || !question.trim()}
            style={{
              background: question.trim() && !loadingChat ? T.accent : T.pill,
              color: question.trim() && !loadingChat ? "#fff" : T.textMuted,
              border: "none", borderRadius: 10, padding: "0 18px",
              cursor: question.trim() && !loadingChat ? "pointer" : "default",
              fontWeight: 700, fontSize: 13, flexShrink: 0, alignSelf: "stretch",
              transition: "background .15s",
            }}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── REPORTS VIEW ────────────────────────────────────────────────────────────
function ReportsView({ bets, strategies, periodFilter, periodLabel }) {
  const [groupBy, setGroupBy] = useState("sport");

  const settled = bets.filter(b => b.result !== "Em aberto" && b.result !== "Void");

  const groups = (() => {
    const map = {};
    settled.forEach(b => {
      let key;
      if (groupBy === "sport") key = b.sport;
      else if (groupBy === "competition") key = b.competition || "Sem competição";
      else if (groupBy === "bookmaker") key = b.bookmaker || "Sem casa";
      else if (groupBy === "strategy") {
        const s = strategies.find(s => s.id === b.strategyId);
        key = s ? s.name : "Sem estratégia";
      } else if (groupBy === "betType") key = b.betType;
      else if (groupBy === "timing") key = b.timing || "Sem timing";
      else if (groupBy === "oddsRange") {
        if (b.odds < 1.5) key = "< 1.50";
        else if (b.odds < 2) key = "1.50 – 2.00";
        else if (b.odds < 3) key = "2.00 – 3.00";
        else key = "> 3.00";
      }
      if (!map[key]) map[key] = [];
      map[key].push(b);
    });
    return Object.entries(map).map(([name, items]) => {
      const wins = items.filter(b => b.result === "Ganhou").length;
      const staked = items.reduce((s, b) => s + b.stake, 0);
      const profit = items.reduce((s, b) => s + (betProfit(b) ?? 0), 0);
      const roi = staked ? (profit / staked) * 100 : 0;
      return { name, count: items.length, wins, staked, profit, roi };
    }).sort((a, b) => b.profit - a.profit);
  })();

  const maxAbs = Math.max(1, ...groups.map(g => Math.abs(g.profit)));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, color: T.text }}>Relatórios</h2>
          <p style={{ margin: "4px 0 0", color: T.textSub, fontSize: 13 }}>
            Analisa onde ganhas e perdes · <span style={{ color: T.accent }}>{periodLabel}</span>
          </p>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[["sport", "Desporto"], ["competition", "Competição"], ["bookmaker", "Casa de apostas"], ["strategy", "Estratégia"], ["betType", "Tipo"], ["timing", "Timing"], ["oddsRange", "Range de odds"]].map(([v, l]) => (
            <button key={v} onClick={() => setGroupBy(v)} style={{
              background: groupBy === v ? T.accent : T.pill,
              color: groupBy === v ? "#fff" : T.textSub,
              border: "none", borderRadius: 8, padding: "6px 13px", cursor: "pointer", fontSize: 12, fontWeight: 600,
            }}>{l}</button>
          ))}
        </div>
      </div>

      {groups.length === 0 ? (
        <div style={{ textAlign: "center", color: T.textMuted, padding: "60px 0", fontSize: 14 }}>
          Sem dados suficientes para este relatório.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {groups.map(g => (
            <div key={g.name} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{g.name}</div>
                  <div style={{ color: T.textMuted, fontSize: 12, marginTop: 2 }}>{g.count} apostas · {g.wins} vitórias</div>
                </div>
                <div style={{ minWidth: 80, textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: T.textMuted }}>Apostado</div>
                  <div style={{ fontFamily: "monospace", fontSize: 13, color: T.textSub }}>{fmtAbs(g.staked)}</div>
                </div>
                <div style={{ minWidth: 80, textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: T.textMuted }}>ROI</div>
                  <div style={{ fontFamily: "monospace", fontSize: 13, color: g.roi >= 0 ? T.win : T.loss }}>{pct(g.roi)}</div>
                </div>
                <div style={{ minWidth: 90, textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: T.textMuted }}>Lucro/Perda</div>
                  <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: g.profit >= 0 ? T.win : T.loss }}>
                    {g.profit >= 0 ? "+" : ""}{fmtAbs(g.profit)}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 10, background: T.bg, borderRadius: 4, height: 6, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${(Math.abs(g.profit) / maxAbs) * 100}%`,
                  background: g.profit >= 0 ? T.win : T.loss,
                  borderRadius: 4,
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ─── BANKROLL VIEW ───────────────────────────────────────────────────────────
function BankrollView({ state, dispatch }) {
  const [showBankrollForm, setShowBankrollForm] = useState(false);
  const [editingBankroll, setEditingBankroll] = useState(null);
  const [showTxForm, setShowTxForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // bankroll id to confirm delete

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, color: T.text }}>Bankrolls</h2>
          <p style={{ margin: "4px 0 0", color: T.textSub, fontSize: 13 }}>Gere os teus fundos por carteira</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn onClick={() => setShowTxForm(true)}>
            <Icon d={icons.wallet} size={15} /> Depósito / Levantamento
          </Btn>
          <Btn variant="primary" onClick={() => { setEditingBankroll(null); setShowBankrollForm(true); }}>
            <Icon d={icons.plus} size={15} /> Novo bankroll
          </Btn>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        {state.bankrolls.map(bk => {
          const bkBets = state.bets.filter(b => b.bankrollId === bk.id && b.result !== "Em aberto");
          const profit = bkBets.reduce((s, b) => s + (betProfit(b) ?? 0), 0);
          const txBalance = state.transactions.filter(t => t.bankrollId === bk.id)
            .reduce((s, t) => s + (t.type === "Depósito" ? t.amount : -t.amount), 0);
          const totalBalance = bk.balance + txBalance + profit;

          // balance curve
          const curve = (() => {
            let running = bk.balance + txBalance;
            return bkBets.sort((a, c) => a.date.localeCompare(c.date)).map(b => {
              running += betProfit(b) ?? 0;
              return running;
            });
          })();

          return (
            <div key={bk.id} style={{
              background: T.card, border: `1px solid ${T.border}`, borderRadius: 14,
              padding: "20px", flex: "1 1 260px", minWidth: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: bk.color }} />
                  <span style={{ fontWeight: 700, fontSize: 15, color: T.text }}>{bk.name}</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => { setEditingBankroll(bk); setShowBankrollForm(true); }}
                    style={{ background: T.pill, border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: T.textSub }}>
                    <Icon d={icons.edit} size={13} />
                  </button>
                  <button onClick={() => setConfirmDelete(bk.id)}
                    style={{ background: T.pill, border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: T.loss }}>
                    <Icon d={icons.trash} size={13} />
                  </button>
                </div>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 26, fontWeight: 800, color: totalBalance >= 0 ? T.win : T.loss }}>
                {fmtAbs(totalBalance)}
              </div>
              <div style={{ color: T.textMuted, fontSize: 12, marginTop: 2 }}>Saldo atual</div>
              <div style={{ marginTop: 12, height: 50, opacity: 0.8 }}>
                <Sparkline data={curve.length > 1 ? curve : [totalBalance - profit, totalBalance]} color={profit >= 0 ? T.win : T.loss} height={50} />
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                <div>
                  <div style={{ color: T.textMuted, fontSize: 11 }}>Lucro</div>
                  <div style={{ fontFamily: "monospace", fontSize: 13, color: profit >= 0 ? T.win : T.loss }}>
                    {profit >= 0 ? "+" : ""}{fmtAbs(profit)}
                  </div>
                </div>
                <div>
                  <div style={{ color: T.textMuted, fontSize: 11 }}>Apostas</div>
                  <div style={{ fontFamily: "monospace", fontSize: 13, color: T.textSub }}>{bkBets.length}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction history */}
      <h3 style={{ color: T.text, fontSize: 15, marginBottom: 12 }}>Histórico de movimentos</h3>
      {state.transactions.length === 0 ? (
        <div style={{ color: T.textMuted, fontSize: 13, padding: "24px 0" }}>Sem movimentos registados.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[...state.transactions].sort((a, b) => b.date.localeCompare(a.date)).map(tx => {
            const bk = state.bankrolls.find(b => b.id === tx.bankrollId);
            return (
              <div key={tx.id} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: tx.type === "Depósito" ? T.winDim : T.lossDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  {tx.type === "Depósito" ? "↓" : "↑"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: T.text }}>{tx.type}</div>
                  <div style={{ color: T.textMuted, fontSize: 12 }}>{tx.date} · {bk?.name || "—"}{tx.note ? ` · ${tx.note}` : ""}</div>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 700, color: tx.type === "Depósito" ? T.win : T.loss }}>
                  {tx.type === "Depósito" ? "+" : "-"}{fmtAbs(tx.amount)}
                </div>
                <button onClick={() => dispatch({ type: "DEL_TX", id: tx.id })}
                  style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", padding: 4 }}>
                  <Icon d={icons.trash} size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {showBankrollForm && (
        <BankrollForm
          initial={editingBankroll}
          onClose={() => { setShowBankrollForm(false); setEditingBankroll(null); }}
          onSave={(bk) => { dispatch({ type: editingBankroll ? "UPD_BANKROLL" : "ADD_BANKROLL", bankroll: bk }); setShowBankrollForm(false); setEditingBankroll(null); }}
        />
      )}
      {showTxForm && (
        <TxForm bankrolls={state.bankrolls} onClose={() => setShowTxForm(false)}
          onSave={(tx) => { dispatch({ type: "ADD_TX", tx }); setShowTxForm(false); }} />
      )}
      {confirmDelete && (
        <ConfirmDialog
          message="Tens a certeza que queres apagar este bankroll? As apostas associadas serão reatribuídas ao próximo bankroll disponível."
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => { dispatch({ type: "DEL_BANKROLL", id: confirmDelete }); setConfirmDelete(null); }}
        />
      )}
    </div>
  );
}

// ─── STRATEGIES VIEW ─────────────────────────────────────────────────────────
function StrategiesView({ state, dispatch }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, color: T.text }}>Estratégias</h2>
          <p style={{ margin: "4px 0 0", color: T.textSub, fontSize: 13 }}>Avalia o desempenho de cada estratégia</p>
        </div>
        <Btn variant="primary" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Icon d={icons.plus} size={15} /> Nova estratégia
        </Btn>
      </div>

      {state.strategies.length === 0 ? (
        <div style={{ textAlign: "center", color: T.textMuted, padding: "60px 0", fontSize: 14 }}>
          Cria a tua primeira estratégia e atribui apostas a ela.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {state.strategies.map(s => {
            const sBets = state.bets.filter(b => b.strategyId === s.id && b.result !== "Em aberto" && b.result !== "Void");
            const wins = sBets.filter(b => b.result === "Ganhou").length;
            const staked = sBets.reduce((acc, b) => acc + b.stake, 0);
            const profit = sBets.reduce((acc, b) => acc + (betProfit(b) ?? 0), 0);
            const roi = staked ? (profit / staked) * 100 : 0;
            return (
              <div key={s.id} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: T.text }}>{s.name}</div>
                      {s.description && <div style={{ color: T.textMuted, fontSize: 12, marginTop: 3 }}>{s.description}</div>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: T.textMuted, fontSize: 11 }}>Apostas</div>
                      <div style={{ fontFamily: "monospace", fontSize: 14, color: T.text }}>{sBets.length}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: T.textMuted, fontSize: 11 }}>Vitórias</div>
                      <div style={{ fontFamily: "monospace", fontSize: 14, color: T.text }}>{wins}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: T.textMuted, fontSize: 11 }}>ROI</div>
                      <div style={{ fontFamily: "monospace", fontSize: 14, color: roi >= 0 ? T.win : T.loss }}>{pct(roi)}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: T.textMuted, fontSize: 11 }}>Lucro</div>
                      <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: profit >= 0 ? T.win : T.loss }}>
                        {profit >= 0 ? "+" : "-"}{fmtAbs(profit)}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, alignSelf: "center" }}>
                      <button onClick={() => { setEditing(s); setShowForm(true); }}
                        style={{ background: T.pill, border: "none", borderRadius: 6, padding: "6px 9px", cursor: "pointer", color: T.textSub }}>
                        <Icon d={icons.edit} size={13} />
                      </button>
                      <button onClick={() => dispatch({ type: "DEL_STRATEGY", id: s.id })}
                        style={{ background: T.pill, border: "none", borderRadius: 6, padding: "6px 9px", cursor: "pointer", color: T.loss }}>
                        <Icon d={icons.trash} size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <StrategyForm
          initial={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSave={(s) => { dispatch({ type: editing ? "UPD_STRATEGY" : "ADD_STRATEGY", strategy: s }); setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

// ─── IMPORT / EXPORT MODAL ────────────────────────────────────────────────────
const CSV_COLUMNS = [
  "date", "bankrollId", "sport", "competition", "description", "market",
  "betType", "bookmaker", "strategyId", "odds", "stake", "result",
  "timing", "gameResult", "notes",
];

function betsToCSV(bets) {
  const header = CSV_COLUMNS.join(",");
  const rows = bets.map(b =>
    CSV_COLUMNS.map(col => {
      let v = b[col] ?? "";
      v = String(v).replace(/"/g, '""');
      if (v.includes(",") || v.includes("\n") || v.includes('"')) v = `"${v}"`;
      return v;
    }).join(",")
  );
  return [header, ...rows].join("\n");
}

function csvToBets(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const header = parseCSVLine(lines[0]);
  const bets = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const obj = {};
    header.forEach((col, idx) => { obj[col.trim()] = values[idx] ?? ""; });
    bets.push({
      id: uid(),
      date: obj.date || today(),
      bankrollId: obj.bankrollId || "",
      sport: obj.sport || SPORTS[0],
      competition: obj.competition || "",
      description: obj.description || "",
      market: obj.market || "",
      betType: obj.betType || BET_TYPES[0],
      bookmaker: obj.bookmaker || "",
      strategyId: obj.strategyId || "",
      odds: parseFloat(obj.odds) || 0,
      stake: parseFloat(obj.stake) || 0,
      result: obj.result || "Em aberto",
      timing: obj.timing || TIMINGS[0],
      gameResult: obj.gameResult || "",
      notes: obj.notes || "",
    });
  }
  return bets;
}

function parseCSVLine(line) {
  const result = [];
  let cur = "", inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { cur += c; }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { result.push(cur); cur = ""; }
      else cur += c;
    }
  }
  result.push(cur);
  return result;
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function ImportExportModal({ state, dispatch, onClose }) {
  const [tab, setTab] = useState("export"); // "export" | "import"
  const [importText, setImportText] = useState("");
  const [importFormat, setImportFormat] = useState("json");
  const [importMode, setImportMode] = useState("merge"); // "merge" | "replace"
  const [feedback, setFeedback] = useState(null);

  const exportJSON = () => {
    downloadFile(`becson-bets-${today()}.json`, JSON.stringify(state, null, 2), "application/json");
  };

  const exportCSV = () => {
    downloadFile(`becson-bets-${today()}.csv`, betsToCSV(state.bets), "text/csv");
  };

  const handleImport = () => {
    setFeedback(null);
    try {
      if (importFormat === "json") {
        const parsed = JSON.parse(importText);
        const incoming = Array.isArray(parsed) ? parsed : parsed.bets;
        if (!Array.isArray(incoming)) throw new Error("Formato inválido — esperava uma lista de apostas.");
        const bets = incoming.map(b => ({ ...b, id: b.id || uid() }));
        if (importMode === "replace") {
          dispatch({ type: "REPLACE_STATE", state: { ...state, bets, ...(parsed.bankrolls ? { bankrolls: parsed.bankrolls } : {}), ...(parsed.competitions ? { competitions: parsed.competitions } : {}), ...(parsed.strategies ? { strategies: parsed.strategies } : {}), ...(parsed.markets ? { markets: parsed.markets } : {}), ...(parsed.sports ? { sports: parsed.sports } : {}) } });
        } else {
          bets.forEach(b => dispatch({ type: "ADD_BET", bet: b }));
        }
        setFeedback({ ok: true, msg: `${bets.length} apostas importadas com sucesso.` });
      } else {
        const bets = csvToBets(importText);
        if (bets.length === 0) throw new Error("Não foi possível ler nenhuma linha válida do CSV.");
        if (importMode === "replace") {
          dispatch({ type: "REPLACE_STATE", state: { ...state, bets } });
        } else {
          bets.forEach(b => dispatch({ type: "ADD_BET", bet: b }));
        }
        setFeedback({ ok: true, msg: `${bets.length} apostas importadas com sucesso.` });
      }
      setImportText("");
    } catch (e) {
      setFeedback({ ok: false, msg: "Erro ao importar: " + e.message });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImportText(ev.target.result);
      if (file.name.endsWith(".csv")) setImportFormat("csv");
      else setImportFormat("json");
    };
    reader.readAsText(file);
  };

  return (
    <Modal title="Importar / Exportar dados" onClose={onClose} width={560}>
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {[["export", "Exportar"], ["import", "Importar"]].map(([k, l]) => (
          <button key={k} onClick={() => { setTab(k); setFeedback(null); }} style={{
            flex: 1, background: tab === k ? T.accent : T.pill,
            color: tab === k ? "#fff" : T.textSub,
            border: "none", borderRadius: 8, padding: "10px", cursor: "pointer", fontWeight: 700, fontSize: 13,
          }}>{l}</button>
        ))}
      </div>

      {tab === "export" && (
        <div>
          <p style={{ color: T.textSub, fontSize: 13, marginBottom: 18, lineHeight: 1.6 }}>
            Descarrega todos os teus dados — apostas, bankrolls, competições, estratégias — para guardar uma cópia de segurança ou levar para outro sítio.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Btn variant="primary" onClick={exportJSON} style={{ justifyContent: "center", padding: "12px" }}>
              ⬇ Exportar tudo como JSON
            </Btn>
            <Btn onClick={exportCSV} style={{ justifyContent: "center", padding: "12px" }}>
              ⬇ Exportar apenas apostas como CSV
            </Btn>
          </div>
          <div style={{ marginTop: 16, color: T.textMuted, fontSize: 12, lineHeight: 1.6 }}>
            JSON guarda tudo (apostas, bankrolls, competições, estratégias). CSV guarda só a lista de apostas, útil para abrir em Excel/Sheets.
          </div>
        </div>
      )}

      {tab === "import" && (
        <div>
          <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
            <Select label="Formato" value={importFormat} onChange={e => setImportFormat(e.target.value)}
              options={[{ v: "json", l: "JSON" }, { v: "csv", l: "CSV" }]} />
            <Select label="Modo" value={importMode} onChange={e => setImportMode(e.target.value)}
              options={[{ v: "merge", l: "Adicionar às existentes" }, { v: "replace", l: "Substituir tudo" }]} />
          </div>

          <label style={lbl}>Carregar ficheiro</label>
          <input type="file" accept=".json,.csv" onChange={handleFileUpload}
            style={{ ...inp, padding: "8px 10px", marginBottom: 14 }} />

          <label style={lbl}>Ou cola o conteúdo aqui</label>
          <textarea
            value={importText}
            onChange={e => setImportText(e.target.value)}
            placeholder={importFormat === "json" ? '{"bets": [...]}' : "date,bankrollId,sport,..."}
            style={{ ...inp, minHeight: 140, fontFamily: "monospace", fontSize: 12, resize: "vertical" }}
          />

          {importMode === "replace" && (
            <div style={{ background: T.lossDim, border: `1px solid ${T.loss}33`, borderRadius: 8, padding: "10px 14px", marginTop: 12, color: T.loss, fontSize: 12 }}>
              ⚠ Atenção: "Substituir tudo" apaga as apostas atuais e troca pelas do ficheiro.
            </div>
          )}

          {feedback && (
            <div style={{
              marginTop: 14, padding: "10px 14px", borderRadius: 8, fontSize: 13,
              background: feedback.ok ? T.winDim : T.lossDim,
              color: feedback.ok ? T.win : T.loss,
            }}>
              {feedback.msg}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
            <Btn onClick={onClose}>Fechar</Btn>
            <Btn variant="primary" disabled={!importText.trim()} onClick={handleImport}>
              Importar
            </Btn>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── BETS LIST VIEW ──────────────────────────────────────────────────────────
function BetsView({ state, dispatch }) {
  const [showForm, setShowForm] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterResult, setFilterResult] = useState("Todos");
  const [filterSport, setFilterSport] = useState("Todos");
  const [filterBankroll, setFilterBankroll] = useState("Todos");
  const [sortBy, setSortBy] = useState("date_desc");
  const [expandedId, setExpandedId] = useState(null);

  const uniqueSports = ["Todos", ...new Set(state.bets.map(b => b.sport))];

  const filtered = state.bets
    .filter(b =>
      (filterResult === "Todos" || (filterResult === "💡 Previstos" ? b.isDraft === true : (!b.isDraft && b.result === filterResult))) &&
      (filterSport === "Todos" || b.sport === filterSport) &&
      (filterBankroll === "Todos" || b.bankrollId === filterBankroll) &&
      (!search || [b.description, b.market, b.competition, b.bookmaker].some(f => f?.toLowerCase().includes(search.toLowerCase())))
    )
    .sort((a, b) => {
      if (sortBy === "date_desc") return b.date.localeCompare(a.date);
      if (sortBy === "date_asc")  return a.date.localeCompare(b.date);
      if (sortBy === "stake")     return b.stake - a.stake;
      if (sortBy === "odds")      return b.odds - a.odds;
      if (sortBy === "profit") {
        const pa = betProfit(a) ?? -Infinity, pb = betProfit(b) ?? -Infinity;
        return pb - pa;
      }
      return 0;
    });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, color: T.text }}>Apostas</h2>
          <p style={{ margin: "4px 0 0", color: T.textSub, fontSize: 13 }}>{state.bets.length} apostas registadas</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Btn onClick={() => setShowImportExport(true)}>
            <Icon d={icons.reports} size={14} /> Importar / Exportar
          </Btn>
          <Btn variant="primary" onClick={() => { setEditing(null); setShowForm(true); }}>
            <Icon d={icons.plus} size={15} /> Registar aposta
          </Btn>
        </div>
      </div>

      {/* filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 180px", maxWidth: 240 }}>
          <Icon d={icons.search} size={14} color={T.textMuted} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar…"
            style={{ ...inp, paddingLeft: 32 }} />
        </div>
        <select value={filterResult} onChange={e => setFilterResult(e.target.value)} style={{ ...inp, width: "auto" }}>
          {["Todos", "💡 Previstos", ...RESULTS].map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={filterSport} onChange={e => setFilterSport(e.target.value)} style={{ ...inp, width: "auto" }}>
          {uniqueSports.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterBankroll} onChange={e => setFilterBankroll(e.target.value)} style={{ ...inp, width: "auto" }}>
          <option value="Todos">Todos os bankrolls</option>
          {state.bankrolls.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...inp, width: "auto" }}>
          <option value="date_desc">Mais recentes</option>
          <option value="date_asc">Mais antigas</option>
          <option value="stake">Maior valor</option>
          <option value="odds">Maiores odds</option>
          <option value="profit">Maior lucro</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", color: T.textMuted, padding: "60px 0", fontSize: 14 }}>
          {state.bets.length === 0
            ? <span>Ainda não tens apostas. Clica em <strong style={{ color: T.accent }}>Registar aposta</strong>.</span>
            : "Nenhuma aposta corresponde aos filtros."}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.map(bet => {
            const isDraft = bet.isDraft === true;
            const profit = isDraft ? null : betProfit(bet);
            const bk = state.bankrolls.find(b => b.id === bet.bankrollId);
            const strategy = state.strategies.find(s => s.id === bet.strategyId);
            const expanded = expandedId === bet.id;
            return (
              <div key={bet.id} style={{
                background: isDraft ? "#111A11" : T.card,
                border: `1px solid ${isDraft ? "#2D5A2D" : T.border}`,
                borderRadius: 10, overflow: "hidden",
              }}>
                <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", cursor: "pointer" }}
                  onClick={() => setExpandedId(expanded ? null : bet.id)}>
                  {/* left accent */}
                  <div style={{ width: 3, height: 36, borderRadius: 2, background: isDraft ? "#4ADE80" : RES_COLOR[bet.result], flexShrink: 0 }} />

                  <div style={{ minWidth: 74 }}>
                    <div style={{ color: T.textMuted, fontSize: 11 }}>{bet.date}</div>
                    <div style={{ fontSize: 12, color: T.textSub, marginTop: 2 }}>{bet.sport?.split(" ")[0]}</div>
                  </div>

                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{bet.description}</div>
                    <div style={{ color: T.textMuted, fontSize: 12, marginTop: 1 }}>
                      {[bet.competition, isDraft ? null : bet.market].filter(Boolean).join(" · ")}
                    </div>
                  </div>

                  {isDraft ? (
                    <span style={{ background: "#1A3A1A", color: "#4ADE80", borderRadius: 20, padding: "3px 11px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>💡 Previsto</span>
                  ) : (
                    <>
                      <div style={{ fontFamily: "monospace", color: T.accent, fontSize: 14, minWidth: 46 }}>
                        @{bet.odds?.toFixed(2)}
                      </div>
                      <div style={{ fontFamily: "monospace", fontSize: 14, minWidth: 64, textAlign: "right" }}>
                        {fmtAbs(bet.stake)}
                      </div>
                      <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, minWidth: 80, textAlign: "right",
                        color: profit === null ? T.textMuted : profit >= 0 ? T.win : T.loss }}>
                        {profit === null ? "—" : (profit >= 0 ? "+" : "-") + fmtAbs(profit)}
                      </div>
                      <Badge result={bet.result} />
                    </>
                  )}

                  <Icon d={icons.chevron} size={14} color={T.textMuted} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: ".2s", flexShrink: 0 }} />
                </div>

                {expanded && (
                  <div style={{ borderTop: `1px solid ${isDraft ? "#2D5A2D" : T.border}`, padding: "14px 20px", background: T.bg }}>
                    {bet.notes && (
                      <div style={{ background: T.card, borderRadius: 8, padding: "10px 14px", marginBottom: 14, color: T.textSub, fontSize: 13, lineHeight: 1.6 }}>
                        {bet.notes}
                      </div>
                    )}
                    {!isDraft && (
                      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 14 }}>
                        {[
                          ["Casa de apostas", bet.bookmaker || "—"],
                          ["Bankroll", bk?.name || "—"],
                          ["Estratégia", strategy?.name || "—"],
                          ["Tipo", bet.betType],
                          ["Retorno potencial", fmtAbs(bet.stake * bet.odds)],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <div style={{ color: T.textMuted, fontSize: 11 }}>{k}</div>
                            <div style={{ color: T.textSub, fontSize: 13, fontWeight: 500 }}>{v}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {isDraft && (
                        <Btn variant="primary" onClick={() => { dispatch({ type: "UPD_BET", bet: { ...bet, isDraft: false } }); setEditing({ ...bet, isDraft: false }); setShowForm(true); }}>
                          <Icon d={icons.plus} size={13} /> Converter em aposta
                        </Btn>
                      )}
                      <Btn onClick={() => { setEditing(bet); setShowForm(isDraft ? false : true); if (isDraft) { setEditing(bet); setShowForm(true); } }}>
                        <Icon d={icons.edit} size={13} /> Editar
                      </Btn>
                      <Btn variant="danger" style={{ padding: "7px 13px" }}
                        onClick={() => dispatch({ type: "DEL_BET", id: bet.id })}>
                        <Icon d={icons.trash} size={13} /> Apagar
                      </Btn>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <BetForm
          initial={editing}
          bankrolls={state.bankrolls}
          strategies={state.strategies}
          competitions={state.competitions || []}
          markets={state.markets || []}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSave={(bet) => { dispatch({ type: editing ? "UPD_BET" : "ADD_BET", bet }); setShowForm(false); setEditing(null); }}
          onAddMarket={(m) => dispatch({ type: "ADD_MARKET", market: m })}
          onAddCompetition={(c) => dispatch({ type: "ADD_COMPETITION", competition: c })}
          onAddStrategy={(s) => dispatch({ type: "ADD_STRATEGY", strategy: s })}
          sports={state.sports || []}
          onAddSport={(s) => dispatch({ type: "ADD_SPORT", sport: s })}
        />
      )}
      {showImportExport && (
        <ImportExportModal
          state={state}
          dispatch={dispatch}
          onClose={() => setShowImportExport(false)}
        />
      )}
    </div>
  );
}

// ─── DASHBOARD VIEW ───────────────────────────────────────────────────────────
function DashboardView({ state, periodFilter, periodLabel }) {
  const allSettled = state.bets.filter(b => b.result !== "Em aberto" && b.result !== "Void");
  const settled = allSettled.filter(periodFilter);
  const wins    = settled.filter(b => b.result === "Ganhou");
  const losses  = settled.filter(b => b.result === "Perdeu");
  const pending = state.bets.filter(b => b.result === "Em aberto");

  const totalStaked  = settled.reduce((s, b) => s + b.stake, 0);
  const totalProfit  = settled.reduce((s, b) => s + (betProfit(b) ?? 0), 0);
  const roi          = totalStaked ? (totalProfit / totalStaked) * 100 : 0;
  const winRate      = settled.length ? (wins.length / settled.length) * 100 : 0;
  const avgOdds      = settled.length ? settled.reduce((s, b) => s + b.odds, 0) / settled.length : 0;
  const avgStake     = settled.length ? totalStaked / settled.length : 0;
  const pendingStake = pending.reduce((s, b) => s + b.stake, 0);

  // balance over time (filtered period)
  const balanceCurve = (() => {
    let running = 0;
    return [...settled].sort((a, b) => a.date.localeCompare(b.date)).map(b => {
      running += betProfit(b) ?? 0;
      return running;
    });
  })();

  // last 5 bets (always global)
  const recent = [...state.bets].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  // by sport (filtered)
  const bySport = {};
  settled.forEach(b => {
    bySport[b.sport] = bySport[b.sport] || { profit: 0, count: 0 };
    bySport[b.sport].profit += betProfit(b) ?? 0;
    bySport[b.sport].count++;
  });
  const sportEntries = Object.entries(bySport).sort((a, b) => b[1].profit - a[1].profit);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ margin: 0, fontSize: 18, color: T.text }}>Dashboard</h2>
        <div style={{ color: T.textSub, fontSize: 13 }}>
          A mostrar: <span style={{ color: T.accent, fontWeight: 600 }}>{periodLabel}</span>
        </div>
      </div>

      {/* main stats */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <StatBox label="Lucro / Perda" value={(totalProfit >= 0 ? "+" : "-") + fmtAbs(totalProfit)} color={totalProfit >= 0 ? T.win : T.loss} />
        <StatBox label="ROI" value={pct(roi)} color={roi >= 0 ? T.win : T.loss} sub={`sobre ${fmtAbs(totalStaked)} apostados`} />
        <StatBox label="Taxa de vitória" value={pct(winRate).replace("+", "")} color={T.text} sub={`${wins.length} vitórias · ${losses.length} derrotas`} />
        <StatBox label="Em aberto" value={pending.length} sub={`${fmtAbs(pendingStake)} em risco`} color={T.pending} />
        <StatBox label="Odds média" value={avgOdds ? avgOdds.toFixed(2) : "—"} sub="apostas resolvidas" small />
        <StatBox label="Valor médio" value={avgStake ? fmtAbs(avgStake) : "—"} sub="por aposta" small />
      </div>

      {/* balance curve */}
      {balanceCurve.length > 1 && (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 22px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: T.text }}>Evolução do saldo</div>
            <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 700, color: totalProfit >= 0 ? T.win : T.loss }}>
              {totalProfit >= 0 ? "+" : "-"}{fmtAbs(totalProfit)}
            </div>
          </div>
          <Sparkline data={[0, ...balanceCurve]} color={totalProfit >= 0 ? T.win : T.loss} height={100} />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* by sport */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 20px" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 14 }}>Por desporto</div>
          {sportEntries.length === 0
            ? <div style={{ color: T.textMuted, fontSize: 13 }}>Sem dados</div>
            : sportEntries.map(([sport, { profit, count }]) => (
              <div key={sport} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: T.textSub }}>{sport}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: profit >= 0 ? T.win : T.loss }}>
                    {profit >= 0 ? "+" : "-"}{fmtAbs(profit)}
                  </span>
                </div>
                <div style={{ background: T.bg, borderRadius: 3, height: 5 }}>
                  <div style={{ height: "100%", width: `${Math.min(100, (Math.abs(profit) / Math.max(...sportEntries.map(e => Math.abs(e[1].profit)), 1)) * 100)}%`, background: profit >= 0 ? T.win : T.loss, borderRadius: 3 }} />
                </div>
              </div>
            ))
          }
        </div>

        {/* recent activity — always global */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 20px" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 14 }}>Últimas apostas</div>
          {recent.length === 0
            ? <div style={{ color: T.textMuted, fontSize: 13 }}>Sem apostas</div>
            : recent.map(bet => {
              const profit = betProfit(bet);
              return (
                <div key={bet.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: T.text, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{bet.description}</div>
                    <div style={{ fontSize: 11, color: T.textMuted }}>{bet.date}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, marginLeft: 8 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 12, color: profit === null ? T.textMuted : profit >= 0 ? T.win : T.loss }}>
                      {profit === null ? "—" : (profit >= 0 ? "+" : "-") + fmtAbs(profit)}
                    </span>
                    <Badge result={bet.result} />
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
}

// ─── COMPETITIONS VIEW ───────────────────────────────────────────────────────
function CompetitionForm({ initial, onSave, onClose, sports }) {
  const [f, setF] = useState(initial || { name: "", sport: SPORTS[0], country: "", notes: "" });
  return (
    <Modal title={initial ? "Editar competição" : "Nova competição"} onClose={onClose} width={440}>
      <div style={{ display: "grid", gap: 14 }}>
        <Input label="Nome" value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Primeira Liga" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Select label="Desporto" value={f.sport} onChange={e => setF(p => ({ ...p, sport: e.target.value }))} options={[...SPORTS, ...(sports || [])]} />
          <Input label="País / Região" value={f.country} onChange={e => setF(p => ({ ...p, country: e.target.value }))} placeholder="Ex: Portugal" />
        </div>
        <div>
          <label style={lbl}>Notas</label>
          <textarea value={f.notes} onChange={e => setF(p => ({ ...p, notes: e.target.value }))}
            style={{ ...inp, resize: "vertical", minHeight: 72 }} placeholder="Informação adicional…" />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
        <Btn onClick={onClose}>Cancelar</Btn>
        <Btn variant="primary" disabled={!f.name.trim()}
          onClick={() => f.name.trim() && onSave({ ...f, id: initial?.id || uid() })}>
          Guardar
        </Btn>
      </div>
    </Modal>
  );
}

function CompetitionsView({ state, dispatch }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [filterSport, setFilterSport] = useState("Todos");

  const competitions = state.competitions || [];
  const filtered = filterSport === "Todos" ? competitions : competitions.filter(c => c.sport === filterSport);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, color: T.text }}>Competições</h2>
          <p style={{ margin: "4px 0 0", color: T.textSub, fontSize: 13 }}>Gere as competições que acompanhas</p>
        </div>
        <Btn variant="primary" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Icon d={icons.plus} size={15} /> Nova competição
        </Btn>
      </div>

      {/* filter by sport */}
      {competitions.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
          {["Todos", ...new Set(competitions.map(c => c.sport))].map(s => (
            <button key={s} onClick={() => setFilterSport(s)} style={{
              background: filterSport === s ? T.accent : T.pill,
              color: filterSport === s ? "#fff" : T.textSub,
              border: "none", borderRadius: 8, padding: "6px 13px", cursor: "pointer", fontSize: 12, fontWeight: 600,
            }}>{s}</button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", color: T.textMuted, padding: "60px 0", fontSize: 14 }}>
          {competitions.length === 0
            ? <span>Ainda não tens competições. Clica em <strong style={{ color: T.accent }}>Nova competição</strong>.</span>
            : "Nenhuma competição corresponde ao filtro."}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(c => {
            const cBets = state.bets.filter(b => b.competition === c.name && b.result !== "Em aberto" && b.result !== "Void");
            const wins = cBets.filter(b => b.result === "Ganhou").length;
            const staked = cBets.reduce((s, b) => s + b.stake, 0);
            const profit = cBets.reduce((s, b) => s + (betProfit(b) ?? 0), 0);
            const roi = staked ? (profit / staked) * 100 : 0;
            const pending = state.bets.filter(b => b.competition === c.name && b.result === "Em aberto").length;

            return (
              <div key={c.id} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1, minWidth: 160 }}>
                    {c.icon ? <CompetitionIcon icon={c.icon} size={22} /> : <div style={{ width: 12, height: 12, borderRadius: "50%", background: c.color || T.accent, flexShrink: 0, marginTop: 2 }} />}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: T.text }}>{c.name}</div>
                      <div style={{ color: T.textMuted, fontSize: 12, marginTop: 3 }}>
                        {c.sport}{c.country ? ` · ${c.country}` : ""}
                      </div>
                      {c.notes && <div style={{ color: T.textMuted, fontSize: 12, marginTop: 4, fontStyle: "italic" }}>{c.notes}</div>}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: T.textMuted, fontSize: 11 }}>Apostas</div>
                      <div style={{ fontFamily: "monospace", fontSize: 14, color: T.text }}>{cBets.length}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: T.textMuted, fontSize: 11 }}>Vitórias</div>
                      <div style={{ fontFamily: "monospace", fontSize: 14, color: T.text }}>{wins}</div>
                    </div>
                    {pending > 0 && (
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: T.textMuted, fontSize: 11 }}>Em aberto</div>
                        <div style={{ fontFamily: "monospace", fontSize: 14, color: T.pending }}>{pending}</div>
                      </div>
                    )}
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: T.textMuted, fontSize: 11 }}>ROI</div>
                      <div style={{ fontFamily: "monospace", fontSize: 14, color: cBets.length ? (roi >= 0 ? T.win : T.loss) : T.textMuted }}>
                        {cBets.length ? pct(roi) : "—"}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: T.textMuted, fontSize: 11 }}>Lucro</div>
                      <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: cBets.length ? (profit >= 0 ? T.win : T.loss) : T.textMuted }}>
                        {cBets.length ? ((profit >= 0 ? "+" : "-") + fmtAbs(profit)) : "—"}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, alignSelf: "center" }}>
                      <button onClick={() => { setEditing(c); setShowForm(true); }}
                        style={{ background: T.pill, border: "none", borderRadius: 6, padding: "6px 9px", cursor: "pointer", color: T.textSub }}>
                        <Icon d={icons.edit} size={13} />
                      </button>
                      <button onClick={() => dispatch({ type: "DEL_COMPETITION", id: c.id })}
                        style={{ background: T.pill, border: "none", borderRadius: 6, padding: "6px 9px", cursor: "pointer", color: T.loss }}>
                        <Icon d={icons.trash} size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <CompetitionForm
          initial={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSave={(c) => { dispatch({ type: editing ? "UPD_COMPETITION" : "ADD_COMPETITION", competition: c }); setShowForm(false); setEditing(null); }}
          sports={state.sports || []}
        />
      )}
    </div>
  );
}

// ─── REDUCER ─────────────────────────────────────────────────────────────────
function reducer(state, action) {
  let next;
  switch (action.type) {
    case "REPLACE_STATE":  next = { ...action.state }; break;
    case "ADD_BET":        next = { ...state, bets: [action.bet, ...state.bets] }; break;
    case "UPD_BET":        next = { ...state, bets: state.bets.map(b => b.id === action.bet.id ? action.bet : b) }; break;
    case "DEL_BET":        next = { ...state, bets: state.bets.filter(b => b.id !== action.id) }; break;
    case "ADD_BANKROLL":   next = { ...state, bankrolls: [...state.bankrolls, action.bankroll] }; break;
    case "UPD_BANKROLL":   next = { ...state, bankrolls: state.bankrolls.map(b => b.id === action.bankroll.id ? action.bankroll : b) }; break;
    case "DEL_BANKROLL": { const remaining = state.bankrolls.filter(b => b.id !== action.id); const fallback = remaining[0]?.id || ""; next = { ...state, bankrolls: remaining, bets: state.bets.map(b => b.bankrollId === action.id ? { ...b, bankrollId: fallback } : b) }; break; }
    case "ADD_TX":         next = { ...state, transactions: [...state.transactions, action.tx] }; break;
    case "DEL_TX":         next = { ...state, transactions: state.transactions.filter(t => t.id !== action.id) }; break;
    case "ADD_STRATEGY":   next = { ...state, strategies: [...state.strategies, action.strategy] }; break;
    case "UPD_STRATEGY":   next = { ...state, strategies: state.strategies.map(s => s.id === action.strategy.id ? action.strategy : s) }; break;
    case "DEL_STRATEGY":   next = { ...state, strategies: state.strategies.filter(s => s.id !== action.id) }; break;
    case "ADD_COMPETITION": next = { ...state, competitions: [...(state.competitions || []), action.competition] }; break;
    case "UPD_COMPETITION": next = { ...state, competitions: (state.competitions || []).map(c => c.id === action.competition.id ? action.competition : c) }; break;
    case "DEL_COMPETITION": next = { ...state, competitions: (state.competitions || []).filter(c => c.id !== action.id) }; break;
    case "ADD_MARKET":    next = { ...state, markets: [...(state.markets || []), action.market] }; break;
    case "DEL_MARKET":    next = { ...state, markets: (state.markets || []).filter(m => m !== action.market) }; break;
    case "ADD_SPORT":     next = { ...state, sports: [...(state.sports || []), action.sport] }; break;
    case "DEL_SPORT":     next = { ...state, sports: (state.sports || []).filter(s => s !== action.sport) }; break;
    default: return state;
  }
  saveRemote(next);
  return next;
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard",    icon: icons.dashboard },
  { id: "bets",      label: "Apostas",      icon: icons.bets },
  { id: "bankroll",  label: "Bankrolls",    icon: icons.bankroll },
  { id: "strategies",label: "Estratégias",  icon: icons.strategy },
  { id: "reports",   label: "Relatórios",   icon: icons.reports },
  { id: "competitions", label: "Competições",   icon: icons.competition },
  { id: "ai",        label: "IA Insights",  icon: icons.ai },
];

// ─── APP ─────────────────────────────────────────────────────────────────────
// ─── PERIOD PICKER ───────────────────────────────────────────────────────────
function buildPeriodOptions() {
  const opts = [{ v: "global", l: "Global (tudo)" }];
  const start = new Date(2026, 5, 1); // Junho 2026
  const now = new Date();
  // Use whichever is later: now or June 2026
  const ref = now > start ? now : start;
  for (let i = 0; i < 24; i++) {
    const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const label = d.toLocaleString("pt-PT", { month: "long", year: "numeric" });
    opts.push({ v: `${y}-${m}`, l: label.charAt(0).toUpperCase() + label.slice(1) });
  }
  return opts;
}
const PERIOD_OPTIONS = buildPeriodOptions();

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch_] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [view, setView] = useState("dashboard");
  const [period, setPeriod] = useState("global");

  const dispatch = useCallback((action) => {
    dispatch_(prev => reducer(prev, action));
  }, []);

  useEffect(() => {
    loadRemote().then(setState => dispatch_(() => setState)).catch(() => setLoadError(true));
  }, []);

  const periodFilter = period === "global"
    ? () => true
    : (b) => b.date && b.date.startsWith(period);

  const periodLabel = period === "global"
    ? "Global (tudo)"
    : (PERIOD_OPTIONS.find(o => o.v === period)?.l || period);

  const showPeriodPicker = view === "dashboard" || view === "reports";
  const navIds = NAV.map(n => n.id);
  const currentIdx = navIds.indexOf(view);
  const goLeft  = () => { if (currentIdx > 0) setView(navIds[currentIdx - 1]); };
  const goRight = () => { if (currentIdx < navIds.length - 1) setView(navIds[currentIdx + 1]); };

  // Detect narrow viewport (mobile)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const SIDEBAR_W = 200;
  const BOTTOM_H  = 56;


  if (loadError) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: T.bg, color: T.loss, fontFamily: "'Inter', sans-serif", padding: 24, textAlign: "center" }}>
        Não foi possível ligar à base de dados. Verifica a tua ligação à internet e tenta recarregar a página.
      </div>
    );
  }

  if (!state) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: T.bg, color: T.textSub, fontFamily: "'Inter', sans-serif", gap: 14 }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>Becson<span style={{ color: T.accent }}> Bets</span></div>
        <div style={{ fontSize: 13 }}>A carregar os teus dados…</div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>

      {/* ── SIDEBAR (desktop only) ── */}
      {!isMobile && (
        <aside style={{
          width: SIDEBAR_W, background: T.sidebar, borderRight: `1px solid ${T.border}`,
          flexShrink: 0, display: "flex", flexDirection: "column",
          position: "sticky", top: 0, height: "100vh", overflow: "hidden",
        }}>
          <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontWeight: 900, fontSize: 17, letterSpacing: -0.5 }}>
              Becson<span style={{ color: T.accent }}> Bets</span>
            </div>
          </div>
          <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => setView(n.id)} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                background: view === n.id ? T.accentGlow : "none",
                border: view === n.id ? `1px solid ${T.accent}44` : "1px solid transparent",
                borderRadius: 9, padding: "10px 12px", color: view === n.id ? T.accent : T.textSub,
                cursor: "pointer", fontFamily: "inherit", fontWeight: view === n.id ? 700 : 500, fontSize: 13,
                marginBottom: 2, textAlign: "left", transition: "all .15s",
              }}>
                <Icon d={n.icon} size={16} color={view === n.id ? T.accent : T.textMuted} />
                {n.label}
              </button>
            ))}
          </nav>
          <div style={{ padding: "14px 16px", borderTop: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.textMuted }}>
              {state.bets.length} apostas · {state.bankrolls.length} bankroll{state.bankrolls.length !== 1 ? "s" : ""}
            </div>
          </div>
        </aside>
      )}

      {/* ── MAIN ── */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflowX: "hidden" }}>

        {/* mobile top bar */}
        {isMobile && (
          <div style={{ background: T.sidebar, borderBottom: `1px solid ${T.border}`, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: -0.5 }}>
              Becson<span style={{ color: T.accent }}> Bets</span>
            </div>
            <div style={{ color: T.textSub, fontSize: 13, fontWeight: 600 }}>
              {NAV[currentIdx]?.label}
            </div>
          </div>
        )}

        {/* period picker */}
        {showPeriodPicker && (
          <div style={{ borderB
