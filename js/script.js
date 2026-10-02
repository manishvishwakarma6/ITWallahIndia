/**
 * IT WALLAH INDIA - GLOBAL SCRIPTS & UTILITIES
 */

document.addEventListener("DOMContentLoaded", function () {
    // --------------------------------------------------------------------------
    // 1. BANNER SLIDER INITIALIZATION
    // --------------------------------------------------------------------------
    const bannerSlider = document.querySelector("#bannerSlider");
    if (bannerSlider && window.bootstrap) {
        new bootstrap.Carousel(bannerSlider, {
            interval: 3500,
            pause: "hover",
            wrap: true
        });
    }

    // --------------------------------------------------------------------------
    // 2. SMOOTH SCROLLING FOR ANCHOR LINKS WITH FIXED NAVBAR OFFSET
    // --------------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId && targetId !== "#" && targetId !== "#!") {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const navOffset = 90;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    // --------------------------------------------------------------------------
    // 3. DYNAMIC BACK-TO-TOP BUTTON WITH CIRCULAR SCROLL PROGRESS
    // --------------------------------------------------------------------------
    let backToTopBtn = document.getElementById("backToTopBtn");
    if (!backToTopBtn) {
        backToTopBtn = document.createElement("button");
        backToTopBtn.id = "backToTopBtn";
        backToTopBtn.className = "back-to-top-btn";
        backToTopBtn.setAttribute("aria-label", "Scroll back to top");
        backToTopBtn.innerHTML = `
            <svg class="progress-ring" width="52" height="52">
                <circle cx="26" cy="26" r="23"></circle>
            </svg>
            <i class="fa-solid fa-arrow-up" style="font-size: 14px;"></i>
        `;
        document.body.appendChild(backToTopBtn);
    }

    const progressCircle = backToTopBtn.querySelector("circle");
    const circumference = 2 * Math.PI * 23; // r = 23 -> ~144.5

    if (progressCircle) {
        progressCircle.style.strokeDasharray = `${circumference}`;
        progressCircle.style.strokeDashoffset = `${circumference}`;
    }

    function updateBackToTop() {
        const scrollY = window.scrollY || window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        if (scrollY > 300) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }

        if (progressCircle && docHeight > 0) {
            const scrollPercentage = Math.min(1, Math.max(0, scrollY / docHeight));
            const offset = circumference - scrollPercentage * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }
    }

    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // --------------------------------------------------------------------------
    // 4. DYNAMIC AUTO-UPDATING COPYRIGHT YEAR
    // --------------------------------------------------------------------------
    const yearSpan = document.getElementById("currentYear");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --------------------------------------------------------------------------
    // 5. CUSTOM CURSOR DOT
    // --------------------------------------------------------------------------
    const cursor = document.getElementById("cursorDot");
    if (cursor) {
        const moveCursor = (e) => {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            requestAnimationFrame(() => {
                cursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
            });
        };
        document.addEventListener("mousemove", moveCursor, { passive: true });
        document.addEventListener("touchmove", moveCursor, { passive: true });
    }

    // --------------------------------------------------------------------------
    // 6. LIGHTBOX LOGIC FOR GALLERY IMAGES (IF PRESENT)
    // --------------------------------------------------------------------------
    const galleryImages = document.querySelectorAll(".gallery-card .img-wrapper img");
    if (galleryImages.length > 0) {
        const overlay = document.createElement("div");
        overlay.className = "lightbox-overlay";

        const closeBtn = document.createElement("span");
        closeBtn.className = "lightbox-close";
        closeBtn.innerHTML = "&times;";

        const lightboxImg = document.createElement("img");

        overlay.appendChild(closeBtn);
        overlay.appendChild(lightboxImg);
        document.body.appendChild(overlay);

        galleryImages.forEach((img) => {
            img.style.cursor = "zoom-in";
            img.addEventListener("click", (e) => {
                e.stopPropagation();
                lightboxImg.src = img.src;
                overlay.classList.add("active");
                document.body.style.overflow = "hidden";
            });
        });

        const closeLightbox = () => {
            overlay.classList.remove("active");
            document.body.style.overflow = "";
            setTimeout(() => {
                lightboxImg.src = "";
            }, 300);
        };

        closeBtn.addEventListener("click", closeLightbox);
        overlay.addEventListener("click", (e) => {
            if (e.target !== lightboxImg) closeLightbox();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && overlay.classList.contains("active")) {
                closeLightbox();
            }
        });
    }
});
