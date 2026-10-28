
/* =========================================
   ÉLAN RESORT — ROOMS PAGE
   File: room.js
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector("#roomMenuToggle");
  const navigation = document.querySelector("#roomNavigation");

  // -----------------------------------------
  // MOBILE NAVIGATION
  // -----------------------------------------

  function closeMenu() {
    if (!menuToggle || !navigation) return;

    menuToggle.classList.remove("active");
    navigation.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    document.body.classList.remove("room-menu-open");
  }

  function openMenu() {
    if (!menuToggle || !navigation) return;

    menuToggle.classList.add("active");
    navigation.classList.add("active");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");

    document.body.classList.add("room-menu-open");
  }

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navigation.classList.contains("active");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close after selecting a navigation link.
    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close if the visitor clicks outside the header.
    document.addEventListener("click", (event) => {
      const clickedInsideHeader = event.target.closest(".room-header");

      if (!clickedInsideHeader) {
        closeMenu();
      }
    });

    // Close the menu with Escape.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Prevent the mobile menu state remaining after resizing.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  // -----------------------------------------
  // COPYRIGHT YEAR
  // -----------------------------------------

  const yearElement = document.querySelector("#roomYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // -----------------------------------------
  // ROOM BOOKING LINKS
  // -----------------------------------------

  const roomNames = [
    "Classic Retreat",
    "Serenity Double",
    "The Élan Suite"
  ];

  document.querySelectorAll(".room-book-button").forEach((button) => {
    const roomName = button.dataset.room;

    if (roomNames.includes(roomName)) {
      button.href = `booking.html?room=${encodeURIComponent(roomName)}`;
    }
  });
});
