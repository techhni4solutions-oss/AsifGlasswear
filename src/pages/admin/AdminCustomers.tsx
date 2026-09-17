import { useState } from "react";
import { useData } from "../../context/DataContext";

export default function AdminCustomers() {
  const { customers, deleteCustomer } = useData();
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const filtered = customers.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
    (c.phone && c.phone.includes(search))
  );

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this customer record?")) {
      try {
        await deleteCustomer(id);
        if (selectedCustomer?.id === id) setSelectedCustomer(null);
      } catch (err) {
        alert("Failed to delete customer");
      }
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-7">
        <h1 className="font-serif text-2xl md:text-3xl">Customers</h1>
        <div className="font-mono text-sm px-3 py-1.5 rounded-lg border" style={{ borderColor: "#e2ddd6", color: "#777770" }}>
          {customers.length} total
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#e2ddd6" }}>
        <div className="p-4 border-b" style={{ borderColor: "#f0ede8" }}>
          <input
            type="search"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 px-4 py-2.5 rounded-lg border text-sm"
            style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
          />
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: "#f8f7f4" }}>
              <tr style={{ color: "#777770" }}>
                <th className="text-left px-5 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Phone</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Projects</th>
                <th className="text-left px-4 py-3 font-medium">Last Inquiry</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50" style={{ borderColor: "#f0ede8" }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: "#f0ede8", color: "var(--gold)" }}>
                        {c.name ? c.name[0] : "C"}
                      </div>
                      <div className="font-medium">{c.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm" style={{ color: "#444440" }}>{c.phone}</td>
                  <td className="px-4 py-3.5 text-sm" style={{ color: "#444440" }}>{c.email || "N/A"}</td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-sm font-medium" style={{ color: "var(--gold)" }}>{c.projects}</span>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-mono" style={{ color: "#777770" }}>{c.lastInquiry}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: "#22c55e18", color: "#22c55e" }}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1">
                      <button onClick={() => setSelectedCustomer(c)} className="text-xs px-2.5 py-1 rounded border" style={{ borderColor: "#e2ddd6", color: "#444440" }}>View</button>
                      <button onClick={() => handleDelete(c.id)} className="text-xs px-2 py-1 rounded border" style={{ borderColor: "#e2ddd6", color: "#ef4444" }}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y" style={{ borderColor: "#f0ede8" }}>
          {filtered.map((c) => (
            <div key={c.id} className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0" style={{ backgroundColor: "#f0ede8", color: "var(--gold)" }}>
                  {c.name ? c.name[0] : "C"}
                </div>
                <div>
                  <div className="font-medium text-sm">{c.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#777770" }}>{c.phone}</div>
                  <div className="text-xs" style={{ color: "#777770" }}>{c.projects} projects · {c.lastInquiry}</div>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setSelectedCustomer(c)} className="text-xs px-2 py-1 rounded border" style={{ borderColor: "#e2ddd6", color: "#444440" }}>View</button>
                <button onClick={() => handleDelete(c.id)} className="text-xs px-2 py-1 rounded border" style={{ borderColor: "#e2ddd6", color: "#ef4444" }}>✕</button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: "#777770" }}>No customers found.</div>
        )}
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl">Customer Details</h2>
              <button type="button" onClick={() => setSelectedCustomer(null)} className="w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: "#f1f0ed" }}>✕</button>
            </div>
            <div className="mb-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0" style={{ backgroundColor: "#f0ede8", color: "var(--gold)" }}>
                {selectedCustomer.name ? selectedCustomer.name[0] : "C"}
              </div>
              <div>
                <div className="font-serif text-lg">{selectedCustomer.name}</div>
                <div className="text-sm mt-0.5" style={{ color: "#777770" }}>ID: #{selectedCustomer.id}</div>
              </div>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-xs mb-1" style={{ color: "#777770" }}>Phone</div>
                <div className="font-medium">{selectedCustomer.phone}</div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: "#777770" }}>Email</div>
                <div className="font-medium">{selectedCustomer.email || "N/A"}</div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: "#777770" }}>Total Projects</div>
                <div className="font-medium font-mono" style={{ color: "var(--gold)" }}>{selectedCustomer.projects}</div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: "#777770" }}>Last Inquiry</div>
                <div className="font-medium font-mono">{selectedCustomer.lastInquiry}</div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: "#777770" }}>Status</div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: "#22c55e18", color: "#22c55e" }}>
                  {selectedCustomer.status}
                </span>
              </div>
            </div>
            <button onClick={() => setSelectedCustomer(null)} className="mt-8 w-full py-3 rounded-lg font-semibold border text-center transition-colors hover:bg-gray-50" style={{ borderColor: "#e2ddd6" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
