/* =========================================
   PROJECT DETAIL PAGE SCRIPT
   Drives the page loader: tracks real image
   load progress, animates the bar to 100%,
   then slides the loader out and reveals
   the page content.
========================================= */

(function () {

    // ── Loader elements ──────────────────────
    const loader  = document.getElementById("loader");
    const barFill = document.querySelector(".loader__bar-fill");
    const pctEl   = document.querySelector(".loader__pct");
    const letters = document.querySelectorAll(".loader__letter");

    if (!loader) return;   // safety — if no loader on page, bail

    // ── Collect images to track ───────────────
    // Only track images that are in the viewport-critical areas (hero + gallery).
    // Logo / UI icons are excluded so they don't skew progress.
    const trackedImgs = Array.from(
        document.querySelectorAll(".pd-hero img, .pd-gallery img, .pd-process img")
    );

    // ── State ────────────────────────────────
    let loadedCount  = 0;
    let displayPct   = 0;      // currently shown percentage (animated)
    let targetPct    = 5;      // where we're animating toward
    let rafId        = null;
    let loaderDone   = false;

    // ── Animate displayed percentage ──────────
    function tickCounter() {
        if (displayPct < targetPct) {
            displayPct = Math.min(displayPct + 1, targetPct);
            if (barFill) barFill.style.width = displayPct + "%";
            if (pctEl)   pctEl.textContent   = displayPct + "%";
        }
        if (displayPct < 100 || targetPct < 100) {
            rafId = requestAnimationFrame(tickCounter);
        } else {
            // Reached 100% — kick off exit sequence
            cancelAnimationFrame(rafId);
            finishLoader();
        }
    }

    // ── Per-image callback ───────────────────
    function onImageLoad() {
        if (loaderDone) return;
        loadedCount++;
        const total = trackedImgs.length || 1;
        // Reserve 0-90% for real image load; 90-100% filled in finishLoader
        targetPct = Math.min(90, Math.round((loadedCount / total) * 90));
    }

    // ── Letter animation (stagger in) ─────────
    function animateLetters() {
        if (!letters.length) return;
        letters.forEach((l, i) => {
            setTimeout(() => {
                l.style.transition = "opacity 0.35s ease, transform 0.35s ease";
                l.style.opacity    = "1";
                l.style.transform  = "translateY(0)";
            }, i * 42);
        });
    }

    // ── Loader exit ──────────────────────────
    function finishLoader() {
        if (loaderDone) return;
        loaderDone = true;

        // Brief pause at 100% before sliding out
        setTimeout(() => {
            loader.style.transition = "opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.65s cubic-bezier(0.4,0,0.2,1)";
            loader.style.opacity    = "0";
            loader.style.transform  = "translateY(-8px)";

            setTimeout(() => {
                loader.style.display = "none";
                loader.setAttribute("aria-hidden", "true");
                document.body.classList.remove("is-loading");
                document.getElementById("site-content")?.classList.add("is-revealed");

                // Trigger page entrance if GSAP is available
                if (typeof gsap !== "undefined") {
                    triggerEntrance();
                }
            }, 680);
        }, 260);
    }

    // ── Page entrance animation ───────────────
    function triggerEntrance() {
        const tl = gsap.timeline();

        // Hero image
        tl.from(".pd-hero img", {
            scale: 1.05, opacity: 0, duration: 1.1, ease: "power3.out"
        }, 0)
        // Back link + meta
        .from([".pd-back", ".pd-meta"], {
            y: 18, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out"
        }, 0.2)
        // Title
        .from(".pd-title", {
            y: 28, opacity: 0, duration: 0.8, ease: "power3.out"
        }, 0.3)
        // Description
        .from(".pd-hero__desc", {
            y: 16, opacity: 0, duration: 0.7, ease: "power3.out"
        }, 0.5);
    }

    // ── Bootstrap ────────────────────────────

    // Set initial letter styles (hidden, ready to animate in)
    letters.forEach(l => {
        l.style.opacity   = "0";
        l.style.transform = "translateY(10px)";
    });

    // Start counter tick immediately
    rafId = requestAnimationFrame(tickCounter);

    // Animate letters in after a beat
    setTimeout(animateLetters, 120);

    // Watch each tracked image
    if (trackedImgs.length === 0) {
        // No images to track — just run a timed progress
        const fakeTimer = setInterval(() => {
            targetPct = Math.min(targetPct + 12, 90);
            if (targetPct >= 90) clearInterval(fakeTimer);
        }, 120);
    } else {
        trackedImgs.forEach(img => {
            if (img.complete && img.naturalWidth > 0) {
                // Already cached/loaded
                onImageLoad();
            } else {
                img.addEventListener("load",  onImageLoad, { once: true });
                img.addEventListener("error", onImageLoad, { once: true }); // count errors too
            }
        });
    }

    // Hard cap: no matter what, finish loading after 4 seconds
    // (handles broken images, slow networks, blocked assets)
    const hardCapTimer = setTimeout(() => {
        targetPct = 100;
    }, 4000);

    // window.load fills bar to 100% naturally once everything is done
    window.addEventListener("load", () => {
        clearTimeout(hardCapTimer);
        targetPct = 100;
    });

})();
