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
