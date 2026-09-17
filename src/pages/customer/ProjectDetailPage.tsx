import { useState } from "react";

interface Project {
  id: number;
  name: string;
  category: string;
  type: string;
  location: string;
  date: string;
  image: string;
  gallery: string[];
  description: string;
  services: string[];
  materials: string[];
}

interface Props {
  project: Project;
  onBack: () => void;
  onGetQuote: () => void;
}

export default function ProjectDetailPage({ project, onBack, onGetQuote }: Props) {
  const [activeImg, setActiveImg] = useState(project.image);
  const allImages = [project.image, ...project.gallery];

  return (
    <div className="pb-24 md:pb-12">
      {/* Breadcrumb */}
      <div className="px-4 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
          <button onClick={onBack} className="flex items-center gap-1 hover:underline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Projects
          </button>
          <span>/</span>
          <span style={{ color: "var(--foreground)" }}>{project.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Image gallery */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl overflow-hidden aspect-video mb-3 bg-gray-100">
              <img src={activeImg} alt={project.name} className="w-full h-full object-cover" />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(img)}
                    className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all"
                    style={{ borderColor: activeImg === img ? "var(--gold)" : "transparent" }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project info */}
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono mb-4 border" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
              {project.category} • {project.type}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl leading-tight mb-3">{project.name}</h1>
            <div className="flex items-center gap-4 mb-6 text-sm" style={{ color: "var(--muted-foreground)" }}>
              <span>📍 {project.location}</span>
              <span>📅 {project.date}</span>
            </div>
            <p className="text-base leading-relaxed mb-8" style={{ color: "var(--muted-foreground)" }}>{project.description}</p>

            <div className="mb-6">
              <div className="text-sm font-semibold mb-3">Services Provided</div>
              <div className="flex flex-wrap gap-2">
                {project.services.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-lg text-sm border" style={{ borderColor: "var(--border)", backgroundColor: "var(--secondary)" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="text-sm font-semibold mb-3">Materials Used</div>
              <div className="flex flex-col gap-2">
                {project.materials.map((m) => (
                  <div key={m} className="flex items-center gap-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--gold)" }} />
                    {m}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6 border" style={{ borderColor: "var(--border)", backgroundColor: "var(--secondary)" }}>
              <div className="font-semibold mb-2">Interested in a similar project?</div>
              <p className="text-sm mb-4" style={{ color: "var(--muted-foreground)" }}>
                We'll design and deliver a solution tailored to your exact requirements.
              </p>
              <button onClick={onGetQuote} className="btn-gold w-full py-3.5 rounded-lg font-semibold">
                Request Similar Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
