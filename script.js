const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

/* =========================================
   ROOM DETAILS MODAL
========================================= */

const roomModal = document.querySelector("#roomModal");

if (roomModal) {
  const modalContent = roomModal.querySelector(".room-modal-content");
  const modalImage = document.querySelector("#modalRoomImage");
  const modalName = document.querySelector("#modalRoomName");
  const modalDescription = document.querySelector(
    "#modalRoomDescription"
  );
  const modalPrice = document.querySelector("#modalRoomPrice");
  const modalBookButton = document.querySelector("#modalBookButton");
  const closeButton = roomModal.querySelector(".room-modal-close");

  let previousFocus = null;

  function openRoomModal(room) {
    if (!room) return;

    const name = room.dataset.name;
    const price = Number(room.dataset.price);
    const image = room.dataset.image;
    const description = room.dataset.description;

    if (
      !name ||
      !Number.isFinite(price) ||
      !image ||
      !description
    ) {
      console.error("Room details are missing:", room);
      return;
    }

    previousFocus = document.activeElement;

    modalName.textContent = name;
    modalDescription.textContent = description;
    modalPrice.textContent = `KSh ${price.toLocaleString("en-KE")}`;

    modalImage.src = image;
    modalImage.alt = name;

    modalBookButton.href =
      `booking.html?room=${encodeURIComponent(name)}`;

    roomModal.classList.add("is-open");
    roomModal.setAttribute("aria-hidden", "false");
    roomModal.removeAttribute("inert");

    document.body.classList.add("modal-open");

    closeButton?.focus();
  }

  function closeRoomModal() {
    if (!roomModal.classList.contains("is-open")) return;

    roomModal.classList.remove("is-open");
    roomModal.setAttribute("aria-hidden", "true");
    roomModal.setAttribute("inert", "");

    document.body.classList.remove("modal-open");

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  // Open the correct room.
  document.querySelectorAll(".room-details-btn").forEach((button) => {
    button.addEventListener("click", () => {
      openRoomModal(button.closest(".room-card"));
    });
  });

  // Close button.
  closeButton?.addEventListener("click", closeRoomModal);

  // Close when clicking the dark background.
  const backdrop = roomModal.querySelector(".room-modal-backdrop");

  backdrop?.addEventListener("click", closeRoomModal);

  // Close with Escape.
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      roomModal.classList.contains("is-open")
    ) {
      closeRoomModal();
    }
  });
}
