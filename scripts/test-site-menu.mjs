import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = ts.transpileModule(
  readFileSync(new URL("../src/scripts/site-menu.ts", import.meta.url), "utf8"),
  { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } },
).outputText;
const { initializeSiteMenu } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

function fixture(language = "en") {
  const root = { documentElement: { style: { overflow: "clip" } }, activeElement: null };
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
  const links = Array.from({ length: 6 }, element); // four pages and two languages
  const panel = Object.assign(element(), { hidden: true, querySelector: () => links[0] });
  const classes = new Set();
  const header = {
    querySelector: (selector) => selector === ".menu-toggle" ? button : panel,
    querySelectorAll: () => [identity, button, ...links],
    classList: { toggle(name, value) { if (value) classes.add(name); else classes.delete(name); } },
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

test("menu opens with focus, translated labels and isolated background; close restores state", () => {
  for (const language of ["en", "zh"]) {
    const f = fixture(language);
    assert.equal(f.panel.hidden, true);
    f.button.emit("click");
    assert.equal(f.panel.hidden, false);
    assert.equal(f.button.attributes["aria-expanded"], "true");
    assert.equal(f.button.attributes["aria-label"], language === "zh" ? "关闭" : "Close");
    assert.equal(f.root.activeElement, f.links[0]);
    assert(f.background.every(region => region.inert));
    assert.equal(f.root.documentElement.style.overflow, "hidden");
    assert(f.classes.has("is-menu-open"));
    f.button.emit("click");
    assert.equal(f.panel.hidden, true);
    assert.equal(f.button.attributes["aria-expanded"], "false");
    assert.equal(f.button.attributes["aria-label"], language === "zh" ? "菜单" : "Menu");
    assert.deepEqual(f.background.map(region => region.inert), [false, true]);
    assert.equal(f.root.documentElement.style.overflow, "clip");
    assert.equal(f.root.activeElement, f.button);
    assert(!f.classes.has("is-menu-open"));
  }
});

test("Escape closes an open menu and returns focus; closed menus leave keyboard events alone", () => {
  const f = fixture();
  assert.equal(f.key("Escape"), false);
  f.button.emit("click");
  assert.equal(f.key("Escape"), true);
  assert.equal(f.panel.hidden, true);
  assert.equal(f.root.activeElement, f.button);
  assert.equal(f.key("Escape"), false);
});

test("Tab wraps at both header/menu boundaries without intercepting ordinary navigation", () => {
  const f = fixture();
  f.button.emit("click");
  assert.equal(f.key("Tab"), false);
  f.links.at(-1).focus();
  assert.equal(f.key("Tab"), true);
  assert.equal(f.root.activeElement, f.identity);
  assert.equal(f.key("Tab", true), true);
  assert.equal(f.root.activeElement, f.links.at(-1));
  f.key("Escape");
  assert.equal(f.key("Tab"), false);
});

test("page/language links close the panel and unlock the page; panel whitespace does not", () => {
  const f = fixture();
  f.button.emit("click");
  f.panel.emit("click", { target: { closest: () => null } });
  assert.equal(f.panel.hidden, false);
  f.panel.emit("click", { target: { closest: () => f.links[0] } });
  assert.equal(f.panel.hidden, true);
  assert.equal(f.root.documentElement.style.overflow, "clip");
  f.button.emit("click");
  assert.equal(f.panel.hidden, false);
  f.key("Escape");
  assert.deepEqual(f.background.map(region => region.inert), [false, true]);
});
