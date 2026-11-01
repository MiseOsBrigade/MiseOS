import assert from "node:assert/strict";
import { RepoRoamer, findCharacter, listCharacters, formatEventLine } from "../src/index.js";

assert.equal(listCharacters().length, 15, "expected the 15-character MiseOS roster");
assert.equal(findCharacter("kurogami-senpai").name, "Kurogami Senpai");
assert.equal(findCharacter("15").id, "orchestra-core");

const roamer = new RepoRoamer({
  root: new URL("..", import.meta.url).pathname,
  character: "seira",
  maxDepth: 3
});

await roamer.initialize();
const event = await roamer.step();
assert.ok(event.character);
assert.ok(event.action);
assert.ok(event.location);
assert.match(formatEventLine(event), /Seira|Repo Pet|Mise/);

console.log("Smoke test passed: MiseOS Repo Pet can roam safely.");
