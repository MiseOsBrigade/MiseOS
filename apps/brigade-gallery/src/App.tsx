import { useState } from "react";
import "./styles/tokens.css";
import { BrigadeGallery } from "./components/BrigadeGallery.js";
import { MasterRosterGallery } from "./components/MasterRosterGallery.js";

type Tab = "brigade" | "master-roster";

export default function App() {
  const [tab, setTab] = useState<Tab>("master-roster");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--gs-obsidian)" }}>
      <nav
        className="sticky top-0 z-10 flex justify-center gap-1 border-b p-3 backdrop-blur"
        style={{ borderColor: "var(--gs-obsidian-border)", backgroundColor: "rgba(9,13,20,0.85)" }}
      >
        <TabButton active={tab === "master-roster"} onClick={() => setTab("master-roster")}>
          Master Roster (75)
        </TabButton>
        <TabButton active={tab === "brigade"} onClick={() => setTab("brigade")}>
          Brigade Gallery (68)
        </TabButton>
      </nav>

      {tab === "master-roster" ? <MasterRosterGallery /> : <BrigadeGallery />}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md px-4 py-2 text-sm font-medium transition-colors"
      style={{
        backgroundColor: active ? "var(--gs-copper)" : "transparent",
        color: active ? "var(--gs-obsidian)" : "var(--gs-cream)",
      }}
    >
      {children}
    </button>
  );
}
