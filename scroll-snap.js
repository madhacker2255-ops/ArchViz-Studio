/* =========================================
   HERO → PROJECTS SNAP SCROLL
   Pure JS — no CSS scroll-snap.
   Uses window.scrollTo with smooth behaviour
   so it works independently of CSS smooth-scroll.
========================================= */

(function () {

    gsap.registerPlugin(ScrollToPlugin);
    const hero     = document.getElementById("Home");
    const projects = document.getElementById("Projects");
    if (!hero || !projects) return;

    // ── Scroll hint ──────────────────────────
    const hint = document.createElement("div");
    hint.className = "scroll-hint";
    hint.setAttribute("aria-hidden", "true");
    hint.innerHTML = `
        <span class="scroll-hint__label">Scroll</span>
        <svg class="scroll-hint__arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3v14M4 11l6 6 6-6"
                stroke="rgba(255,255,255,0.65)" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    hero.appendChild(hint);

    // ── State ────────────────────────────────
    let isSnapping  = false;
    let hasDoneSnap = false;
    let touchStartY = 0;

    function hideHint() {
        hint.classList.add("is-hidden");
    }

    // ── Snap to projects ─────────────────────
    function snapToProjects() {
        if (isSnapping) return;
        isSnapping = true;
        hasDoneSnap = true;
        hideHint();

        const target = projects.getBoundingClientRect().top + window.scrollY;
        gsap.to(window, { scrollTo: target, duration: 1.2, ease: "power3.inOut" });

        setTimeout(() => { isSnapping = false; }, 900);
    }

    // ── Is user at hero? ─────────────────────
    function atHero() {
        return window.scrollY < hero.offsetHeight * 0.5;
    }

    // ── Wheel ────────────────────────────────
    window.addEventListener("wheel", function (e) {
        if (!atHero() || hasDoneSnap) return;
        if (e.deltaY <= 0) return;
        e.preventDefault();
        snapToProjects();
    }, { passive: false });

    // ── Touch ────────────────────────────────
    window.addEventListener("touchstart", function (e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("touchend", function (e) {
        if (!atHero() || hasDoneSnap) return;
        const delta = touchStartY - e.changedTouches[0].clientY;
        if (delta > 40) snapToProjects();
    }, { passive: true });

    // ── Keyboard ─────────────────────────────
    document.addEventListener("keydown", function (e) {
        if (!atHero() || hasDoneSnap) return;
        if (e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") {
            e.preventDefault();
            snapToProjects();
        }
    });

    // ── Reset when back at top ───────────────
    window.addEventListener("scroll", function () {
        if (window.scrollY < 50) {
            hasDoneSnap = false;
            hint.classList.remove("is-hidden");
        }
    }, { passive: true });

})();
