(() => {
  "use strict";

  function initialiseNavigation() {
    const headers = document.querySelectorAll("header.nav");

    headers.forEach((header, index) => {
      const toggle = header.querySelector(".nav__btn--menu");
      const menu = header.querySelector(".nav__menu");

      if (!toggle || !menu) return;

      const menuId = menu.id || `site-menu-${index + 1}`;
      menu.id = menuId;
      menu.setAttribute("role", "navigation");
      menu.setAttribute("aria-label", "Primary navigation");
      toggle.setAttribute("role", "button");
      toggle.setAttribute("aria-controls", menuId);
      toggle.setAttribute("aria-expanded", "false");

      function setExpanded(expanded) {
        toggle.setAttribute("aria-expanded", String(expanded));
        toggle.setAttribute(
          "aria-label",
          expanded ? "Close menu" : "Open menu",
        );
      }

      setExpanded(false);

      toggle.addEventListener("click", (event) => {
        event.preventDefault();
        setExpanded(toggle.getAttribute("aria-expanded") !== "true");
      });

      toggle.addEventListener("keydown", (event) => {
        if (event.key === " ") {
          event.preventDefault();
          toggle.click();
        }
      });

      menu.addEventListener("click", (event) => {
        if (event.target.closest("a")) setExpanded(false);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;

      const openToggle = document.querySelector(
        '.nav__btn--menu[aria-expanded="true"]',
      );

      if (openToggle) {
        openToggle.click();
        openToggle.focus();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiseNavigation);
  } else {
    initialiseNavigation();
  }
})();
