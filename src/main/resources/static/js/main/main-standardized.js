document.addEventListener("DOMContentLoaded", function () {
  const root = document.querySelector("[data-main-root]");
  if (!root) {
    return;
  }

  const chips = Array.from(root.querySelectorAll("[data-main-chip]"));
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (candidate) {
        candidate.classList.remove("is-active");
      });
      chip.classList.add("is-active");
    });
  });

  const shelves = Array.from(root.querySelectorAll("[data-main-shelf]"));
  shelves.forEach(function (shelf) {
    const section = shelf.closest(".movies-shelf");
    if (!section) {
      return;
    }

    const prev = section.querySelector("[data-main-shelf-prev]");
    const next = section.querySelector("[data-main-shelf-next]");

    function updateControls() {
      if (!prev || !next) {
        return;
      }

      const maxScroll = shelf.scrollWidth - shelf.clientWidth - 2;
      prev.disabled = shelf.scrollLeft <= 2;
      next.disabled = shelf.scrollLeft >= maxScroll;
    }

    function scrollShelf(direction) {
      shelf.scrollBy({
        left: direction * Math.max(280, Math.round(shelf.clientWidth * 0.72)),
        behavior: "smooth",
      });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        scrollShelf(-1);
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        scrollShelf(1);
      });
    }

    shelf.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);
    updateControls();
  });
});
