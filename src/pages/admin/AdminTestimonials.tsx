import { useData } from "../../context/DataContext";

export default function AdminTestimonials() {
  const { testimonials, updateTestimonial, deleteTestimonial } = useData();

  const toggle = async (id: number) => {
    const item = testimonials.find((t) => t.id === id);
    if (!item) return;
    try {
      await updateTestimonial(id, { ...item, published: !item.published });
    } catch (err) {
      alert("Failed to toggle publish status");
    }
  };

  const del = async (id: number) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await deleteTestimonial(id);
      } catch (err) {
        alert("Failed to delete testimonial");
      }
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-7">
        <h1 className="font-serif text-2xl md:text-3xl">Testimonials & Client Feedback</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl border p-5" style={{ borderColor: "#e2ddd6", opacity: t.published ? 1 : 0.6 }}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <img src={t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format'} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#777770" }}>{t.project}</div>
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ backgroundColor: t.published ? "#22c55e18" : "#ef444418", color: t.published ? "#22c55e" : "#ef4444" }}>
                {t.published ? "Published" : "Hidden"}
              </span>
            </div>
            <div className="flex mb-2" style={{ color: "var(--gold)", fontSize: "14px" }}>{"★".repeat(t.rating || 5)}</div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#444440" }}>"{t.review}"</p>
            <div className="flex gap-2">
              <button onClick={() => toggle(t.id)} className="flex-1 py-2 rounded-lg text-xs font-medium border" style={{ borderColor: "#e2ddd6", color: "#444440" }}>
                {t.published ? "Unpublish" : "Publish"}
              </button>
              <button onClick={() => del(t.id)} className="py-2 px-3 rounded-lg text-xs font-medium border" style={{ borderColor: "#e2ddd6", color: "#ef4444" }}>✕</button>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-16" style={{ color: "#777770" }}>No testimonials found.</div>
      )}
    </div>
  );
}
