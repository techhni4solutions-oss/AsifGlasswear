import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminMobileNav from "../../components/admin/AdminMobileNav";
import AdminDashboard from "./AdminDashboard";
import AdminProjects from "./AdminProjects";
import AdminServices from "./AdminServices";
import AdminGallery from "./AdminGallery";
import AdminTestimonials from "./AdminTestimonials";
import AdminInquiries from "./AdminInquiries";
import AdminContactInfo from "./AdminContactInfo";
import AdminSettings from "./AdminSettings";

export type AdminSection =
  | "dashboard" | "projects" | "services" | "gallery"
  | "testimonials" | "inquiries"
  | "contact-info" | "settings";

interface Props {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: Props) {
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = (s: AdminSection) => {
    setSection(s);
    setDrawerOpen(false);
  };

  const renderContent = () => {
    switch (section) {
      case "dashboard": return <AdminDashboard onNavigate={navigate} />;
      case "projects": return <AdminProjects />;
      case "services": return <AdminServices />;
      case "gallery": return <AdminGallery />;
      case "testimonials": return <AdminTestimonials />;
      case "inquiries": return <AdminInquiries />;
      case "contact-info": return <AdminContactInfo />;
      case "settings": return <AdminSettings onLogout={onLogout} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#f1f0ed" }}>
      {/* Desktop sidebar — always visible on lg+ */}
      <AdminSidebar
        current={section}
        onNavigate={navigate}
        onLogout={onLogout}
        drawerOpen={drawerOpen}
        onDrawerClose={() => setDrawerOpen(false)}
      />

      {/* Drawer overlay on mobile */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b bg-white flex-shrink-0" style={{ borderColor: "#e2ddd6" }}>
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-lg active:bg-gray-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="font-serif text-base">Asif Glass Admin</div>
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-sm font-bold" style={{ color: "var(--gold)" }}>A</div>
        </div>

        {/* Scrollable content — leave room for mobile bottom nav */}
        <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          {renderContent()}
        </div>
      </div>

      {/* Mobile bottom nav — always visible on mobile */}
      <AdminMobileNav current={section} onNavigate={navigate} onMore={() => setDrawerOpen(true)} />
    </div>
  );
}
