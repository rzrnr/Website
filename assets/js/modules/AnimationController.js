/**
 * ================================
 * ANIMATION CONTROLLER
 * ================================
 * Central controller for all animations
 */

class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animationQueue = [];
        this.isProcessing = false;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.bindEvents();
    }

    setupIntersectionObserver() {
        // Observer for scroll-triggered animations
        this.scrollObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.triggerAnimation(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );
    }

    bindEvents() {
        // Listen for reduced motion changes
        window.matchMedia('(prefers-reduced-motion: reduce)')
            .addEventListener('change', (e) => {
                this.reducedMotion = e.matches;
            });
    }

    // Register element for scroll-triggered animation
    observeElement(element, animationType = 'fade-in', options = {}) {
        if (!element) return;
        
        // Store animation data
        element.dataset.animationType = animationType;
        element.dataset.animationOptions = JSON.stringify(options);
        
        // Add to observer
        this.scrollObserver.observe(element);
    }

    // Manually trigger animation
    triggerAnimation(element, animationType = null, options = {}) {
        if (this.reducedMotion && !options.forceAnimation) {
            // Skip animation for reduced motion preference
            element.style.opacity = '1';
            element.style.transform = 'none';
            return Promise.resolve();
        }

        const type = animationType || element.dataset.animationType || 'fade-in';
        const storedOptions = element.dataset.animationOptions ? 
            JSON.parse(element.dataset.animationOptions) : {};
        const finalOptions = { ...storedOptions, ...options };

        return this.playAnimation(element, type, finalOptions);
    }

    playAnimation(element, type, options = {}) {
        return new Promise((resolve) => {
            const {
                delay = 0,
                duration = 600,
                easing = 'ease-out',
                stagger = 0
            } = options;

            // Add delay for stagger effect
            setTimeout(() => {
                this.applyAnimation(element, type, duration, easing);
                
                // Resolve after animation completes
                setTimeout(resolve, duration);
            }, delay + stagger);
        });
    }

    applyAnimation(element, type, duration, easing) {
        // Remove any existing animation classes
        element.classList.remove(...this.getAllAnimationClasses());
        
        // Apply new animation
        switch (type) {
            case 'fade-in':
                element.classList.add('animate-fade-in');
                break;
            case 'slide-up':
                element.classList.add('animate-slide-up');
                break;
            case 'slide-down':
                element.classList.add('animate-slide-down');
                break;
            case 'slide-left':
                element.classList.add('animate-slide-left');
                break;
            case 'slide-right':
                element.classList.add('animate-slide-right');
                break;
            case 'scale-in':
                element.classList.add('animate-scale-in');
                break;
            case 'bounce':
                element.classList.add('animate-bounce');
                break;
            case 'float':
                element.classList.add('animate-float');
                break;
            default:
                element.classList.add('animate-fade-in');
        }

        // Set custom duration and easing if provided
        if (duration !== 600 || easing !== 'ease-out') {
            element.style.animationDuration = `${duration}ms`;
            element.style.animationTimingFunction = easing;
        }
    }

    // Animate multiple elements with stagger
    staggerElements(elements, animationType = 'fade-in', options = {}) {
        const {
            staggerDelay = 100,
            ...baseOptions
        } = options;

        const promises = Array.from(elements).map((element, index) => {
            return this.triggerAnimation(element, animationType, {
                ...baseOptions,
                stagger: index * staggerDelay
            });
        });

        return Promise.all(promises);
    }

    // Animation sequences
    sequence(animations) {
        return animations.reduce((promise, animation) => {
            return promise.then(() => {
                const { element, type, options } = animation;
                return this.triggerAnimation(element, type, options);
            });
        }, Promise.resolve());
    }

    // Parallel animations
    parallel(animations) {
        const promises = animations.map(animation => {
            const { element, type, options } = animation;
            return this.triggerAnimation(element, type, options);
        });

        return Promise.all(promises);
    }

    getAllAnimationClasses() {
        return [
            'animate-fade-in', 'animate-fade-out',
            'animate-slide-up', 'animate-slide-down',
            'animate-slide-left', 'animate-slide-right',
            'animate-scale-in', 'animate-scale-out',
            'animate-bounce', 'animate-pulse', 'animate-spin', 'animate-float'
        ];
    }

    // Clean up
    destroy() {
        if (this.scrollObserver) {
            this.scrollObserver.disconnect();
        }
    }
}

export default AnimationController;
