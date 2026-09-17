import { useState } from "react";
import { useData } from "../../context/DataContext";

const NAV_ITEMS = [
  { label: "Home", page: "home", section: null },
  { label: "About", page: "home", section: "about" },
  { label: "Services", page: "home", section: "services" },
  { label: "Projects", page: "projects", section: null },
  { label: "Contact", page: "contact", section: null },
];

interface Props {
  currentPage: string;
  onNavigate: (page: string, section?: string) => void;
  onAdminClick?: () => void;
}

export default function CustomerHeader({ currentPage, onNavigate }: Props) {
  const { settings } = useData();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (item: typeof NAV_ITEMS[0]) => {
    setMenuOpen(false);
    if (item.section) {
      if (currentPage !== "home") {
        onNavigate(item.page, item.section);
      } else {
        const el = document.getElementById(item.section);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      onNavigate(item.page);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b" style={{ backgroundColor: "rgba(248,247,244,0.97)", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--dark-bg)" }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="7" height="7" stroke="#c9a96e" strokeWidth="1.5" />
                <rect x="11" y="2" width="7" height="7" stroke="#c9a96e" strokeWidth="1.5" />
                <rect x="2" y="11" width="7" height="7" stroke="#c9a96e" strokeWidth="1.5" />
                <rect x="11" y="11" width="7" height="7" stroke="#c9a96e" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="min-w-0 text-left">
              <div className="font-serif text-sm leading-tight truncate" style={{ color: "var(--foreground)", maxWidth: "180px" }}>{settings.company_name || "Asif Glass & Aluminium"}</div>
              <div className="text-xs leading-tight tracking-widest uppercase hidden sm:block" style={{ color: "var(--muted-foreground)", fontFamily: "'JetBrains Mono', monospace", fontSize: "8px" }}>Gujranwala, Pakistan</div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNav(item)}
                className="text-sm font-medium transition-colors hover:opacity-100"
                style={{ color: currentPage === item.page ? "var(--gold)" : "var(--muted-foreground)", opacity: currentPage === item.page ? 1 : 0.8 }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop & Mobile CTA */}
          <div className="flex items-center gap-2">
            <button onClick={() => onNavigate("contact")} className="btn-gold px-4 py-2 md:px-5 md:py-2.5 rounded-lg text-xs md:text-sm font-semibold">
              Get a Quote
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            style={{ backgroundColor: menuOpen ? "var(--secondary)" : "transparent" }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {menuOpen ? (
                <>
                  <line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="19" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 shadow-2xl border-b" style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}>
            <nav className="flex flex-col p-4 gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNav(item)}
                  className="text-left px-4 py-3.5 rounded-xl text-base font-medium transition-colors active:bg-amber-50 flex items-center justify-between"
                  style={{ color: "var(--foreground)" }}
                >
                  <span>{item.label}</span>
                  {item.section && <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>↓ scroll</span>}
                </button>
              ))}
              <div className="mt-3 pt-3 border-t flex flex-col gap-2" style={{ borderColor: "var(--border)" }}>
                <button
                  onClick={() => { onNavigate("contact"); setMenuOpen(false); }}
                  className="btn-gold w-full py-4 rounded-xl text-base font-semibold"
                >
                  Get a Free Quote
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
