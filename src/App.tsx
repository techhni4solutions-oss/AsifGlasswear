import { useState, useEffect } from "react";
import CustomerSite from "./pages/CustomerSite";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminPanel from "./pages/admin/AdminPanel";

export type AppView = "customer" | "admin-login" | "admin";

export default function App() {
  const [view, setView] = useState<AppView>(() => {
    if (window.location.hash === "#admin" || window.location.pathname.endsWith("/admin") || window.location.search.includes("admin")) {
      return "admin-login";
    }
    return "customer";
  });
  const [adminAuthed, setAdminAuthed] = useState(false);

  useEffect(() => {
    const checkAdminRoute = () => {
      if (window.location.hash === "#admin" || window.location.pathname.endsWith("/admin") || window.location.search.includes("admin")) {
        setView("admin-login");
      }
    };
    window.addEventListener("hashchange", checkAdminRoute);
    window.addEventListener("popstate", checkAdminRoute);
    return () => {
      window.removeEventListener("hashchange", checkAdminRoute);
      window.removeEventListener("popstate", checkAdminRoute);
    };
  }, []);

  const handleBackToWebsite = () => {
    if (window.location.hash === "#admin") {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    setView("customer");
  };

  if (view === "admin-login" || (view === "admin" && !adminAuthed)) {
    return (
      <AdminLogin
        onLogin={() => { setAdminAuthed(true); setView("admin"); }}
        onBack={handleBackToWebsite}
      />
    );
  }
  if (view === "admin" && adminAuthed) {
    return <AdminPanel onLogout={() => { setAdminAuthed(false); handleBackToWebsite(); }} />;
  }
  return <CustomerSite onAdminClick={() => setView("admin-login")} />;
}
