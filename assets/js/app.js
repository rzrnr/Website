/**
 * ================================
 * MAIN APPLICATION
 * ================================
 * Entry point for the modular website system
 */

import PageTransitionManager from './modules/PageTransitionManager.js';
import AnimationController from './modules/AnimationController.js';
import ComponentSystem from './modules/ComponentSystem.js';

class App {
    constructor() {
        this.pageTransitions = null;
        this.animations = null;
        this.components = null;
        this.utils = null;
        
        // Keep existing functionality
        this.introManager = null;
        this.mouseTrail = null;
        this.themeManager = null;
        
        this.init();
    }

    async init() {
        try {
            // Initialize core systems
            await this.initializeCoreModules();
            
            // Initialize existing systems
            await this.initializeExistingFeatures();
            
            // Initialize page-specific features
            this.initializePageFeatures();
            
            console.log('✅ App initialized successfully');
            
        } catch (error) {
            console.error('❌ App initialization failed:', error);
        }
    }

    async initializeCoreModules() {
        // Animation system
        this.animations = new AnimationController();
        
        // Component system
        this.components = new ComponentSystem();
        
        // Page transitions (only for multi-page sites)
        if (this.shouldEnablePageTransitions()) {
            this.pageTransitions = new PageTransitionManager();
        }
        
        // Utils
        this.utils = this.createUtilityFunctions();
    }

    async initializeExistingFeatures() {
        // Import and initialize existing features
        const { IntroAnimationManager } = await import('./animations/IntroAnimationManager.js');
        const { MouseTrailManager } = await import('./animations/MouseTrailManager.js');
        const { ThemeManager } = await import('./modules/ThemeManager.js');
        
        this.introManager = new IntroAnimationManager();
        this.mouseTrail = new MouseTrailManager();
        this.themeManager = new ThemeManager();
    }

    initializePageFeatures() {
        // Auto-initialize animations for elements with data attributes
        this.autoInitializeAnimations();
        
        // Initialize components
        this.components.autoInitializeComponents();
        
        // Page-specific initialization
        this.initializeCurrentPage();
    }

    autoInitializeAnimations() {
        // Elements with scroll animations
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(element => {
            const animationType = element.dataset.animate;
            const delay = parseInt(element.dataset.animateDelay) || 0;
            const stagger = parseInt(element.dataset.animateStagger) || 0;
            
            this.animations.observeElement(element, animationType, {
                delay,
                stagger
            });
        });

        // Stagger groups
        const staggerGroups = document.querySelectorAll('[data-stagger-group]');
        staggerGroups.forEach(group => {
            const children = group.children;
            const animationType = group.dataset.staggerAnimation || 'fade-in';
            const delay = parseInt(group.dataset.staggerDelay) || 100;
            
            this.animations.staggerElements(children, animationType, {
                staggerDelay: delay
            });
        });
    }

    initializeCurrentPage() {
        const pageName = this.getCurrentPageName();
        
        // Dispatch page-specific initialization
        document.dispatchEvent(new CustomEvent('pageInitialized', {
            detail: { page: pageName }
        }));
        
        // Load page-specific modules if they exist
        this.loadPageModule(pageName);
    }

    async loadPageModule(pageName) {
        try {
            const module = await import(`./pages/${pageName}.js`);
            if (module.default) {
                new module.default(this);
            }
        } catch (error) {
            // Page module doesn't exist - that's fine
            console.log(`No specific module found for page: ${pageName}`);
        }
    }

    shouldEnablePageTransitions() {
        // Check if this is a single-page app or multi-page site
        return document.querySelector('[data-spa]') !== null;
    }

    getCurrentPageName() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') return 'home';
        return path.split('/').filter(Boolean).pop() || 'home';
    }

    createUtilityFunctions() {
        return {
            // Debounce function
            debounce: (func, wait) => {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            },

            // Throttle function
            throttle: (func, limit) => {
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
            prefersReducedMotion: () => {
                return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            },

            // Wait for element to be available
            waitForElement: (selector, timeout = 5000) => {
                return new Promise((resolve, reject) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        resolve(element);
                        return;
                    }

                    const observer = new MutationObserver(() => {
                        const element = document.querySelector(selector);
                        if (element) {
                            observer.disconnect();
                            resolve(element);
                        }
                    });

                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });

                    setTimeout(() => {
                        observer.disconnect();
                        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                    }, timeout);
                });
            },

            // Smooth scroll to element
            scrollTo: (target, options = {}) => {
                const element = typeof target === 'string' ? 
                    document.querySelector(target) : target;
                
                if (!element) return;
                
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    ...options
                });
            }
        };
    }

    // Global event handlers
    on(event, handler) {
        document.addEventListener(event, handler);
    }

    off(event, handler) {
        document.removeEventListener(event, handler);
    }

    // Cleanup
    destroy() {
        if (this.pageTransitions) this.pageTransitions.destroy?.();
        if (this.animations) this.animations.destroy?.();
        if (this.mouseTrail) this.mouseTrail.destroy?.();
        if (this.themeManager) this.themeManager.destroy?.();
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new App());
} else {
    new App();
}

// Export for global access
window.App = App;
