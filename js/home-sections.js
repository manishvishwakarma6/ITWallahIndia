/**
 * IT WALLAH INDIA - HOME PAGE DYNAMIC INTERACTIONS & ANIMATIONS
 */

document.addEventListener("DOMContentLoaded", function () {
    // --------------------------------------------------------------------------
    // 1. DYNAMIC HERO TYPING EFFECT
    // --------------------------------------------------------------------------
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");

    const textArray = [
        "Learn Full-Stack Development",
        "Master Java & Spring Boot",
        "Explore Python & AI/ML",
        "Master SQL & Database Systems",
        "Build Real-World Web Projects",
        "Master Cloud & AWS Deployment"
    ];

    if (typedTextSpan && cursorSpan) {
        const typingDelay = 80;
        const erasingDelay = 40;
        const newTextDelay = 1800;
        let textArrayIndex = 0;
        let charIndex = 0;

        function type() {
            if (charIndex < textArray[textArrayIndex].length) {
                if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                cursorSpan.classList.remove("typing");
                setTimeout(erase, newTextDelay);
            }
        }

        function erase() {
            if (charIndex > 0) {
                if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } else {
                cursorSpan.classList.remove("typing");
                textArrayIndex++;
                if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, typingDelay + 400);
            }
        }

        if (textArray.length) setTimeout(type, 600);
    }

    // --------------------------------------------------------------------------
    // 2. DYNAMIC STATS NUMBER COUNT-UP ANIMATION
    // --------------------------------------------------------------------------
    let statsAnimated = false;
    function animateCounters() {
        if (statsAnimated) return;
        const statNumbers = document.querySelectorAll(".stats-number");
        statNumbers.forEach((el) => {
            const targetVal = parseInt(el.getAttribute("data-target") || el.textContent, 10);
            if (!isNaN(targetVal)) {
                let current = 0;
                const duration = 1500; // 1.5 seconds
                const increment = Math.max(1, Math.floor(targetVal / 30));
                const stepTime = Math.abs(Math.floor(duration / (targetVal / increment)));

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= targetVal) {
                        el.textContent = `${targetVal}+`;
                        clearInterval(timer);
                    } else {
                        el.textContent = `${current}+`;
                    }
                }, stepTime);
            }
        });
        statsAnimated = true;
    }

    // --------------------------------------------------------------------------
    // 3. INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
    // --------------------------------------------------------------------------
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");

                // If stats section came into view, trigger counter animation
                if (entry.target.classList.contains("stats-card-main") || entry.target.querySelector(".stats-number")) {
                    animateCounters();
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        observer.observe(el);
    });

    // --------------------------------------------------------------------------
    // 4. TESTIMONIAL CAROUSEL INITIALIZATION
    // --------------------------------------------------------------------------
    const testimonialCarousel = document.getElementById("testimonialCarousel");
    if (testimonialCarousel && window.bootstrap) {
        new bootstrap.Carousel(testimonialCarousel, {
            interval: 4000,
            ride: "carousel",
            pause: "hover",
            wrap: true
        });
    }

    // --------------------------------------------------------------------------
    // 5. DYNAMIC NEWSLETTER SUBSCRIPTION VALIDATION
    // --------------------------------------------------------------------------
    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterInput = document.getElementById("newsletterEmail");
    const newsletterFeedback = document.getElementById("newsletterFeedback");

    if (newsletterForm && newsletterInput && newsletterFeedback) {
        newsletterForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const email = newsletterInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!email) {
                newsletterFeedback.textContent = "Please enter your email address.";
                newsletterFeedback.className = "newsletter-feedback error";
                return;
            }

            if (!emailRegex.test(email)) {
                newsletterFeedback.textContent = "Please enter a valid email address.";
                newsletterFeedback.className = "newsletter-feedback error";
                return;
            }

            // Success state
            newsletterFeedback.textContent = "🎉 Thanks for subscribing! You're on the list.";
            newsletterFeedback.className = "newsletter-feedback success";
            newsletterInput.value = "";

            setTimeout(() => {
                newsletterFeedback.textContent = "";
            }, 6000);
        });
    }
});
