// ================================
// INTRO ANIMATION MANAGER
// ================================

class IntroAnimationManager {
    constructor() {
        this.introOverlay = document.getElementById('intro-overlay');
        this.introLogo = document.querySelector('.intro-logo');
        this.mainContent = document.getElementById('main-content');
        this.normalLogo = document.querySelector('.animated-logo');
        this.hasPlayedIntro = sessionStorage.getItem('introPlayed') === 'true';
        
        this.init();
    }

    init() {
        if (this.hasPlayedIntro) {
            // Skip intro if already played in this session
            this.skipIntro();
        } else {
            // Play intro animation
            this.playIntro();
        }
        
        // Recalculate position on window resize (for responsive behavior)
        window.addEventListener('resize', () => {
            if (!this.hasPlayedIntro) {
                this.calculateFinalPosition();
            }
        });
    }

    playIntro() {
        // Add class to body to indicate intro is playing
        document.body.classList.add('intro-playing');
        
        // Ensure intro is visible and main content is hidden
        if (this.introOverlay) {
            this.introOverlay.classList.remove('hidden');
        }
        if (this.mainContent) {
            this.mainContent.classList.remove('show');
        }

        // Calculate exact position of final logo after a short delay
        setTimeout(() => {
            this.calculateFinalPosition();
            // Recalculate after a moment to ensure layout is stable
            setTimeout(() => {
                this.calculateFinalPosition();
            }, 200);
        }, 100);

        // Start the intro sequence with tighter timing
        setTimeout(() => {
            this.startLogoAnimation();
        }, 800); // Reduced wait time

        setTimeout(() => {
            this.animateToNormalState();
        }, 2500); // Start transition after 2.5 seconds

        setTimeout(() => {
            this.completeIntro();
        }, 2500); // Start completion process when animation begins

        // Mark intro as played for this session
        sessionStorage.setItem('introPlayed', 'true');
    }

    calculateFinalPosition() {
        // Wait for DOM to be fully rendered and layout to stabilize
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (this.normalLogo) {
                    const rect = this.normalLogo.getBoundingClientRect();
                    const parentRect = this.normalLogo.parentElement.getBoundingClientRect();
                    
                    // Get the center point of the logo relative to viewport
                    const centerX = rect.left + (rect.width / 2);
                    const centerY = rect.top + (rect.height / 2);
                    
                    // Convert to percentage of viewport
                    const finalLeft = (centerX / window.innerWidth) * 100;
                    const finalTop = (centerY / window.innerHeight) * 100;
                    
                    // Set CSS custom properties with precise positioning
                    document.documentElement.style.setProperty('--logo-final-left', `${finalLeft}%`);
                    document.documentElement.style.setProperty('--logo-final-top', `${finalTop}%`);
                    
                    console.log(`Logo position: ${finalLeft.toFixed(2)}%, ${finalTop.toFixed(2)}%`);
                }
            });
        });
    }

    startLogoAnimation() {
        // Add floating animation to intro logo with reduced duration
        if (this.introLogo) {
            this.introLogo.style.animation = 'introFloat 1.5s ease-in-out infinite';
        }
    }

    animateToNormalState() {
        // Start animating logo to its final position
        if (this.introLogo) {
            this.introLogo.classList.add('animate-out');
        }

        // Show main content gradually while logo is moving
        setTimeout(() => {
            if (this.mainContent) {
                this.mainContent.classList.add('show');
            }
        }, 1200);
    }

    completeIntro() {
        // Wait for animation to complete, then seamlessly switch logos
        setTimeout(() => {
            // Remove intro playing class and add complete class
            document.body.classList.remove('intro-playing');
            document.body.classList.add('intro-complete');
            
            // Hide intro overlay
            if (this.introOverlay) {
                this.introOverlay.classList.add('hidden');
            }
        }, 2000); // Reduced wait time for faster completion

        // Remove intro overlay from DOM after transition
        setTimeout(() => {
            if (this.introOverlay && this.introOverlay.parentNode) {
                this.introOverlay.parentNode.removeChild(this.introOverlay);
            }
        }, 2800); // Faster cleanup
    }

    skipIntro() {
        // Immediately show main content and hide intro
        document.body.classList.add('intro-complete');
        if (this.introOverlay) {
            this.introOverlay.style.display = 'none';
        }
        if (this.mainContent) {
            this.mainContent.classList.add('show');
        }
    }
}

// Add CSS for intro float animation
const introStyles = `
    @keyframes introFloat {
        0%, 100% {
            transform: translate(-50%, -50%) translateY(0);
        }
        50% {
            transform: translate(-50%, -50%) translateY(-8px);
        }
    }
`;

