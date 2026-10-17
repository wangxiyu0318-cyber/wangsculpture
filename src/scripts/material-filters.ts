export function initializeMaterialFilters(root: Document = document, browser: Window = window) {
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-filter]"));
  const works = Array.from(root.querySelectorAll<HTMLElement>(".archive-grid .work-item"));
  const groups = root.querySelectorAll<HTMLElement>(".archive-year");
  const status = root.querySelector<HTMLElement>("#filter-status");
  const allowed = new Set(buttons.map((button) => button.dataset.filter));

  function requestedMaterial() {
    const value = new URL(browser.location.href).searchParams.get("material") ?? "all";
    return allowed.has(value) ? value : "all";
  }

  function applyFilter(selected: string) {
    buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === selected)));
    let count = 0;
    works.forEach((work) => {
      const tags = work.dataset.materialTags?.split(" ") ?? [];
      work.hidden = selected !== "all" && !tags.includes(selected);
      if (!work.hidden) count++;
    });
    groups.forEach((group) => {
      group.hidden = !Array.from(group.querySelectorAll<HTMLElement>(".work-item")).some((work) => !work.hidden);
      group.querySelector(".archive-grid")?.classList.toggle("is-filtered", selected !== "all");
    });
    const label = buttons.find((button) => button.dataset.filter === selected)?.dataset.label ?? selected;
    if (status) {
      status.textContent = status.dataset.language === "zh"
        ? `显示 ${count} 件作品${selected === "all" ? "" : `（${label}）`}`
        : `Showing ${count} ${count === 1 ? "work" : "works"}${selected === "all" ? "" : ` in ${label}`}`;
    }
    // Keep the selected material when switching between equivalent archive pages.
    root.querySelectorAll<HTMLAnchorElement>(".language-switcher a").forEach((link) => {
      const url = new URL(link.href);
      if (selected === "all") url.searchParams.delete("material");
      else url.searchParams.set("material", selected);
      link.href = url.href;
    });
  }

  buttons.forEach((button) => button.addEventListener("click", () => {
    const selected = button.dataset.filter ?? "all";
    const url = new URL(browser.location.href);
    if (selected === "all") url.searchParams.delete("material");
    else url.searchParams.set("material", selected);
    browser.history.replaceState(null, "", url);
    applyFilter(selected);
  }));
  browser.addEventListener("popstate", () => applyFilter(requestedMaterial()));
  applyFilter(requestedMaterial());
}
