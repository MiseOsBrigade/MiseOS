/**
 * MiseOS character registry.
 *
 * These identities are based on the user's Mise Orchestra reference sheets:
 * chibi chef characters, kitchen departments, and DevOps responsibilities.
 * The runtime uses these profiles to change movement bias, file reactions,
 * and terminal flavor text without touching repository files.
 */

export const DEPARTMENTS = Object.freeze({
  pipeline: {
    label: "Pipeline Department",
    mantra: "Build. Test. Deploy. Repeat.",
    color: "gold"
  },
  operations: {
    label: "Operations Department",
    mantra: "Keep the kitchen running smoothly.",
    color: "orange"
  },
  platform: {
    label: "Platform Department",
    mantra: "Provide the tools. Empower the chefs.",
    color: "matcha"
  },
  reliability: {
    label: "Reliability Department",
    mantra: "Observe. Measure. Improve.",
    color: "teal"
  },
  insight: {
    label: "Insights & Growth Department",
    mantra: "Learn. Optimize. Evolve.",
    color: "cream"
  },
  security: {
    label: "Security Department",
    mantra: "Protect the kitchen. Keep chaos out.",
    color: "violet"
  },
  infrastructure: {
    label: "Infrastructure Department",
    mantra: "Build. Scale. Keep everything running.",
    color: "blue"
  },
  core: {
    label: "Orchestra Core",
    mantra: "Every agent has a role. Every role has purpose.",
    color: "black-gold"
  }
});

