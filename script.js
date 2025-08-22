// ================================
// MOUSE TRAIL MANAGER
// ================================

class MouseTrailManager {
    constructor() {
        this.trail = document.querySelector('.mouse-trail');
        this.trailDot = document.querySelector('.trail-dot');
        this.particleContainer = document.querySelector('.trail-particles');
        this.mouseX = 0;
        this.mouseY = 0;
        this.trailX = 0;
        this.trailY = 0;
        this.particles = [];
        this.lastParticleTime = 0;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        
        if (this.trail) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
        this.addHoverTargets();
        this.startAnimation();
    }

    bindEvents() {
        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Create particles occasionally
            this.createParticle(e.clientX, e.clientY);
        });

        // Show/hide trail
        document.addEventListener('mouseenter', () => {
            this.trail.style.opacity = '1';
            this.particleContainer.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            this.trail.style.opacity = '0';
            this.particleContainer.style.opacity = '0';
        });
    }

    createParticle(x, y) {
        const now = Date.now();
        
        // Calculate mouse movement speed and direction
        const deltaX = x - (this.lastMouseX || x);
        const deltaY = y - (this.lastMouseY || y);
        const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Calculate movement direction for line trail
        const angle = Math.atan2(deltaY, deltaX);
        
        // Particle count based on speed
        let particleCount = 1;
        if (speed > 10) particleCount = 2;
        if (speed > 30) particleCount = 3;
        if (speed > 60) particleCount = 4;
        if (speed > 100) particleCount = 6;
        if (speed > 150) particleCount = 8;
        
        // Faster throttling for more particles
        const throttleTime = speed > 50 ? 15 : 25;
        if (now - this.lastParticleTime < throttleTime) {
            this.lastMouseX = x;
            this.lastMouseY = y;
            return;
        }
        
        this.lastParticleTime = now;
        this.lastMouseX = x;
        this.lastMouseY = y;
        
        // Create particles in a line behind the cursor
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Place particles in a line behind the cursor based on movement direction
            const distance = (i + 1) * 15; // Distance between particles
            const lineOffsetX = -Math.cos(angle) * distance;
            const lineOffsetY = -Math.sin(angle) * distance;
            
            // Add small random offset for natural look
            const randomOffsetX = (Math.random() - 0.5) * 8;
            const randomOffsetY = (Math.random() - 0.5) * 8;
            
            const finalX = x + lineOffsetX + randomOffsetX;
            const finalY = y + lineOffsetY + randomOffsetY;
            
            particle.style.left = finalX + 'px';
            particle.style.top = finalY + 'px';
            
            // Stagger creation for smooth line effect
            if (i > 0) {
                setTimeout(() => {
                    this.particleContainer.appendChild(particle);
                }, i * 3);
            } else {
                this.particleContainer.appendChild(particle);
            }
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1800);
        }
    }

    startAnimation() {
        // Smooth trail animation with different easing for satisfying movement
        const animate = () => {
            // Variable easing based on mouse speed
            const deltaX = this.mouseX - this.trailX;
            const deltaY = this.mouseY - this.trailY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Adaptive easing - faster when mouse moves quickly
            let ease = 0.08;
            if (distance > 100) ease = 0.15;
            if (distance > 200) ease = 0.25;
            
            // Apply easing
            this.trailX += deltaX * ease;
            this.trailY += deltaY * ease;
            
            // Update position
            this.trailDot.style.left = this.trailX + 'px';
            this.trailDot.style.top = this.trailY + 'px';
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    addHoverTargets() {
        // Define interactive elements
        const hoverTargets = document.querySelectorAll(
            'a, button, .project-card, .animated-logo, .theme-toggle'
        );

        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                this.trailDot.classList.add('trail-hover');
            });

            target.addEventListener('mouseleave', () => {
                this.trailDot.classList.remove('trail-hover');
            });
        });
    }
}

// ================================
// PARALLAX MOUSE TRACKING
// ================================

class ParallaxManager {
    constructor() {
        this.init();
    }

    init() {
        this.addParallaxEffect();
    }

    addParallaxEffect() {
        document.addEventListener('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;
            const { innerWidth: width, innerHeight: height } = window;
            
            // Calculate mouse position as percentage
            const xPercent = (x / width - 0.5) * 2; // -1 to 1
            const yPercent = (y / height - 0.5) * 2; // -1 to 1

            // Apply subtle parallax to different elements
            this.moveElement('.logo-circle-1', xPercent * 5, yPercent * 5);
            this.moveElement('.logo-circle-2', xPercent * -3, yPercent * -3);
            this.moveElement('.logo-circle-3', xPercent * 4, yPercent * -2);
            this.moveElement('.logo-circle-4', xPercent * -2, yPercent * 4);
            
            // Subtle movement for the hero title
            this.moveElement('.hero-title', xPercent * 2, yPercent * 2);
        });
    }

    moveElement(selector, x, y) {
        const element = document.querySelector(selector);
        if (element) {
            element.style.transform = `translate(${x}px, ${y}px)`;
        }
    }
}

// ================================
// MAGNETIC EFFECT
// ================================

class MagneticEffectManager {
    constructor() {
        this.init();
    }

    init() {
        this.addMagneticEffect();
    }

    addMagneticEffect() {
        const magneticElements = document.querySelectorAll('.theme-toggle, .animated-logo');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = e.clientX - centerX;
                const deltaY = e.clientY - centerY;
                
                // Magnetic strength (adjust as needed)
                const strength = 0.3;
                const moveX = deltaX * strength;
                const moveY = deltaY * strength;
                
                element.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }
}

