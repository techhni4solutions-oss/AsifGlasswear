import { useState } from "react";
import { useData } from "../../context/DataContext";
import { api, getImageUrl } from "../../services/api";

type ProjectForm = {
  name: string; category: string; location: string; description: string;
  services: string; materials: string; date: string; featured: boolean; image: string;
};

const EMPTY_FORM: ProjectForm = { name: "", category: "Commercial", location: "", description: "", services: "", materials: "", date: "", featured: false, image: "" };

export default function AdminProjects() {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ProjectForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const filtered = projects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleEdit = (id: number) => {
    const p = projects.find((x) => x.id === id)!;
    setForm({
      name: p.name,
      category: p.category,
      location: p.location,
      description: p.description,
      services: Array.isArray(p.services) ? p.services.join(", ") : (p.services || ""),
      materials: Array.isArray(p.materials) ? p.materials.join(", ") : (p.materials || ""),
      date: p.date,
      featured: p.featured,
      image: p.image
    });
    setEditId(id);
    setSelectedFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
      } catch (err) {
        alert("Failed to delete project");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.image;
      if (selectedFile) {
        const uploadRes = await api.uploadFile(selectedFile);
        imageUrl = uploadRes.url;
      }

      const servicesArray = form.services ? form.services.split(",").map((s) => s.trim()).filter(Boolean) : [];
      const materialsArray = form.materials ? form.materials.split(",").map((s) => s.trim()).filter(Boolean) : [];

      const payload = {
        name: form.name,
        category: form.category,
        type: form.category,
        location: form.location,
        date: form.date || "Completed",
        status: "Completed",
        featured: form.featured,
        image: imageUrl || "https://images.unsplash.com/photo-1690944851207-3f288c8fcd0b?w=800&h=600&fit=crop&auto=format",
        description: form.description,
        services: servicesArray,
        materials: materialsArray,
        gallery: []
      };

      if (editId) {
        await updateProject(editId, payload);
      } else {
        await addProject(payload);
      }

      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
      setSelectedFile(null);
    } catch (err: any) {
      alert(err.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <h1 className="font-serif text-2xl md:text-3xl">Projects</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); setSelectedFile(null); }} className="btn-gold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2">
          + Add New Project
        </button>
      </div>

      {/* Filters row */}
      <div className="bg-white rounded-2xl border p-4 mb-6 flex flex-col sm:flex-row gap-3" style={{ borderColor: "#e2ddd6" }}>
        <input
          type="search"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-lg border text-sm"
          style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
        />
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-4 py-2.5 rounded-lg border text-sm"
          style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
        >
          <option>All</option>
          <option>Residential</option>
          <option>Commercial</option>
        </select>
      </div>

      {/* Project cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((proj) => (
          <div key={proj.id} className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#e2ddd6" }}>
            <div className="relative aspect-video">
              <img src={getImageUrl(proj.image)} alt={proj.name} className="w-full h-full object-cover" />
              {proj.featured && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-mono" style={{ backgroundColor: "rgba(201,169,110,0.9)", color: "#111" }}>Featured</span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-semibold text-sm">{proj.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#777770" }}>{proj.category} · {proj.location}</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ backgroundColor: "#22c55e18", color: "#22c55e" }}>
                  {proj.status}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => handleEdit(proj.id)} className="flex-1 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-amber-50" style={{ borderColor: "#e2ddd6", color: "#444440" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(proj.id)} className="py-2 px-3 rounded-lg text-xs font-medium border transition-colors hover:bg-red-50 hover:border-red-200" style={{ borderColor: "#e2ddd6", color: "#ef4444" }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: "#777770" }}>No projects found.</div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50">
          <form onSubmit={handleSave} className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl">{editId ? "Edit Project" : "Add New Project"}</h2>
              <button type="button" onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: "#f1f0ed" }}>✕</button>
            </div>
            {[
              { label: "Project Name *", key: "name", type: "text", placeholder: "Al Barsha Commercial Tower", required: true },
              { label: "Location", key: "location", type: "text", placeholder: "Gujranwala, Pakistan" },
              { label: "Project Date", key: "date", type: "text", placeholder: "March 2024" },
              { label: "Services Used (comma separated)", key: "services", type: "text", placeholder: "Building Facade, Curtain Wall" },
              { label: "Materials Used (comma separated)", key: "materials", type: "text", placeholder: "Aluminium Profiles, Tempered Glass" },
            ].map((f) => (
              <div key={f.key} className="mb-4">
                <label className="block text-sm font-medium mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  required={f.required}
                  placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm"
                  style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
                />
              </div>
            ))}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5">Project Image (Upload File or paste URL)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm mb-2"
                style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
              />
              <input
                type="text"
                placeholder="Or paste image URL (https://...)"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border text-sm"
                style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
              />
              {form.image && <img src={getImageUrl(form.image)} alt="Preview" className="mt-2 h-20 rounded-lg object-cover" />}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border text-sm"
                style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
              >
                <option>Residential</option>
                <option>Commercial</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border text-sm resize-none"
                style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
              />
            </div>
            <label className="flex items-center gap-2 mb-5 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ accentColor: "var(--gold)" }} />
              <span className="text-sm">Featured Project</span>
            </label>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-gold flex-1 py-3 rounded-lg font-semibold">
                {saving ? "Saving..." : "Save Project"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-lg font-medium border" style={{ borderColor: "#e2ddd6" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
