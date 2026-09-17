import { useState } from "react";

const TEAM = [
  { id: 1, name: "Khalid Al Mansoori", position: "General Manager", phone: "+971 50 111 2222", email: "k.mansoori@asifglass.pk", active: true },
  { id: 2, name: "Ahmed Hassan", position: "Senior Fabricator", phone: "+971 55 333 4444", email: "a.hassan@asifglass.pk", active: true },
  { id: 3, name: "Sarah Thompson", position: "Project Manager", phone: "+971 52 555 6666", email: "s.thompson@asifglass.pk", active: true },
  { id: 4, name: "Mohammed Ali", position: "Installation Lead", phone: "+971 56 777 8888", email: "m.ali@asifglass.pk", active: false },
];

export default function AdminTeam() {
  const [team, setTeam] = useState(TEAM);
  const [showForm, setShowForm] = useState(false);

  const toggleActive = (id: number) => setTeam((prev) => prev.map((t) => t.id === id ? { ...t, active: !t.active } : t));
  const del = (id: number) => setTeam((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-7">
        <h1 className="font-serif text-2xl md:text-3xl">Team</h1>
        <button onClick={() => setShowForm(true)} className="btn-gold px-5 py-2.5 rounded-lg text-sm">+ Add Member</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {team.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl border p-5 text-center" style={{ borderColor: "#e2ddd6", opacity: member.active ? 1 : 0.65 }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-3" style={{ backgroundColor: "#f0ede8", color: "var(--gold)" }}>
              {member.name[0]}
            </div>
            <div className="font-semibold">{member.name}</div>
            <div className="text-xs mt-1 mb-3" style={{ color: "var(--gold)" }}>{member.position}</div>
            <div className="text-xs mb-1" style={{ color: "#777770" }}>{member.phone}</div>
            <div className="text-xs mb-4" style={{ color: "#777770" }}>{member.email}</div>
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium mb-4" style={{ backgroundColor: member.active ? "#22c55e18" : "#ef444418", color: member.active ? "#22c55e" : "#ef4444" }}>
              {member.active ? "Active" : "Inactive"}
            </span>
            <div className="flex gap-2">
              <button onClick={() => toggleActive(member.id)} className="flex-1 py-2 rounded-lg text-xs font-medium border" style={{ borderColor: "#e2ddd6" }}>
                {member.active ? "Deactivate" : "Activate"}
              </button>
              <button onClick={() => del(member.id)} className="py-2 px-3 rounded-lg text-xs border" style={{ borderColor: "#e2ddd6", color: "#ef4444" }}>✕</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50">
          <form onSubmit={(e) => { e.preventDefault(); setShowForm(false); }} className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl">Add Team Member</h2>
              <button type="button" onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#f1f0ed" }}>✕</button>
            </div>
            {["Employee Name", "Position", "Phone", "Email"].map((label) => (
              <div key={label} className="mb-4">
                <label className="block text-sm font-medium mb-1.5">{label}</label>
                <input type="text" className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }} />
              </div>
            ))}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-1.5">Profile Image</label>
              <div className="border-2 border-dashed rounded-xl p-6 text-center" style={{ borderColor: "#e2ddd6" }}>
                <div className="text-2xl mb-1">📤</div>
                <div className="text-sm" style={{ color: "#777770" }}>Upload photo</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-gold flex-1 py-3 rounded-lg font-semibold">Save Member</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-lg font-medium border" style={{ borderColor: "#e2ddd6" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
