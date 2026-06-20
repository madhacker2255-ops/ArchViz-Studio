/* =========================================
   PROJECT DETAIL PAGE — SCRIPT
   Handles: loader sequence, before/after slider
========================================= */

// =========================================
//  LOADER SEQUENCE
// =========================================

(function initLoader() {
    const loader   = document.getElementById("loader");
    const barFill  = document.querySelector(".loader__bar-fill");
    const pctLabel = document.querySelector(".loader__pct");
    const body     = document.body;
    const content  = document.getElementById("site-content");

    if (!loader) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
        // Skip the show — reveal immediately
        loader.style.display = "none";
        body.classList.remove("is-loading");
        content.classList.add("is-revealed");
        return;
    }

    // Animate a believable, slightly uneven progress fill
    let progress = 0;
    const target = 100;
    const duration = 1500; // ms, matches letter stagger + buffer
    const startTime = performance.now();

    function tick(now) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);

        // Ease-out cubic for a natural "settling" feel
        const eased = 1 - Math.pow(1 - t, 3);
        progress = Math.round(eased * target);

        if (barFill)  barFill.style.width = progress + "%";
        if (pctLabel) pctLabel.textContent = progress + "%";

        if (t < 1) {
            requestAnimationFrame(tick);
        } else {
            finishLoading();
        }
    }

    requestAnimationFrame(tick);

    function finishLoading() {
        // Brief hold at 100% before exit
        setTimeout(() => {
            loader.classList.add("is-done");
            body.classList.remove("is-loading");
            content.classList.add("is-revealed");

            // Remove loader from DOM after its exit transition completes
            setTimeout(() => {
                loader.style.display = "none";
            }, 800);
        }, 280);
    }
})();

// =========================================
//  BEFORE / AFTER COMPARISON SLIDER
// =========================================

(function initCompareSlider() {
    const compare = document.getElementById("pdCompare");
    const before  = document.getElementById("pdCompareBefore");
    const handle  = document.getElementById("pdCompareHandle");

    if (!compare || !before || !handle) return;

    let isDragging = false;

    function setPosition(percent) {
        const clamped = Math.max(0, Math.min(100, percent));
        before.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
        handle.style.left = clamped + "%";
        handle.setAttribute("aria-valuenow", Math.round(clamped));
    }

    function getPercentFromEvent(clientX) {
        const rect = compare.getBoundingClientRect();
        const x = clientX - rect.left;
        return (x / rect.width) * 100;
    }

    function onMove(clientX) {
        setPosition(getPercentFromEvent(clientX));
    }

    // Mouse events
    handle.addEventListener("mousedown", () => { isDragging = true; });
    compare.addEventListener("mousedown", (e) => {
        isDragging = true;
        onMove(e.clientX);
    });
    window.addEventListener("mousemove", (e) => {
        if (isDragging) onMove(e.clientX);
    });
    window.addEventListener("mouseup", () => { isDragging = false; });

    // Touch events
    handle.addEventListener("touchstart", () => { isDragging = true; }, { passive: true });
    compare.addEventListener("touchstart", (e) => {
        isDragging = true;
        onMove(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener("touchmove", (e) => {
        if (isDragging && e.touches[0]) onMove(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener("touchend", () => { isDragging = false; });

    // Keyboard accessibility
    handle.addEventListener("keydown", (e) => {
        const current = parseFloat(handle.style.left) || 50;
        if (e.key === "ArrowLeft")  { setPosition(current - 5); e.preventDefault(); }
        if (e.key === "ArrowRight") { setPosition(current + 5); e.preventDefault(); }
    });

    // Initialize at 50%
    setPosition(50);
})();
