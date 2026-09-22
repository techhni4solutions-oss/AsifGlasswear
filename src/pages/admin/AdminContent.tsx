import { useState } from "react";

const CONTENT_SECTIONS = [
  { key: "hero", label: "Homepage Hero", fields: [
    { key: "heading", label: "Hero Heading", type: "text", value: "Premium Aluminium & Glass Solutions" },
    { key: "description", label: "Hero Description", type: "textarea", value: "Modern doors, windows, partitions, facades and custom glass solutions designed and installed with precision." },
    { key: "cta", label: "CTA Button Text", type: "text", value: "Get a Free Quote" },
  ]},
  { key: "stats", label: "Company Statistics", fields: [
    { key: "years", label: "Years Experience", type: "text", value: "25+" },
    { key: "projects", label: "Projects Completed", type: "text", value: "800+" },
    { key: "clients", label: "Happy Clients", type: "text", value: "500+" },
    { key: "team", label: "Expert Team", type: "text", value: "30+" },
  ]},
  { key: "about", label: "About Us", fields: [
    { key: "about_text", label: "About Text", type: "textarea", value: "Asif Glass & Aluminium is a premium aluminium and glass solutions provider serving Gujranwala and Punjab since 1998. We specialize in custom aluminium windows, doors, facades, glass partitions, railings, and shower cabins for residential and commercial clients." },
  ]},
  { key: "cta_section", label: "CTA Section", fields: [
    { key: "cta_heading", label: "CTA Heading", type: "text", value: "Have a Project in Mind?" },
    { key: "cta_sub", label: "CTA Subtext", type: "textarea", value: "Get a customized quotation for your Aluminium & Glass project." },
  ]},
  { key: "footer", label: "Footer", fields: [
    { key: "footer_text", label: "Footer Tagline", type: "textarea", value: "Premium aluminium and glass solutions for residential and commercial projects across Punjab since 1998." },
    { key: "trn", label: "TRN / NTN Number", type: "text", value: "100-234-567-89012" },
  ]},
];

export default function AdminContent() {
  const [sections, setSections] = useState(CONTENT_SECTIONS);
  const [activeSection, setActiveSection] = useState("hero");
  const [saved, setSaved] = useState<string | null>(null);

  const currentSection = sections.find((s) => s.key === activeSection)!;

  const updateField = (sectionKey: string, fieldKey: string, value: string) => {
    setSections((prev) => prev.map((s) =>
      s.key === sectionKey ? { ...s, fields: s.fields.map((f) => f.key === fieldKey ? { ...f, value } : f) } : s
    ));
  };

  const handleSave = () => {
    setSaved(activeSection);
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-7">
        <h1 className="font-serif text-2xl md:text-3xl">Website Content</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section nav */}
        <div className="bg-white rounded-2xl border p-3" style={{ borderColor: "#e2ddd6" }}>
          <div className="text-xs font-mono uppercase tracking-wider px-3 py-2 mb-1" style={{ color: "#777770" }}>Sections</div>
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-colors"
              style={{
                backgroundColor: activeSection === s.key ? "rgba(201,169,110,0.1)" : "transparent",
                color: activeSection === s.key ? "var(--gold)" : "#444440",
                borderLeft: activeSection === s.key ? "2px solid var(--gold)" : "2px solid transparent",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="lg:col-span-3 bg-white rounded-2xl border p-6" style={{ borderColor: "#e2ddd6" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">{currentSection.label}</h2>
            {saved === activeSection && (
              <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: "#22c55e18", color: "#22c55e" }}>Saved ✓</span>
            )}
          </div>
          <div className="flex flex-col gap-5">
            {currentSection.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium mb-1.5">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    rows={4}
                    value={field.value}
                    onChange={(e) => updateField(activeSection, field.key, e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border text-sm resize-none"
                    style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
                  />
                ) : (
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => updateField(activeSection, field.key, e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border text-sm"
                    style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t" style={{ borderColor: "#f0ede8" }}>
            <button onClick={handleSave} className="btn-gold px-8 py-3 rounded-lg font-semibold">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
