import assert from "node:assert/strict";
import { MISE_CHARACTERS, RepoRoamer, categorizePath } from "../src/index.js";

assert.equal(MISE_CHARACTERS.length, 15, "expected the core 15 Mise characters");
assert.ok(MISE_CHARACTERS.some(character => character.id === "kurogami-senpai"));
assert.ok(categorizePath(".github/workflows/deploy.yml").includes("ci"));
assert.ok(categorizePath("Dockerfile").includes("docker"));
assert.ok(categorizePath("docs/README.md").includes("docs"));

const roamer = new RepoRoamer({ root: ".", character: "orchestra-core", maxDepth: 2 });
const event = await roamer.step();

assert.equal(event.characterId, "orchestra-core");
assert.ok(event.relativePath.length >= 1);
assert.ok(roamer.getSnapshot().visitedCount >= 1);

console.log("Smoke test passed: MiseOS Repo Pet can roam safely.");
