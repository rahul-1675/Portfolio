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
       AUTOMATIC MALE VOICE SELF-INTRO (AUTOPLAY ON OPEN / REFRESH)
       ========================================================================== */
    let isSpeaking = false;
    let autoplayTriggered = false;
    
    // Spoken self intro with first name removed ("Hi, I'm Rahul...")
    const selfIntroText = "Hi, I'm Rahul. I'm an Artificial Intelligence and Machine Learning student, as well as a full-stack developer. I build fast, scalable applications using Python, Java, Spring Boot, SQL, and modern web technologies. Welcome to my portfolio!";
    
    // Select Male Voice
    const getMaleVoice = () => {
        if (!('speechSynthesis' in window)) return null;
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return null;
        
        const maleKeywords = ['david', 'male', 'mark', 'george', 'alex', 'rishi', 'james', 'daniel', 'guy', 'steffan', 'google us english', 'microsoft david'];
        for (const keyword of maleKeywords) {
            const found = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes(keyword));
            if (found) return found;
        }
        
        const fallbackMale = voices.find(v => v.name.toLowerCase().includes('male'));
        if (fallbackMale) return fallbackMale;
        
        return voices.find(v => v.lang.startsWith('en')) || voices[0];
    };
    
    // Ensure voices are loaded (Chrome loads voices asynchronously)
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
            getMaleVoice();
        };
    }
    
    const stopIntroSpeech = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        isSpeaking = false;
    };
    
    const startIntroSpeech = () => {
        if (isSpeaking) {
            return;
        }
        
        stopIntroSpeech(); // Reset any ongoing speech
        isSpeaking = true;
        
        // Web Speech API Synthesis with Male Voice & Increased Pitch
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(selfIntroText);
            utterance.rate = 1.0;
            utterance.pitch = 1.15; // Increased pitch as requested
            
            const maleVoice = getMaleVoice();
            if (maleVoice) {
                utterance.voice = maleVoice;
            }
            
            utterance.onend = () => {
                stopIntroSpeech();
            };
            
            utterance.onerror = () => {
                stopIntroSpeech();
            };
            
            window.speechSynthesis.speak(utterance);
        }
    };

    // Autoplay immediately on page load / refresh
    const triggerAutoplayIntro = () => {
        if (autoplayTriggered) return;
        autoplayTriggered = true;
        setTimeout(() => {
            startIntroSpeech();
        }, 300);
    };

    window.addEventListener('load', () => {
        triggerAutoplayIntro();
    });

    // Browser Autoplay Fallback (triggers automatically on very first user interaction if browser blocked silent autoplay)
    const userGestureHandler = () => {
        if (!isSpeaking && !autoplayTriggered) {
            triggerAutoplayIntro();
        }
        document.removeEventListener('click', userGestureHandler);
        document.removeEventListener('keydown', userGestureHandler);
        document.removeEventListener('touchstart', userGestureHandler);
        document.removeEventListener('scroll', userGestureHandler);
    };

    document.addEventListener('click', userGestureHandler);
    document.addEventListener('keydown', userGestureHandler);
    document.addEventListener('touchstart', userGestureHandler);
    document.addEventListener('scroll', userGestureHandler);

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