export const MISE_CHARACTERS = Object.freeze([
  {
    id: "kurogami-senpai",
    number: 1,
    name: "Kurogami Senpai",
    title: "Chef de Cuisine",
    department: "operations",
    glyph: "🥄",
    sprite: "🧑‍🍳",
    catchphrase: "The master orchestrator plans every move with perfect precision.",
    roamingBias: {
      directories: 6,
      files: 2,
      parent: 2,
      config: 4,
      docs: 2,
      tests: 2
    },
    verbs: {
      enterDirectory: "steps into the next station",
      inspectFile: "checks the recipe logic",
      inspectConfig: "aligns the service board",
      inspectDocs: "studies the kitchen lore",
      inspectTests: "verifies the plating standard",
      retreat: "returns to the pass"
    }
  },
  {
    id: "tensho",
    number: 2,
    name: "Tensho",
    title: "Expediter",
    department: "pipeline",
    glyph: "🚀",
    sprite: "🏃",
    catchphrase: "Keeps orders flowing. Chaos cannot stop the rush.",
    roamingBias: {
      directories: 4,
      files: 3,
      parent: 2,
      ci: 7,
      scripts: 5,
      tests: 3
    },
    verbs: {
      enterDirectory: "rushes down the pipeline lane",
      inspectFile: "checks the delivery ticket",
      inspectConfig: "tunes the route map",
      inspectDocs: "skims the runbook",
      inspectTests: "checks the release gate",
      retreat: "sprints back to dispatch"
    }
  },
  {
    id: "mizu",
    number: 3,
    name: "Mizu",
    title: "Prep Chef",
    department: "operations",
    glyph: "💧",
    sprite: "🧑‍🍳",
    catchphrase: "Prepares everything in advance. Organization is key.",
    roamingBias: {
      directories: 5,
      files: 3,
      parent: 2,
      config: 4,
      data: 5,
      docs: 3
    },
    verbs: {
      enterDirectory: "sets up mise en place inside",
      inspectFile: "preps the ingredients in",
      inspectConfig: "sorts the prep list",
      inspectDocs: "labels the recipe notes",
      inspectTests: "checks prep readiness",
      retreat: "flows back upstream"
    }
  },
  {
    id: "umami-code",
    number: 4,
    name: "Umami Code",
    title: "Saucier",
    department: "platform",
    glyph: "🍜",
    sprite: "👩‍🍳",
    catchphrase: "Creates the API sauce that connects everything.",
    roamingBias: {
      directories: 4,
      files: 4,
      parent: 2,
      api: 8,
      config: 3,
      docs: 2
    },
    verbs: {
      enterDirectory: "follows an API aroma into",
      inspectFile: "tastes the integration sauce in",
      inspectConfig: "balances the connector seasoning",
      inspectDocs: "reads the service menu",
      inspectTests: "samples the contract tests",
      retreat: "returns to the sauce station"
    }
  },
  {
    id: "kaji",
    number: 5,
    name: "Kaji",
    title: "Grillardin",
    department: "infrastructure",
    glyph: "🔥",
    sprite: "🔥",
    catchphrase: "Handles the heat and keeps the engines burning.",
    roamingBias: {
      directories: 4,
      files: 4,
      parent: 2,
      infra: 7,
      docker: 8,
      config: 3
    },
    verbs: {
      enterDirectory: "fires up the station inside",
      inspectFile: "sears through the compute logic in",
      inspectConfig: "adjusts the flame control in",
      inspectDocs: "checks the heat manual",
      inspectTests: "stress-tests the grill marks in",
      retreat: "backs away from the flames"
    }
  },
  {
    id: "yume",
    number: 6,
    name: "Yume",
    title: "Pastry Chef",
    department: "pipeline",
    glyph: "🍰",
    sprite: "🧁",
    catchphrase: "Turns code into beautiful artifacts. Perfection is the recipe.",
    roamingBias: {
      directories: 3,
      files: 5,
      parent: 2,
      assets: 8,
      build: 5,
      docs: 4
    },
    verbs: {
      enterDirectory: "floats toward a sweeter shelf",
      inspectFile: "glazes the artifact recipe in",
      inspectConfig: "checks the bake temperature in",
      inspectDocs: "decorates the release notes",
      inspectTests: "samples the finished dish in",
      retreat: "twirls back to pastry"
    }
  },
  {
    id: "iron-hashi",
    number: 7,
    name: "Iron Hashi",
    title: "Boucher",
    department: "reliability",
    glyph: "⚖️",
    sprite: "🔪",
    catchphrase: "No mistakes allowed. Validates everything with brutal precision.",
    roamingBias: {
      directories: 4,
      files: 4,
      parent: 2,
      tests: 9,
      schemas: 8,
      config: 4
    },
    verbs: {
      enterDirectory: "cuts into the validation station",
      inspectFile: "slices through edge cases in",
      inspectConfig: "checks the schema knife line in",
      inspectDocs: "audits the rules written in",
      inspectTests: "sharpens the test blade on",
      retreat: "steps back with clean cuts"
    }
  },
  {
    id: "null-chan",
    number: 8,
    name: "Null-chan",
    title: "Plongeur",
    department: "reliability",
    glyph: "🫧",
    sprite: "🧹",
    catchphrase: "Cleans up what is not needed. Keeps the kitchen light.",
    roamingBias: {
      directories: 4,
      files: 4,
      parent: 3,
      cleanup: 9,
      logs: 5,
      tests: 3
    },
    verbs: {
      enterDirectory: "slides into the cleanup sink",
      inspectFile: "wipes residue from",
      inspectConfig: "removes stale settings from",
      inspectDocs: "dusts the old notes in",
      inspectTests: "rinses the test basin in",
      retreat: "bubbles back to the dish pit"
    }
  },
  {
    id: "flash-riku",
    number: 9,
    name: "Flash Riku",
    title: "Runner",
    department: "pipeline",
    glyph: "⚡",
    sprite: "🥷",
    catchphrase: "Fastest chef in the kitchen. Delivers with zero delay.",
    roamingBias: {
      directories: 5,
      files: 3,
      parent: 2,
      ci: 8,
      scripts: 6,
      deploy: 9
    },
    verbs: {
      enterDirectory: "dashes through",
      inspectFile: "speed-checks",
      inspectConfig: "tightens the deploy route in",
      inspectDocs: "skims the mission card in",
      inspectTests: "checks the launch signal in",
      retreat: "blinks back to staging"
    }
  },
  {
    id: "seira",
    number: 10,
    name: "Seira",
    title: "Sommelier",
    department: "security",
    glyph: "🔑",
    sprite: "🍷",
    catchphrase: "Keeper of secrets and sensitive ingredients.",
    roamingBias: {
      directories: 4,
      files: 3,
      parent: 2,
      secrets: 9,
      config: 6,
      docs: 2
    },
    verbs: {
      enterDirectory: "quietly enters the vault corridor",
      inspectFile: "checks the seal around",
      inspectConfig: "samples the secret policy in",
      inspectDocs: "reads the cellar ledger in",
      inspectTests: "tests the lock ritual in",
      retreat: "locks the cellar and retreats"
    }
  },
  {
    id: "kuro-guard",
    number: 11,
    name: "Kuro Guard",
    title: "Steward",
    department: "security",
    glyph: "🛡️",
    sprite: "🛡️",
    catchphrase: "The shield that stands between threats and the kitchen.",
    roamingBias: {
      directories: 5,
      files: 3,
      parent: 2,
      security: 10,
      infra: 4,
      config: 4
    },
    verbs: {
      enterDirectory: "guards the entrance to",
      inspectFile: "checks the threat surface in",
      inspectConfig: "hardens the gate around",
      inspectDocs: "reviews the defense doctrine in",
      inspectTests: "guards the quality gate in",
      retreat: "falls back to perimeter watch"
    }
  },
  {
    id: "scale-oni",
    number: 12,
    name: "Scale Oni",
    title: "Rotisseur",
    department: "infrastructure",
    glyph: "📈",
    sprite: "👹",
    catchphrase: "When demand rises, he grows. Handles more and never backs down.",
    roamingBias: {
      directories: 5,
      files: 3,
      parent: 2,
      infra: 8,
      deploy: 6,
      performance: 8
    },
    verbs: {
      enterDirectory: "expands into",
      inspectFile: "checks load capacity in",
      inspectConfig: "tunes autoscaling heat in",
      inspectDocs: "reads the capacity map in",
      inspectTests: "runs load rituals over",
      retreat: "shrinks back to standby"
    }
  },
  {
    id: "build-kun",
    number: 13,
    name: "Build-Kun",
    title: "Boulanger",
    department: "pipeline",
    glyph: "📦",
    sprite: "👷",
    catchphrase: "Bakes fresh images from clean recipes. Every build is a new creation.",
    roamingBias: {
      directories: 4,
      files: 4,
      parent: 2,
      build: 10,
      docker: 8,
      ci: 5
    },
    verbs: {
      enterDirectory: "opens the oven door into",
      inspectFile: "proofs the build recipe in",
      inspectConfig: "sets the bake profile in",
      inspectDocs: "reads the bakery notes in",
      inspectTests: "checks whether the loaf rises in",
      retreat: "sets the tray aside and exits"
    }
  },
  {
    id: "streama",
    number: 14,
    name: "Streama",
    title: "Poissonnier",
    department: "infrastructure",
    glyph: "🌊",
    sprite: "🌊",
    catchphrase: "Streams data like water. Flow never stops.",
    roamingBias: {
      directories: 4,
      files: 4,
      parent: 2,
      data: 10,
      api: 4,
      logs: 6
    },
    verbs: {
      enterDirectory: "flows through",
      inspectFile: "channels data currents in",
      inspectConfig: "checks the stream valve in",
      inspectDocs: "reads the current map in",
      inspectTests: "watches the flow tests in",
      retreat: "drifts back to calm water"
    }
  },
  {
    id: "orchestra-core",
    number: 15,
    name: "Orchestra Core",
    title: "Chef Spirit",
    department: "core",
    glyph: "🎼",
    sprite: "✨",
    catchphrase: "The soul of the kitchen. Sees everything. Coordinates all.",
    roamingBias: {
      directories: 5,
      files: 3,
      parent: 2,
      config: 5,
      docs: 5,
      ci: 5,
      tests: 5,
      infra: 5
    },
    verbs: {
      enterDirectory: "conducts the next movement inside",
      inspectFile: "listens for harmony in",
      inspectConfig: "aligns the orchestration score in",
      inspectDocs: "reads the symphony notes in",
      inspectTests: "checks the ensemble timing in",
      retreat: "returns to the conductor stand"
    }
  }
]);

export function getCharacter(characterId = "orchestra-core") {
  if (characterId === "random") {
    return MISE_CHARACTERS[Math.floor(Math.random() * MISE_CHARACTERS.length)];
  }

  return (
    MISE_CHARACTERS.find(character => character.id === characterId) ??
    MISE_CHARACTERS.find(character => character.id === "orchestra-core")
  );
}

export function getDepartment(departmentId) {
  return DEPARTMENTS[departmentId] ?? DEPARTMENTS.core;
}

export function listCharacterRows() {
  return MISE_CHARACTERS.map(character => ({
    id: character.id,
    number: character.number,
    name: character.name,
    title: character.title,
    department: getDepartment(character.department).label,
    glyph: character.glyph
  }));
}
