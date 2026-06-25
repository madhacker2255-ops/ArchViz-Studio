/* =========================================
   ARCHVIZ STUDIO — MAIN SCRIPT
   Handles: nav indicator, scroll-spy,
            mobile hamburger, scroll lock
========================================= */

// Prevent browser restoring last scroll position on load
history.scrollRestoration = "manual";
window.scrollTo(0, 0);

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

// ── Nav indicator — liquid stretch animation ──
// Measures link position relative to nav pill,
// uses a two-stage ease: fast stretch then snap.

function getIndicatorTarget(link) {
    const navRect  = navMenu.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    return {
        left:  linkRect.left - navRect.left,
        width: linkRect.width,
    };
}

function moveIndicator(target, instant) {
    if (!isDesktop() || !indicator || !navMenu) return;

    const { left, width } = getIndicatorTarget(target);

    if (instant) {
        // First paint — no animation, just place it
        gsap.set(indicator, { x: left, width });
        return;
    }

    // Stage 1: stretch leading edge toward target fast
    // Stage 2: trailing edge catches up with elastic snap
    const currentX = gsap.getProperty(indicator, "x");
    const currentW = gsap.getProperty(indicator, "width");
    const movingRight = left > currentX;

    if (movingRight) {
        // Stretch right edge first, then pull left edge
        gsap.to(indicator, {
            width: (left - currentX) + width,
            duration: 0.3,
            ease: "power3.out",
        });
        gsap.to(indicator, {
            x: left,
            width,
            duration: 0.5,
            ease: "power4.out",
            delay: 0.18,
        });
    } else {
        // Stretch left edge first, then pull right edge
        gsap.to(indicator, {
            x: left,
            width: currentX + currentW - left,
            duration: 0.3,
            ease: "power3.out",
        });
        gsap.to(indicator, {
            width,
            duration: 0.5,
            ease: "power4.out",
            delay: 0.18,
        });
    }
}

// ── Init indicator on load ───────────────
// Works with both href="#Home" and href="hero.html#Home"
function getActiveLink() {
    return document.querySelector(".nav-menu a.active")
        || document.querySelector(".nav-menu a");
}

function initIndicator() {
    if (!isDesktop()) return;
    const active = getActiveLink();
    if (active) moveIndicator(active, true);
}

// Run after full paint so layout is settled
if (document.readyState === "complete") {
    requestAnimationFrame(initIndicator);
} else {
    window.addEventListener("load", () => requestAnimationFrame(initIndicator));
}

// Re-sync on resize
window.addEventListener("resize", () => {
    const active = getActiveLink();
    if (active && isDesktop()) moveIndicator(active, true);
});

// =========================================
//  SCROLL SPY
// =========================================

function setActiveLink(id) {
    navLinks.forEach(link => {
        const href = link.getAttribute("href") || "";
        const hash = href.includes("#") ? href.split("#")[1] : "";
        link.classList.remove("active");
        if (hash === id) {
            link.classList.add("active");
            if (isDesktop()) moveIndicator(link);
        }
    });
}

// IntersectionObserver — fires only when section crosses 50% of viewport.
// No per-pixel scroll events, no jitter.
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
        }
    });
}, {
    // Fire when section top enters the middle band of the viewport.
    // rootMargin clips the viewport to a narrow horizontal strip
    // at 40% from top — so indicator only switches when a section
    // top crosses that line, not on every pixel.
    rootMargin: "-40% 0px -55% 0px",
    threshold: 0,
});

sections.forEach(section => sectionObserver.observe(section));

// Set correct active on load without waiting for scroll
window.addEventListener("load", () => {
    // Find which section is most visible right now
    let best = null, bestRatio = 0;
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const ratio = visible / section.offsetHeight;
        if (ratio > bestRatio) { bestRatio = ratio; best = section; }
    });
    if (best) setActiveLink(best.id);
});

// =========================================
// =========================================

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
            const active = document.querySelector(".nav-menu a.active") || document.querySelector(".nav-menu a");
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

    // Hero image scale-in (safe on all breakpoints — no position conflict)
    tl.from(".hero > img", {
        scale: 1.06,
        duration: 1.6,
        ease: "power3.out"
    });

    // On desktop: animate title from translateY since the CSS positions
    // it with top+transform. On mobile: title is bottom-anchored with
    // transform:none so we just fade it in — no y shift needed.
    if (window.innerWidth > 768) {
        tl.from(".hero-title span", {
            y: 30, opacity: 0, duration: 0.8, ease: "power3.out"
        }, "-=1.0")
        .from(".hero-title strong", {
            y: 30, opacity: 0, duration: 0.8, ease: "power3.out"
        }, "-=0.55");
    } else {
        tl.from(".hero-title", {
            opacity: 0, duration: 0.7, ease: "power3.out"
        }, "-=1.0");
    }

    tl.from([".hero-line", ".hero-subtitle"], {
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


// =========================================
//  NAV INDICATOR — hover preview
//  Glides to hovered link, returns to active
//  on mouse-leave. Feels magnetic/premium.
// =========================================

(function () {
    const links = document.querySelectorAll(".nav-menu a");

    links.forEach(link => {
        link.addEventListener("mouseenter", () => {
            if (!isDesktop()) return;
            moveIndicator(link);
        });
    });

    document.querySelector(".nav-menu")?.addEventListener("mouseleave", () => {
        if (!isDesktop()) return;
        const active = document.querySelector(".nav-menu a.active");
        if (active) moveIndicator(active);
    });
})();
