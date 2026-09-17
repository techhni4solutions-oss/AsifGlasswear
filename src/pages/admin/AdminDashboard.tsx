import type { AdminSection } from "./AdminPanel";
import { useData } from "../../context/DataContext";

const STATUS_COLORS: Record<string, string> = {
  New: "#3b82f6",
  Contacted: "#f59e0b",
  Quoted: "#8b5cf6",
  Completed: "#22c55e",
  Rejected: "#ef4444",
};

interface Props {
  onNavigate: (s: AdminSection) => void;
}

export default function AdminDashboard({ onNavigate }: Props) {
  const { projects, services, inquiries } = useData();

  const STATS = [
    { label: "Total Projects", value: projects.length.toString(), icon: "🏗️", color: "#c9a96e" },
    { label: "Total Services", value: services.length.toString(), icon: "⚙️", color: "#8b5cf6" },
    { label: "New Inquiries", value: inquiries.filter(i => i.status === "New").length.toString(), icon: "📬", color: "#3b82f6" },
  ];
  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl" style={{ color: "#111111" }}>Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: "#777770" }}>Welcome to the Admin Panel</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-2xl p-5 bg-white border" style={{ borderColor: "#e2ddd6" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            </div>
            <div className="font-serif text-3xl font-medium mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-sm" style={{ color: "#777770" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Inquiries */}
        <div className="xl:col-span-2 bg-white rounded-2xl border p-6" style={{ borderColor: "#e2ddd6" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-base">Recent Inquiries</h2>
            <button onClick={() => onNavigate("inquiries")} className="text-xs font-medium underline underline-offset-2" style={{ color: "#c9a96e" }}>View all</button>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: "#777770" }}>
                  <th className="text-left pb-3 font-medium">Customer</th>
                  <th className="text-left pb-3 font-medium">Project Type</th>
                  <th className="text-left pb-3 font-medium">Date</th>
                  <th className="text-left pb-3 font-medium">Status</th>
                  <th className="text-left pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "#f0ede8" }}>
                {inquiries.slice(0, 5).map((inq) => (
                  <tr key={inq.id}>
                    <td className="py-3">
                      <div className="font-medium text-sm">{inq.name}</div>
                      <div className="text-xs" style={{ color: "#777770" }}>{inq.phone}</div>
                    </td>
                    <td className="py-3 text-sm" style={{ color: "#444440" }}>{inq.projectType}</td>
                    <td className="py-3 text-xs font-mono" style={{ color: "#777770" }}>{inq.date}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${STATUS_COLORS[inq.status]}18`, color: STATUS_COLORS[inq.status] }}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <button className="text-xs px-3 py-1 rounded-lg border font-medium" style={{ borderColor: "#e2ddd6", color: "#444440" }}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-3">
            {inquiries.slice(0, 4).map((inq) => (
              <div key={inq.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: "#f8f7f4" }}>
                <div>
                  <div className="font-medium text-sm">{inq.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#777770" }}>{inq.projectType} · {inq.date}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${STATUS_COLORS[inq.status]}18`, color: STATUS_COLORS[inq.status] }}>
                  {inq.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#e2ddd6" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-base">Recent Projects</h2>
            <button onClick={() => onNavigate("projects")} className="text-xs font-medium underline underline-offset-2" style={{ color: "#c9a96e" }}>View all</button>
          </div>
          <div className="flex flex-col gap-3">
            {projects.slice(0, 4).map((proj) => (
              <div key={proj.id} className="flex items-center gap-3">
                <img src={proj.image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm truncate">{proj.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#777770" }}>{proj.category} · {proj.date}</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ backgroundColor: "#22c55e18", color: "#22c55e" }}>
                  Done
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
