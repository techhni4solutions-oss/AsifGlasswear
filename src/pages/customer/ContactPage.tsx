import { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";

const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;

function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("The selected image could not be read."));
    reader.readAsDataURL(file);
  });
}

const PROJECT_TYPES = [
  "Aluminium Windows", "Aluminium Doors", "Sliding Doors", "Glass Doors",
  "Glass Partitions", "Glass Railings", "Shop Front", "Building Facade",
  "Shower Cabin", "Custom Glass Work", "Other",
];

interface ContactProps {
  initialProjectType?: string;
}

export default function ContactPage({ initialProjectType }: ContactProps = {}) {
  const { settings, submitInquiry } = useData();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    projectType: initialProjectType || "",
    location: "",
    message: "",
  });

  useEffect(() => {
    if (initialProjectType) {
      setForm((prev) => ({ ...prev, projectType: initialProjectType }));
    }
  }, [initialProjectType]);

  const mapLat = settings.map_lat || 32.1577;
  const mapLon = settings.map_lon || 74.1945;
  const mapZoom = 16;
  const osmEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${mapLon - 0.008}%2C${mapLat - 0.005}%2C${mapLon + 0.008}%2C${mapLat + 0.005}&layer=mapnik&marker=${mapLat}%2C${mapLon}`;
  const osmLink = `https://www.openstreetmap.org/?mlat=${mapLat}&mlon=${mapLon}#map=${mapZoom}/${mapLat}/${mapLon}`;
  const gmapsLink = settings.gmaps_link || `https://www.google.com/maps?q=${encodeURIComponent(settings.address)}`;

  const cleanPhone = settings.whatsapp ? settings.whatsapp.replace(/[^0-9]/g, "") : "923066426139";
  const whatsappUrl = `https://wa.me/${cleanPhone}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let attachmentUrl = "";
      if (selectedFile) {
        if (!selectedFile.type.startsWith("image/")) {
          throw new Error("Please select a valid image file.");
        }
        if (selectedFile.size > MAX_ATTACHMENT_SIZE) {
          throw new Error("Please select an image smaller than 5 MB.");
        }

        // Save the image data with the inquiry instead of using a temporary
        // Render filesystem URL that disappears when the server sleeps.
        attachmentUrl = await readImageAsDataUrl(selectedFile);
      }

      await submitInquiry({
        ...form,
        attachment: attachmentUrl,
      });

      setSubmitted(true);
    } catch (err: any) {
      alert(err.message || "Failed to submit quote request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-24 md:pb-12">
      {/* Header */}
      <div className="py-16 px-4 text-center" style={{ backgroundColor: "var(--dark-bg)" }}>
        <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "var(--gold)" }}>Get In Touch</div>
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">Request a Free Quote</h1>
        <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(245,244,240,0.6)" }}>
          Fill in the form below and our team will get back to you within 24 hours with a detailed quotation.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-5 gap-10 md:gap-14">
        {/* Contact info + map */}
        <div className="lg:col-span-2">
          <h2 className="font-serif text-2xl mb-6">Contact Information</h2>

          {[
            { icon: "📞", label: "Phone", value: settings.phone, href: `tel:${settings.phone.replace(/[^0-9+]/g, "")}` },
            { icon: "💬", label: "WhatsApp", value: settings.whatsapp, href: whatsappUrl },
            { icon: "✉️", label: "Email", value: settings.email, href: `mailto:${settings.email}` },
            { icon: "📍", label: "Address", value: settings.address, href: gmapsLink },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 rounded-xl mb-3 border transition-all hover:border-amber-400 hover:shadow-sm"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
            >
              <span className="text-2xl mt-0.5 flex-shrink-0">{item.icon}</span>
              <div>
                <div className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>{item.label}</div>
                <div className="text-sm font-medium leading-relaxed">{item.value}</div>
              </div>
            </a>
          ))}

          {/* OpenStreetMap embed */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold">Our Location</div>
              <div className="flex gap-2">
                <a href={osmLink} target="_blank" rel="noopener noreferrer" className="text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors hover:bg-gray-50" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
                  OpenStreetMap ↗
                </a>
                <a href={gmapsLink} target="_blank" rel="noopener noreferrer" className="text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors hover:bg-blue-50" style={{ borderColor: "var(--border)", color: "#3b82f6" }}>
                  Google Maps ↗
                </a>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--border)", height: "260px" }}>
              <iframe
                title={`${settings.company_name} Location`}
                src={osmEmbed}
                width="100%"
                height="260"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mt-2 text-xs text-center" style={{ color: "var(--muted-foreground)" }}>
              📍 {settings.address}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
              <div className="text-5xl mb-4">✅</div>
              <h3 className="font-serif text-2xl mb-3">Quote Request Received!</h3>
              <p className="text-base max-w-sm" style={{ color: "var(--muted-foreground)" }}>
                Thank you! Our team will review your requirements and contact you within 24 hours.
              </p>
              <a
                href={`${whatsappUrl}?text=Hello, I just submitted a quote request for ${encodeURIComponent(form.projectType || "a project")}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold whatsapp-btn"
              >
                💬 Also reach us on WhatsApp
              </a>
              <button onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", projectType: "", location: "", message: "" }); setSelectedFile(null); }} className="mt-4 text-sm font-medium underline underline-offset-4" style={{ color: "var(--muted-foreground)" }}>
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl p-6 md:p-8 border" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
              <h3 className="font-serif text-xl mb-6">Project Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Asif Ahmed"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border text-sm"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 000 0000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border text-sm"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border text-sm"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Type *</label>
                  <select
                    required
                    value={form.projectType}
                    onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border text-sm"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                  >
                    <option value="">Select type...</option>
                    {PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Project Location</label>
                  <input
                    type="text"
                    placeholder="Gujranwala, Lahore..."
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border text-sm"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Upload Design/Room Photo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file && file.size > MAX_ATTACHMENT_SIZE) {
                      alert("Please select an image smaller than 5 MB.");
                      e.target.value = "";
                      setSelectedFile(null);
                      return;
                    }
                    setSelectedFile(file);
                  }}
                  className="w-full px-4 py-3 rounded-xl border text-sm"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                />
                <p className="text-xs mt-2" style={{ color: "var(--muted-foreground)" }}>
                  Upload a photo of your space or design idea (maximum 5 MB). It will be saved permanently with your inquiry.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Project Description</label>
                <textarea
                  rows={5}
                  placeholder="Describe your project — dimensions, quantity, preferred materials, timeline..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border text-sm resize-none"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                />
              </div>

              <button type="submit" disabled={submitting} className="btn-gold w-full py-4 rounded-xl text-base font-semibold">
                {submitting ? "Submitting Request..." : "Request a Free Quote"}
              </button>
              <p className="text-xs text-center mt-3" style={{ color: "var(--muted-foreground)" }}>
                Or WhatsApp us directly on{" "}
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-medium" style={{ color: "#25D366" }}>{settings.whatsapp}</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
