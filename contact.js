/* =========================================
   CONTACT PAGE SCRIPT
   Form validation, Web3Forms submit,
   select has-value class, nav indicator
========================================= */

// =========================================
//  NAV — set Contact indicator on load
// =========================================
window.addEventListener("DOMContentLoaded", () => {
    const contactLink = document.querySelector('.nav-menu a[href="contact.html"]');
    if (contactLink && typeof gsap !== "undefined") {
        requestAnimationFrame(() => {
            const indicator = document.querySelector(".nav-indicator");
            if (!indicator) return;
            gsap.set(indicator, {
                x: contactLink.offsetLeft - 28,
                width: contactLink.offsetWidth,
            });
        });
    }
});

// =========================================
//  SELECT — colour flip when value chosen
// =========================================
const projectSelect = document.getElementById("cf-type");
if (projectSelect) {
    projectSelect.addEventListener("change", () => {
        projectSelect.classList.toggle("has-value", projectSelect.value !== "");
    });
}

// =========================================
//  FORM — validation & Web3Forms submit
// =========================================
const form       = document.getElementById("contactForm");
const submitBtn  = form ? form.querySelector(".ct-submit") : null;
const successBox = document.getElementById("ctSuccess");

// Inject error + shake styles once
const shakeStyle = document.createElement("style");
shakeStyle.textContent = `
    @keyframes ct-shake {
        0%,100% { transform: translateX(0); }
        20%      { transform: translateX(-6px); }
        40%      { transform: translateX(5px); }
        60%      { transform: translateX(-4px); }
        80%      { transform: translateX(3px); }
    }
    .ct-field--error input,
    .ct-field--error textarea,
    .ct-field--error select {
        border-color: #c0392b !important;
        background: rgba(192,57,43,0.04) !important;
        box-shadow: 0 0 0 3px rgba(192,57,43,0.10) !important;
    }
    .ct-field--error.ct-checkbox .ct-checkbox__box {
        border-color: #c0392b !important;
    }
`;
document.head.appendChild(shakeStyle);

if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Clear old error states
        form.querySelectorAll(".ct-field--error")
            .forEach(el => el.classList.remove("ct-field--error"));

        let valid = true;

        // Required text fields
        ["cf-name", "cf-email", "cf-message"].forEach(id => {
            const el = document.getElementById(id);
            if (!el || el.value.trim() === "") {
                el && el.closest(".ct-field")?.classList.add("ct-field--error");
                valid = false;
            }
        });

        // Email format
        const emailEl = document.getElementById("cf-email");
        if (emailEl && emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
            emailEl.closest(".ct-field")?.classList.add("ct-field--error");
            valid = false;
        }

        // Checkbox
        const agreeEl = document.getElementById("cf-agree");
        if (agreeEl && !agreeEl.checked) {
            agreeEl.closest(".ct-checkbox")?.classList.add("ct-field--error");
            valid = false;
        }

        if (!valid) {
            if (submitBtn) {
                submitBtn.style.animation = "none";
                void submitBtn.offsetWidth;
                submitBtn.style.animation = "ct-shake 0.35s ease";
            }
            const firstErr = form.querySelector(".ct-field--error input, .ct-field--error textarea");
            firstErr && firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        // All good — send via Web3Forms
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.7";
            submitBtn.querySelector("span").textContent = "Sending…";
        }

        const payload = {
            access_key:   "YOUR_WEB3FORMS_ACCESS_KEY", // ← replace with key from web3forms.com/create
            subject:      "New Project Enquiry — Archviz Studio",
            from_name:    "Archviz Studio Website",
            replyto:      document.getElementById("cf-email")?.value,
            name:         document.getElementById("cf-name")?.value,
            email:        document.getElementById("cf-email")?.value,
            phone:        document.getElementById("cf-phone")?.value || "—",
            company:      document.getElementById("cf-company")?.value || "—",
            project_type: document.getElementById("cf-type")?.value || "—",
            message:      document.getElementById("cf-message")?.value,
        };

        fetch("https://api.web3forms.com/submit", {
            method:  "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body:    JSON.stringify(payload),
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                // Hide form fields, show success
                form.querySelectorAll(
                    ".ct-form__row, .ct-field, .ct-checkbox, .ct-submit"
                ).forEach(el => (el.style.display = "none"));
                if (successBox) {
                    successBox.hidden = false;
                    successBox.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            } else {
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
                submitBtn.querySelector("span").textContent = "Failed — Try Again";
                submitBtn.style.animation = "none";
                void submitBtn.offsetWidth;
                submitBtn.style.animation = "ct-shake 0.35s ease";
            }
        })
        .catch(() => {
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
            submitBtn.querySelector("span").textContent = "Failed — Try Again";
        });
    });

    // Remove error state on input change
    form.querySelectorAll("input, textarea, select").forEach(el => {
        el.addEventListener("input", () => {
            el.closest(".ct-field, .ct-checkbox")?.classList.remove("ct-field--error");
        });
    });
}
