import { RepoRoamer, formatEventLine } from "../src/index.js";

const character = process.argv[2] ?? "kurogami-senpai";
const roamer = new RepoRoamer({
  root: ".",
  character,
  maxDepth: 4,
  peek: false
});

for (let index = 0; index < 8; index += 1) {
  const event = await roamer.step();
  console.log(formatEventLine(event));
}
