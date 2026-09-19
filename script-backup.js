/* Supabase */
const SUPABASE_URL = "https://fusqcgkowwhnnwtxtagx.supabase.co";
const SUPABASE_KEY = "sb_publishable_2VtFL2wz9r222PScvBZMGw_07q0zUCW";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------
  // Smooth anchor scrolling
  // --------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  // --------------------------------
  // Scroll reveal
  // --------------------------------
  const revealItems = document.querySelectorAll(
    ".project, .capability, .about-grid, .process-list > div, .contact-main",
  );

  revealItems.forEach((item) => {
    item.classList.add("reveal");
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  // --------------------------------
  // Project visual movement
  // --------------------------------
  document.querySelectorAll(".project").forEach((project) => {
    const visual = project.querySelector(".project-visual");

    if (!visual) return;

    project.addEventListener("mousemove", (event) => {
      if (window.innerWidth <= 900) return;

      const rect = project.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      visual.style.transform = `
        perspective(1000px)
        rotateY(${x * 3}deg)
        rotateX(${y * -3}deg)
        translate3d(${x * 5}px, ${y * 5}px, 0)
      `;
    });

    project.addEventListener("mouseleave", () => {
      visual.style.transform = "";
    });
  });

  // --------------------------------
  // Current year
  // --------------------------------
  document
    .querySelectorAll(".contact-footer span:last-child")
    .forEach((item) => {
      item.textContent = `� ${new Date().getFullYear()} TANMAY`;
    });

  // --------------------------------
  // Reduced-motion accessibility
  // --------------------------------
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.style.scrollBehavior = "auto";
  }
});

/* TM� registration cursor */
(() => {
  const cursor = document.querySelector(".tm-cursor");

  if (
    !cursor ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    document.body.classList.add("cursor-active");
  });

  window.addEventListener("mouseleave", () => {
    document.body.classList.remove("cursor-active");
  });

  function animateCursor() {
    currentX += (mouseX - currentX) * 0.14;
    currentY += (mouseY - currentY) * 0.14;

    cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
})();

/* Visitor Book */
(() => {
  const modal = document.querySelector(".visitor-modal");
  const openButton = document.querySelector(".visitor-book-open");
  const closeButton = document.querySelector(".visitor-modal-close");
  const backdrop = document.querySelector(".visitor-modal-backdrop");

  if (!modal || !openButton) return;

  function openBook() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeBook() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openButton.addEventListener("click", openBook);
  closeButton.addEventListener("click", closeBook);
  backdrop.addEventListener("click", closeBook);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeBook();
  });
})();

/* Visitor Book � dynamic archive */
(() => {
  const list = document.querySelector("#visitor-index-list");
  const count = document.querySelector("#visitor-count");

  if (!list) return;

  const entries = [
    {
      id: 1,
      name: "Sofia",
      location: "Copenhagen, DK",
      date: "17.09.26",
      message: "Loved the way the projects move.",
    },
    {
      id: 2,
      name: "Marco",
      location: "Berlin, DE",
      date: "18.09.26",
      message: "The FROZA project has a great visual system.",
    },
    {
      id: 3,
      name: "Emma",
      location: "London, UK",
      date: "19.09.26",
      message: "Really enjoyed exploring the portfolio.",
    },
  ];

  function renderEntries() {
    list.innerHTML = "";

    entries.forEach((entry) => {
      const button = document.createElement("button");

      button.className = "visitor-index-entry";
      button.type = "button";

      button.innerHTML = `
        <span>${String(entry.id).padStart(3, "0")}</span>
        <span>${entry.name}</span>
        <span>${entry.location || "�"}</span>
        <span>${entry.date}</span>
      `;

      button.addEventListener("click", () => {
        alert(
          `VISITOR BOOK / ${String(entry.id).padStart(3, "0")}\n\n` +
            `"${entry.message}"\n\n` +
            `� ${entry.name}\n` +
            `${entry.location || ""}\n` +
            `${entry.date}`,
        );
      });

      list.appendChild(button);
    });

    if (count) {
      count.textContent = `${String(entries.length).padStart(3, "0")} ENTRIES`;
    }
  }

  renderEntries();
})();

/* Supabase connection test */
(async () => {
  const { error } = await supabaseClient
    .from("visitor_book")
    .select("id")
    .limit(1);

  if (error) {
    console.error("Visitor Book connection failed:", error.message);
  } else {
    console.log("Visitor Book connected successfully.");
  }
})();
