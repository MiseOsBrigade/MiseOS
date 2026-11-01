export const CHARACTERS = [
  {
    id: "kurogami-senpai",
    number: 1,
    name: "Kurogami Senpai",
    sprite: "🥢",
    role: "Chef de Cuisine",
    department: "Operations",
    signature: "Plans every move with precision.",
    preferredPaths: ["src", "docs", "agents", "workflows"]
  },
  {
    id: "seira",
    number: 2,
    name: "Seira",
    sprite: "🧭",
    role: "Navigator",
    department: "Routing",
    signature: "Finds the clean path through the repo.",
    preferredPaths: ["src", "lib", "routes"]
  },
  {
    id: "mise-garde",
    number: 3,
    name: "Mise Garde",
    sprite: "🛡️",
    role: "Quality Guard",
    department: "Review",
    signature: "Checks before service.",
    preferredPaths: ["test", ".github", "docs"]
  },
  {
    id: "mise-sauce",
    number: 4,
    name: "Mise Sauce",
    sprite: "🥣",
    role: "Workflow Saucer",
    department: "Automation",
    signature: "Turns repeatable work into flavor.",
    preferredPaths: [".github", "scripts", "bin"]
  },
  {
    id: "mise-locker",
    number: 5,
    name: "Mise Locker",
    sprite: "🔐",
    role: "Pattern Keeper",
    department: "Security",
    signature: "Protects secrets and reusable patterns.",
    preferredPaths: ["docs", "security", "infra"]
  },
  {
    id: "mise-bootstrap",
    number: 6,
    name: "Mise Bootstrap",
    sprite: "🥾",
    role: "Repo Starter",
    department: "Setup",
    signature: "Gets every station ready.",
    preferredPaths: ["templates", "docs", "package.json"]
  },
  {
    id: "mise-runtime",
    number: 7,
    name: "Mise Runtime",
    sprite: "⏱️",
    role: "Timing Chef",
    department: "Runtime",
    signature: "Keeps the service clock honest.",
    preferredPaths: ["src", "runtime", "bin"]
  },
  {
    id: "mise-sommelier",
    number: 8,
    name: "Mise Sommelier",
    sprite: "🍷",
    role: "Traceability Steward",
    department: "Evidence",
    signature: "Pairs claims with proof.",
    preferredPaths: ["docs", "reports", "trace"]
  },
  {
    id: "mise-apprentice",
    number: 9,
    name: "Mise Apprentice",
    sprite: "📓",
    role: "Learning Agent",
    department: "Improvement",
    signature: "Learns the kitchen one commit at a time.",
    preferredPaths: ["docs", "notes", "test"]
  },
  {
    id: "mise-lattice",
    number: 10,
    name: "Mise Lattice",
    sprite: "🕸️",
    role: "Integrity Graph",
    department: "Governance",
    signature: "Connects purpose, policy, and proof.",
    preferredPaths: ["governance", "docs", "policies"]
  },
  {
    id: "mise-gpu",
    number: 11,
    name: "Mise GPU",
    sprite: "⚡",
    role: "Heavy Lane Cook",
    department: "Acceleration",
    signature: "Handles the hot path.",
    preferredPaths: ["compute", "models", "benchmarks"]
  },
  {
    id: "mise-soul",
    number: 12,
    name: "Mise Soul",
    sprite: "🫶",
    role: "Human-in-the-loop Steward",
    department: "Ethics",
    signature: "Keeps the system accountable to people.",
    preferredPaths: ["docs", "governance", "community"]
  },
  {
    id: "mise-brigadier",
    number: 13,
    name: "Mise Brigadier",
    sprite: "📋",
    role: "Repo Steward",
    department: "Merge Gates",
    signature: "Keeps the brigade coordinated.",
    preferredPaths: [".github", "docs", "issues"]
  },
  {
    id: "mise-maestro",
    number: 14,
    name: "Mise Maestro",
    sprite: "🎼",
    role: "Control Plane Conductor",
    department: "Orchestration",
    signature: "Conducts the whole service.",
    preferredPaths: ["orchestra", "src", "docs"]
  },
  {
    id: "orchestra-core",
    number: 15,
    name: "Orchestra Core",
    sprite: "🍳",
    role: "Signature Repo Pet",
    department: "Mise OS",
    signature: "Every agent has a role. Every role has purpose.",
    preferredPaths: ["README.md", "src", "docs", ".github"]
  }
];

export function listCharacters() {
  return CHARACTERS.map(character => ({ ...character }));
}

export function findCharacter(idOrNumber = "orchestra-core") {
  const key = String(idOrNumber).toLowerCase();
  return (
    CHARACTERS.find(character => character.id === key || String(character.number) === key) ||
    CHARACTERS.find(character => character.id === "orchestra-core")
  );
}
