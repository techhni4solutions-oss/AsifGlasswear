import { useState } from "react";

interface Props {
  onLogout: () => void;
}

export default function AdminSettings({ onLogout }: Props) {
  const [profile, setProfile] = useState({ name: "Admin User", email: "admin@asifglass.pk", phone: "+971 50 000 0000" });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [notifications, setNotifications] = useState({ newInquiry: true, quotedInquiry: true, completedProject: false, weeklyReport: true });
  const [savedSection, setSavedSection] = useState<string | null>(null);

  const save = (section: string) => { setSavedSection(section); setTimeout(() => setSavedSection(null), 2000); };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-7">
        <h1 className="font-serif text-2xl md:text-3xl">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        {/* Admin Profile */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#e2ddd6" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">Admin Profile</h2>
            {savedSection === "profile" && <span className="text-xs text-green-600">Saved ✓</span>}
          </div>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: "#f0ede8", color: "var(--gold)" }}>A</div>
            <button className="text-sm font-medium px-4 py-2 rounded-lg border" style={{ borderColor: "#e2ddd6", color: "#444440" }}>Change Photo</button>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: "Full Name", key: "name" },
              { label: "Email Address", key: "email" },
              { label: "Phone Number", key: "phone" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium mb-1.5">{f.label}</label>
                <input
                  type="text"
                  value={(profile as any)[f.key]}
                  onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border text-sm"
                  style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
                />
              </div>
            ))}
          </div>
          <button onClick={() => save("profile")} className="btn-gold mt-5 px-6 py-2.5 rounded-lg text-sm font-semibold">Save Profile</button>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#e2ddd6" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">Change Password</h2>
            {savedSection === "password" && <span className="text-xs text-green-600">Updated ✓</span>}
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: "Current Password", key: "current" },
              { label: "New Password", key: "new" },
              { label: "Confirm New Password", key: "confirm" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium mb-1.5">{f.label}</label>
                <input
                  type="password"
                  value={(passwords as any)[f.key]}
                  onChange={(e) => setPasswords({ ...passwords, [f.key]: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border text-sm"
                  style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}
                />
              </div>
            ))}
          </div>
          <button onClick={() => save("password")} className="btn-gold mt-5 px-6 py-2.5 rounded-lg text-sm font-semibold">Update Password</button>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#e2ddd6" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">Notification Settings</h2>
            {savedSection === "notifications" && <span className="text-xs text-green-600">Saved ✓</span>}
          </div>
          <div className="flex flex-col gap-4">
            {[
              { key: "newInquiry", label: "New inquiry received" },
              { key: "quotedInquiry", label: "Inquiry status updated" },
              { key: "completedProject", label: "Project marked complete" },
              { key: "weeklyReport", label: "Weekly summary report" },
            ].map((item) => (
              <label key={item.key} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">{item.label}</span>
                <div
                  onClick={() => setNotifications({ ...notifications, [item.key]: !(notifications as any)[item.key] })}
                  className="relative w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0"
                  style={{ backgroundColor: (notifications as any)[item.key] ? "var(--gold)" : "#e2ddd6" }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                    style={{ transform: (notifications as any)[item.key] ? "translateX(20px)" : "translateX(2px)" }}
                  />
                </div>
              </label>
            ))}
          </div>
          <button onClick={() => save("notifications")} className="btn-gold mt-5 px-6 py-2.5 rounded-lg text-sm font-semibold">Save Preferences</button>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#e2ddd6" }}>
          <h2 className="font-semibold mb-5">Account</h2>
          <div className="rounded-xl p-4 border mb-4" style={{ borderColor: "#fde8e8", backgroundColor: "#fff5f5" }}>
            <div className="text-sm font-medium mb-1" style={{ color: "#ef4444" }}>Sign Out</div>
            <div className="text-xs mb-3" style={{ color: "#777770" }}>You will be returned to the login screen.</div>
            <button onClick={onLogout} className="px-5 py-2.5 rounded-lg text-sm font-semibold border transition-colors hover:bg-red-50" style={{ borderColor: "#ef4444", color: "#ef4444" }}>
              Logout
            </button>
          </div>
          <div className="rounded-xl p-4 border" style={{ borderColor: "#e2ddd6", backgroundColor: "#f8f7f4" }}>
            <div className="text-sm font-medium mb-1">Website Version</div>
            <div className="text-xs font-mono" style={{ color: "#777770" }}>v2.4.1 · Deployed 15 Sep 2026</div>
          </div>
        </div>
      </div>
    </div>
  );
}
