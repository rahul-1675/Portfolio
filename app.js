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
       INTERACTIVE VOICE SELF-INTRO & VISUALIZER
       ========================================================================== */
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');
    const playIntroBtn = document.getElementById('play-intro-btn');
    const playIntroIcon = document.getElementById('play-intro-icon');
    const visualizerBars = document.getElementById('visualizer-bars');
    const musicProgress = document.getElementById('music-progress');
    
    let isSpeaking = false;
    let progressInterval = null;
    let currentProgress = 0;
    
    const selfIntroText = "Hi, I'm Bhavanam Rahul. I'm an Artificial Intelligence and Machine Learning student, as well as a full-stack developer. I build fast, scalable applications using Python, Java, Spring Boot, SQL, and modern web technologies. Welcome to my portfolio!";
    
    const stopIntroSpeech = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        isSpeaking = false;
        if (musicIcon) {
            musicIcon.classList.remove('fa-pause');
            musicIcon.classList.add('fa-play');
        }
        if (playIntroIcon) {
            playIntroIcon.classList.remove('fa-pause');
            playIntroIcon.classList.add('fa-play');
        }
        if (visualizerBars) {
            visualizerBars.classList.remove('playing');
        }
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        currentProgress = 0;
        if (musicProgress) {
            musicProgress.style.width = '0%';
        }
    };
    
    const startIntroSpeech = () => {
        if (isSpeaking) {
            stopIntroSpeech();
            return;
        }
        
        stopIntroSpeech(); // Reset any ongoing speech
        isSpeaking = true;
        
        if (musicIcon) {
            musicIcon.classList.remove('fa-play');
            musicIcon.classList.add('fa-pause');
        }
        if (playIntroIcon) {
            playIntroIcon.classList.remove('fa-play');
            playIntroIcon.classList.add('fa-pause');
        }
        if (visualizerBars) {
            visualizerBars.classList.add('playing');
        }
        
        // Progress bar simulation over ~12 seconds of speech
        const totalDurationMs = 12000;
        const intervalStepMs = 100;
        const increment = (intervalStepMs / totalDurationMs) * 100;
        
        currentProgress = 0;
        progressInterval = setInterval(() => {
            currentProgress += increment;
            if (currentProgress >= 100) {
                currentProgress = 100;
            }
            if (musicProgress) {
                musicProgress.style.width = `${currentProgress}%`;
            }
        }, intervalStepMs);
        
        // Web Speech API Synthesis
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(selfIntroText);
            utterance.rate = 0.95;
            utterance.pitch = 1.0;
            
            utterance.onend = () => {
                stopIntroSpeech();
            };
            
            utterance.onerror = () => {
                stopIntroSpeech();
            };
            
            window.speechSynthesis.speak(utterance);
        } else {
            // Fallback for browsers without SpeechSynthesis
            setTimeout(() => {
                stopIntroSpeech();
            }, totalDurationMs);
        }
    };
    
    if (musicToggle) {
        musicToggle.addEventListener('click', startIntroSpeech);
    }
    if (playIntroBtn) {
        playIntroBtn.addEventListener('click', startIntroSpeech);
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
