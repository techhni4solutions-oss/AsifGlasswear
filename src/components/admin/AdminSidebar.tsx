import type { AdminSection } from "../../pages/admin/AdminPanel";

const NAV = [
  { section: "dashboard" as AdminSection, icon: "⊞", label: "Dashboard" },
  { section: "projects" as AdminSection, icon: "🏗️", label: "Projects" },
  { section: "services" as AdminSection, icon: "⚙️", label: "Services" },
  { section: "gallery" as AdminSection, icon: "🖼️", label: "Gallery" },
  { section: "testimonials" as AdminSection, icon: "⭐", label: "Testimonials" },
  { section: "inquiries" as AdminSection, icon: "📬", label: "Inquiries", badge: "6" },
  { section: "contact-info" as AdminSection, icon: "📞", label: "Contact Info" },
  { section: "settings" as AdminSection, icon: "🔧", label: "Settings" },
];

interface Props {
  current: AdminSection;
  onNavigate: (s: AdminSection) => void;
  onLogout: () => void;
  drawerOpen: boolean;
  onDrawerClose: () => void;
}

export default function AdminSidebar({ current, onNavigate, onLogout, drawerOpen }: Props) {
  return (
    <aside
      className={`
        fixed lg:static top-0 left-0 h-full z-40 flex flex-col w-64 flex-shrink-0
        sidebar-transition
        ${drawerOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      style={{ backgroundColor: "#0f0f0e", minHeight: "100vh" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center border flex-shrink-0" style={{ borderColor: "rgba(201,169,110,0.3)", backgroundColor: "rgba(201,169,110,0.08)" }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="2" width="7" height="7" stroke="#c9a96e" strokeWidth="1.5" />
            <rect x="11" y="2" width="7" height="7" stroke="#c9a96e" strokeWidth="1.5" />
            <rect x="2" y="11" width="7" height="7" stroke="#c9a96e" strokeWidth="1.5" />
            <rect x="11" y="11" width="7" height="7" stroke="#c9a96e" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="min-w-0">
          <div className="font-serif text-sm text-white leading-tight">Asif Glass</div>
          <div className="text-xs leading-tight" style={{ color: "var(--gold)", fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", letterSpacing: "0.08em" }}>ADMIN PORTAL</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="text-xs font-mono tracking-widest uppercase px-3 mb-3" style={{ color: "rgba(255,255,255,0.22)" }}>Navigation</div>
        {NAV.map((item) => {
          const active = current === item.section;
          return (
            <button
              key={item.section}
              onClick={() => onNavigate(item.section)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all text-left"
              style={{
                backgroundColor: active ? "rgba(201,169,110,0.13)" : "transparent",
                color: active ? "var(--gold)" : "rgba(245,244,240,0.52)",
                borderLeft: active ? "2px solid var(--gold)" : "2px solid transparent",
              }}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-mono flex-shrink-0" style={{ backgroundColor: "rgba(201,169,110,0.2)", color: "var(--gold)" }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg mb-2" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: "rgba(201,169,110,0.2)", color: "var(--gold)" }}>A</div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-white truncate">Admin User</div>
            <div className="text-xs truncate" style={{ color: "rgba(245,244,240,0.38)" }}>admin@asifglass.pk</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-white/5"
          style={{ color: "rgba(245,244,240,0.38)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
