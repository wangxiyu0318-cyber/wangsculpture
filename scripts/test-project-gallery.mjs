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
  const stage = Object.assign(element(), { clientWidth: 500, style: {}, setPointerCapture() {} });
  const video = Object.assign(element(), {
    hidden: true, attributes: {}, paused: true, pauseCalls: 0, loadCalls: 0,
    pause() { this.paused = true; this.pauseCalls++; },
    load() { this.loadCalls++; this.paused = true; },
    getAttribute(name) { return name === "src" ? this.src : this.attributes[name]; },
    setAttribute(name, value) { this.attributes[name] = value; },
    getBoundingClientRect() { return { left: 56, right: 444, top: 0, bottom: 500 }; },
  });
  const photo = Object.assign(element(), { ...items[0] });
  const previous = Object.assign(element(), { disabled: true });
  const next = Object.assign(element(), { disabled: false });
  const caption = { textContent: items[0].caption };
  const count = { textContent: `01 / ${String(items.length).padStart(2, "0")}` };
  gallery.ownerDocument = { activeElement: null };
  gallery.focus = (options) => { gallery.ownerDocument.activeElement = gallery; gallery.focusOptions = options; };
  gallery.dataset = { base, title: "Test artwork", videoLabel: "Video" };
  const selectors = {
    "[data-gallery-images]": items.length > 1 ? { textContent: JSON.stringify(items) } : null,
    img: photo, "[data-gallery-stage]": stage,
    "[data-gallery-video]": video,
    "[data-gallery-previous]": previous, "[data-gallery-next]": next,
    "[data-gallery-caption]": caption, "[data-gallery-count]": count,
  };
  gallery.querySelector = (selector) => selectors[selector];
  return { gallery, stage, video, photo, previous, next, caption, count };
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


test("mixed media updates counts and labels, pauses outgoing video and never plays on return", () => {
  const clip = { type: "video", src: "/videos/clip.mp4", width: 1920, height: 1080 };
  const secondClip = { ...clip, src: "/videos/second.mp4", alt: "Second clip", caption: "Video caption" };
  const f = fixture([images[0], clip, images[1], secondClip], "/portfolio/");
  initialize(f);
  f.next.emit("click");
  assert.equal(f.count.textContent, "02 / 04");
  assert.equal(f.photo.hidden, true); assert.equal(f.video.hidden, false);
  assert.equal(f.video.src, "/portfolio/videos/clip.mp4");
  assert.equal(f.video.attributes["aria-label"], "Test artwork — Video 2 / 4");
  assert.equal(f.stage.style.aspectRatio, "1920 / 1080");
  assert.equal(f.caption.textContent, "");
  assert.equal(f.video.paused, true);
  f.video.paused = false;
  f.gallery.ownerDocument.activeElement = f.video;
  f.next.emit("click");
  assert.equal(f.video.pauseCalls, 1); assert.equal(f.video.paused, true);
  assert.equal(f.gallery.ownerDocument.activeElement, f.gallery);
  assert.equal(f.photo.hidden, false); assert.equal(f.video.hidden, true);
  assert.equal(f.stage.style.aspectRatio, "2400 / 3600");
  assert.equal(f.count.textContent, "03 / 04");
  f.previous.emit("click");
  assert.equal(f.video.paused, true); assert.equal(f.video.loadCalls, 1);
  f.next.emit("click"); f.next.emit("click");
  assert.equal(f.video.src, "/portfolio/videos/second.mp4");
  assert.equal(f.video.attributes["aria-label"], "Test artwork — Video 4 / 4: Second clip");
  assert.equal(f.caption.textContent, "Video caption");
  assert.equal(f.count.textContent, "04 / 04"); assert.equal(f.next.disabled, true);
  f.next.emit("click"); assert.equal(f.count.textContent, "04 / 04");
});

test("video keeps native keyboard and control-strip gestures; swipes elsewhere still navigate", () => {
  const f = fixture([images[0], { type: "video", src: "clip.mp4", width: 640, height: 360 }, images[1]]);
  initialize(f); f.next.emit("click");
  assert.equal(key(f, "ArrowRight", { closest: () => f.video }), false);
  assert.equal(f.count.textContent, "02 / 03");
  swipe(f, -120, 0, { target: f.video, clientY: 450 });
  assert.equal(f.count.textContent, "02 / 03");
  swipe(f, -120, 10, { target: f.video });
  assert.equal(f.count.textContent, "03 / 03");
  assert.equal(f.video.paused, true);
  swipe(f, 120); assert.equal(f.count.textContent, "02 / 03");
  swipe(f, 120); assert.equal(f.count.textContent, "01 / 03");
});

test("moving directly between videos pauses the old source", () => {
  const f = fixture([images[0],
    { type: "video", src: "first.mp4", width: 640, height: 360 },
    { type: "video", src: "second.mp4", width: 640, height: 360 }]);
  initialize(f); f.next.emit("click"); f.video.paused = false;
  f.next.emit("click");
  assert.equal(f.video.pauseCalls, 1);
  assert.equal(f.video.src, "/second.mp4"); assert.equal(f.video.paused, true);
});
