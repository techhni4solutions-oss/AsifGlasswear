import { useEffect, useState } from "react";
import CustomerHeader from "../components/customer/CustomerHeader";
import MobileBottomBar from "../components/customer/MobileBottomBar";
import HomePage from "./customer/HomePage";
import ProjectsPage from "./customer/ProjectsPage";
import ProjectDetailPage from "./customer/ProjectDetailPage";
import ServiceDetailPage from "./customer/ServiceDetailPage";
import ContactPage from "./customer/ContactPage";
import { useData } from "../context/DataContext";

export type CustomerPage = "home" | "projects" | "project-detail" | "service-detail" | "contact";

type CustomerLocation = {
  page: CustomerPage;
  projectId: number | null;
  serviceId: number | null;
  section: string | null;
};

function readCustomerLocation(): CustomerLocation {
  const hash = window.location.hash.replace(/^#/, "");
  const [route, rawId] = hash.split("/");
  const id = Number(rawId);

  if (route === "projects") return { page: "projects", projectId: null, serviceId: null, section: null };
  if (route === "project" && Number.isFinite(id)) return { page: "project-detail", projectId: id, serviceId: null, section: null };
  if (route === "service" && Number.isFinite(id)) return { page: "service-detail", projectId: null, serviceId: id, section: null };
  if (route === "contact") return { page: "contact", projectId: null, serviceId: null, section: null };
  if (route === "about" || route === "services") return { page: "home", projectId: null, serviceId: null, section: route };
  return { page: "home", projectId: null, serviceId: null, section: null };
}

function locationHash(page: CustomerPage, section?: string, projectId?: number | null, serviceId?: number | null) {
  if (page === "projects") return "#projects";
  if (page === "project-detail" && projectId) return `#project/${projectId}`;
  if (page === "service-detail" && serviceId) return `#service/${serviceId}`;
  if (page === "contact") return "#contact";
  if (section) return `#${section}`;
  return "#home";
}

interface Props {
  onAdminClick: () => void;
}

export default function CustomerSite({ onAdminClick }: Props) {
  const { projects, services, settings } = useData();
  const initialLocation = readCustomerLocation();
  const [page, setPage] = useState<CustomerPage>(initialLocation.page);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(initialLocation.projectId);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(initialLocation.serviceId);
  const [quoteProjectType, setQuoteProjectType] = useState<string>("");
  const [pendingSection, setPendingSection] = useState<string | null>(initialLocation.section);
  const [activeSection, setActiveSection] = useState<string | null>(initialLocation.section);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) ?? null;
  const selectedService = services.find((s) => s.id === selectedServiceId) ?? null;

  const cleanPhone = settings.whatsapp ? settings.whatsapp.replace(/[^0-9]/g, "") : "923066426139";
  const whatsappUrl = `https://wa.me/${cleanPhone}`;

  const applyLocation = (location: CustomerLocation) => {
    setPage(location.page);
    setSelectedProjectId(location.projectId);
    setSelectedServiceId(location.serviceId);
    setPendingSection(location.section);
    setActiveSection(location.section);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  useEffect(() => {
    const handleHistoryNavigation = () => applyLocation(readCustomerLocation());
    window.addEventListener("popstate", handleHistoryNavigation);
    window.addEventListener("hashchange", handleHistoryNavigation);
    return () => {
      window.removeEventListener("popstate", handleHistoryNavigation);
      window.removeEventListener("hashchange", handleHistoryNavigation);
    };
  }, []);

  useEffect(() => {
    if (page !== "home" || !pendingSection) return;
    const timer = window.setTimeout(() => {
      const el = document.getElementById(pendingSection);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setPendingSection(null);
      }
    }, 100);
    return () => window.clearTimeout(timer);
  }, [page, pendingSection]);

  const navigate = (p: CustomerPage | string, section?: string) => {
    const targetPage = p as CustomerPage;
    const nextHash = locationHash(targetPage, section, selectedProjectId, selectedServiceId);
    if (window.location.hash !== nextHash) {
      window.history.pushState({}, "", nextHash);
    }
    setPage(targetPage);
    setPendingSection(section || null);
    setActiveSection(section || null);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const openProject = (id: number) => {
    setSelectedProjectId(id);
    setSelectedServiceId(null);
    setActiveSection(null);
    window.history.pushState({}, "", locationHash("project-detail", undefined, id, null));
    setPage("project-detail");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const openService = (id: number) => {
    setSelectedServiceId(id);
    setSelectedProjectId(null);
    setActiveSection(null);
    window.history.pushState({}, "", locationHash("service-detail", undefined, null, id));
    setPage("service-detail");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const onPageReady = () => {
    if (pendingSection) {
      setTimeout(() => {
        const el = document.getElementById(pendingSection);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        setPendingSection(null);
      }, 100);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <CustomerHeader
        currentPage={page}
        currentSection={activeSection}
        onNavigate={(p, section) => navigate(p, section)}
        onAdminClick={onAdminClick}
      />

      <main>
        {page === "home" && (
          <HomePage
            onMount={onPageReady}
            onViewProjects={() => navigate("projects")}
            onGetQuote={() => {
              setQuoteProjectType("");
              navigate("contact");
            }}
            onProjectClick={openProject}
            onServiceClick={openService}
          />
        )}

        {page === "projects" && (
          <ProjectsPage
            onProjectClick={openProject}
            onGetQuote={() => {
              setQuoteProjectType("");
              navigate("contact");
            }}
          />
        )}

        {page === "project-detail" && selectedProject && (
          <ProjectDetailPage
            project={selectedProject}
            onBack={() => navigate("projects")}
            onGetQuote={() => {
              setQuoteProjectType(selectedProject.type || selectedProject.category || "");
              navigate("contact");
            }}
          />
        )}

        {page === "service-detail" && selectedService && (
          <ServiceDetailPage
            service={selectedService}
            onBack={() => navigate("home", "services")}
            onGetQuote={(serviceName) => {
              setQuoteProjectType(serviceName);
              navigate("contact");
            }}
            onProjectClick={openProject}
          />
        )}

        {page === "contact" && <ContactPage initialProjectType={quoteProjectType} />}
      </main>

      <MobileBottomBar />

      {/* Floating WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl whatsapp-btn md:bottom-8"
        aria-label="WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
