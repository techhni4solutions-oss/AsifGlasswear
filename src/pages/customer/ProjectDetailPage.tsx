import { useState, useEffect, useCallback, useRef } from "react";
import { getImageUrl } from "../../services/api";

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
  const galleryList = Array.isArray(project.gallery) ? project.gallery : [];
  const rawImages = [project.image, ...galleryList].filter(Boolean);
  const allImages = Array.from(new Set(rawImages));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const currentImage = allImages[currentIndex] || project.image;

  // Slideshow navigation
  const goToNext = useCallback(() => {
    if (allImages.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  }, [allImages.length]);

  const goToPrev = useCallback(() => {
    if (allImages.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  }, [allImages.length]);

  // Slideshow auto-play
  useEffect(() => {
    if (!isPlaying || allImages.length <= 1 || isZoomOpen) return;
    const interval = setInterval(() => {
      goToNext();
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlaying, allImages.length, isZoomOpen, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsZoomOpen(false);
        setZoomLevel(1);
        setPan({ x: 0, y: 0 });
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrev();
      } else if (isZoomOpen && (e.key === "+" || e.key === "=")) {
        setZoomLevel((z) => Math.min(z + 0.5, 3));
      } else if (isZoomOpen && (e.key === "-" || e.key === "_")) {
        setZoomLevel((z) => Math.max(z - 0.5, 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomOpen, goToNext, goToPrev]);

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.5, 3));
  const handleZoomOut = () => {
    setZoomLevel((z) => {
      const next = Math.max(z - 0.5, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };
  const toggleDoubleClickZoom = () => {
    if (zoomLevel > 1) {
      handleResetZoom();
    } else {
      setZoomLevel(2);
    }
  };

  // Pan / drag when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

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
          {/* Slideshow & Gallery column */}
          <div className="lg:col-span-3">
            {/* Main Interactive Slide Viewer */}
            <div className="relative rounded-2xl overflow-hidden aspect-video mb-3 bg-neutral-900 group select-none shadow-md">
              <img
                src={getImageUrl(currentImage)}
                alt={`${project.name} - Photo ${currentIndex + 1}`}
                onClick={() => {
                  setIsZoomOpen(true);
                  setZoomLevel(1);
                  setPan({ x: 0, y: 0 });
                }}
                className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.01]"
              />

              {/* Photo counter badge */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-mono font-medium bg-black/60 text-white backdrop-blur-md flex items-center gap-1.5 shadow">
                <span>📷</span>
                <span>{currentIndex + 1} / {allImages.length}</span>
              </div>

              {/* Action buttons (Zoom + Slideshow Play/Pause) */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                {allImages.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPlaying(!isPlaying);
                    }}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center gap-1.5 transition-all shadow"
                    title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
                  >
                    <span>{isPlaying ? "⏸ Pause" : "▶ Play Slideshow"}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomOpen(true);
                    setZoomLevel(1);
                    setPan({ x: 0, y: 0 });
                  }}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1.5 transition-all shadow"
                  title="Click to Zoom In and view full-screen"
                >
                  <span>🔍 Zoom In</span>
                </button>
              </div>

              {/* Prev / Next Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrev();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center text-xl transition-all shadow opacity-80 hover:opacity-100"
                    title="Previous photo"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center text-xl transition-all shadow opacity-80 hover:opacity-100"
                    title="Next photo"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Bottom slide dots */}
              {allImages.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-1.5 pointer-events-none">
                  {allImages.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentIndex === i ? "w-6 bg-amber-400" : "w-1.5 bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Click to zoom prompt */}
            <div className="flex items-center justify-between text-xs px-1 mb-4" style={{ color: "var(--muted-foreground)" }}>
              <span>Click on any photo to open full-screen zoom</span>
              {allImages.length > 1 && <span>Use ‹ › or arrows to browse</span>}
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2 hide-scrollbar">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentIndex(i);
                      setIsPlaying(false);
                    }}
                    className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all shadow-sm ${
                      currentIndex === i
                        ? "border-amber-500 scale-105 shadow-md"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0.5 right-1 text-[9px] font-mono text-white/90 bg-black/50 px-1 rounded">
                      {i + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project info column */}
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

            {/* Services */}
            {Array.isArray(project.services) && project.services.length > 0 && (
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
            )}

            {/* Materials */}
            {Array.isArray(project.materials) && project.materials.length > 0 && (
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
            )}

            {/* Quote CTA */}
            <div className="rounded-2xl p-6 border" style={{ borderColor: "var(--border)", backgroundColor: "var(--secondary)" }}>
              <div className="font-semibold mb-2">Interested in a similar project?</div>
              <p className="text-sm mb-4" style={{ color: "var(--muted-foreground)" }}>
                We'll design, fabricate, and install a custom aluminium and glass solution tailored to your exact specifications.
              </p>
              <button onClick={onGetQuote} className="btn-gold w-full py-3.5 rounded-lg font-semibold">
                Request Similar Project Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN PHOTO ZOOM MODAL (LIGHTBOX) */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white select-none backdrop-blur-md"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between px-4 py-3 bg-black/60 border-b border-white/10 z-10">
            <div className="flex items-center gap-3">
              <span className="font-medium text-sm text-white truncate max-w-xs sm:max-w-md">
                {project.name}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-amber-400">
                {currentIndex + 1} / {allImages.length}
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-lg p-1">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  className="px-2.5 py-1 text-sm font-semibold rounded hover:bg-white/20 disabled:opacity-30"
                  title="Zoom Out (-)"
                >
                  −
                </button>
                <span className="px-2 text-xs font-mono min-w-12 text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  className="px-2.5 py-1 text-sm font-semibold rounded hover:bg-white/20 disabled:opacity-30"
                  title="Zoom In (+)"
                >
                  +
                </button>
                {zoomLevel > 1 && (
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="px-2 py-1 text-xs text-amber-400 hover:bg-white/20 rounded ml-1"
                    title="Reset Zoom"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setIsZoomOpen(false);
                  handleResetZoom();
                }}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-lg"
                title="Close (Esc)"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Zoom Viewer Area */}
          <div
            className="flex-1 relative overflow-hidden flex items-center justify-center p-2 sm:p-6"
            style={{ cursor: zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in" }}
            onMouseDown={handleMouseDown}
            onDoubleClick={toggleDoubleClickZoom}
          >
            <img
              src={getImageUrl(currentImage)}
              alt={`${project.name} zoomed`}
              draggable={false}
              style={{
                transform: `scale(${zoomLevel}) translate(${pan.x / zoomLevel}px, ${pan.y / zoomLevel}px)`,
                transition: isDragging ? "none" : "transform 0.2s ease-out",
                maxHeight: "85vh",
                maxWidth: "92vw",
              }}
              className="object-contain select-none shadow-2xl rounded"
            />

            {/* In-modal Prev / Next arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white text-2xl flex items-center justify-center border border-white/20 shadow-lg transition-all"
                  title="Previous (Left Arrow)"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white text-2xl flex items-center justify-center border border-white/20 shadow-lg transition-all"
                  title="Next (Right Arrow)"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip in Zoom Modal */}
          <div className="bg-black/60 border-t border-white/10 py-3 px-4 flex items-center justify-center gap-2 overflow-x-auto hide-scrollbar">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  handleResetZoom();
                }}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  currentIndex === idx
                    ? "border-amber-400 scale-105"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={getImageUrl(img)}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
