import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = ts.transpileModule(
  readFileSync(new URL("../src/scripts/site-menu.ts", import.meta.url), "utf8"),
  { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } },
).outputText;
const { initializeSiteMenu } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

function fixture(language = "en", reducedMotion = false) {
  const root = {
    documentElement: { style: { overflow: "clip" } }, activeElement: null,
    defaultView: { matchMedia: () => ({ matches: reducedMotion }) },
  };
  function element() {
    const listeners = new Map();
    return {
      listeners, attributes: {},
      addEventListener(name, callback) { listeners.set(name, callback); },
      emit(name, event = {}) { listeners.get(name)?.(event); },
      focus() { root.activeElement = this; },
      setAttribute(name, value) { this.attributes[name] = value; },
    };
  }
  Object.assign(root, element());
  const identity = element(), button = element();
  button.dataset = { menuLabel: language === "zh" ? "菜单" : "Menu", closeLabel: language === "zh" ? "关闭" : "Close" };
  const links = Array.from({ length: 6 }, element);
  const panel = Object.assign(element(), {
    hidden: true, inert: true,
    querySelectorAll: () => links,
    contains: target => links.includes(target),
    getBoundingClientRect() { this.measured = true; return {}; },
  });
  const classes = new Set();
  const header = {
    querySelector: selector => selector === ".menu-toggle" ? button : panel,
    contains: target => [identity, button, panel, ...links].includes(target),
    classList: { add: name => classes.add(name), remove: name => classes.delete(name) },
  };
  const background = [{ inert: false }, { inert: true }];
  root.querySelector = () => header;
  root.querySelectorAll = () => background;
  initializeSiteMenu(root);
  function key(key, shiftKey = false) {
    let prevented = false;
    root.emit("keydown", { key, shiftKey, preventDefault() { prevented = true; } });
    return prevented;
  }
  return { root, identity, button, panel, links, background, classes, key };
}

test("opening and closing preserve page interaction and scrollbars in both languages", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  for (const language of ["en", "zh"]) {
    const f = fixture(language);
    f.button.emit("click");
    assert.equal(f.panel.hidden, false);
    assert.equal(f.panel.inert, false);
    assert.equal(f.panel.attributes["aria-hidden"], "false");
    assert.equal(f.button.attributes["aria-expanded"], "true");
    assert.equal(f.button.attributes["aria-label"], language === "zh" ? "关闭" : "Close");
    assert.equal(f.root.activeElement, f.links[0]);
    assert.equal(f.panel.measured, true);
    assert.deepEqual(f.background.map(region => region.inert), [false, true]);
    assert.equal(f.root.documentElement.style.overflow, "clip");
    f.button.emit("click");
    assert.equal(f.panel.hidden, false); // keep rendering until reverse stagger completes
    assert.equal(f.panel.inert, true);
    assert.equal(f.panel.attributes["aria-hidden"], "true");
    assert.equal(f.button.attributes["aria-expanded"], "false");
    assert.equal(f.button.attributes["aria-label"], language === "zh" ? "菜单" : "Menu");
    assert.equal(f.root.activeElement, f.button);
    assert(!f.classes.has("is-menu-open"));
    t.mock.timers.tick(649);
    assert.equal(f.panel.hidden, false);
    t.mock.timers.tick(1);
    assert.equal(f.panel.hidden, true);
    assert.equal(f.root.documentElement.style.overflow, "clip");
  }
});

test("Escape retracts the menu and restores focus; Tab remains normal page navigation", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const f = fixture();
  assert.equal(f.key("Escape"), false);
  f.button.emit("click");
  assert.equal(f.key("Tab"), false);
  assert.equal(f.key("Tab", true), false);
  assert.equal(f.key("Escape"), true);
  assert.equal(f.root.activeElement, f.button);
  assert.equal(f.panel.inert, true);
  t.mock.timers.tick(650);
  assert.equal(f.panel.hidden, true);
  assert.equal(f.key("Escape"), false);
});

test("reopening during retraction cancels the old hiding timer", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const f = fixture();
  f.button.emit("click"); f.button.emit("click");
  t.mock.timers.tick(300);
  f.button.emit("click");
  t.mock.timers.tick(1000);
  assert.equal(f.panel.hidden, false);
  assert.equal(f.panel.inert, false);
  assert.equal(f.button.attributes["aria-expanded"], "true");
  assert(f.classes.has("is-menu-open"));
  f.key("Escape");
  t.mock.timers.tick(650);
  assert.equal(f.panel.hidden, true);
});

test("page/language links close without blocking navigation; whitespace leaves menu open", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const f = fixture();
  f.button.emit("click");
  f.panel.emit("click", { target: { closest: () => null } });
  assert(f.classes.has("is-menu-open"));
  f.panel.emit("click", { target: { closest: () => f.links[0] } });
  assert.equal(f.panel.inert, true);
  t.mock.timers.tick(650);
  assert.equal(f.panel.hidden, true);
});

test("outside clicks or focus dismiss the disclosure without trapping the page", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const f = fixture();
  f.button.emit("click");
  f.root.emit("pointerdown", { target: f.links[0] });
  assert(f.classes.has("is-menu-open"));
  f.root.emit("pointerdown", { target: {} });
  assert(!f.classes.has("is-menu-open"));
  f.button.emit("click");
  f.root.emit("focusin", { target: f.identity });
  assert(f.classes.has("is-menu-open"));
  f.root.emit("focusin", { target: {} });
  assert(!f.classes.has("is-menu-open"));
  t.mock.timers.tick(650);
  assert.equal(f.panel.hidden, true);
});

test("reduced motion closes immediately without waiting for stagger timers", () => {
  const f = fixture("en", true);
  f.button.emit("click");
  assert.equal(f.panel.hidden, false);
  f.button.emit("click");
  assert.equal(f.panel.hidden, true);
  assert.equal(f.root.documentElement.style.overflow, "clip");
});
