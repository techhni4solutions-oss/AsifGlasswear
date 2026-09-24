import { useState, useEffect, useCallback } from "react";
import { getImageUrl } from "../../services/api";
import { useData } from "../../context/DataContext";

interface Service {
  id: number;
  name: string;
  icon: string;
  description: string;
  image: string;
  images?: string[];
  status: string;
}

interface Props {
  service: Service;
  onBack: () => void;
  onGetQuote: (serviceName: string) => void;
}

// Technical highlights and features based on service name
function getServiceFeatures(serviceName: string) {
  const lower = serviceName.toLowerCase();
  if (lower.includes("window")) {
    return [
      { icon: "🛡️", title: "Thermal & Acoustic Insulation", desc: "Multi-chamber thermally broken aluminium profiles with double-glazed acoustic glass to block Punjab's intense summer heat and street noise." },
      { icon: "🪟", title: "Opening Styles", desc: "Available in Casement, Sliding, Tilt-and-Turn, Top-Hung Awning, and Fixed Architectural Picture configurations." },
      { icon: "🔒", title: "Multipoint Locking", desc: "Equipped with heavy-duty multipoint security locks, stainless steel friction hinges, and concealed drainage systems." },
      { icon: "🎨", title: "Finish Options", desc: "Qualicoat-certified powder coating (Anthracite Grey, Matt Black, White, Bronze) and luxury anodized finishes." },
    ];
  }
  if (lower.includes("door") && lower.includes("slide")) {
    return [
      { icon: "↔️", title: "Ultra-Smooth Glide", desc: "Heavy-duty stainless steel ball-bearing rollers capable of carrying up to 300kg per sash with effortless one-finger glide." },
      { icon: "🌊", title: "Weather & Dust Sealing", desc: "High-grade EPDM gaskets and interlocking wool-pile weatherstrips engineered for Pakistan's monsoon and dust conditions." },
      { icon: "🌅", title: "Panoramic Sightlines", desc: "Slim interlock stiles (as thin as 20mm) providing uninterrupted views from your living room or master terrace." },
      { icon: "🛡️", title: "Safety Glazing", desc: "10mm to 24mm double-glazed tempered safety glass with optional low-E thermal coating." },
    ];
  }
  if (lower.includes("door")) {
    return [
      { icon: "🚪", title: "Heavy-Duty Architect Systems", desc: "Pivot entrance doors, bi-folding door systems, and classic hinged doors with concealed hydraulic closers." },
      { icon: "💎", title: "Glass & Profile Variety", desc: "Clear float, tinted bronze/grey, fluted reed glass, frosted privacy, and mirror finishes." },
      { icon: "🔐", title: "Smart & Keyed Security", desc: "Compatible with modern digital smart locks, mortise latch systems, and luxury floor springs." },
      { icon: "📐", title: "Custom Sizing", desc: "Engineered for monumental door openings up to 3.5 meters high with precision balancing." },
    ];
  }
  if (lower.includes("partition")) {
    return [
      { icon: "🏢", title: "Acoustic Privacy", desc: "Frameless 10mm-12mm toughened glass partitions or double-glazed acoustic modules reducing sound transmission up to 42dB." },
      { icon: "✨", title: "Frameless Minimalist Look", desc: "Sleek aluminium perimeter channel tracks in anodized silver, matte black, or brushed brass finish." },
      { icon: "🔒", title: "Integrated Glass Doors", desc: "Seamless integration with sliding glass doors, pivot doors, and magnetic privacy smart-film glass." },
      { icon: "🛠️", title: "Rapid Clean Installation", desc: "Modular dry-glazed installation for offices, showrooms, boardrooms, and luxury residential suites." },
    ];
  }
  return [
    { icon: "📐", title: "Custom Engineered", desc: "Tailored to your exact architectural blueprints and structural load requirements." },
    { icon: "💎", title: "Certified Materials", desc: "6063-T5 architectural aluminium extrusions and impact-tested tempered safety glass." },
    { icon: "🔧", title: "Expert Installation", desc: "Installed by certified technicians with decades of hands-on fabrication experience." },
    { icon: "🛡️", title: "Durability & Warranty", desc: "Corrosion-resistant construction built to withstand harsh outdoor weather conditions." },
  ];
}