// Inject intro styles
const introStyleSheet = document.createElement('style');
introStyleSheet.textContent = introStyles;
document.head.appendChild(introStyleSheet);

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
        
        // Hover state management
        this.isHovering = false;
        this.hoverIntensity = 0; // 0 = normal, 1 = full hover
        this.targetHoverIntensity = 0;
        
        console.log('MouseTrailManager init:', {
            trail: !!this.trail,
            trailDot: !!this.trailDot,
            particleContainer: !!this.particleContainer
        });
        
        if (this.trail && this.trailDot && this.particleContainer) {
            this.init();
        } else {
            console.warn('Mouse trail elements not found, creating them...');
            this.createTrailElements();
            this.init();
        }
    }

    createTrailElements() {
        // Create mouse trail if it doesn't exist
        if (!this.trail) {
            this.trail = document.createElement('div');
            this.trail.className = 'mouse-trail';
            this.trail.style.position = 'fixed';
            this.trail.style.top = '0';
            this.trail.style.left = '0';
            this.trail.style.width = '100vw';
            this.trail.style.height = '100vh';
            this.trail.style.pointerEvents = 'none';
            this.trail.style.zIndex = '9998';
            this.trail.style.opacity = '1';
            document.body.appendChild(this.trail);
            console.log('Created trail container');
        }
        
        // Create trail dot if it doesn't exist
        if (!this.trailDot) {
            this.trailDot = document.createElement('div');
            this.trailDot.className = 'trail-dot';
            this.trailDot.style.position = 'fixed';
            this.trailDot.style.width = '80px';
            this.trailDot.style.height = '80px';
            this.trailDot.style.borderRadius = '60% 40% 70% 30%';
            this.trailDot.style.pointerEvents = 'none';
            this.trailDot.style.zIndex = '9999';
            this.trailDot.style.opacity = '0.6';
            this.trailDot.style.filter = 'blur(20px)';
            this.trailDot.style.transform = 'translate(-50%, -50%)';
            this.trailDot.style.background = 'radial-gradient(ellipse 120% 80% at 45% 40%, rgba(50, 50, 50, 0.5) 0%, rgba(80, 80, 80, 0.4) 20%, rgba(100, 100, 100, 0.3) 40%, rgba(70, 70, 70, 0.2) 60%, rgba(40, 40, 40, 0.1) 80%, transparent 100%)';
            this.trailDot.style.left = '50px';
            this.trailDot.style.top = '50px';
            document.body.appendChild(this.trailDot);
            console.log('Created trail dot directly on body');
        }
        
        // Create particle container if it doesn't exist
        if (!this.particleContainer) {
            this.particleContainer = document.createElement('div');
            this.particleContainer.className = 'trail-particles';
            this.particleContainer.style.position = 'fixed';
            this.particleContainer.style.top = '0';
            this.particleContainer.style.left = '0';
            this.particleContainer.style.width = '100vw';
            this.particleContainer.style.height = '100vh';
            this.particleContainer.style.pointerEvents = 'none';
            this.particleContainer.style.zIndex = '9997';
            document.body.appendChild(this.particleContainer);
            console.log('Created particle container');
        }
    }

    init() {
        this.bindEvents();
        this.addHoverTargets();
        this.animate();
        console.log('MouseTrailManager initialized successfully');
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.createParticle(e.clientX, e.clientY);
        });

        // Ensure trail is always visible when mouse is on page
        document.addEventListener('mouseenter', () => {
            if (this.trail) this.trail.style.opacity = '1';
            if (this.trailDot) this.trailDot.style.opacity = '0.4';
            if (this.particleContainer) this.particleContainer.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            if (this.trail) this.trail.style.opacity = '0';
            if (this.trailDot) this.trailDot.style.opacity = '0';
            if (this.particleContainer) this.particleContainer.style.opacity = '0';
        });
        
        // Make sure trail is visible from start and properly styled
        if (this.trail) {
            this.trail.style.opacity = '1';
            this.trail.style.position = 'fixed';
            this.trail.style.top = '0';
            this.trail.style.left = '0';
            this.trail.style.width = '100vw';
            this.trail.style.height = '100vh';
            this.trail.style.pointerEvents = 'none';
            this.trail.style.zIndex = '9998';
        }
        
        if (this.trailDot) {
            this.trailDot.style.opacity = '0.4';
            this.trailDot.style.position = 'fixed';
            this.trailDot.style.pointerEvents = 'none';
            this.trailDot.style.zIndex = '9999';
            this.trailDot.style.display = 'block';
            this.trailDot.style.visibility = 'visible';
            console.log('Trail dot styled:', this.trailDot);
        }
        
        if (this.particleContainer) this.particleContainer.style.opacity = '1';
    }

    createParticle(x, y) {
        const now = Date.now();
        
        // Calculate mouse movement speed
        const deltaX = x - (this.lastMouseX || x);
        const deltaY = y - (this.lastMouseY || y);
        const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Skip if no movement
        if (speed < 2) {
            this.lastMouseX = x;
            this.lastMouseY = y;
            return;
        }
        
        // Throttling - only create particles every 30ms (more frequent)
        if (now - this.lastParticleTime < 30) {
            this.lastMouseX = x;
            this.lastMouseY = y;
            return;
        }
        
        this.lastParticleTime = now;
        this.lastMouseX = x;
        this.lastMouseY = y;
        
        // Create 2-3 particles based on speed (reduced from 3-5)
        const particleCount = Math.min(Math.floor(speed / 30) + 2, 3);
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            
            // Get theme for particle color - INVERTED LOGIC
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const particleColor = isDark ? 
                'rgba(255, 255, 255, 0.8)' : 
                'rgba(50, 50, 50, 0.8)';
            const shadowColor = isDark ? 
                'rgba(255, 255, 255, 0.6)' : 
                'rgba(50, 50, 50, 0.6)';
            
            // Set ALL styles inline for beautiful particles
            particle.style.position = 'fixed';
            particle.style.left = (x + (Math.random() - 0.5) * 8) + 'px'; // Reduced spread from 20 to 8
            particle.style.top = (y + (Math.random() - 0.5) * 8) + 'px'; // Reduced spread from 20 to 8
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.background = particleColor;
            particle.style.borderRadius = '50%';
            particle.style.opacity = '1';
            particle.style.zIndex = '9999';
            particle.style.pointerEvents = 'none';
            particle.style.transform = 'translate(-50%, -50%)';
            particle.style.boxShadow = `0 0 8px ${shadowColor}`;
            
            // Add to body (we know this works)
            document.body.appendChild(particle);
            this.particles.push(particle);
            
            // Smooth fade out animation with even shorter lifespan
            let opacity = 1;
            let scale = 1;
            const fadeOut = setInterval(() => {
                opacity -= 0.12; // Even faster fade (was 0.08)
                scale -= 0.08; // Even faster shrink (was 0.05)
                if (opacity <= 0) {
                    clearInterval(fadeOut);
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                    const index = this.particles.indexOf(particle);
                    if (index > -1) {
                        this.particles.splice(index, 1);
                    }
                } else {
                    particle.style.opacity = opacity;
                    particle.style.transform = `translate(-50%, -50%) scale(${scale})`;
                }
            }, 35); // Even faster animation interval (was 40ms)
        }
    }

    animate() {
        const updateTrail = () => {
            // Smooth trail following
            this.trailX += (this.mouseX - this.trailX) * 0.12;
            this.trailY += (this.mouseY - this.trailY) * 0.12;
            
            // Smooth hover intensity interpolation
            this.hoverIntensity += (this.targetHoverIntensity - this.hoverIntensity) * 0.08;
            
            // Update trail position and hover effects
            if (this.trailDot) {
                this.trailDot.style.left = this.trailX + 'px';
                this.trailDot.style.top = this.trailY + 'px';
                
                // Interpolate size and opacity based on hover intensity
                const baseSize = 80;
                const hoverSize = 140;
                const currentSize = baseSize + (hoverSize - baseSize) * this.hoverIntensity;
                
                const baseOpacity = 0.6;
                const hoverOpacity = 0.7;
                const currentOpacity = baseOpacity + (hoverOpacity - baseOpacity) * this.hoverIntensity;
                
                const baseBlur = 20;
                const hoverBlur = 25;
                const currentBlur = baseBlur + (hoverBlur - baseBlur) * this.hoverIntensity;
                
                this.trailDot.style.width = currentSize + 'px';
                this.trailDot.style.height = currentSize + 'px';
                this.trailDot.style.opacity = currentOpacity;
                this.trailDot.style.filter = `blur(${currentBlur}px)`;
                
                // Interpolate background colors
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                this.updateTrailBackground(isDark);
                
                // Debug: Log position occasionally
                if (Math.random() < 0.01) {
                    console.log('Trail dot:', this.trailX, this.trailY, 'Hover:', this.hoverIntensity.toFixed(2));
                }
            }
            
            requestAnimationFrame(updateTrail);
        };
        
        updateTrail();
    }

    updateTrailBackground(isDark) {
        if (!this.trailDot) return;
        
        const intensity = this.hoverIntensity;
        
        if (isDark) {
            // Dark mode: white/light colors
            const baseColors = [
                `rgba(255, 255, 255, ${0.5 + intensity * 0.1})`,
                `rgba(240, 240, 255, ${0.4 + intensity * 0.1})`,
                `rgba(220, 230, 255, ${0.3 + intensity * 0.1})`,
                `rgba(200, 210, 240, ${0.2 + intensity * 0.1})`,
                `rgba(180, 190, 220, ${0.1 + intensity * 0.1})`
            ];
            
            this.trailDot.style.background = `radial-gradient(
                ellipse ${120 + intensity * 10}% ${80 - intensity * 10}% at ${45 - intensity * 5}% ${40 + intensity * 5}%,
                ${baseColors[0]} 0%,
                ${baseColors[1]} ${20 - intensity * 5}%,
                ${baseColors[2]} ${40 - intensity * 10}%,
                ${baseColors[3]} ${60 - intensity * 10}%,
                ${baseColors[4]} ${80 - intensity * 10}%,
                transparent 100%
            )`;
        } else {
            // Light mode: dark/gray colors
            const baseColors = [
                `rgba(${30 + intensity * 20}, ${30 + intensity * 20}, ${30 + intensity * 20}, ${0.5 + intensity * 0.1})`,
                `rgba(${60 + intensity * 20}, ${60 + intensity * 20}, ${60 + intensity * 20}, ${0.4 + intensity * 0.1})`,
                `rgba(${90 + intensity * 10}, ${90 + intensity * 10}, ${90 + intensity * 10}, ${0.3 + intensity * 0.1})`,
                `rgba(${50 + intensity * 10}, ${50 + intensity * 10}, ${50 + intensity * 10}, ${0.2 + intensity * 0.1})`,
                `rgba(${20 + intensity * 10}, ${20 + intensity * 10}, ${20 + intensity * 10}, ${0.1 + intensity * 0.1})`
            ];
            
            this.trailDot.style.background = `radial-gradient(
                ellipse ${120 + intensity * 10}% ${80 - intensity * 10}% at ${45 - intensity * 5}% ${40 + intensity * 5}%,
                ${baseColors[0]} 0%,
                ${baseColors[1]} ${20 - intensity * 5}%,
                ${baseColors[2]} ${40 - intensity * 10}%,
                ${baseColors[3]} ${60 - intensity * 10}%,
                ${baseColors[4]} ${80 - intensity * 10}%,
                transparent 100%
            )`;
        }
    }

    destroy() {
        // Cleanup method for performance
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        this.particles = [];
    }

    addHoverTargets() {
        // Define interactive elements
        const hoverTargets = document.querySelectorAll(
            'a, button, .project-card, .animated-logo, .theme-toggle'
        );

        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                this.isHovering = true;
                this.targetHoverIntensity = 1; // Smooth transition to full hover
            });

            target.addEventListener('mouseleave', () => {
                this.isHovering = false;
                this.targetHoverIntensity = 0; // Smooth transition back to normal
            });
        });

        // Global mouse tracking for better hover detection
        document.addEventListener('mouseover', (e) => {
            const isHoverTarget = e.target.closest('a, button, .project-card, .animated-logo, .theme-toggle');
            if (isHoverTarget && !this.isHovering) {
                this.isHovering = true;
                this.targetHoverIntensity = 1;
            }
        });

        document.addEventListener('mouseout', (e) => {
            const isLeavingHoverTarget = e.target.closest('a, button, .project-card, .animated-logo, .theme-toggle');
            const isEnteringHoverTarget = e.relatedTarget && e.relatedTarget.closest('a, button, .project-card, .animated-logo, .theme-toggle');
            
            if (isLeavingHoverTarget && !isEnteringHoverTarget) {
                this.isHovering = false;
                this.targetHoverIntensity = 0;
            }
        });
    }
}

