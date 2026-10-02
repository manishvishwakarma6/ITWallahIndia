/**
 * IT WALLAH INDIA - NAVBAR & TOP HEADER DYNAMIC LOGIC
 */

window.initDynamicNavbar = function () {
    // --------------------------------------------------------------------------
    // 1. DYNAMIC TOP HEADER ANNOUNCEMENT SLIDER
    // --------------------------------------------------------------------------
    const track = document.getElementById("header-track");
    if (track && !track.dataset.sliderInitialized) {
        track.dataset.sliderInitialized = "true";
        const originalSlide = track.querySelector(".slide");
        let exactSlideWidth = 0;
        let position = 0;
        let baseSpeed = window.innerWidth < 480 ? 0.75 : 1.1;
        let currentSpeed = baseSpeed;
        let isPaused = false;

        function initSlider() {
            if (originalSlide) {
                exactSlideWidth = originalSlide.getBoundingClientRect().width;
                if (exactSlideWidth === 0) exactSlideWidth = window.innerWidth;
            }
        }

        initSlider();

        function animateSlider() {
            if (!isPaused && exactSlideWidth > 0) {
                position -= currentSpeed;
                if (position <= -exactSlideWidth) {
                    position = window.innerWidth;
                }
                track.style.transform = `translateX(${position}px)`;
            }
            requestAnimationFrame(animateSlider);
        }

        requestAnimationFrame(animateSlider);

        window.addEventListener("resize", () => {
            initSlider();
            baseSpeed = window.innerWidth < 480 ? 0.75 : 1.1;
            if (!isPaused) currentSpeed = baseSpeed;
        });

        track.addEventListener("mouseenter", () => { isPaused = true; });
        track.addEventListener("mouseleave", () => { isPaused = false; });
        track.addEventListener("touchstart", () => { isPaused = true; }, { passive: true });
        track.addEventListener("touchend", () => { isPaused = false; });
    }

    // --------------------------------------------------------------------------
    // 2. DYNAMIC NAVBAR SCROLL EFFECT (Sticky Glassmorphism & Elevation)
    // --------------------------------------------------------------------------
    const stickyWrapper = document.querySelector(".sticky-top-wrapper");
    const customNavbar = document.querySelector(".custom-navbar");

    function handleNavbarScroll() {
        const scrollY = window.scrollY || window.pageYOffset;
        if (scrollY > 30) {
            if (stickyWrapper) stickyWrapper.classList.add("is-scrolled");
            if (customNavbar) customNavbar.classList.add("scrolled");
        } else {
            if (stickyWrapper) stickyWrapper.classList.remove("is-scrolled");
            if (customNavbar) customNavbar.classList.remove("scrolled");
        }
    }

    window.removeEventListener("scroll", handleNavbarScroll);
    window.addEventListener("scroll", handleNavbarScroll, { passive: true });
    handleNavbarScroll(); // Initial check

    // --------------------------------------------------------------------------
    // 3. STRICT SINGLE ACTIVE NAV LINK DETECTION & HIGHLIGHTING
    // --------------------------------------------------------------------------
    function setActiveNavLink() {
        const path = window.location.pathname;
        let page = path.split("/").pop() || "index.html";
        page = page.split("?")[0].split("#")[0];
        if (!page || page === "") page = "index.html";
        page = page.replace(/\.html$/, ""); // Normalize by removing .html for Netlify clean URLs

        // 1. Remove active state from EVERY nav item, nav-link, dropdown item, and course link first
        document.querySelectorAll(".custom-navbar .active").forEach(el => {
            el.classList.remove("active");
        });

        let activeFound = false;

        // Helper to mark all parent hierarchy active
        function markParentsActive(element) {
            element.classList.add("active");
            
            let parent = element.parentElement;
            while (parent && !parent.classList.contains('custom-navbar')) {
                // If inside a dropdown menu, mark the toggle that opens it
                if (parent.classList.contains('dropdown-menu')) {
                    const prevToggle = parent.previousElementSibling;
                    if (prevToggle && prevToggle.classList.contains('dropdown-toggle')) {
                        prevToggle.classList.add('active');
                    }
                }
                
                // If it's a top-level nav-item, mark its nav-link
                if (parent.classList.contains('nav-item')) {
                    parent.classList.add('active');
                    const navLink = parent.querySelector(':scope > .nav-link');
                    if (navLink) navLink.classList.add('active');
                }

                // If inside a course category (All Courses menu), open the category
                if (parent.classList.contains('course-cat')) {
                    parent.classList.add('open');
                }
                
                parent = parent.parentElement;
            }
            
            // Highlight the "All Courses" button itself if we matched inside it
            if (element.closest('.custom-dropdown-box')) {
                const allCoursesBtn = document.getElementById('allCoursesBtn');
                if (allCoursesBtn) allCoursesBtn.classList.add('active-course-btn'); // optional styling
            }
        }

        // 2. Find all links in the navbar
        const allLinks = document.querySelectorAll(".custom-navbar a.nav-link, .custom-navbar a.dropdown-item, .custom-navbar a.sub-item");
        
        allLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (href && href !== "#" && !href.startsWith("javascript:")) {
                let hrefFile = href.split("/").pop().split("?")[0].split("#")[0];
                hrefFile = hrefFile.replace(/\.html$/, ""); // Normalize by removing .html
                
                if (hrefFile === page || (page === "index" && href === "/")) {
                    markParentsActive(link);
                    activeFound = true;
                }
            }
        });

        // 3. Default fallback for index.html
        if (!activeFound && (page === "index" || page === "")) {
            const homeLink = document.querySelector('.navbar-nav .nav-link[href="index.html"], .navbar-nav .nav-link[href="./index.html"]');
            if (homeLink) {
                markParentsActive(homeLink);
            }
        }
    }

    setActiveNavLink();

    // --------------------------------------------------------------------------
    // 4. DESKTOP HOVER DROPDOWNS & MEGA MENU
    // --------------------------------------------------------------------------
    const allCoursesWrapper = document.querySelector(".custom-dropdown-box");
    const allCoursesBtn = document.getElementById("allCoursesBtn");
    const allCoursesMenu = allCoursesWrapper ? allCoursesWrapper.querySelector(".dropdown-menu") : null;

    if (allCoursesWrapper && allCoursesBtn && allCoursesMenu && !allCoursesBtn.dataset.listenerAttached) {
        allCoursesBtn.dataset.listenerAttached = "true";
        let acCloseTimer = null;

        function openAllCourses() {
            if (acCloseTimer) { clearTimeout(acCloseTimer); acCloseTimer = null; }
            allCoursesMenu.classList.add("show");
            allCoursesBtn.setAttribute("aria-expanded", "true");
        }

        function scheduleCloseAllCourses(delay) {
            acCloseTimer = setTimeout(() => {
                allCoursesMenu.classList.remove("show");
                allCoursesBtn.setAttribute("aria-expanded", "false");
            }, delay);
        }

        allCoursesBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            openAllCourses();
        });

        allCoursesWrapper.addEventListener("mouseenter", function () {
            if (window.innerWidth < 1200) return;
            openAllCourses();
        });

        allCoursesWrapper.addEventListener("mouseleave", function () {
            if (window.innerWidth < 1200) return;
            scheduleCloseAllCourses(250);
        });

        document.addEventListener("click", function (e) {
            if (!allCoursesWrapper.contains(e.target)) {
                allCoursesMenu.classList.remove("show");
                allCoursesBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Nav dropdowns hover (desktop)
    document.querySelectorAll(".navbar-nav .nav-item.dropdown").forEach((navItem) => {
        if (navItem.dataset.hoverAttached) return;
        navItem.dataset.hoverAttached = "true";

        const toggleLink = navItem.querySelector(".nav-link.dropdown-toggle");
        if (!toggleLink) return;

        let bsDropdown = null;
        let closeTimer = null;

        function openDd() {
            if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
            if (window.bootstrap) {
                bsDropdown = bootstrap.Dropdown.getInstance(toggleLink) ||
                             new bootstrap.Dropdown(toggleLink, { autoClose: false });
                bsDropdown.show();
            }
        }

        function scheduleDdClose() {
            closeTimer = setTimeout(() => {
                if (bsDropdown) bsDropdown.hide();
            }, 120);
        }

        navItem.addEventListener("mouseenter", function () {
            if (window.innerWidth < 1200) return;
            openDd();
        });

        navItem.addEventListener("mouseleave", function () {
            if (window.innerWidth < 1200) return;
            scheduleDdClose();
        });

        const dropMenu = navItem.querySelector(".dropdown-menu");
        if (dropMenu) {
            dropMenu.addEventListener("mouseenter", function () {
                if (window.innerWidth < 1200) return;
                if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
            });
            dropMenu.addEventListener("mouseleave", function () {
                if (window.innerWidth < 1200) return;
                scheduleDdClose();
            });
        }
    });

    // --------------------------------------------------------------------------
    // 5. MOBILE HAMBURGER TOGGLE & AUTO-CLOSE
    // --------------------------------------------------------------------------
    const navbarToggler = document.getElementById("navbarToggler");
    const hamburgerIcon = document.querySelector(".hamburger-icon");
    const navbarCollapse = document.getElementById("navbarNav");

    if (navbarToggler && hamburgerIcon && !navbarToggler.dataset.listenerAttached) {
        navbarToggler.dataset.listenerAttached = "true";
        navbarToggler.addEventListener("click", function () {
            hamburgerIcon.classList.toggle("open");
        });
    }

    if (navbarCollapse && !navbarCollapse.dataset.autoCloseAttached) {
        navbarCollapse.dataset.autoCloseAttached = "true";
        document.addEventListener("click", function (event) {
            if (navbarCollapse && navbarCollapse.classList.contains("show")) {
                const isClickInside = navbarCollapse.contains(event.target) || (navbarToggler && navbarToggler.contains(event.target));
                if (!isClickInside && window.bootstrap) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                    if (hamburgerIcon) hamburgerIcon.classList.remove("open");
                }
            }
        });
    }

    // --------------------------------------------------------------------------
    // 6. MOBILE MULTI-LEVEL SUBMENU ACCORDION LOGIC
    // --------------------------------------------------------------------------
    const dropdownSubmenuToggles = document.querySelectorAll(".dropdown-submenu > a.dropdown-toggle");
    dropdownSubmenuToggles.forEach(function (element) {
        if (element.dataset.submenuAttached) return;
        element.dataset.submenuAttached = "true";

        element.addEventListener("click", function (e) {
            if (window.innerWidth < 1200) {
                e.preventDefault();
                e.stopPropagation();

                const parentLi = this.parentElement;
                const siblings = parentLi.parentElement.querySelectorAll(".dropdown-submenu");
                siblings.forEach(function (sibling) {
                    if (sibling !== parentLi) {
                        const submenu = sibling.querySelector(".dropdown-menu");
                        if (submenu) submenu.classList.remove("show");
                    }
                });

                const nextEl = this.nextElementSibling;
                if (nextEl && nextEl.classList.contains("dropdown-menu")) {
                    if (nextEl.classList.contains("show")) {
                        const deepMenus = nextEl.querySelectorAll(".dropdown-menu.show");
                        deepMenus.forEach((menu) => menu.classList.remove("show"));
                    }
                    nextEl.classList.toggle("show");
                }
            } else {
                // On desktop, prevent click from jumping page and closing dropdowns
                e.preventDefault();
                e.stopPropagation();
            }
        });
    });

    // --------------------------------------------------------------------------
    // 7. COURSE CATEGORY CLICK TOGGLE (.course-cat)
    // --------------------------------------------------------------------------
    document.querySelectorAll(".course-cat-header").forEach(function (header) {
        if (header.dataset.catHeaderAttached) return;
        header.dataset.catHeaderAttached = "true";

        header.addEventListener("click", function () {
            const cat = this.closest(".course-cat");
            const isOpen = cat.classList.contains("open");

            document.querySelectorAll(".course-cat.open").forEach(function (openCat) {
                openCat.classList.remove("open");
            });

            if (!isOpen) {
                cat.classList.add("open");
            }
        });
    });

    document.querySelectorAll(".course-cat").forEach(function (cat) {
        if (cat.dataset.catHoverAttached) return;
        cat.dataset.catHoverAttached = "true";
        cat.addEventListener("mouseenter", function () {
            if (window.innerWidth < 1200) return;
            document.querySelectorAll(".course-cat.open").forEach(function (openCat) {
                if (openCat !== cat) openCat.classList.remove("open");
            });
            cat.classList.add("open");
        });
    });

    // --------------------------------------------------------------------------
    // 8. PREVENT DESKTOP CLICKS FROM CLOSING HOVER DROPDOWNS
    // --------------------------------------------------------------------------
    document.querySelectorAll(".nav-link.dropdown-toggle").forEach(function (toggle) {
        if (toggle.dataset.desktopClickAttached) return;
        toggle.dataset.desktopClickAttached = "true";
        toggle.addEventListener("click", function (e) {
            if (window.innerWidth >= 1200) {
                const href = this.getAttribute("href");
                if (!href || href === "#") {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        });
    });
};

// Initialize on DOMContentLoaded if components are already rendered
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("header-track") || document.getElementById("navbar")) {
        window.initDynamicNavbar();
    }
});
