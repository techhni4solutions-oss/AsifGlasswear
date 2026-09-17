import type { AdminSection } from "../../pages/admin/AdminPanel";

const TABS = [
  { section: "dashboard" as AdminSection, icon: "⊞", label: "Home" },
  { section: "projects" as AdminSection, icon: "🏗️", label: "Projects" },
  { section: "inquiries" as AdminSection, icon: "📬", label: "Inquiries" },
];

interface Props {
  current: AdminSection;
  onNavigate: (s: AdminSection) => void;
  onMore: () => void;
}

export default function AdminMobileNav({ current, onNavigate, onMore }: Props) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-20 lg:hidden border-t bg-white"
      style={{ borderColor: "#e2ddd6" }}
    >
      <div className="grid grid-cols-5 h-16">
        {TABS.map((tab) => {
          const active = current === tab.section;
          return (
            <button
              key={tab.section}
              onClick={() => onNavigate(tab.section)}
              className="flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors active:bg-gray-50"
              style={{ color: active ? "var(--gold)" : "#999992" }}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className="text-xs leading-none mt-0.5" style={{ fontSize: "10px" }}>{tab.label}</span>
              {active && (
                <div className="absolute top-0 w-8 h-0.5 rounded-b-full" style={{ backgroundColor: "var(--gold)" }} />
              )}
            </button>
          );
        })}
        {/* More button */}
        <button
          onClick={onMore}
          className="flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors active:bg-gray-50"
          style={{ color: "#999992" }}
        >
          <span className="text-xl leading-none">☰</span>
          <span className="text-xs leading-none mt-0.5" style={{ fontSize: "10px" }}>More</span>
        </button>
      </div>
    </div>
  );
}
