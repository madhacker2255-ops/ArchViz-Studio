/* =========================================
   ARCHVIZ STUDIO — SCROLL ANIMATIONS
   Uses GSAP + ScrollTrigger
   Drop after gsap.min.js on every page.
========================================= */

(function () {
    "use strict";

    // ── Bail early on reduced motion ─────────
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // ── Wait for GSAP + ScrollTrigger to load ─
    if (typeof gsap === "undefined") {
        console.warn("animations.js: GSAP not found");
        return;
    }

    // Load ScrollTrigger plugin via CDN if not already registered
    function initScrollTrigger() {
        if (!gsap.plugins || !gsap.plugins.scrollTrigger) {
            // ScrollTrigger loaded separately — register it
        }
        gsap.registerPlugin(ScrollTrigger);
        document.documentElement.classList.add("anim-ready");
        setupAnimations();
    }

    // ── Shared trigger defaults ───────────────
    const ST = {
        start: "top 88%",
        toggleActions: "play none none none",
    };

    // ── Easing palette ───────────────────────
    const ease   = "power3.out";
    const easeS  = "power2.out";

    // ── Helper: animate a group with stagger ─
    function fadeUp(selector, options = {}) {
        const els = document.querySelectorAll(selector);
        if (!els.length) return;

        gsap.to(els, {
            opacity: 1,
            y: 0,
            duration: options.duration ?? 0.75,
            stagger:  options.stagger  ?? 0.1,
            ease:     options.ease     ?? ease,
            scrollTrigger: {
                trigger: options.trigger ?? els[0],
                start:   options.start  ?? ST.start,
                toggleActions: ST.toggleActions,
            },
        });
    }

    function fadeLeft(selector, options = {}) {
        const els = document.querySelectorAll(selector);
        if (!els.length) return;

        gsap.to(els, {
            opacity: 1,
            x: 0,
            duration: options.duration ?? 0.7,
            stagger:  options.stagger  ?? 0.1,
            ease:     options.ease     ?? ease,
            scrollTrigger: {
                trigger: options.trigger ?? els[0],
                start:   options.start  ?? ST.start,
                toggleActions: ST.toggleActions,
            },
        });
    }

    function fadeRight(selector, options = {}) {
        const els = document.querySelectorAll(selector);
        if (!els.length) return;

        gsap.to(els, {
            opacity: 1,
            x: 0,
            duration: options.duration ?? 0.7,
            stagger:  options.stagger  ?? 0.12,
            ease:     options.ease     ?? ease,
            scrollTrigger: {
                trigger: options.trigger ?? els[0],
                start:   options.start  ?? ST.start,
                toggleActions: ST.toggleActions,
            },
        });
    }

    function scaleUp(selector, options = {}) {
        const els = document.querySelectorAll(selector);
        if (!els.length) return;

        gsap.to(els, {
            opacity: 1,
            scale:    1,
            duration: options.duration ?? 0.65,
            stagger:  options.stagger  ?? 0.08,
            ease:     options.ease     ?? "back.out(1.4)",
            scrollTrigger: {
                trigger: options.trigger ?? els[0],
                start:   options.start  ?? ST.start,
                toggleActions: ST.toggleActions,
            },
        });
    }

    // =========================================
    function setupAnimations() {

        // Hero parallax removed

        // ── SECTION HEADINGS ──────────────────
        // Each section's heading clips up and the accent line grows
        document.querySelectorAll(
            ".proj-heading-light, .proj-heading-bold, " +
            ".about-heading__light, .about-heading__bold, " +
            ".ct-hero__title, .pd-title, " +
            ".ct-panel-title, .pd-card-title, " +
            ".about-skills-title, .about-process-title, " +
            ".cta-title"
        ).forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 32 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease,
                    scrollTrigger: {
                        trigger: el,
                        start: "top 90%",
                        toggleActions: ST.toggleActions,
                    },
                }
            );
        });

        // Accent lines grow from left
        document.querySelectorAll(".proj-heading-line, .about-heading-line").forEach(el => {
            gsap.to(el, {
                scaleX: 1,
                duration: 0.7,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: ST.toggleActions,
                },
            });
        });

        // Eyebrows, descriptions
        document.querySelectorAll(
            ".proj-heading-desc, .about-heading-desc, " +
            ".ct-hero__eyebrow, .ct-hero__desc, .ct-hero__badge, " +
            ".about-skills-eyebrow, .pd-back, .pd-meta, .pd-hero__desc, " +
            ".cta-eyebrow"
        ).forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.65,
                    ease: easeS,
                    scrollTrigger: {
                        trigger: el,
                        start: "top 91%",
                        toggleActions: ST.toggleActions,
                    },
                }
            );
        });

        // ── FILTER PILLS ──────────────────────
        const filtersEl = document.querySelector(".proj-filters");
        if (filtersEl) {
            gsap.fromTo(filtersEl,
                { opacity: 0, y: 16 },
                {
                    opacity: 1, y: 0,
                    duration: 0.6,
                    ease: easeS,
                    scrollTrigger: { trigger: filtersEl, start: "top 90%", toggleActions: ST.toggleActions },
                }
            );
        }

        // ── PROJECT CARDS ─────────────────────
        const featuredCard = document.querySelector(".proj-card--featured");
        if (featuredCard) {
            gsap.to(featuredCard, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease,
                scrollTrigger: {
                    trigger: featuredCard,
                    start: "top 88%",
                    toggleActions: ST.toggleActions,
                },
            });
        }

        const gridCards = document.querySelectorAll(".proj-card--grid");
        if (gridCards.length) {
            gsap.to(gridCards, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: { amount: 0.35, from: "start" },
                ease,
                scrollTrigger: {
                    trigger: ".proj-grid",
                    start: "top 88%",
                    toggleActions: ST.toggleActions,
                },
            });
        }

        // ── ABOUT — BIO CARD ──────────────────
        const bioCard = document.querySelector(".about-bio-card");
        if (bioCard) {
            gsap.to(bioCard, {
                opacity: 1, y: 0,
                duration: 0.85,
                ease,
                scrollTrigger: { trigger: bioCard, start: "top 86%", toggleActions: ST.toggleActions },
            });
        }

        // Stats count up
        document.querySelectorAll(".about-stat").forEach((el, i) => {
            gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: i * 0.08,
                ease,
                scrollTrigger: {
                    trigger: ".about-stats",
                    start: "top 88%",
                    toggleActions: ST.toggleActions,
                },
            });
        });

        // Animate the number itself counting up
        document.querySelectorAll(".about-stat strong").forEach(el => {
            const raw = el.textContent.trim(); // e.g. "120+"
            const num = parseInt(raw);
            if (isNaN(num)) return;
            const suffix = raw.replace(String(num), "");

            ScrollTrigger.create({
                trigger: el,
                start: "top 90%",
                onEnter: () => {
                    gsap.fromTo({ val: 0 },
                        { val: 0 },
                        {
                            val: num,
                            duration: 1.4,
                            ease: "power2.out",
                            onUpdate: function () {
                                el.textContent = Math.round(this.targets()[0].val) + suffix;
                            },
                        }
                    );
                },
                once: true,
            });
        });

        // ── ABOUT — SKILLS CARD ───────────────
        const skillsCard = document.querySelector(".about-skills-card");
        if (skillsCard) {
            gsap.to(skillsCard, {
                opacity: 1, y: 0,
                duration: 0.85,
                ease,
                scrollTrigger: { trigger: skillsCard, start: "top 86%", toggleActions: ST.toggleActions },
            });
        }

        // Skill bars fill to their percentage
        document.querySelectorAll(".about-bar__fill").forEach(bar => {
            const pct = getComputedStyle(bar).getPropertyValue("--pct").trim() || "0%";
            ScrollTrigger.create({
                trigger: bar,
                start: "top 90%",
                onEnter: () => {
                    gsap.to(bar, {
                        width: pct,
                        duration: 1.1,
                        ease: "power3.out",
                    });
                },
                once: true,
            });
        });

        // Tool icons pop in
        const tools = document.querySelectorAll(".about-tool");
        if (tools.length) {
            gsap.to(tools, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.55,
                stagger: { amount: 0.5, grid: "auto", from: "start" },
                ease: "back.out(1.6)",
                scrollTrigger: {
                    trigger: ".about-tools",
                    start: "top 88%",
                    toggleActions: ST.toggleActions,
                },
            });
        }

        // ── ABOUT — PROCESS CARD ──────────────
        const processCard = document.querySelector(".about-process-card");
        if (processCard) {
            gsap.to(processCard, {
                opacity: 1, y: 0,
                duration: 0.8,
                ease,
                scrollTrigger: { trigger: processCard, start: "top 86%", toggleActions: ST.toggleActions },
            });
        }

        const processSteps = document.querySelectorAll(".about-process-step");
        if (processSteps.length) {
            gsap.to(processSteps, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease,
                scrollTrigger: {
                    trigger: ".about-process-steps",
                    start: "top 88%",
                    toggleActions: ST.toggleActions,
                },
            });
        }

        // ── PROJECT DETAIL — OVERVIEW ─────────
        const overviewCard = document.querySelector(".pd-overview__card");
        if (overviewCard) {
            gsap.to(overviewCard, {
                opacity: 1, y: 0, duration: 0.8, ease,
                scrollTrigger: { trigger: overviewCard, start: "top 88%", toggleActions: ST.toggleActions },
            });
        }

        const detailsCard = document.querySelector(".pd-details__card");
        if (detailsCard) {
            gsap.to(detailsCard, {
                opacity: 1, y: 0, duration: 0.8, delay: 0.12, ease,
                scrollTrigger: { trigger: detailsCard, start: "top 88%", toggleActions: ST.toggleActions },
            });
        }

        // Feature icons inside overview
        document.querySelectorAll(".pd-feature").forEach((el, i) => {
            gsap.fromTo(el,
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0,
                    duration: 0.55,
                    delay: i * 0.09,
                    ease,
                    scrollTrigger: { trigger: ".pd-feature-grid", start: "top 88%", toggleActions: ST.toggleActions },
                }
            );
        });

        // ── PROJECT DETAIL — GALLERY ──────────
        const galleryItems = document.querySelectorAll(".pd-gallery__item");
        if (galleryItems.length) {
            gsap.to(galleryItems, {
                opacity: 1,
                scale: 1,
                duration: 0.65,
                stagger: { amount: 0.45, from: "start" },
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".pd-gallery__grid",
                    start: "top 88%",
                    toggleActions: ST.toggleActions,
                },
            });
        }

        // ── PROJECT DETAIL — PROCESS STEPS ───
        const pdProcessSteps = document.querySelectorAll(".pd-process__step");
        if (pdProcessSteps.length) {
            gsap.to(pdProcessSteps, {
                opacity: 1, y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease,
                scrollTrigger: {
                    trigger: ".pd-process__steps",
                    start: "top 88%",
                    toggleActions: ST.toggleActions,
                },
            });
        }

        // ── PROJECT DETAIL — TECH HIGHLIGHTS ─
        const techItems = document.querySelectorAll(".pd-tech__item");
        if (techItems.length) {
            gsap.to(techItems, {
                opacity: 1, y: 0,
                duration: 0.55,
                stagger: 0.08,
                ease: "back.out(1.3)",
                scrollTrigger: {
                    trigger: ".pd-tech__grid",
                    start: "top 88%",
                    toggleActions: ST.toggleActions,
                },
            });
        }

        // ── PROJECT DETAIL — BEFORE/AFTER ────
        const compareEl = document.querySelector(".pd-compare");
        if (compareEl) {
            gsap.fromTo(compareEl,
                { opacity: 0, scale: 0.96 },
                {
                    opacity: 1, scale: 1,
                    duration: 0.75,
                    ease,
                    scrollTrigger: { trigger: compareEl, start: "top 88%", toggleActions: ST.toggleActions },
                }
            );
        }

        // ── PROJECT NAV ───────────────────────
        const projNav = document.querySelector(".pd-projnav");
        if (projNav) {
            gsap.to(projNav, {
                opacity: 1, y: 0,
                duration: 0.7,
                ease,
                scrollTrigger: { trigger: projNav, start: "top 90%", toggleActions: ST.toggleActions },
            });
        }

        // ── CONTACT BODY CARD ─────────────────
        const ctBody = document.querySelector(".ct-body");
        if (ctBody) {
            gsap.to(ctBody, {
                opacity: 1, y: 0,
                duration: 0.9,
                ease,
                scrollTrigger: { trigger: ctBody, start: "top 86%", toggleActions: ST.toggleActions },
            });
        }

        // Contact channel rows slide in from right
        const channels = document.querySelectorAll(".ct-channel");
        if (channels.length) {
            gsap.to(channels, {
                opacity: 1, x: 0,
                duration: 0.55,
                stagger: 0.08,
                ease,
                scrollTrigger: {
                    trigger: ".ct-channels",
                    start: "top 88%",
                    toggleActions: ST.toggleActions,
                },
            });
        }

        // Social icons pop in
        const socials = document.querySelectorAll(".ct-social");
        if (socials.length) {
            gsap.to(socials, {
                opacity: 1, scale: 1,
                duration: 0.5,
                stagger: 0.06,
                ease: "back.out(1.8)",
                scrollTrigger: {
                    trigger: ".ct-socials",
                    start: "top 92%",
                    toggleActions: ST.toggleActions,
                },
            });
        }

        // ── CTA BANNER ────────────────────────
        const ctaBanner = document.querySelector(".cta-banner");
        if (ctaBanner) {
            gsap.to(ctaBanner, {
                opacity: 1, y: 0,
                duration: 0.85,
                ease,
                scrollTrigger: { trigger: ctaBanner, start: "top 88%", toggleActions: ST.toggleActions },
            });

            // Blueprint SVG paths draw in
            const bpPaths = ctaBanner.querySelectorAll("line, rect, circle");
            bpPaths.forEach((path, i) => {
                const len = path.getTotalLength ? path.getTotalLength() : 60;
                gsap.fromTo(path,
                    { strokeDasharray: len, strokeDashoffset: len, opacity: 0 },
                    {
                        strokeDashoffset: 0,
                        opacity: 1,
                        duration: 0.6,
                        delay: 0.3 + i * 0.03,
                        ease: "power2.inOut",
                        scrollTrigger: { trigger: ctaBanner, start: "top 85%", toggleActions: ST.toggleActions },
                    }
                );
            });
        }

        // ── FOOTER ────────────────────────────
        const footer = document.querySelector(".site-footer");
        if (footer) {
            gsap.to(footer, {
                opacity: 1, y: 0,
                duration: 0.65,
                ease: easeS,
                scrollTrigger: { trigger: footer, start: "top 95%", toggleActions: ST.toggleActions },
            });
        }

        // ── GENERIC DATA-ANIM ATTRIBUTES ──────
        // Allow any element to opt-in via data-anim="fade-up" etc.
        document.querySelectorAll("[data-anim='fade-up']").forEach(el => {
            gsap.fromTo(el, { opacity: 0, y: 40 }, {
                opacity: 1, y: 0, duration: 0.75, ease,
                scrollTrigger: { trigger: el, start: "top 90%", toggleActions: ST.toggleActions },
            });
        });
        document.querySelectorAll("[data-anim='fade-left']").forEach(el => {
            gsap.fromTo(el, { opacity: 0, x: 40 }, {
                opacity: 1, x: 0, duration: 0.7, ease,
                scrollTrigger: { trigger: el, start: "top 90%", toggleActions: ST.toggleActions },
            });
        });
        document.querySelectorAll("[data-anim='fade-right']").forEach(el => {
            gsap.fromTo(el, { opacity: 0, x: -40 }, {
                opacity: 1, x: 0, duration: 0.7, ease,
                scrollTrigger: { trigger: el, start: "top 90%", toggleActions: ST.toggleActions },
            });
        });
        document.querySelectorAll("[data-anim='scale-up']").forEach(el => {
            gsap.fromTo(el, { opacity: 0, scale: 0.88 }, {
                opacity: 1, scale: 1, duration: 0.65, ease: "back.out(1.4)",
                scrollTrigger: { trigger: el, start: "top 90%", toggleActions: ST.toggleActions },
            });
        });

    } // end setupAnimations

    // ── Boot ──────────────────────────────────
    // ScrollTrigger script loads after this file;
    // we defer init until the DOM + scripts are ready.
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initScrollTrigger);
    } else {
        initScrollTrigger();
    }

})();