// ================================
// PARALLAX MOUSE TRACKING (OPTIMIZED)
// ================================

class ParallaxManager {
    constructor() {
        this.isActive = true;
        this.rafId = null;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.init();
    }

    init() {
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.isActive = false;
            return;
        }
        
        this.addParallaxEffect();
    }

    addParallaxEffect() {
        let ticking = false;
        
        document.addEventListener('mousemove', (e) => {
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
            
            if (!ticking) {
                this.rafId = requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    updateParallax() {
        if (!this.isActive) return;
        
        const { innerWidth: width, innerHeight: height } = window;
        const xPercent = (this.lastMouseX / width - 0.5) * 2;
        const yPercent = (this.lastMouseY / height - 0.5) * 2;

        // Batch DOM updates
        const elements = [
            { selector: '.logo-circle-1', x: xPercent * 3, y: yPercent * 3 },
            { selector: '.logo-circle-2', x: xPercent * -2, y: yPercent * -2 },
            { selector: '.logo-circle-3', x: xPercent * 2.5, y: yPercent * -1.5 },
            { selector: '.logo-circle-4', x: xPercent * -1.5, y: yPercent * 2.5 },
            { selector: '.hero-title', x: xPercent * 1, y: yPercent * 1 }
        ];

        elements.forEach(({ selector, x, y }) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.transform = `translate(${x}px, ${y}px)`;
            }
        });
    }

    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }
}

