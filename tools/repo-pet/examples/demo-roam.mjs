import { RepoRoamer, formatEventLine } from "../src/index.js";

const roamer = new RepoRoamer({
  root: new URL("..", import.meta.url).pathname,
  character: "kurogami-senpai",
  maxDepth: 4
});

await roamer.initialize();

for (let index = 0; index < 5; index += 1) {
  const event = await roamer.step();
  console.log(formatEventLine(event));
}
