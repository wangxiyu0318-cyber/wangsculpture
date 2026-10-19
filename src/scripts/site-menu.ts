export function initializeSiteMenu(root: Document = document) {
  const header = root.querySelector<HTMLElement>(".signature-header");
  const button = header?.querySelector<HTMLButtonElement>(".menu-toggle");
  const panel = header?.querySelector<HTMLElement>("#site-menu");
  if (!header || !button || !panel) return;

  const background = Array.from(root.querySelectorAll<HTMLElement>("main, footer"));
  let previousOverflow = "";
  let previousInert: boolean[] = [];

  function setOpen(open: boolean, restoreFocus = false) {
    if (open === !panel!.hidden) return;
    if (open) {
      previousOverflow = root.documentElement.style.overflow;
      previousInert = background.map((region) => region.inert);
      background.forEach((region) => { region.inert = true; });
      root.documentElement.style.overflow = "hidden";
    } else {
      background.forEach((region, index) => { region.inert = previousInert[index]; });
      root.documentElement.style.overflow = previousOverflow;
    }
    panel!.hidden = !open;
    header!.classList.toggle("is-menu-open", open);
    button!.setAttribute("aria-expanded", String(open));
    button!.setAttribute("aria-label", open
      ? button!.dataset.closeLabel ?? "Close"
      : button!.dataset.menuLabel ?? "Menu");
    if (open) panel!.querySelector<HTMLAnchorElement>("a[href]")?.focus();
    else if (restoreFocus) button!.focus();
  }

  button.addEventListener("click", () => setOpen(panel.hidden, true));
  panel.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).closest("a[href]")) setOpen(false);
  });
  root.addEventListener("keydown", (event) => {
    if (panel.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false, true);
    } else if (event.key === "Tab") {
      // Keep keyboard focus in the visible header/menu while the page is inert.
      const links = Array.from(header.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      const first = links[0];
      const last = links[links.length - 1];
      if (event.shiftKey && root.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && root.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  });
}
