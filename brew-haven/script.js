(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav a");
  const tabs = document.querySelectorAll(".tab");
  const menuItems = document.querySelectorAll(".menu-item");
  const reveals = document.querySelectorAll(".reveal");
  const newsletter = document.getElementById("newsletter");
  const formMessage = document.getElementById("form-msg");
  const year = document.getElementById("year");
  const reducesMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  function closeNav() {
    if (!header || !navToggle) return;
    header.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  if (navToggle && header) {
    navToggle.addEventListener("click", function () {
      const isOpen = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    document.addEventListener("click", function (event) {
      if (!header.contains(event.target)) closeNav();
    });
  }

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if ("IntersectionObserver" in window && !reducesMotion) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    reveals.forEach(function (element) {
      element.classList.add("is-visible");
    });
  }

  const sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            const active = link.getAttribute("href") === "#" + id;
            link.classList.toggle("is-active", active);
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const filter = tab.dataset.filter;

      tabs.forEach(function (item) {
        const active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });

      menuItems.forEach(function (item) {
        const matches = filter === "all" || item.dataset.category === filter;
        item.classList.toggle("is-hidden", !matches);
        if (matches) {
          item.classList.add("is-visible");
        }
      });
    });
  });

  if (newsletter) {
    newsletter.addEventListener("submit", function (event) {
      event.preventDefault();
      const input = newsletter.querySelector("input");
      const email = input.value.trim();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!isValid) {
        formMessage.textContent = "Please enter a valid email address.";
        input.focus();
        return;
      }

      formMessage.textContent = "You're on the list. See you at the counter.";
      newsletter.reset();
    });
  }
})();
