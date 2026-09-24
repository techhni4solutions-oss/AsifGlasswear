import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { api, getAuthToken } from '../services/api';
import { readPublicDataCache, writePublicDataCache } from '../services/dataCache';

export type SiteSettings = {
  id?: number;
  company_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  map_lat: number;
  map_lon: number;
  gmaps_link: string;
  hero_title: string;
  hero_subtitle: string;
};

const DEFAULT_SETTINGS: SiteSettings = {
  company_name: 'Asif Glass & Aluminium',
  phone: '0306 642 6139',
  whatsapp: '0306 642 6139',
  email: 'info@asifglass.pk',
  address: 'Ghulam Dastagir Khan Rd, Block-D Satellite Town, Gujranwala 52250, Pakistan',
  map_lat: 32.1577,
  map_lon: 74.1945,
  gmaps_link: 'https://www.google.com/maps?q=Ghulam+Dastagir+Khan+Rd,+Block-D+Satellite+Town,+Gujranwala+52250,+Pakistan',
  hero_title: 'Premium Aluminium & Glass Solutions',
  hero_subtitle: 'Crafting Architectural Elegance for Residential & Commercial Spaces in Pakistan',
};

type DataContextType = {
  projects: any[];
  setProjects: React.Dispatch<React.SetStateAction<any[]>>;
  services: any[];
  setServices: React.Dispatch<React.SetStateAction<any[]>>;
  testimonials: any[];
  setTestimonials: React.Dispatch<React.SetStateAction<any[]>>;
  inquiries: any[];
  setInquiries: React.Dispatch<React.SetStateAction<any[]>>;
  customers: any[];
  setCustomers: React.Dispatch<React.SetStateAction<any[]>>;
  settings: SiteSettings;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  loading: boolean;
  refreshData: () => Promise<void>;

  // Helper CRUD methods connected directly to backend API
  addProject: (data: any) => Promise<any>;
  updateProject: (id: number, data: any) => Promise<any>;
  deleteProject: (id: number) => Promise<void>;

  addService: (data: any) => Promise<any>;
  updateService: (id: number, data: any) => Promise<any>;
  deleteService: (id: number) => Promise<void>;

  addTestimonial: (data: any) => Promise<any>;
  updateTestimonial: (id: number, data: any) => Promise<any>;
  deleteTestimonial: (id: number) => Promise<void>;

  submitInquiry: (data: any) => Promise<any>;
  updateInquiryStatus: (id: number, status: string) => Promise<any>;
  deleteInquiry: (id: number) => Promise<void>;

  addCustomer: (data: any) => Promise<any>;
  updateCustomer: (id: number, data: any) => Promise<any>;
  deleteCustomer: (id: number) => Promise<void>;

  updateSettings: (data: SiteSettings) => Promise<any>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [cacheReady, setCacheReady] = useState(false);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [pData, sData, tData, stData] = await Promise.all([
        api.getProjects(),
        api.getServices(),
        api.getTestimonials(),
        api.getSettings(),
      ]);

      setProjects(pData);
      setServices(sData);
      setTestimonials(tData);
      if (stData) setSettings(stData);

      void writePublicDataCache({
        projects: pData,
        services: sData,
        testimonials: tData,
        settings: stData || DEFAULT_SETTINGS,
      });

      // If logged in as admin, also fetch protected inquiries and customers
      if (getAuthToken()) {
        const [inqData, custData] = await Promise.all([
          api.getInquiries().catch(() => []),
          api.getCustomers().catch(() => []),
        ]);
        setInquiries(inqData);
        setCustomers(custData);
      }
    } catch (err) {
      console.error('Error refreshing data from API:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    void (async () => {
      const cached = await readPublicDataCache();
      if (!active) return;

      if (cached) {
        setProjects(cached.projects || []);
        setServices(cached.services || []);
        setTestimonials(cached.testimonials || []);
        if (cached.settings) setSettings(cached.settings);
        setLoading(false);
      }

      setCacheReady(true);
      void refreshData();
    })();

    return () => {
      active = false;
    };
  }, [refreshData]);

  // Keep the fast-start snapshot current after admin edits as well as API refreshes.
  useEffect(() => {
    if (!cacheReady) return;
    void writePublicDataCache({ projects, services, testimonials, settings });
  }, [cacheReady, projects, services, testimonials, settings]);

  // Project CRUD
  const addProject = async (data: any) => {
    const created = await api.createProject(data);
    setProjects((prev) => [created, ...prev]);
    return created;
  };

  const updateProject = async (id: number, data: any) => {
    const updated = await api.updateProject(id, data);
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const deleteProject = async (id: number) => {
    await api.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Service CRUD
  const addService = async (data: any) => {
    const created = await api.createService(data);
    setServices((prev) => [...prev, created]);
    return created;
  };

  const updateService = async (id: number, data: any) => {
    const updated = await api.updateService(id, data);
    setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  };

  const deleteService = async (id: number) => {
    await api.deleteService(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // Testimonial CRUD
  const addTestimonial = async (data: any) => {
    const created = await api.createTestimonial(data);
    setTestimonials((prev) => [created, ...prev]);
    return created;
  };

  const updateTestimonial = async (id: number, data: any) => {
    const updated = await api.updateTestimonial(id, data);
    setTestimonials((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const deleteTestimonial = async (id: number) => {
    await api.deleteTestimonial(id);
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  // Inquiry CRUD
  const submitInquiry = async (data: any) => {
    const created = await api.createInquiry(data);
    setInquiries((prev) => [created, ...prev]);
    // Refresh customers list if authed
    if (getAuthToken()) {
      api.getCustomers().then(setCustomers).catch(() => {});
    }
    return created;
  };

  const updateInquiryStatus = async (id: number, status: string) => {
    const updated = await api.updateInquiryStatus(id, status);
    setInquiries((prev) => prev.map((inq) => (inq.id === id ? updated : inq)));
    return updated;
  };

  const deleteInquiry = async (id: number) => {
    await api.deleteInquiry(id);
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
  };

  // Customer CRUD
  const addCustomer = async (data: any) => {
    const created = await api.createCustomer(data);
    setCustomers((prev) => [created, ...prev]);
    return created;
  };

  const updateCustomer = async (id: number, data: any) => {
    const updated = await api.updateCustomer(id, data);
    setCustomers((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const deleteCustomer = async (id: number) => {
    await api.deleteCustomer(id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  // Settings
  const updateSettings = async (data: SiteSettings) => {
    const updated = await api.updateSettings(data);
    setSettings(updated);
    return updated;
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        setProjects,
        services,
        setServices,
        testimonials,
        setTestimonials,
        inquiries,
        setInquiries,
        customers,
        setCustomers,
        settings,
        setSettings,
        loading,
        refreshData,
        addProject,
        updateProject,
        deleteProject,
        addService,
        updateService,
        deleteService,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        submitInquiry,
        updateInquiryStatus,
        deleteInquiry,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        updateSettings,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
