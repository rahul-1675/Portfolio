document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       CUSTOM CURSOR
       ========================================================================== */
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');
    
    if (cursor && cursorDot) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Dot follows mouse exactly and immediately
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });
        
        // Fluid outer cursor animation with inertia
        const renderCursor = () => {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            
            cursorX += dx * 0.15;
            cursorY += dy * 0.15;
            
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
            
            requestAnimationFrame(renderCursor);
        };
        renderCursor();
        
        // Hover effects on links/buttons
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .checkbox-container, .contact-method-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
            });
        });
    }

    /* ==========================================================================
       STICKY HEADER & NAV ACTIVE LINKS
       ========================================================================== */
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        // Sticky Header class toggling
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active Nav Links highlighting based on scroll position
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinksContainer) {
        mobileToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('open');
            mobileToggle.classList.toggle('active');
        });
        
        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('open');
                mobileToggle.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       SCROLL REVEAL (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .timeline-item');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* ==========================================================================
       PRELOADER INTRO CARD & CINEMATIC NATIVE VIDEO AUDIO CONTROLLER
       ========================================================================== */
    const introOverlay = document.getElementById('intro-overlay');
    const heroVoiceToggle = document.getElementById('hero-voice-toggle');
    const heroVoiceIcon = document.getElementById('hero-voice-icon');
    const heroIntroVideo = document.getElementById('hero-intro-video');
    
    let isPlaying = false;
    
    const stopVideoAudio = () => {
        if (heroIntroVideo) {
            heroIntroVideo.pause();
        }
        isPlaying = false;
        if (heroVoiceIcon) {
            heroVoiceIcon.classList.remove('fa-pause');
            heroVoiceIcon.classList.add('fa-play');
        }
    };
    
    const startVideoAudio = () => {
        if (!heroIntroVideo) return;
        
        isPlaying = true;
        heroIntroVideo.muted = false; // Enable video's built-in audio!
        heroIntroVideo.volume = 1.0;
        
        if (heroVoiceIcon) {
            heroVoiceIcon.classList.remove('fa-play');
            heroVoiceIcon.classList.add('fa-pause');
        }
        
        const playPromise = heroIntroVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay blocked by browser policy; fallback to muted loop until user gesture
                heroIntroVideo.muted = true;
                heroIntroVideo.play();
            });
        }
    };

    const toggleVideoAudio = () => {
        if (isPlaying) {
            stopVideoAudio();
        } else {
            heroIntroVideo.currentTime = 0;
            startVideoAudio();
        }
    };

    if (heroIntroVideo) {
        heroIntroVideo.addEventListener('ended', () => {
            stopVideoAudio();
        });
    }

    if (heroVoiceToggle) {
        heroVoiceToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleVideoAudio();
        });
    }

    const dismissIntroOverlay = () => {
        if (introOverlay && !introOverlay.classList.contains('hide')) {
            introOverlay.classList.add('hide');
            setTimeout(() => {
                startVideoAudio();
            }, 300);
        }
    };

    const introEnterBtn = document.getElementById('intro-enter-btn');

    // Display preloader overlay for a solid 8 seconds so visitors can read the name clearly
    const autoDismissTimeout = setTimeout(() => {
        dismissIntroOverlay();
    }, 8000);

    // Dismiss only when user explicitly clicks the intro card or enter button
    if (introOverlay) {
        introOverlay.addEventListener('click', (e) => {
            clearTimeout(autoDismissTimeout);
            dismissIntroOverlay();
        });
    }
    if (introEnterBtn) {
        introEnterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            clearTimeout(autoDismissTimeout);
            dismissIntroOverlay();
        });
    }

    /* ==========================================================================
       MAGNETIC BUTTONS EFFECT
       ========================================================================== */
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .logo, .btn-hire-me');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move button slightly towards cursor coordinates
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            // Reset button position
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    /* ==========================================================================
       CONTACT FORM SUBMISSION WITH FEEDBACK OVERLAY
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const successFeedback = document.getElementById('success-feedback');
    
    if (contactForm && successFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Client-side visual validation checks
            const firstName = document.getElementById('contact-firstname').value.trim();
            const lastName = document.getElementById('contact-lastname').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();
            const consent = document.getElementById('contact-consent').checked;
            
            if (firstName && lastName && email && message && consent) {
                // Animate Send Button to show loading status
                const submitBtn = document.getElementById('form-submit-btn');
                const originalBtnContent = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = `Sending... <i class="fas fa-spinner fa-spin btn-icon-right"></i>`;
                
                // Simulate server latency
                setTimeout(() => {
                    // Activate success screen mockup
                    successFeedback.classList.add('active');
                    
                    // Reset form contents
                    contactForm.reset();
                    
                    // Reset submit button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                    
                    // Auto-hide success overlay after 4.5 seconds
                    setTimeout(() => {
                        successFeedback.classList.remove('active');
                    }, 4500);
                    
                }, 1800);
            }
        });
    }
});
