document.addEventListener("DOMContentLoaded", function () {
  const root = document.querySelector("[data-yt-shell-root]");
  if (!root) {
    return;
  }

  const desktopQuery = window.matchMedia("(min-width: 901px)");
  const menuToggle = root.querySelector("[data-yt-shell-menu-toggle]");
  const searchToggles = Array.from(
    root.querySelectorAll("[data-yt-shell-search-toggle]")
  );
  const overlay = root.querySelector("[data-yt-shell-overlay]");
  const drawer = root.querySelector("[data-yt-shell-drawer]");
  const mobileSearch = root.querySelector("[data-yt-shell-mobile-search]");

  function syncOverlay() {
    const open =
      root.dataset.mobileDrawerOpen === "true" ||
      root.dataset.searchOpen === "true";
    if (overlay) {
      overlay.hidden = !open;
    }
  }

  function lockBody(locked) {
    document.body.classList.toggle("yt-shell-lock", locked);
  }

  function closeDrawer() {
    root.dataset.mobileDrawerOpen = "false";
    if (drawer) {
      drawer.hidden = true;
    }
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
    lockBody(root.dataset.searchOpen === "true");
    syncOverlay();
  }

  function closeSearch() {
    root.dataset.searchOpen = "false";
    if (mobileSearch) {
      mobileSearch.hidden = true;
    }
    searchToggles.forEach(function (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    });
    lockBody(root.dataset.mobileDrawerOpen === "true");
    syncOverlay();
  }

  function toggleGuide() {
    const collapsed = root.dataset.guideCollapsed === "true";
    root.dataset.guideCollapsed = collapsed ? "false" : "true";
  }

  function toggleDrawer() {
    const nextState = root.dataset.mobileDrawerOpen !== "true";
    root.dataset.mobileDrawerOpen = String(nextState);
    if (drawer) {
      drawer.hidden = !nextState;
    }
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", String(nextState));
    }
    if (nextState) {
      closeSearch();
      root.dataset.mobileDrawerOpen = "true";
      if (drawer) {
        drawer.hidden = false;
      }
    }
    lockBody(nextState);
    syncOverlay();
  }

  function toggleSearch() {
    const nextState = root.dataset.searchOpen !== "true";
    root.dataset.searchOpen = String(nextState);
    if (mobileSearch) {
      mobileSearch.hidden = !nextState;
    }
    searchToggles.forEach(function (toggle) {
      toggle.setAttribute("aria-expanded", String(nextState));
    });
    if (nextState) {
      closeDrawer();
      root.dataset.searchOpen = "true";
      if (mobileSearch) {
        mobileSearch.hidden = false;
      }
    }
    lockBody(nextState);
    syncOverlay();
  }

  root.dataset.guideCollapsed = "false";
  root.dataset.mobileDrawerOpen = "false";
  root.dataset.searchOpen = "false";
  if (drawer) {
    drawer.hidden = true;
  }
  if (mobileSearch) {
    mobileSearch.hidden = true;
  }
  syncOverlay();

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      if (desktopQuery.matches) {
        toggleGuide();
        return;
      }
      toggleDrawer();
    });
  }

  searchToggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      toggleSearch();
    });
  });

  if (overlay) {
    overlay.addEventListener("click", function () {
      closeDrawer();
      closeSearch();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
      return;
    }
    closeDrawer();
    closeSearch();
  });

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener("change", function (event) {
      if (event.matches) {
        closeDrawer();
        closeSearch();
      } else {
        root.dataset.guideCollapsed = "false";
      }
    });
  } else if (desktopQuery.addListener) {
    desktopQuery.addListener(function (event) {
      if (event.matches) {
        closeDrawer();
        closeSearch();
      } else {
        root.dataset.guideCollapsed = "false";
      }
    });
  }
});
