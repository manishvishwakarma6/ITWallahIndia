/**
 * IT WALLAH INDIA - DYNAMIC COMPONENT LOADER
 * Asynchronously loads Top Header (Announcement Bar), Navbar, and Footer into any HTML page.
 */

(function () {
    const components = [
        { id: "header-placeholder", file: "components/header.html" },
        { id: "navbar-placeholder", file: "components/navbar.html" },
        { id: "footer-placeholder", file: "components/footer.html" }
    ];

    async function loadComponent(item) {
        const placeholder = document.getElementById(item.id);
        if (!placeholder) return;

        try {
            const response = await fetch(item.file);
            if (response.ok) {
                const html = await response.text();
                placeholder.innerHTML = html;
            } else {
                console.warn(`Could not load ${item.file} via fetch (Status ${response.status}).`);
            }
        } catch (err) {
            console.warn(`Fetch error loading component ${item.file}:`, err);
        }
    }

    async function initAllComponents() {
        await Promise.all(components.map(loadComponent));

        // Re-initialize navbar interactive handlers after dynamic injection
        if (typeof window.initDynamicNavbar === "function") {
            window.initDynamicNavbar();
        }

        // Re-initialize copyright year & newsletter in footer
        const yearSpan = document.getElementById("currentYear");
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAllComponents);
    } else {
        initAllComponents();
    }
})();
