const nav = document.getElementById("nav");
const burger = document.getElementById("navBurger");
const navLinks = document.getElementById("navLinks");
const yearEl = document.getElementById("year");
if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
}
function initStickyNav() {
    if (!nav)
        return;
    const onScroll = () => {
        nav.classList.toggle("is-scrolled", window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
}
function initMobileMenu() {
    if (!burger || !navLinks)
        return;
    const closeMenu = () => {
        navLinks.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
    };
    burger.addEventListener("click", () => {
        const open = navLinks.classList.toggle("is-open");
        burger.classList.toggle("is-open", open);
        burger.setAttribute("aria-expanded", String(open));
    });
    navLinks
        .querySelectorAll("a")
        .forEach((link) => link.addEventListener("click", closeMenu));
}
function reveal(selector, options) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, options);
    document.querySelectorAll(selector).forEach((el, index) => {
        if (selector === ".reveal") {
            el.style.transitionDelay = `${(index % 4) * 80}ms`;
        }
        observer.observe(el);
    });
}
function initCardGlow() {
    document.querySelectorAll(".project").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
            card.style.setProperty("--my", `${event.clientY - rect.top}px`);
        });
    });
}
function initContactForm() {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("contactStatus");
    const submit = document.getElementById("contactSubmit");
    if (!form || !status || !submit)
        return;
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        status.className = "contact__status";
        status.textContent = "Sending…";
        submit.disabled = true;
        try {
            const response = await fetch(form.action, {
                method: "POST",
                headers: { Accept: "application/json" },
                body: new FormData(form),
            });
            const result = await response.json();
            if (response.ok && result.success) {
                status.textContent = "Thanks! Your message has been sent — I'll reply soon.";
                status.classList.add("is-ok");
                form.reset();
            }
            else {
                status.textContent = result.message ?? "Something went wrong. Please try again.";
                status.classList.add("is-error");
            }
        }
        catch {
            status.textContent = "Network error. Please try again later.";
            status.classList.add("is-error");
        }
        finally {
            submit.disabled = false;
        }
    });
}
initStickyNav();
initMobileMenu();
reveal(".reveal", { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
reveal(".skill-bar", { threshold: 0.4 });
initCardGlow();
initContactForm();
