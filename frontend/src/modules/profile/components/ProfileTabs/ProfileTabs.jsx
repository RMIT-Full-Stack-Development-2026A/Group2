import { Trophy, User } from "lucide-react";

const TABS = [
  { id: "profile", label: "Overview", Icon: User },
  { id: "history", label: "Match History", Icon: Trophy },
];

export default function ProfileTabs({ active, onChange }) {
  return (
    <div className="d-inline-flex gap-2" role="tablist" aria-label="Profile sections">
      {TABS.map((tab) => {
        const { id, label, Icon: TabIcon } = tab;
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={
              "profile-tab-btn btn d-flex align-items-center justify-content-center gap-2 rounded-3 py-2 px-3 small " +
              (isActive
                ? "bg-white border border-secondary-subtle fw-semibold text-dark shadow-none"
                : "bg-secondary-subtle text-secondary-emphasis border-0 fw-medium")
            }
            onClick={() => onChange(id)}
          >
            <TabIcon size={18} strokeWidth={2} aria-hidden />
            {label}
          </button>
        );
      })}
    </div>
  );
}