// ================================
// THEME MANAGEMENT
// ================================

class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.setTheme(this.currentTheme);
        this.bindEvents();
    }

    bindEvents() {
        this.themeToggle?.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Icon automatically changes via CSS, no need for text updates
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// ================================
// SMOOTH ANIMATIONS
// ================================

class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.observeElements();
        this.addProjectCardEffects();
        this.addLogoInteraction();
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all animatable elements
        const elements = document.querySelectorAll('.hero-title, .project-card, .status-indicator');
        elements.forEach(el => observer.observe(el));
    }

    addProjectCardEffects() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.animateCard(e.target, 'enter');
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.animateCard(e.target, 'leave');
            });

            // Add click effect
            card.addEventListener('click', (e) => {
                this.addClickEffect(e);
            });
        });
    }

    animateCard(card, direction) {
        const title = card.querySelector('.project-title');
        const description = card.querySelector('.project-description');
        
        if (direction === 'enter') {
            title.style.transform = 'translateY(-2px)';
            description.style.transform = 'translateY(-2px)';
        } else {
            title.style.transform = 'translateY(0)';
            description.style.transform = 'translateY(0)';
        }
    }

    addClickEffect(e) {
        // Prevent default for demo purposes
        e.preventDefault();
        
        const card = e.currentTarget;
        const projectType = card.dataset.project;
        
        // Add a subtle click animation
        card.style.transform = 'translateY(-4px) scale(0.98)';
        
        setTimeout(() => {
            card.style.transform = 'translateY(-4px) scale(1)';
            
            // Show a message for now (replace with actual navigation later)
            this.showProjectMessage(projectType);
        }, 150);
    }

    showProjectMessage(projectType) {
        const message = projectType === 'portfolio' 
            ? 'Portfolio-Bereich wird bald verfügbar sein!' 
            : 'Blog-Bereich wird bald verfügbar sein!';
            
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--bg-secondary);
            color: var(--text-primary);
            padding: 1rem 2rem;
            border-radius: 8px;
            border: 1px solid var(--border);
            box-shadow: 0 10px 30px var(--shadow);
            z-index: 10000;
            font-size: 0.875rem;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    addScrollEffects() {
        // Removed scroll effects since we no longer have a fixed header
        // The integrated navigation doesn't need scroll-based styling changes
    }

    addLogoInteraction() {
        const animatedLogo = document.querySelector('.animated-logo');
        
        if (animatedLogo) {
            animatedLogo.addEventListener('click', () => {
                // Add a fun click animation
                const circles = animatedLogo.querySelectorAll('.logo-circle');
                circles.forEach((circle, index) => {
                    setTimeout(() => {
                        circle.style.transform = 'scale(1.5)';
                        setTimeout(() => {
                            circle.style.transform = 'scale(1)';
                        }, 200);
                    }, index * 100);
                });
            });

            // Add mouse enter/leave effects
            animatedLogo.addEventListener('mouseenter', () => {
                const path = animatedLogo.querySelector('.logo-path');
                if (path) {
                    path.style.strokeDashoffset = '0';
                }
            });

            animatedLogo.addEventListener('mouseleave', () => {
                const path = animatedLogo.querySelector('.logo-path');
                if (path) {
                    path.style.strokeDashoffset = '100';
                }
            });
        }
    }
}

// ================================
// PERFORMANCE OPTIMIZATIONS
// ================================

class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        this.preloadCriticalResources();
        this.optimizeImages();
        this.addServiceWorker();
    }

    preloadCriticalResources() {
        // Preload Inter font variations that we use
        const fontWeights = ['300', '400', '500', '600', '700'];
        fontWeights.forEach(weight => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            link.href = `https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2`;
            document.head.appendChild(link);
        });
    }

    optimizeImages() {
        // Lazy loading for future images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    addServiceWorker() {
        // Register service worker for caching (basic implementation)
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }
}

// ================================
// ACCESSIBILITY ENHANCEMENTS
// ================================

class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.addKeyboardNavigation();
        this.addFocusManagement();
        this.addScreenReaderSupport();
    }

    addKeyboardNavigation() {
        // Enhanced keyboard navigation for cards
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach(card => {
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });

        // Theme toggle keyboard support
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                themeToggle.click();
            }
        });
    }

    addFocusManagement() {
        // Add focus indicators
        const focusableElements = document.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.setAttribute('data-focus-visible', 'true');
            });
            
            element.addEventListener('blur', () => {
                element.removeAttribute('data-focus-visible');
            });
        });
    }

    addScreenReaderSupport() {
        // Add ARIA labels and descriptions
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 'Farbthema umschalten');
            themeToggle.setAttribute('aria-describedby', 'theme-description');
            
            // Add hidden description
            const description = document.createElement('div');
            description.id = 'theme-description';
            description.className = 'sr-only';
            description.textContent = 'Schaltet zwischen hellem und dunklem Farbthema um';
            document.body.appendChild(description);
        }

        // Add live region for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }
}

// ================================
// INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    new MouseTrailManager();
    new ParallaxManager();
    new MagneticEffectManager();
    new ThemeManager();
    new AnimationManager();
    new PerformanceManager();
    new AccessibilityManager();
    
    // Add some visual feedback for successful load
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ================================
// UTILITY FUNCTIONS
// ================================

const utils = {
    // Debounce function for performance
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if user prefers reduced motion
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
};
