import type { ArtworkImage } from "../data/projects";

export function initializeProjectGalleries(root: Document = document) {
  root.querySelectorAll<HTMLElement>("[data-inline-gallery]").forEach((gallery) => {
    const data = gallery.querySelector<HTMLScriptElement>("[data-gallery-images]");
    if (!data) return; // Single-image projects have no controls or gestures.
    const images: ArtworkImage[] = JSON.parse(data.textContent ?? "[]");
    if (images.length < 2) return;
    const photo = gallery.querySelector<HTMLImageElement>("img");
    const stage = gallery.querySelector<HTMLElement>("[data-gallery-stage]");
    const previous = gallery.querySelector<HTMLButtonElement>("[data-gallery-previous]");
    const next = gallery.querySelector<HTMLButtonElement>("[data-gallery-next]");
    const caption = gallery.querySelector<HTMLElement>("[data-gallery-caption]");
    const count = gallery.querySelector<HTMLElement>("[data-gallery-count]");
    if (!photo || !stage || !previous || !next || !caption || !count) return;
    const base = gallery.dataset.base ?? "/";
    let current = 0;
    photo.draggable = false;

    function show(index: number) {
      const target = Math.max(0, Math.min(images.length - 1, index));
      if (target === current) return;
      current = target;
      const image = images[current];
      photo!.srcset = `${base}images/${image.src}-640.webp 640w, ${base}images/${image.src}-1024.webp 1024w, ${base}images/${image.src}.webp ${image.width}w`;
      photo!.src = `${base}images/${image.src}.webp`;
      photo!.alt = image.alt;
      photo!.width = image.width;
      photo!.height = image.height;
      caption!.textContent = image.caption;
      count!.textContent = `${String(current + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;
      const active = gallery.ownerDocument.activeElement;
      if ((active === previous && current === 0) || (active === next && current === images.length - 1)) {
        gallery.focus({ preventScroll: true });
      }
      previous!.disabled = current === 0;
      next!.disabled = current === images.length - 1;
    }

    previous.addEventListener("click", () => show(current - 1));
    next.addEventListener("click", () => show(current + 1));
    gallery.addEventListener("keydown", (event) => {
      const target = event.target as HTMLElement;
      if (target.isContentEditable || target.closest("input, textarea, select")) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        show(current + (event.key === "ArrowLeft" ? -1 : 1));
      }
    });

    let start: { id: number; x: number; y: number } | undefined;
    stage.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary || event.pointerType === "mouse" || (event.target as HTMLElement).closest("button")) return;
      start = { id: event.pointerId, x: event.clientX, y: event.clientY };
      stage.setPointerCapture(event.pointerId);
    });
    stage.addEventListener("pointercancel", () => { start = undefined; });
    stage.addEventListener("pointerup", (event) => {
      if (!start || event.pointerId !== start.id) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      start = undefined;
      if (Math.abs(dx) >= Math.max(48, stage.clientWidth * 0.1) && Math.abs(dx) > Math.abs(dy) * 1.5) {
        show(current + (dx < 0 ? 1 : -1));
      }
    });
  });
}
