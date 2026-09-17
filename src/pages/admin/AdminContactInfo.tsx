import { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";

export default function AdminContactInfo() {
  const { settings, updateSettings } = useData();

  const [form, setForm] = useState({
    company_name: settings.company_name || "Asif Glass & Aluminium",
    phone: settings.phone || "0306 642 6139",
    whatsapp: settings.whatsapp || "0306 642 6139",
    email: settings.email || "info@asifglass.pk",
    address: settings.address || "Ghulam Dastagir Khan Rd, Block-D Satellite Town, Gujranwala 52250, Pakistan",
    gmaps_link: settings.gmaps_link || "https://www.google.com/maps?q=Ghulam+Dastagir+Khan+Rd,+Block-D+Satellite+Town,+Gujranwala+52250,+Pakistan",
    hero_title: settings.hero_title || "Premium Aluminium & Glass Solutions",
    hero_subtitle: settings.hero_subtitle || "Crafting Architectural Elegance for Residential & Commercial Spaces in Pakistan",
  });

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        company_name: settings.company_name || "",
        phone: settings.phone || "",
        whatsapp: settings.whatsapp || "",
        email: settings.email || "",
        address: settings.address || "",
        gmaps_link: settings.gmaps_link || "",
        hero_title: settings.hero_title || "",
        hero_subtitle: settings.hero_subtitle || "",
      });
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        ...settings,
        ...form,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Failed to update contact settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl">Contact Information & Site Settings</h1>
          <p className="text-sm mt-1 text-gray-500">Updates made here immediately reflect on the customer-facing website.</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Details */}
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#e2ddd6" }}>
            <h2 className="font-semibold text-base mb-5">Contact Details</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">🏢 Company Name</label>
                <input
                  type="text"
                  required
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border text-sm"
                  style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">📞 Company Phone</label>
                <input
                  type="text"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border text-sm"
                  style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">💬 WhatsApp Number</label>
                <input
                  type="text"
                  required
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border text-sm"
                  style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">✉️ Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border text-sm"
                  style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">📍 Office Address</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border text-sm"
                  style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">🗺️ Google Maps Link</label>
                <input
                  type="text"
                  value={form.gmaps_link}
                  onChange={(e) => setForm({ ...form, gmaps_link: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border text-sm"
                  style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
                />
              </div>
            </div>
          </div>

          {/* Homepage Content */}
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#e2ddd6" }}>
            <h2 className="font-semibold text-base mb-5">Homepage Hero Heading</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Hero Title</label>
                <input
                  type="text"
                  value={form.hero_title}
                  onChange={(e) => setForm({ ...form, hero_title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border text-sm"
                  style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Hero Subtitle</label>
                <textarea
                  rows={4}
                  value={form.hero_subtitle}
                  onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border text-sm resize-none"
                  style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button type="submit" disabled={saving} className="btn-gold px-8 py-3.5 rounded-lg font-semibold">
            {saving ? "Saving Changes..." : "Update Contact Information"}
          </button>
          {saved && (
            <span className="text-sm font-medium text-green-600">✓ Contact information updated live on customer side!</span>
          )}
        </div>
      </form>
    </div>
  );
}
