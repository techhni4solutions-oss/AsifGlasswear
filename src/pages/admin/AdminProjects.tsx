import { useState } from "react";
import { useData } from "../../context/DataContext";
import { api, getImageUrl } from "../../services/api";

type ProjectForm = {
  name: string;
  category: string;
  location: string;
  description: string;
  services: string;
  materials: string;
  date: string;
  featured: boolean;
  images: string[];
};

const EMPTY_FORM: ProjectForm = {
  name: "",
  category: "Commercial",
  location: "",
  description: "",
  services: "",
  materials: "",
  date: "",
  featured: false,
  images: [],
};

export default function AdminProjects() {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ProjectForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleEdit = (id: number) => {
    const p = projects.find((x) => x.id === id)!;
    const galleryList = Array.isArray(p.gallery) ? p.gallery : [];
    const allImgs = [p.image, ...galleryList].filter(Boolean);
    const uniqueImgs = Array.from(new Set(allImgs));

    setForm({
      name: p.name,
      category: p.category,
      location: p.location,
      description: p.description,
      services: Array.isArray(p.services) ? p.services.join(", ") : p.services || "",
      materials: Array.isArray(p.materials) ? p.materials.join(", ") : p.materials || "",
      date: p.date,
      featured: p.featured,
      images: uniqueImgs.length > 0 ? uniqueImgs : p.image ? [p.image] : [],
    });
    setEditId(id);
    setUrlInput("");
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const fileList = Array.from(files);
      const uploadPromises = fileList.map((file) => api.uploadFile(file));
      const results = await Promise.all(uploadPromises);
      const uploadedUrls = results.map((r) => r.url).filter(Boolean);

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (err: any) {
      alert("Failed to upload image(s): " + (err.message || "Network error"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, trimmed],
    }));
    setUrlInput("");
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    setForm((prev) => {
      const updated = [...prev.images];
      const [chosen] = updated.splice(index, 1);
      return {
        ...prev,
        images: [chosen, ...updated],
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.images.length === 0) {
      if (!confirm("No project photos added. Do you want to use a default placeholder image?")) {
        return;
      }
    }

    setSaving(true);
    try {
      const defaultImage =
        "https://images.unsplash.com/photo-1690944851207-3f288c8fcd0b?w=800&h=600&fit=crop&auto=format";
      const primaryImage = form.images[0] || defaultImage;
      const galleryImages = form.images.slice(1);

      const servicesArray = form.services
        ? form.services.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const materialsArray = form.materials
        ? form.materials.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        name: form.name,
        category: form.category,
        type: form.category,
        location: form.location,
        date: form.date || "Completed",
        status: "Completed",
        featured: form.featured,
        image: primaryImage,
        gallery: galleryImages,
        description: form.description,
        services: servicesArray,
        materials: materialsArray,
      };

      if (editId) {
        await updateProject(editId, payload);
      } else {
        await addProject(payload);
      }

      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
      setUrlInput("");
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
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm(EMPTY_FORM);
            setUrlInput("");
          }}
          className="btn-gold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2"
        >
          + Add New Project
        </button>
      </div>

      {/* Filters row */}
      <div
        className="bg-white rounded-2xl border p-4 mb-6 flex flex-col sm:flex-row gap-3"
        style={{ borderColor: "#e2ddd6" }}
      >
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
        {filtered.map((proj) => {
          const totalPhotos = 1 + (Array.isArray(proj.gallery) ? proj.gallery.length : 0);
          return (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border overflow-hidden"
              style={{ borderColor: "#e2ddd6" }}
            >
              <div className="relative aspect-video bg-gray-100">
                <img
                  src={getImageUrl(proj.image)}
                  alt={proj.name}
                  className="w-full h-full object-cover"
                />
                {proj.featured && (
                  <span
                    className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-mono font-medium"
                    style={{ backgroundColor: "rgba(201,169,110,0.95)", color: "#111" }}
                  >
                    Featured
                  </span>
                )}
                <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md text-xs font-mono bg-black/70 text-white backdrop-blur-sm flex items-center gap-1">
                  📷 {totalPhotos} {totalPhotos === 1 ? "photo" : "photos"}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="font-semibold text-sm">{proj.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#777770" }}>
                      {proj.category} · {proj.location}
                    </div>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                    style={{ backgroundColor: "#22c55e18", color: "#22c55e" }}
                  >
                    {proj.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(proj.id)}
                    className="flex-1 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-amber-50"
                    style={{ borderColor: "#e2ddd6", color: "#444440" }}
                  >
                    Edit / Manage Photos
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="py-2 px-3 rounded-lg text-xs font-medium border transition-colors hover:bg-red-50 hover:border-red-200"
                    style={{ borderColor: "#e2ddd6", color: "#ef4444" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: "#777770" }}>
          No projects found.
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 md:p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6 pb-3 border-b" style={{ borderColor: "#f0ede8" }}>
              <div>
                <h2 className="font-serif text-xl md:text-2xl font-semibold">
                  {editId ? "Edit Project & Photos" : "Add New Project"}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: "#777770" }}>
                  Add multiple photos to showcase project details in customer slideshow
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                style={{ backgroundColor: "#f1f0ed" }}
              >
                ✕
              </button>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Al Barsha Commercial Tower"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm"
                  style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Category *</label>
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Location</label>
                <input
                  type="text"
                  placeholder="Gujranwala, Pakistan"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm"
                  style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Completion Date / Year</label>
                <input
                  type="text"
                  placeholder="March 2024"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm"
                  style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
                />
              </div>
            </div>

            {/* Multiple Photos Section */}
            <div className="mb-6 p-4 rounded-xl border" style={{ borderColor: "#e2ddd6", backgroundColor: "#faf9f6" }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-semibold text-sm">Project Photos ({form.images.length})</div>
                  <div className="text-xs" style={{ color: "#777770" }}>
                    First photo is the Cover Image. All photos will display in the customer slideshow.
                  </div>
                </div>
                {uploading && (
                  <span className="text-xs font-medium text-amber-600 animate-pulse">
                    Uploading photos...
                  </span>
                )}
              </div>

              {/* Upload & URL inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 mt-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "#555" }}>
                    📤 Upload Multiple Images from Device
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={uploading}
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 rounded-lg border text-xs bg-white cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-amber-100 file:text-amber-800"
                    style={{ borderColor: "#e2ddd6" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "#555" }}>
                    🔗 Or Add Photo by URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddUrl();
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-lg border text-xs bg-white"
                      style={{ borderColor: "#e2ddd6" }}
                    />
                    <button
                      type="button"
                      onClick={handleAddUrl}
                      className="px-3 py-2 rounded-lg text-xs font-semibold bg-gray-200 hover:bg-gray-300"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Thumbnail Gallery Preview */}
              {form.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                  {form.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`relative group rounded-xl overflow-hidden border-2 bg-white shadow-sm transition-all ${
                        idx === 0 ? "border-amber-500 ring-2 ring-amber-400/20" : "border-gray-200"
                      }`}
                    >
                      <div className="aspect-video w-full overflow-hidden bg-gray-100">
                        <img
                          src={getImageUrl(imgUrl)}
                          alt={`Project photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Badge */}
                      {idx === 0 ? (
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500 text-white shadow">
                          ★ Cover
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetCover(idx)}
                          className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-black/60 text-white hover:bg-amber-600 transition-colors"
                          title="Click to set as primary cover photo"
                        >
                          Make Cover
                        </button>
                      )}

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center hover:bg-red-700 transition-colors shadow"
                        title="Remove photo"
                      >
                        ✕
                      </button>

                      <div className="px-2 py-1 text-[10px] text-gray-500 bg-gray-50 text-center truncate">
                        Photo {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed rounded-xl bg-white" style={{ borderColor: "#dcd7cf" }}>
                  <div className="text-2xl mb-1">🖼️</div>
                  <div className="text-xs font-medium text-gray-600">No photos added yet</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    Click "Upload Multiple Images" above to add project photos
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5">Services Used (comma separated)</label>
              <input
                type="text"
                placeholder="Building Facade, Curtain Wall, Sliding Windows"
                value={form.services}
                onChange={(e) => setForm({ ...form, services: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border text-sm"
                style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5">Materials Used (comma separated)</label>
              <input
                type="text"
                placeholder="Aluminium Profiles, Tempered Glass, Stainless Steel"
                value={form.materials}
                onChange={(e) => setForm({ ...form, materials: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border text-sm"
                style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5">Project Description</label>
              <textarea
                rows={3}
                placeholder="Details of the project, specifications, custom fabrication details..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border text-sm resize-none"
                style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
              />
            </div>

            <label className="flex items-center gap-2 mb-6 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                style={{ accentColor: "var(--gold)" }}
              />
              <span className="text-sm font-medium">Show in Homepage Featured Projects</span>
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving || uploading}
                className="btn-gold flex-1 py-3 rounded-lg font-semibold text-sm"
              >
                {saving ? "Saving Project..." : "Save Project"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-lg font-medium border text-sm hover:bg-gray-50"
                style={{ borderColor: "#e2ddd6" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
