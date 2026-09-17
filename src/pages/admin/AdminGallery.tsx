import { useState } from "react";
import { PROJECTS } from "../../data/mockData";

const GALLERY_IMAGES = PROJECTS.flatMap((p) => [
  { url: p.image, project: p.name, category: p.category, id: p.id * 10 },
  ...p.gallery.map((img, i) => ({ url: img, project: p.name, category: p.category, id: p.id * 10 + i + 1 })),
]);

export default function AdminGallery() {
  const [images, setImages] = useState(GALLERY_IMAGES);
  const [dragOver, setDragOver] = useState(false);

  const deleteImage = (id: number) => setImages((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-7">
        <h1 className="font-serif text-2xl md:text-3xl">Gallery</h1>
        <div className="text-sm font-mono" style={{ color: "#777770" }}>{images.length} images</div>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
        className="rounded-2xl border-2 border-dashed p-10 text-center mb-8 transition-colors"
        style={{ borderColor: dragOver ? "var(--gold)" : "#e2ddd6", backgroundColor: dragOver ? "rgba(201,169,110,0.05)" : "white" }}
      >
        <div className="text-4xl mb-3">📤</div>
        <div className="font-medium mb-1">Drop images here or click to upload</div>
        <div className="text-sm mb-4" style={{ color: "#777770" }}>Supports JPG, PNG, WebP. Multiple files allowed.</div>
        <button className="btn-gold px-6 py-2.5 rounded-lg text-sm font-medium">Select Files</button>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
        {images.map((img) => (
          <div key={img.id} className="group relative rounded-xl overflow-hidden aspect-square bg-gray-100">
            <img src={img.url} alt={img.project} className="w-full h-full object-cover" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
              <div className="flex justify-end">
                <button
                  onClick={() => deleteImage(img.id)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: "rgba(239,68,68,0.9)", color: "white" }}
                >
                  ✕
                </button>
              </div>
              <div>
                <div className="text-white text-xs font-medium truncate">{img.project}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{img.category}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
