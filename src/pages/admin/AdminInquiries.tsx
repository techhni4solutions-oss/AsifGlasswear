import { useState } from "react";
import { useData } from "../../context/DataContext";
import { getImageUrl } from "../../services/api";

type InquiryStatus = "All" | "New" | "Contacted" | "Quoted" | "Completed" | "Rejected";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  New: { bg: "#3b82f618", text: "#3b82f6" },
  Contacted: { bg: "#f59e0b18", text: "#f59e0b" },
  Quoted: { bg: "#8b5cf618", text: "#8b5cf6" },
  Completed: { bg: "#22c55e18", text: "#22c55e" },
  Rejected: { bg: "#ef444418", text: "#ef4444" },
};

export default function AdminInquiries() {
  const { inquiries, updateInquiryStatus, deleteInquiry } = useData();
  const [filter, setFilter] = useState<InquiryStatus>("All");
  const [selected, setSelected] = useState<any | null>(null);

  const filtered = filter === "All" ? inquiries : inquiries.filter((i) => i.status === filter);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const updated = await updateInquiryStatus(id, status);
      if (selected?.id === id) setSelected(updated);
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      try {
        await deleteInquiry(id);
        if (selected?.id === id) setSelected(null);
      } catch (err) {
        alert("Failed to delete inquiry");
      }
    }
  };

  const STATUSES = ["All", "New", "Contacted", "Quoted", "Completed", "Rejected"];

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-7">
        <h1 className="font-serif text-2xl md:text-3xl">Inquiries</h1>
        <div className="font-mono text-sm px-3 py-1.5 rounded-lg border" style={{ borderColor: "#e2ddd6", color: "#777770" }}>
          {inquiries.filter((i) => i.status === "New").length} new
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6 pb-1">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s as InquiryStatus)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all"
            style={{
              borderColor: filter === s ? "var(--gold)" : "#e2ddd6",
              backgroundColor: filter === s ? "var(--gold)" : "white",
              color: filter === s ? "#111" : "#777770",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* List */}
        <div className="xl:col-span-2 bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#e2ddd6" }}>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: "#f8f7f4" }}>
                <tr style={{ color: "#777770" }}>
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 font-medium">Project Type</th>
                  <th className="text-left px-4 py-3 font-medium">Location</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inq) => (
                  <tr
                    key={inq.id}
                    className={`border-t cursor-pointer transition-colors ${selected?.id === inq.id ? "bg-amber-50" : "hover:bg-gray-50"}`}
                    style={{ borderColor: "#f0ede8" }}
                    onClick={() => setSelected(inq)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-medium">{inq.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: "#777770" }}>{inq.phone}</div>
                    </td>
                    <td className="px-4 py-3.5" style={{ color: "#444440" }}>{inq.projectType}</td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: "#777770" }}>{inq.location}</td>
                    <td className="px-4 py-3.5 text-xs font-mono" style={{ color: "#777770" }}>{inq.date}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: STATUS_COLORS[inq.status]?.bg || '#eee', color: STATUS_COLORS[inq.status]?.text || '#333' }}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button className="text-xs px-2.5 py-1 rounded border" style={{ borderColor: "#e2ddd6", color: "#444440" }}>View</button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(inq.id); }} className="text-xs px-2 py-1 rounded border" style={{ borderColor: "#e2ddd6", color: "#ef4444" }}>✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y" style={{ borderColor: "#f0ede8" }}>
            {filtered.map((inq) => (
              <button
                key={inq.id}
                onClick={() => setSelected(inq)}
                className="w-full p-4 text-left transition-colors hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="font-medium text-sm">{inq.name}</div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[inq.status]?.bg || '#eee', color: STATUS_COLORS[inq.status]?.text || '#333' }}>
                    {inq.status}
                  </span>
                </div>
                <div className="text-xs" style={{ color: "#777770" }}>{inq.projectType} · {inq.location}</div>
                <div className="text-xs mt-0.5 font-mono" style={{ color: "#aaa" }}>{inq.date}</div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16" style={{ color: "#777770" }}>No inquiries found.</div>
          )}
        </div>

        {/* Detail panel */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#e2ddd6" }}>
          {selected ? (
            <>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold">Inquiry Details</h3>
                <button onClick={() => setSelected(null)} className="text-xs px-3 py-1 rounded-lg border" style={{ borderColor: "#e2ddd6" }}>Close</button>
              </div>

              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-lg font-bold mb-3" style={{ color: "var(--gold)" }}>
                  {selected.name ? selected.name[0] : "A"}
                </div>
                <div className="font-semibold">{selected.name}</div>
                <div className="text-sm mt-0.5" style={{ color: "#777770" }}>{selected.email}</div>
                <div className="text-sm" style={{ color: "#777770" }}>{selected.phone}</div>
              </div>

              <div className="rounded-xl p-3 mb-4 text-sm" style={{ backgroundColor: "#f8f7f4" }}>
                <div className="flex justify-between mb-1">
                  <span style={{ color: "#777770" }}>Project Type</span>
                  <span className="font-medium">{selected.projectType}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span style={{ color: "#777770" }}>Location</span>
                  <span className="font-medium">{selected.location || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#777770" }}>Date</span>
                  <span className="font-mono text-xs">{selected.date}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#777770" }}>Message</div>
                <p className="text-sm leading-relaxed" style={{ color: "#444440" }}>{selected.message || "No description provided."}</p>
              </div>

              {selected.attachment && (
                <div className="mb-4">
                  <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#777770" }}>Attachment / Design Photo</div>
                  <a
                    href={getImageUrl(selected.attachment)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border p-2 rounded-lg hover:border-amber-400 max-w-full"
                  >
                    <img
                      src={getImageUrl(selected.attachment)}
                      alt="Design photo"
                      className="h-40 max-w-full rounded object-contain bg-gray-50"
                    />
                    <span className="text-xs text-blue-600 underline block mt-1.5 font-medium">Open full image ↗</span>
                  </a>
                </div>
              )}

              <div className="mb-5">
                <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#777770" }}>Update Status</div>
                <select
                  value={selected.status}
                  onChange={(e) => handleUpdateStatus(selected.id, e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm"
                  style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
                >
                  {["New", "Contacted", "Quoted", "Completed", "Rejected"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <a href={`tel:${selected.phone}`} className="flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium border" style={{ borderColor: "#e2ddd6" }}>
                  📞 Call Customer
                </a>
                <a href={`https://wa.me/${selected.phone ? selected.phone.replace(/\D/g, "") : ""}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium whatsapp-btn">
                  💬 WhatsApp
                </a>
                <a href={`mailto:${selected.email}`} className="flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium border" style={{ borderColor: "#e2ddd6", color: "#3b82f6" }}>
                  ✉️ Email
                </a>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center" style={{ color: "#aaa" }}>
              <div className="text-3xl mb-3">📋</div>
              <div className="text-sm">Select an inquiry to view details</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
