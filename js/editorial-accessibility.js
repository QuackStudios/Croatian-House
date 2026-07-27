(() => {
  "use strict";

  function initialiseSkipLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      if (!link.classList.contains("ch-skip-link")) return;

      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      target.setAttribute("tabindex", "-1");

      link.addEventListener("click", (event) => {
        event.preventDefault();
        target.focus({ preventScroll: true });
        target.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
          block: "start",
        });
        history.replaceState(null, "", link.getAttribute("href"));
      });
    });
  }

  function initialiseTickerControls() {
    document.querySelectorAll(".ticker__wrp").forEach((ticker, index) => {
      const tickerId = ticker.id || `site-ticker-${index + 1}`;
      ticker.id = tickerId;

      const control = document.createElement("button");
      control.type = "button";
      control.className = "ch-ticker-toggle";
      control.setAttribute("aria-controls", tickerId);
      control.setAttribute("aria-pressed", "false");
      control.textContent = "Pause motion";

      control.addEventListener("click", () => {
        const paused = ticker.classList.toggle("is-ticker-paused");
        control.setAttribute("aria-pressed", String(paused));
        control.textContent = paused ? "Resume motion" : "Pause motion";
      });

      ticker.before(control);
    });
  }

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
      toggle.setAttribute("aria-haspopup", "true");
      toggle.setAttribute("aria-controls", menuId);
      toggle.setAttribute("aria-expanded", "false");

      const backgroundRegions = Array.from(
        document.querySelectorAll(
          "main, footer, body > nav[aria-label='Explore Croatian House']",
        ),
      );

      function setExpanded(expanded, restoreFocus = true) {
        toggle.setAttribute("aria-expanded", String(expanded));
        menu.setAttribute("aria-hidden", String(!expanded));
        toggle.setAttribute(
          "aria-label",
          expanded ? "Close menu" : "Open menu",
        );

        backgroundRegions.forEach((region) => {
          region.inert = expanded;
        });

        if (expanded) {
          const firstMenuLink = menu.querySelector("a[href]");
          if (firstMenuLink) {
            window.requestAnimationFrame(() => firstMenuLink.focus());
          }
        } else if (restoreFocus && header.contains(document.activeElement)) {
          toggle.focus();
        }
      }

      setExpanded(false);

      toggle.addEventListener("click", (event) => {
        event.preventDefault();
        setExpanded(toggle.getAttribute("aria-expanded") !== "true");
      });

      menu.addEventListener("click", (event) => {
        if (event.target.closest("a")) setExpanded(false, false);
      });

      header.addEventListener("keydown", (event) => {
        if (event.key !== "Tab" || toggle.getAttribute("aria-expanded") !== "true") {
          return;
        }

        const focusable = Array.from(
          header.querySelectorAll(
            'a[href]:not([tabindex="-1"]), button:not([disabled])',
          ),
        ).filter((element) => !element.closest("[inert]"));

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
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
    document.addEventListener("DOMContentLoaded", () => {
      initialiseSkipLinks();
      initialiseTickerControls();
      initialiseNavigation();
    });
  } else {
    initialiseSkipLinks();
    initialiseTickerControls();
    initialiseNavigation();
  }
})();