// ================================
// MAGNETIC EFFECT (OPTIMIZED)
// ================================

class MagneticEffectManager {
    constructor() {
        this.rafId = null;
        this.init();
    }

    init() {
        this.addMagneticEffect();
    }

    addMagneticEffect() {
        const magneticElements = document.querySelectorAll('.theme-toggle, .animated-logo');
        
        magneticElements.forEach((element, index) => {
            let isHovering = false;
            let ticking = false;
            let currentX = 0;
            let currentY = 0;
            let targetX = 0;
            let targetY = 0;
            
            // Animation loop for smooth interpolation
            const animate = () => {
                if (isHovering) {
                    // Smooth interpolation to target position
                    currentX += (targetX - currentX) * 0.15;
                    currentY += (targetY - currentY) * 0.15;
                    
                    element.style.transform = `translate(${currentX}px, ${currentY}px)`;
                    requestAnimationFrame(animate);
                } else {
                    // Smooth return to center
                    currentX += (0 - currentX) * 0.08; // Slower return
                    currentY += (0 - currentY) * 0.08;
                    
                    element.style.transform = `translate(${currentX}px, ${currentY}px)`;
                    
                    // Continue animating until we're close enough to center
                    if (Math.abs(currentX) > 0.1 || Math.abs(currentY) > 0.1) {
                        requestAnimationFrame(animate);
                    } else {
                        // Snap to exact center when close enough
                        element.style.transform = 'translate(0, 0)';
                        currentX = 0;
                        currentY = 0;
                    }
                }
            };
            
            element.addEventListener('mouseenter', () => {
                isHovering = true;
                // Remove any CSS transitions to allow JS control
                element.style.transition = 'none';
                animate();
            }, { passive: true });
            
            element.addEventListener('mousemove', (e) => {
                if (!isHovering || ticking) return;
                
                ticking = true;
                requestAnimationFrame(() => {
                    const rect = element.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    
                    const deltaX = e.clientX - centerX;
                    const deltaY = e.clientY - centerY;
                    
                    // Reduced strength for smoother effect
                    const strength = element.classList.contains('animated-logo') ? 0.08 : 0.06;
                    targetX = deltaX * strength;
                    targetY = deltaY * strength;
                    
                    ticking = false;
                });
            }, { passive: true });
            
            element.addEventListener('mouseleave', () => {
                isHovering = false;
                targetX = 0;
                targetY = 0;
                // animate() will handle the smooth return
            }, { passive: true });
        });
    }

    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
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
        // Logo interaction removed - logo is now non-interactive
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
        
