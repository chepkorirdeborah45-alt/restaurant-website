
/* =========================================
   ÉLAN RESORT — BOOKING PAGE JAVASCRIPT
   Mobile navigation, room selection, pricing,
   date validation and demo confirmation
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =====================================
     1. MOBILE HAMBURGER NAVIGATION
  ===================================== */

  const menuToggle = document.querySelector("#bookingMenuToggle");
  const navigation = document.querySelector("#bookingNavigation");

  if (menuToggle && navigation) {
    const navLinks = navigation.querySelectorAll("a");

    function closeMenu(returnFocus = false) {
      navigation.classList.remove("active");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");

      document.body.classList.remove("booking-menu-open");

      if (returnFocus) {
        menuToggle.focus();
      }
    }

    function openMenu() {
      navigation.classList.add("active");

      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Close navigation menu");

      document.body.classList.add("booking-menu-open");
    }

    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    document.addEventListener("click", (event) => {
      const clickedToggle = menuToggle.contains(event.target);
      const clickedNavigation = navigation.contains(event.target);

      if (!clickedToggle && !clickedNavigation) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        menuToggle.getAttribute("aria-expanded") === "true"
      ) {
        closeMenu(true);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  /* =====================================
     2. BOOKING FORM ELEMENTS
  ===================================== */

  const bookingForm = document.querySelector("#bookingForm");

  const roomType = document.querySelector("#roomType");
  const checkIn = document.querySelector("#checkIn");
  const checkOut = document.querySelector("#checkOut");

  const adults = document.querySelector("#adults");
  const children = document.querySelector("#children");

  const guestName = document.querySelector("#guestName");
  const guestEmail = document.querySelector("#guestEmail");
  const guestPhone = document.querySelector("#guestPhone");
  const specialRequests = document.querySelector("#specialRequests");

  const summaryImage = document.querySelector("#summaryImage");
  const summaryRoomName = document.querySelector("#summaryRoomName");
  const summaryDescription = document.querySelector("#summaryDescription");
  const summaryPrice = document.querySelector("#summaryPrice");
  const summaryNights = document.querySelector("#summaryNights");
  const summaryGuests = document.querySelector("#summaryGuests");
  const summaryTotal = document.querySelector("#summaryTotal");
  const summaryTotalNote = document.querySelector("#summaryTotalNote");
  const mobileTotal = document.querySelector("#mobileTotal");

  const bookingConfirmation =
    document.querySelector("#bookingConfirmation");

  const confirmationMessage =
    document.querySelector("#confirmationMessage");

  const editBooking = document.querySelector("#editBooking");

  const bookingYear = document.querySelector("#bookingYear");

  if (bookingYear) {
    bookingYear.textContent = new Date().getFullYear();
  }

  /*
    Stop only the booking functionality if the form
    is missing. The hamburger menu above still works.
  */
  if (
    !bookingForm ||
    !roomType ||
    !checkIn ||
    !checkOut
  ) {
    return;
  }

  /* =====================================
     3. ROOM DATA
  ===================================== */

  const rooms = {
    "Classic Retreat": {
      price: 4500,
      image: "images/room1.jpg",
      description:
        "Thoughtful comfort and beautiful simplicity. Enjoy a relaxing stay in an elegant room designed for comfort and peaceful moments."
    },

    "Serenity Double": {
      price: 7500,
      image: "images/room2.jpg",
      description:
        "Room to unwind and reconnect. Experience a spacious double room with a calm atmosphere and carefully considered details."
    },

    "The Élan Suite": {
      price: 12000,
      image: "images/room3.jpg",
      description:
        "Elevated living with a little more space. Discover a refined suite designed for guests who appreciate extra comfort and a distinctive stay."
    }
  };

  /* =====================================
     4. DATE HELPERS
  ===================================== */

  function formatLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function parseLocalDate(value) {
    if (!value) {
      return null;
    }

    const parts = value.split("-").map(Number);

    if (parts.length !== 3 || parts.some(Number.isNaN)) {
      return null;
    }

    const [year, month, day] = parts;

    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function calculateNights() {
    const arrival = parseLocalDate(checkIn.value);
    const departure = parseLocalDate(checkOut.value);

    if (!arrival || !departure || departure <= arrival) {
      return 0;
    }

    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    return Math.round(
      (departure.getTime() - arrival.getTime()) /
      millisecondsPerDay
    );
  }

  /* =====================================
     5. SET DEFAULT DATES
  ===================================== */

  const today = formatLocalDate(new Date());
  const tomorrow = formatLocalDate(addDays(new Date(), 1));

  checkIn.min = today;
  checkOut.min = tomorrow;

  if (!checkIn.value || checkIn.value < today) {
    checkIn.value = today;
  }

  function updateCheckoutMinimum() {
    const arrival = parseLocalDate(checkIn.value);

    const earliestCheckout = arrival
      ? formatLocalDate(addDays(arrival, 1))
      : tomorrow;

    checkOut.min = earliestCheckout;

    if (
      checkOut.value &&
      checkOut.value < earliestCheckout
    ) {
      checkOut.value = earliestCheckout;
    }
  }

  updateCheckoutMinimum();

  if (!checkOut.value || checkOut.value <= checkIn.value) {
    checkOut.value = formatLocalDate(
      addDays(parseLocalDate(checkIn.value) || new Date(), 1)
    );
  }

  /* =====================================
     6. FORMAT KENYAN SHILLINGS
  ===================================== */

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0
    }).format(amount).replace("KES", "KSh");
  }

  /* =====================================
     7. GET SELECTED ROOM
  ===================================== */

  function getSelectedRoom() {
    return rooms[roomType.value] || rooms["Classic Retreat"];
  }

  /* =====================================
     8. UPDATE ROOM SUMMARY
  ===================================== */

  function updateRoomSummary() {
    const selectedName = roomType.value;
    const room = getSelectedRoom();

    const nights = calculateNights();

    const adultCount = Number(adults?.value || 1);
    const childCount = Number(children?.value || 0);
    const guestCount = adultCount + childCount;

    const total = room.price * nights;

    if (summaryRoomName) {
      summaryRoomName.textContent = selectedName;
    }

    if (summaryDescription) {
      summaryDescription.textContent = room.description;
    }

    if (summaryPrice) {
      summaryPrice.textContent = formatCurrency(room.price);
    }

    if (summaryImage) {
      summaryImage.src = room.image;
      summaryImage.alt = `${selectedName} accommodation`;
    }

    if (summaryNights) {
      summaryNights.textContent =
        `${nights} ${nights === 1 ? "night" : "nights"}`;
    }

    if (summaryGuests) {
      summaryGuests.textContent =
        `${guestCount} ${guestCount === 1 ? "guest" : "guests"}` +
        ` (${adultCount} adults, ${childCount} children)`;
    }

    if (summaryTotal) {
      summaryTotal.textContent = formatCurrency(total);
    }

    if (mobileTotal) {
      mobileTotal.textContent = formatCurrency(total);
    }

    if (summaryTotalNote) {
      summaryTotalNote.textContent =
        nights > 0
          ? `${nights} ${nights === 1 ? "night" : "nights"}`
          : "Select valid dates";
    }
  }

  /* =====================================
     9. PRESELECT ROOM FROM URL
  ===================================== */

  const params = new URLSearchParams(window.location.search);
  const requestedRoom = params.get("room");

  if (
    requestedRoom &&
    Object.prototype.hasOwnProperty.call(rooms, requestedRoom)
  ) {
    roomType.value = requestedRoom;
  }

  /* =====================================
     10. UPDATE WHEN FIELDS CHANGE
  ===================================== */

  roomType.addEventListener("change", updateRoomSummary);

  checkIn.addEventListener("change", () => {
    updateCheckoutMinimum();
    updateRoomSummary();
  });

  checkOut.addEventListener("change", updateRoomSummary);

  if (adults) {
    adults.addEventListener("change", updateRoomSummary);
  }

  if (children) {
    children.addEventListener("change", updateRoomSummary);
  }

  /* =====================================
     11. BOOKING FORM VALIDATION
  ===================================== */

  function validateBookingDates() {
    const arrival = parseLocalDate(checkIn.value);
    const departure = parseLocalDate(checkOut.value);

    const minimumArrival = parseLocalDate(
      formatLocalDate(new Date())
    );

    if (!arrival) {
      checkIn.setCustomValidity("Please select a valid check-in date.");
      checkIn.reportValidity();
      checkIn.setCustomValidity("");
      return false;
    }

    if (arrival < minimumArrival) {
      checkIn.setCustomValidity(
        "Check-in cannot be earlier than today."
      );
      checkIn.reportValidity();
      checkIn.setCustomValidity("");
      return false;
    }

    if (!departure) {
      checkOut.setCustomValidity("Please select a valid check-out date.");
      checkOut.reportValidity();
      checkOut.setCustomValidity("");
      return false;
    }

    if (departure <= arrival) {
      checkOut.setCustomValidity(
        "Check-out must be at least one day after check-in."
      );
      checkOut.reportValidity();
      checkOut.setCustomValidity("");
      return false;
    }

    return true;
  }

  /* =====================================
     12. SUBMIT BOOKING REQUEST
  ===================================== */

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!bookingForm.reportValidity()) {
      return;
    }

    if (!validateBookingDates()) {
      return;
    }

    const room = getSelectedRoom();
    const nights = calculateNights();

    const adultCount = Number(adults?.value || 1);
    const childCount = Number(children?.value || 0);
    const totalGuests = adultCount + childCount;

    const total = room.price * nights;

    const arrival = parseLocalDate(checkIn.value);
    const departure = parseLocalDate(checkOut.value);

    const dateFormatter = new Intl.DateTimeFormat("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    const arrivalText = dateFormatter.format(arrival);
    const departureText = dateFormatter.format(departure);

    if (confirmationMessage) {
      confirmationMessage.textContent =
        `Thank you, ${guestName.value.trim()}. ` +
        `Your reservation request is prepared for ${roomType.value}, ` +
        `from ${arrivalText} to ${departureText} ` +
        `(${nights} ${nights === 1 ? "night" : "nights"}). ` +
        `Guests: ${totalGuests}. ` +
        `Estimated total: ${formatCurrency(total)}. ` +
        `Please contact ÉLAN Resort to verify availability and confirm your reservation.`;
    }

    if (bookingConfirmation) {
      bookingConfirmation.hidden = false;
      bookingConfirmation.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }

    bookingForm.hidden = true;
  });

  /* =====================================
     13. RETURN TO EDIT THE FORM
  ===================================== */

  if (editBooking) {
    editBooking.addEventListener("click", () => {
      if (bookingConfirmation) {
        bookingConfirmation.hidden = true;
      }

      bookingForm.hidden = false;

      bookingForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      if (guestName) {
        guestName.focus({ preventScroll: true });
      }
    });
  }

  /* =====================================
     14. INITIAL SUMMARY
  ===================================== */

  updateRoomSummary();
});
