export function initializeSiteMenu(root: Document = document) {
  const header = root.querySelector<HTMLElement>(".signature-header");
  const button = header?.querySelector<HTMLButtonElement>(".menu-toggle");
  const panel = header?.querySelector<HTMLElement>("#site-menu");
  if (!header || !button || !panel) return;

  let open = false;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  const items = Array.from(panel.querySelectorAll<HTMLAnchorElement>("a[href]"));
  const closingDuration = 400 + Math.max(0, items.length - 1) * 40;

  function setOpen(value: boolean, restoreFocus = false) {
    if (value === open) return;
    open = value;
    if (closeTimer !== undefined) clearTimeout(closeTimer);
    closeTimer = undefined;

    button!.setAttribute("aria-expanded", String(open));
    button!.setAttribute("aria-label", open
      ? button!.dataset.closeLabel ?? "Close"
      : button!.dataset.menuLabel ?? "Menu");

    if (open) {
      panel!.hidden = false;
      panel!.inert = false;
      panel!.setAttribute("aria-hidden", "false");
      // Commit the initial opacity/offset before starting the staggered transition.
      // Reopening during a close instead reverses the in-flight transitions smoothly.
      panel!.getBoundingClientRect();
      header!.classList.add("is-menu-open");
      items[0]?.focus({ preventScroll: true });
    } else {
      if (restoreFocus || panel!.contains(root.activeElement)) {
        button!.focus({ preventScroll: true });
      }
      panel!.inert = true;
      panel!.setAttribute("aria-hidden", "true");
      header!.classList.remove("is-menu-open");
      const hide = () => {
        if (!open) panel!.hidden = true;
        closeTimer = undefined;
      };
      if (root.defaultView?.matchMedia("(prefers-reduced-motion: reduce)").matches) hide();
      else closeTimer = setTimeout(hide, closingDuration);
    }
  }

  button.addEventListener("click", () => setOpen(!open, true));
  panel.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).closest("a[href]")) setOpen(false);
  });
  root.addEventListener("keydown", (event) => {
    if (open && event.key === "Escape") {
      event.preventDefault();
      setOpen(false, true);
    }
  });
  // This is an inline disclosure, not a modal: the page stays interactive and
  // keeps its scrollbar, scroll position, focus order, and artwork geometry.
  root.addEventListener("pointerdown", (event) => {
    if (open && !header.contains(event.target as Node)) setOpen(false);
  });
  root.addEventListener("focusin", (event) => {
    if (open && !header.contains(event.target as Node)) setOpen(false);
  });
}