        // Safety check to prevent null errors
        if (!title || !description) return;
        
        if (direction === 'enter') {
            title.style.transform = 'translateY(-2px)';
            description.style.transform = 'translateY(-2px)';
        } else {
            title.style.transform = 'translateY(0)';
            description.style.transform = 'translateY(0)';
        }
    }

    addClickEffect(e) {
        // Allow normal navigation to proceed
        const card = e.currentTarget;
        
        // Add a subtle click animation
        card.style.transform = 'translateY(-4px) scale(0.98)';
        
        setTimeout(() => {
            card.style.transform = 'translateY(-4px) scale(1)';
        }, 150);
        
        // Navigation happens normally via href
    }

    addScrollEffects() {
        // Removed scroll effects since we no longer have a fixed header
        // The integrated navigation doesn't need scroll-based styling changes
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

// ================================
// INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize intro animation first
    const introManager = new IntroAnimationManager();
    
    // Initialize other managers after a short delay to let intro play
    setTimeout(() => {
        const themeManager = new ThemeManager();
        const accessibilityManager = new AccessibilityManager();
        
        requestAnimationFrame(() => {
            const mouseTrailManager = new MouseTrailManager();
            const parallaxManager = new ParallaxManager();
            const animationManager = new AnimationManager();
        });
    }, 100);
    
    // Initialize magnetic effect after intro is complete
    setTimeout(() => {
        const magneticManager = new MagneticEffectManager();
    }, 3000); // After intro animation completes
    
    // Add visual feedback for successful load
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
