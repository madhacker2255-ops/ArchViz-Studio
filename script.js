/* =========================================
   ARCHVIZ STUDIO — MAIN SCRIPT
   Handles: nav indicator, scroll-spy,
            mobile hamburger, scroll lock
========================================= */

// ── Elements ──────────────────────────────

const sections   = document.querySelectorAll("section[id]");
const navLinks   = document.querySelectorAll(".nav-menu a");
const indicator  = document.querySelector(".nav-indicator");
const navMenu    = document.querySelector(".nav-menu");
const hamburger  = document.querySelector(".nav-hamburger");
const overlay    = document.querySelector(".nav-overlay");

// ── Utility: is desktop layout? ──────────

function isDesktop() {
    return window.innerWidth > 768;
}

// =========================================
//  NAV INDICATOR (desktop only)
// =========================================

function moveIndicator(target) {
    if (!isDesktop() || !indicator || !navMenu) return;

    gsap.to(indicator, {
        x: target.offsetLeft - 28,
        width: target.offsetWidth,
        duration: 0.8,
        ease: "power4.inOut"
    });
}

// Set initial indicator on page load
const homeLink = document.querySelector('.nav-menu a[href="#Home"]');
if (homeLink) {
    // Small delay so layout is settled
    requestAnimationFrame(() => moveIndicator(homeLink));
}

// =========================================
//  SCROLL SPY
// =========================================

function updateActiveLink() {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 140;
        if (window.scrollY >= sectionTop) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
            if (isDesktop()) moveIndicator(link);
        }
    });
}

window.addEventListener("scroll", updateActiveLink, { passive: true });

// =========================================
//  NAV LIGHT/DARK STATE
//  Flips nav text from white -> navy once the
//  user scrolls past the dark hero section, so
//  it stays readable over light backgrounds.
// =========================================

(function initNavScrollState() {
    const darkHero = document.querySelector(".hero, .pd-hero");

    // Fallback threshold if no hero section exists on this page
    const fallbackThreshold = 120;

    function getThreshold() {
        if (!darkHero) return fallbackThreshold;
        const rect = darkHero.getBoundingClientRect();
        // Switch once the hero's bottom edge nears the fixed nav bar
        return rect.bottom + window.scrollY - 90;
    }

    let threshold = getThreshold();

    function updateNavState() {
        const shouldBeScrolled = window.scrollY > threshold;
        document.body.classList.toggle("nav-scrolled", shouldBeScrolled);
    }

    window.addEventListener("scroll", updateNavState, { passive: true });
    window.addEventListener("resize", () => {
        threshold = getThreshold();
        updateNavState();
    });

    // Run once on load (handles page-refresh mid-scroll, and pages with no hero)
    updateNavState();
})();

// =========================================
//  MOBILE — HAMBURGER MENU
// =========================================

function openMenu() {
    navMenu.classList.add("is-open");
    overlay.classList.add("is-visible");
    overlay.style.display = "block";
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden"; // lock scroll
}

function closeMenu() {
    navMenu.classList.remove("is-open");
    overlay.classList.remove("is-visible");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";

    // Wait for transition before hiding overlay
    setTimeout(() => {
        if (!navMenu.classList.contains("is-open")) {
            overlay.style.display = "none";
        }
    }, 300);
}

function toggleMenu() {
    const isOpen = navMenu.classList.contains("is-open");
    isOpen ? closeMenu() : openMenu();
}

if (hamburger) {
    hamburger.addEventListener("click", toggleMenu);
}

// Close when tapping the overlay
if (overlay) {
    overlay.addEventListener("click", closeMenu);
}

// Close when a nav link is clicked (mobile)
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        if (!isDesktop()) closeMenu();
    });
});

// Close menu on Escape key
document.addEventListener("keydown", e => {
    if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
        closeMenu();
        hamburger.focus();
    }
});

// =========================================
//  PROJECT FILTERS
// =========================================

const filterBtns = document.querySelectorAll(".proj-filter");
const projCards  = document.querySelectorAll(".proj-card");

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        // Update button states
        filterBtns.forEach(b => {
            b.classList.remove("active");
            b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");

        // Show/hide cards
        projCards.forEach(card => {
            const category = card.dataset.category;
            const show = filter === "all" || category === filter;

            if (show) {
                card.removeAttribute("aria-hidden");
                card.style.display = "";
            } else {
                card.setAttribute("aria-hidden", "true");
                card.style.display = "none";
            }
        });
    });
});

// =========================================
//  RESIZE — clean up mobile state on resize
// =========================================

let resizeTimer;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (isDesktop()) {
            // Ensure menu is reset to desktop state
            closeMenu();
            overlay.style.display = "none";
            document.body.style.overflow = "";
            // Re-sync indicator to active link
            const active = document.querySelector(".nav-menu a.active") || homeLink;
            if (active) moveIndicator(active);
        }
    }, 150);
});

// =========================================
//  HERO ENTRANCE ANIMATIONS
// =========================================

window.addEventListener("DOMContentLoaded", () => {
    // Respect user's motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tl = gsap.timeline({ delay: 0.1 });

    tl.from(".hero > img", {
        scale: 1.06,
        duration: 1.6,
        ease: "power3.out"
    })
    .from(".hero-title span", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=1.0")
    .from(".hero-title strong", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.55")
    .from([".hero-line", ".hero-subtitle"], {
        y: 16,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out"
    }, "-=0.4")
    .from(".location-note", {
        x: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out"
    }, "-=0.5")
    .from(".glass-box", {
        y: 16,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out"
    }, "-=0.5")
    .from(".social-links a", {
        y: 10,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out"
    }, "-=0.4");
});
