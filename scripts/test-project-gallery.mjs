import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = ts.transpileModule(
  readFileSync(new URL("../src/scripts/project-gallery.ts", import.meta.url), "utf8"),
  { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } },
).outputText;
const { initializeProjectGalleries } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
const images = [
  { src: "front", alt: "Front view", caption: "Front", width: 2400, height: 3600 },
  { src: "back", alt: "Back view", caption: "", width: 2400, height: 1600 },
  { src: "detail", alt: "Detail view", caption: "Detail", width: 1600, height: 1600 },
];
function element() {
  const listeners = new Map();
  return {
    listeners,
    closest: () => null,
    addEventListener(name, callback) { listeners.set(name, callback); },
    emit(name, event = {}) { listeners.get(name)?.(event); },
  };
}
function fixture(items = images, base = "/") {
  const gallery = element();
  const stage = Object.assign(element(), { clientWidth: 500, setPointerCapture() {} });
  const photo = Object.assign(element(), { ...items[0] });
  const previous = Object.assign(element(), { disabled: true });
  const next = Object.assign(element(), { disabled: false });
  const caption = { textContent: items[0].caption };
  const count = { textContent: `01 / ${String(items.length).padStart(2, "0")}` };
  gallery.ownerDocument = { activeElement: null };
  gallery.focus = (options) => { gallery.ownerDocument.activeElement = gallery; gallery.focusOptions = options; };
  gallery.dataset = { base };
  const selectors = {
    "[data-gallery-images]": items.length > 1 ? { textContent: JSON.stringify(items) } : null,
    img: photo, "[data-gallery-stage]": stage,
    "[data-gallery-previous]": previous, "[data-gallery-next]": next,
    "[data-gallery-caption]": caption, "[data-gallery-count]": count,
  };
  gallery.querySelector = (selector) => selectors[selector];
  return { gallery, stage, photo, previous, next, caption, count };
}
const initialize = (...fixtures) => initializeProjectGalleries({ querySelectorAll: () => fixtures.map(f => f.gallery) });
function key(f, name, target = f.gallery) {
  let prevented = false;
  f.gallery.emit("keydown", { key: name, target, preventDefault() { prevented = true; } });
  return prevented;
}
function swipe(f, dx, dy = 0, options = {}) {
  const event = { target: f.photo, isPrimary: true, pointerType: "touch", pointerId: 7, clientX: 200, clientY: 200, ...options };
  f.stage.emit("pointerdown", event);
  f.stage.emit("pointerup", { ...event, clientX: 200 + dx, clientY: 200 + dy });
}

test("buttons stop at boundaries and update responsive source, alt, dimensions, caption and count", () => {
  const f = fixture(); initialize(f);
  f.previous.emit("click"); assert.equal(f.count.textContent, "01 / 03");
  f.next.emit("click");
  assert.equal(f.photo.src, "/images/back.webp");
  assert.equal(f.photo.alt, "Back view"); assert.equal(f.photo.height, 1600);
  assert.equal(f.caption.textContent, ""); assert.equal(f.count.textContent, "02 / 03");
  assert.equal(f.previous.disabled, false);
  f.gallery.ownerDocument.activeElement = f.next;
  f.next.emit("click");
  assert.equal(f.photo.srcset, "/images/detail-640.webp 640w, /images/detail-1024.webp 1024w, /images/detail.webp 1600w");
  assert.equal(f.photo.width, 1600); assert.equal(f.photo.alt, "Detail view");
  assert.equal(f.caption.textContent, "Detail"); assert.equal(f.count.textContent, "03 / 03");
  assert.equal(f.next.disabled, true);
  assert.equal(f.gallery.ownerDocument.activeElement, f.gallery);
  assert.deepEqual(f.gallery.focusOptions, { preventScroll: true });
  f.next.emit("click"); assert.equal(f.count.textContent, "03 / 03");
  f.previous.emit("click"); f.previous.emit("click");
  assert.equal(f.previous.disabled, true); assert.equal(f.count.textContent, "01 / 03");
});

test("arrow keys are local to each gallery and ignore editable controls", () => {
  const a = fixture(), b = fixture(); initialize(a, b);
  assert(key(a, "ArrowRight")); assert.equal(a.count.textContent, "02 / 03");
  assert.equal(b.count.textContent, "01 / 03");
  assert.equal(key(a, "ArrowRight", { closest: () => ({}) }), false);
  assert.equal(key(a, "ArrowRight", { isContentEditable: true }), false);
  assert.equal(key(a, "Tab"), false);
  key(a, "ArrowLeft"); key(a, "ArrowLeft");
  assert.equal(a.count.textContent, "01 / 03");
});

test("touch requires a deliberate horizontal swipe; scrolling, small moves and cancellation do not advance", () => {
  const f = fixture(); initialize(f);
  swipe(f, -49); swipe(f, -90, 110); swipe(f, -120, 0, { pointerType: "mouse" });
  swipe(f, -120, 0, { isPrimary: false });
  swipe(f, -120, 0, { target: { closest: () => ({}) } });
  assert.equal(f.count.textContent, "01 / 03");
  f.stage.emit("pointerdown", { target: f.photo, isPrimary: true, pointerType: "touch", pointerId: 1, clientX: 200, clientY: 200 });
  f.stage.emit("pointercancel"); f.stage.emit("pointerup", { pointerId: 1, clientX: 0, clientY: 200 });
  assert.equal(f.count.textContent, "01 / 03");
  swipe(f, -100, 10); assert.equal(f.count.textContent, "02 / 03");
  swipe(f, -100); swipe(f, -100); assert.equal(f.count.textContent, "03 / 03");
  swipe(f, 100); assert.equal(f.count.textContent, "02 / 03");
});

test("single-image galleries register no interaction handlers", () => {
  const f = fixture(images.slice(0, 1)); initialize(f);
  assert.equal(f.gallery.listeners.size, 0); assert.equal(f.stage.listeners.size, 0);
  assert.equal(f.previous.listeners.size, 0); assert.equal(f.next.listeners.size, 0);
  assert.equal(f.count.textContent, "01 / 01");
});

test("asset paths remain base-aware", () => {
  const f = fixture(images, "/wangsculpture/"); initialize(f);
  f.next.emit("click");
  assert.equal(f.photo.src, "/wangsculpture/images/back.webp");
  assert(f.photo.srcset.startsWith("/wangsculpture/images/back-640.webp"));
});
