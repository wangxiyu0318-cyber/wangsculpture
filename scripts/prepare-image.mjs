import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

// Usage: npm run image -- /absolute/path/to/artwork.jpg project-name
const [source, name] = process.argv.slice(2);
if (!source || !name || !/^[a-z0-9-]+$/.test(name)) {
  console.error(
    "Usage: npm run image -- /path/to/artwork.jpg lowercase-image-name",
  );
  process.exit(1);
}
const original = await sharp(source).rotate().toBuffer();
const { width, height } = await sharp(original).metadata();
if (!width || !height || width < 1024) {
  throw new Error(
    "Please use an image at least 1024 pixels wide. 1600–2400 pixels is recommended.",
  );
}
const directory = resolve("public/images");
await mkdir(directory, { recursive: true });
// The original file is untouched. Every rendition keeps its natural aspect ratio.
await sharp(original)
  .webp({ quality: 88 })
  .toFile(resolve(directory, `${name}.webp`));
for (const size of [640, 1024]) {
  await sharp(original)
    .resize({ width: size })
    .webp({ quality: 85 })
    .toFile(resolve(directory, `${name}-${size}.webp`));
}
console.log(`Prepared ${name}. Add this image to src/data/projects.ts:`);
console.log(
  JSON.stringify(
    {
      src: name,
      alt: "Describe the artwork and view",
      caption: "Installation view",
      width,
      height,
    },
    null,
    2,
  ),
);
