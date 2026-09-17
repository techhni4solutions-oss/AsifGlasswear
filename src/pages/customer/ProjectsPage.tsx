import { useState } from "react";
import { useData } from "../../context/DataContext";

const FILTERS = ["All", "Residential", "Commercial", "Aluminium", "Glass", "Windows", "Doors", "Partitions"];

interface Props {
  onProjectClick: (id: number) => void;
  onGetQuote: () => void;
}

export default function ProjectsPage({ onProjectClick, onGetQuote }: Props) {
  const { projects } = useData();
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? projects
    : projects.filter((p) =>
        p.category === activeFilter ||
        p.type.includes(activeFilter) ||
        p.services.some((s) => s.includes(activeFilter))
      );

  return (
    <div className="pb-24 md:pb-12">
      {/* Page header */}
      <div className="py-16 px-4 text-center" style={{ backgroundColor: "var(--dark-bg)" }}>
        <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "var(--gold)" }}>Portfolio</div>
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">Our Projects</h1>
        <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(245,244,240,0.6)" }}>
          Explore our completed residential and commercial projects across the UAE.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters - horizontal scroll on mobile */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-10 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all"
              style={{
                borderColor: activeFilter === f ? "var(--gold)" : "var(--border)",
                backgroundColor: activeFilter === f ? "var(--gold)" : "transparent",
                color: activeFilter === f ? "var(--foreground)" : "var(--muted-foreground)",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((proj) => (
            <button
              key={proj.id}
              onClick={() => onProjectClick(proj.id)}
              className="group rounded-2xl overflow-hidden border text-left transition-all hover:-translate-y-1 hover:shadow-xl"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={proj.image}
                  alt={proj.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium" style={{ backgroundColor: "rgba(15,15,14,0.8)", color: "var(--gold)", backdropFilter: "blur(4px)" }}>
                    {proj.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="font-mono text-xs mb-2" style={{ color: "var(--muted-foreground)" }}>{proj.type}</div>
                <h3 className="font-serif text-lg leading-tight mb-2">{proj.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>📍 {proj.location}</span>
                  <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>{proj.date}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20" style={{ color: "var(--muted-foreground)" }}>
            No projects found for this filter.
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-2xl p-8 md:p-12 text-center" style={{ backgroundColor: "var(--dark-bg)" }}>
          <h3 className="font-serif text-2xl md:text-3xl text-white mb-3">Have a Similar Project?</h3>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "rgba(245,244,240,0.6)" }}>
            Tell us about your requirements and our team will provide a detailed quotation.
          </p>
          <button onClick={onGetQuote} className="btn-gold px-8 py-4 rounded-lg font-semibold">
            Request a Quote
          </button>
        </div>
      </div>
    </div>
  );
}
