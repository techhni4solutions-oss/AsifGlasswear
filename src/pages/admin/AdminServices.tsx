import { useState } from "react";
import { useData } from "../../context/DataContext";
import { api, getImageUrl } from "../../services/api";

export default function AdminServices() {
  const { services, addService, updateService, deleteService } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", description: "", status: "Active", image: "", images: [] as string[], icon: "✨" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleStatus = async (id: number) => {
    const s = services.find((x) => x.id === id);
    if (!s) return;
    try {
      const newStatus = s.status === "Active" ? "Inactive" : "Active";
      await updateService(id, { ...s, status: newStatus });
    } catch (err) {
      alert("Failed to toggle service status");
    }
  };

  const handleEdit = (id: number) => {
    const s = services.find((x: any) => x.id === id)!;
    const existingImages = Array.isArray(s.images) ? s.images : [];
    setForm({ name: s.name, description: s.description, status: s.status, image: s.image, images: existingImages, icon: s.icon });
    setEditId(id);
    setSelectedFile(null);
    setAdditionalFiles([]);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(id);
      } catch (err) {
        alert("Failed to delete service");
      }
    }
  };

  const removeGalleryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Upload main image if a file was selected
      let imageUrl = form.image;
      if (selectedFile) {
        const uploadRes = await api.uploadFile(selectedFile);
        imageUrl = uploadRes.url;
      }

      // Upload additional gallery images
      const galleryUrls = [...form.images];
      for (const file of additionalFiles) {
        const uploadRes = await api.uploadFile(file);
        galleryUrls.push(uploadRes.url);
      }

      const payload = {
        name: form.name,
        icon: form.icon || "✨",
        description: form.description,
        image: imageUrl || "https://images.unsplash.com/photo-1702724758750-9ff8d50f02e5?w=600&h=400&fit=crop&auto=format",
        images: galleryUrls,
        status: form.status,
      };

      if (editId) {
        await updateService(editId, payload);
      } else {
        await addService(payload);
      }

      setShowForm(false);
      setEditId(null);
      setForm({ name: "", description: "", status: "Active", image: "", images: [], icon: "✨" });
      setSelectedFile(null);
      setAdditionalFiles([]);
    } catch (err: any) {
      alert(err.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-7">
        <h1 className="font-serif text-2xl md:text-3xl">Services</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: "", description: "", status: "Active", image: "", images: [], icon: "✨" }); setSelectedFile(null); setAdditionalFiles([]); }} className="btn-gold px-5 py-2.5 rounded-lg text-sm">+ Add Service</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map((svc) => {
          const allImages = Array.isArray(svc.images) ? svc.images : [];
          const totalPhotos = (svc.image ? 1 : 0) + allImages.length;
          return (
            <div key={svc.id} className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#e2ddd6" }}>
              <div className="aspect-video overflow-hidden relative">
                <img src={getImageUrl(svc.image)} alt={svc.name} className="w-full h-full object-cover" />
                {totalPhotos > 1 && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
                    📷 {totalPhotos} photos
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{svc.icon}</span>
                    <div className="font-semibold text-sm">{svc.name}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ backgroundColor: svc.status === "Active" ? "#22c55e18" : "#ef444418", color: svc.status === "Active" ? "#22c55e" : "#ef4444" }}>
                    {svc.status}
                  </span>
                </div>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "#777770" }}>{svc.description ? svc.description.slice(0, 90) : ''}...</p>
                <div className="flex gap-2">
                  <button onClick={() => toggleStatus(svc.id)} className="flex-1 py-2 rounded-lg text-xs font-medium border" style={{ borderColor: "#e2ddd6", color: "#444440" }}>
                    {svc.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => handleEdit(svc.id)} className="py-2 px-3 rounded-lg text-xs font-medium border" style={{ borderColor: "#e2ddd6", color: "#444440" }}>Edit</button>
                  <button onClick={() => handleDelete(svc.id)} className="py-2 px-3 rounded-lg text-xs font-medium border" style={{ borderColor: "#e2ddd6", color: "#ef4444" }}>Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50">
          <form onSubmit={handleSave} className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl">{editId ? "Edit Service" : "Add Service"}</h2>
              <button type="button" onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: "#f1f0ed" }}>✕</button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5">Service Name *</label>
              <input type="text" required placeholder="Aluminium Windows" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5">Icon Emoji</label>
              <input type="text" placeholder="🪟" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }} />
            </div>

            {/* Main Image */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5">Main Image (Cover Photo)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm mb-2"
                style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
              />
              <input
                type="text"
                placeholder="Or image URL (https://...)"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border text-sm"
                style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
              />
              {form.image && <img src={getImageUrl(form.image)} alt="Preview" className="mt-2 h-20 rounded-lg object-cover" />}
            </div>

            {/* Additional Gallery Images */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5">Additional Gallery Photos</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setAdditionalFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
                  }
                }}
                className="w-full px-3 py-2.5 rounded-lg border text-sm"
                style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
              />
              {/* Existing gallery thumbnails */}
              {form.images.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs font-medium mb-1.5" style={{ color: "#777770" }}>Saved Photos ({form.images.length})</div>
                  <div className="flex flex-wrap gap-2">
                    {form.images.map((url, idx) => (
                      <div key={idx} className="relative group">
                        <img src={getImageUrl(url)} alt={`Gallery ${idx + 1}`} className="h-16 w-16 rounded-lg object-cover border" style={{ borderColor: "#e2ddd6" }} />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* New files to upload preview */}
              {additionalFiles.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs font-medium mb-1.5" style={{ color: "#777770" }}>New Photos to Upload ({additionalFiles.length})</div>
                  <div className="flex flex-wrap gap-2">
                    {additionalFiles.map((file, idx) => (
                      <div key={idx} className="relative group">
                        <img src={URL.createObjectURL(file)} alt={file.name} className="h-16 w-16 rounded-lg object-cover border" style={{ borderColor: "#e2ddd6" }} />
                        <button
                          type="button"
                          onClick={() => setAdditionalFiles((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5">Detailed Description</label>
              <textarea rows={4} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm resize-none" style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }} />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-gold flex-1 py-3 rounded-lg font-semibold">
                {saving ? "Saving..." : "Save Service"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-lg font-medium border" style={{ borderColor: "#e2ddd6" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