export default function ServiceDetailPage({ service, onBack, onGetQuote }: Props) {
  const { settings } = useData();
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Build the full image list: main image + gallery images
  const allImages: string[] = [];
  if (service.image) allImages.push(service.image);
  if (Array.isArray(service.images)) {
    service.images.forEach((img) => {
      if (img && !allImages.includes(img)) allImages.push(img);
    });
  }
  // Fallback if no images at all
  if (allImages.length === 0) {
    allImages.push("https://images.unsplash.com/photo-1702724758750-9ff8d50f02e5?w=600&h=400&fit=crop&auto=format");
  }

  // SEO Meta Tags – inject into <head>
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${service.name} | Asif Glass & Aluminium — Premium Services`;

    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let tag = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    const desc = service.description?.slice(0, 160) || `Premium ${service.name} by Asif Glass & Aluminium, Gujranwala.`;
    setMeta("description", desc);
    setMeta("og:title", `${service.name} | Asif Glass & Aluminium`, true);
    setMeta("og:description", desc, true);
    setMeta("og:image", getImageUrl(allImages[0]), true);
    setMeta("og:type", "website", true);

    // JSON-LD Schema.org Service markup
    let script = document.getElementById("service-jsonld") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "service-jsonld";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      description: desc,
      image: getImageUrl(allImages[0]),
      provider: {
        "@type": "LocalBusiness",
        name: settings.company_name || "Asif Glass & Aluminium",
        address: settings.address || "Gujranwala, Pakistan",
        telephone: settings.phone || "",
      },
    });

    return () => {
      document.title = prevTitle;
      const jsonld = document.getElementById("service-jsonld");
      if (jsonld) jsonld.remove();
    };
  }, [service, settings]);

  // Keyboard navigation for slides & zoom
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setIsZoomOpen(false);
    if (e.key === "ArrowRight") setCurrentSlide((prev) => (prev + 1) % allImages.length);
    if (e.key === "ArrowLeft") setCurrentSlide((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const cleanPhone = settings.whatsapp ? settings.whatsapp.replace(/[^0-9]/g, "") : "923066426139";
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello Asif Glass & Aluminium, I am interested in getting a detailed quote for ${service.name}.`
  )}`;

  const features = getServiceFeatures(service.name);

  const goToSlide = (idx: number) => setCurrentSlide(idx);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % allImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <div className="pb-24 md:pb-16">
      {/* Breadcrumb Header */}
      <div className="px-4 py-4 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
          <button onClick={onBack} className="flex items-center gap-1 hover:underline font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Services
          </button>
          <span>/</span>
          <span style={{ color: "var(--foreground)" }} className="font-semibold">{service.name}</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="py-14 md:py-20 px-4 text-center" style={{ backgroundColor: "var(--dark-bg)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest mb-4 border" style={{ borderColor: "rgba(201,169,110,0.3)", color: "var(--gold)", backgroundColor: "rgba(201,169,110,0.08)" }}>
            <span>{service.icon}</span>
            <span>Architectural Solutions</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-5">
            {service.name}
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "rgba(245,244,240,0.75)" }}>
            Precision-engineered, thermally efficient, and bespoke aluminium & glass solutions fabricated in our Gujranwala facility.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onGetQuote(service.name)}
              className="btn-gold px-7 py-3.5 rounded-xl text-sm font-semibold shadow-lg"
            >
              Request Quote for {service.name}
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl text-sm font-semibold border flex items-center gap-2 transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.25)", color: "#fff" }}
            >
              💬 WhatsApp Direct
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-start">
          {/* Left Column: Image Slideshow with Zoom */}
          <div className="lg:col-span-7">
            {/* Slideshow */}
            <div className="relative rounded-2xl overflow-hidden aspect-video sm:aspect-[16/10] bg-neutral-900 border group shadow-xl" style={{ borderColor: "var(--border)" }}>
              <img
                src={getImageUrl(allImages[currentSlide])}
                alt={`${service.name} - Photo ${currentSlide + 1}`}
                onClick={() => setIsZoomOpen(true)}
                className="w-full h-full object-cover cursor-zoom-in transition-all duration-500"
              />

              {/* Slide Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 6 15 12 9 18" /></svg>
                  </button>
                </>
              )}

              {/* Slide counter badge */}
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono flex items-center gap-2">
                <span>{service.icon}</span>
                <span>{currentSlide + 1} / {allImages.length}</span>
              </div>

              {/* Zoom button */}
              <div className="absolute top-3 right-3">
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center gap-1.5 transition-all shadow"
                >
                  🔍 Zoom
                </button>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className="flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all"
                    style={{
                      borderColor: idx === currentSlide ? "var(--gold)" : "transparent",
                      opacity: idx === currentSlide ? 1 : 0.6,
                      width: 72,
                      height: 54,
                    }}
                  >
                    <img src={getImageUrl(img)} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="text-xs text-center mt-2" style={{ color: "var(--muted-foreground)" }}>
              {allImages.length > 1 ? "Click photos to zoom • Use arrows or ← → keys to browse" : "Click photo to view high-resolution full-screen"}
            </div>

            {/* In-depth Overview */}
            <div className="mt-10 rounded-2xl p-6 md:p-8 border" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
              <div className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: "var(--gold)" }}>Detailed Overview</div>
              <h2 className="font-serif text-2xl md:text-3xl mb-4">Engineering & Craftsmanship</h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: "var(--muted-foreground)" }}>
                {service.description || "Our custom aluminium and glass systems are built to meet the highest aesthetic and architectural standards. Fabricated from certified prime-grade aluminium and precision-cut glass, each unit is manufactured to your exact opening dimensions."}
              </p>
              <p className="text-base leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                Whether you are modernizing a residential villa in Satellite Town, building an office space in Lahore, or outfitting a commercial showroom in Gujranwala, we oversee every step from laser site measurements to final on-site structural glazing.
              </p>
            </div>
          </div>

          {/* Right Column: Key Features & CTA Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-2xl p-6 border" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
              <h3 className="font-serif text-xl mb-4 flex items-center gap-2">
                <span>✨</span>
                <span>Specifications & Advantages</span>
              </h3>
              <div className="space-y-4">
                {features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3.5 pb-3.5 border-b last:border-b-0" style={{ borderColor: "var(--border)" }}>
                    <div className="text-2xl mt-0.5 flex-shrink-0">{feat.icon}</div>
                    <div>
                      <div className="font-semibold text-sm">{feat.title}</div>
                      <div className="text-xs leading-relaxed mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                        {feat.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Quote Box */}
            <div className="rounded-2xl p-6 border text-center" style={{ borderColor: "var(--gold)", backgroundColor: "rgba(201,169,110,0.06)" }}>
              <div className="font-serif text-xl mb-2">Need a Quotation for {service.name}?</div>
              <p className="text-xs mb-5 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                Share your room measurements or blueprints and get a detailed breakdown within 24 hours.
              </p>
              <button
                onClick={() => onGetQuote(service.name)}
                className="btn-gold w-full py-3.5 rounded-xl font-semibold text-sm shadow-md mb-3"
              >
                Request Free Estimate
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2 whatsapp-btn"
              >
                💬 WhatsApp Our Engineers
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Fullscreen Zoom Modal with Slideshow */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-md select-none"
          onClick={() => setIsZoomOpen(false)}
        >
          {/* Top bar */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
            <span className="text-xs font-mono text-white/80 hidden sm:inline">
              {service.name} — {currentSlide + 1}/{allImages.length} (Esc to close, ← → to browse)
            </span>
            <button
              onClick={() => setIsZoomOpen(false)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Main zoomed image */}
          <img
            src={getImageUrl(allImages[currentSlide])}
            alt={`${service.name} - Photo ${currentSlide + 1}`}
            className="max-h-[85vh] max-w-[95vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Modal navigation arrows */}
          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 6 15 12 9 18" /></svg>
              </button>
            </>
          )}

          {/* Modal thumbnail strip */}
          {allImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 p-2 rounded-xl backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className="flex-shrink-0 rounded-md overflow-hidden border-2 transition-all"
                  style={{
                    borderColor: idx === currentSlide ? "var(--gold)" : "transparent",
                    opacity: idx === currentSlide ? 1 : 0.5,
                    width: 56,
                    height: 42,
                  }}
                >
                  <img src={getImageUrl(img)} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
