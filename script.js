/* Supabase */
const SUPABASE_URL = "https://fusqcgkowwhnnwtxtagx.supabase.co";
const SUPABASE_KEY = "sb_publishable_2VtFL2wz9r222PScvBZMGw_07q0zUCW";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------
  // Visitor Book public archive
  // --------------------------------
  const archiveList = document.querySelector("#visitor-index-list");
  const archiveCount = document.querySelector("#visitor-count");
  const seeMoreButton = document.querySelector(".visitor-see-more");

  let visitorEntries = [];
  let visibleVisitorEntries = 5;

  function renderVisitorArchive() {
    if (!archiveList) return;

    archiveList.innerHTML = "";

    const visibleEntries = visitorEntries.slice(0, visibleVisitorEntries);

    visibleEntries.forEach((entry, index) => {
      const row = document.createElement("button");

      row.type = "button";
      row.className = "visitor-index-entry";

      const number = String(index + 1).padStart(3, "0");

      row.innerHTML = `
        <span>${number}</span>
        <span class="visitor-index-initials">${entry.initials}</span>
      `;

      archiveList.appendChild(row);
    });

    if (archiveCount) {
      archiveCount.textContent =
        String(visitorEntries.length).padStart(3, "0") + " ENTRIES";
    }

    if (seeMoreButton) {
      const hasMore = visibleVisitorEntries < visitorEntries.length;
      seeMoreButton.hidden = !hasMore;
      seeMoreButton.setAttribute("aria-expanded", hasMore ? "false" : "true");
    }
  }

  async function loadVisitorArchive() {
    if (!archiveList) return;

    const { data, error } = await supabaseClient
      .from("visitor_book")
      .select("id, initials, created_at")
      .eq("approved", true)
      .not("initials", "is", null)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Visitor archive error:", error);
      return;
    }

    visitorEntries = data || [];
    visibleVisitorEntries = Math.min(5, visitorEntries.length);

    renderVisitorArchive();
  }


  loadVisitorArchive();
  seeMoreButton?.addEventListener("click", () => {
    visibleVisitorEntries += 5;
    renderVisitorArchive();
  });
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
      item.textContent = `© ${new Date().getFullYear()} TANMAY`;
    });

  // --------------------------------
  // Reduced-motion accessibility
  // --------------------------------
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.style.scrollBehavior = "auto";
  }
});

/* Visitor Book */
document.addEventListener("DOMContentLoaded", () => {
  const openButton = document.querySelector(".visitor-book-open");
  const modal = document.querySelector(".visitor-modal");
  const closeButton = document.querySelector(".visitor-modal-close");
  const backdrop = document.querySelector(".visitor-modal-backdrop");
  const form = document.querySelector(".visitor-form");
  const initialsInput = document.querySelector(
    '.visitor-form input[name="initials"]',
  );

  if (!openButton || !modal) {
    console.error("Visitor Book elements not found.");
    return;
  }

  function openVisitorBook(event) {
    event.preventDefault();

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      initialsInput?.focus();
    }, 100);
  }

  function closeVisitorBook() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openButton.addEventListener("click", openVisitorBook);

  closeButton?.addEventListener("click", closeVisitorBook);
  backdrop?.addEventListener("click", closeVisitorBook);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeVisitorBook();
    }
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const initials = initialsInput?.value.trim().toUpperCase();

    if (!initials) {
      alert("Please enter your initials.");
      initialsInput?.focus();
      return;
    }

    if (initials.length > 3) {
      alert("Please use up to 3 initials.");
      initialsInput?.focus();
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.style.opacity = "0.5";
    }

    const { error } = await supabaseClient.from("visitor_book").insert({
      initials: initials,
      approved: true
    });

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.style.opacity = "";
    }
    if (error) {
      console.error("Visitor Book submission error:", error);
      alert("Something went wrong. Please try again.");
      return;
    }

    form.reset();
    closeVisitorBook();
    window.location.reload();
    return;
  });

  console.log("Visitor Book initialized successfully.");
});









