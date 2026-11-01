import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { deflateSync } from "node:zlib";

const root = resolve("apps/shimeji-brigade/assets/sprites");
const states = { idle: 6, walk: 8, climb: 6, fall: 4, drag: 3, interact: 6, perch: 4 };
const characters = ["mizu", "kurogami"];

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type);
  const body = Buffer.concat([name, data]);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(body));
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  return Buffer.concat([length, body, checksum]);
}

function transparentPng() {
  const pixels = Buffer.alloc(128 * (1 + 128 * 4));
  const header = Buffer.alloc(13);
  header.writeUInt32BE(128, 0);
  header.writeUInt32BE(128, 4);
  header[8] = 8;
  header[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(pixels)),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

for (const character of characters) {
  for (const [state, count] of Object.entries(states)) {
    const directory = resolve(root, character, state);
    await mkdir(directory, { recursive: true });
    for (let index = 1; index <= count; index += 1) {
      await writeFile(resolve(directory, `frame_${String(index).padStart(3, "0")}.png`), transparentPng());
    }
  }
}
console.log(`Generated local placeholder sprite frames for ${characters.length} characters.`);
