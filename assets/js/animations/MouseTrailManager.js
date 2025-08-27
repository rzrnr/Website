/**
 * ================================
 * MOUSE TRAIL MANAGER
 * ================================
 * Handles mouse trail effects and particles
 */

export class MouseTrailManager {
    constructor() {
        this.trail = document.querySelector('.trail-dot');
        this.particleContainer = document.querySelector('.trail-particles');
        this.mouseX = 0;
        this.mouseY = 0;
        this.trailX = 0;
        this.trailY = 0;
        this.particles = [];
        this.lastParticleTime = 0;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.isVisible = false;
        
        this.init();
    }

    init() {
        if (this.trail && this.particleContainer) {
            this.bindEvents();
            this.animate();
            this.addFloatAnimationStyles();
        }
    }

    bindEvents() {
        document.addEventListener('mousemove', this.throttle((e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.createParticle(e.clientX, e.clientY);
            
            if (!this.isVisible) {
                this.showTrail();
            }
        }, 16));

        document.addEventListener('mouseenter', () => {
            this.showTrail();
        });

        document.addEventListener('mouseleave', () => {
            this.hideTrail();
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.hideTrail();
            }
        });
    }

    showTrail() {
        this.isVisible = true;
        if (this.particleContainer) this.particleContainer.style.opacity = '1';
    }

    hideTrail() {
        this.isVisible = false;
        if (this.particleContainer) this.particleContainer.style.opacity = '0';
    }

    createParticle(x, y) {
        const now = Date.now();
        
        const deltaX = x - (this.lastMouseX || x);
        const deltaY = y - (this.lastMouseY || y);
        const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (speed < 2) {
            this.lastMouseX = x;
            this.lastMouseY = y;
            return;
        }
        
        if (now - this.lastParticleTime < 30) {
            this.lastMouseX = x;
            this.lastMouseY = y;
            return;
        }
        
        this.lastParticleTime = now;
        this.lastMouseX = x;
        this.lastMouseY = y;
        
        const particleCount = Math.min(Math.floor(speed / 30) + 2, 3);
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const particleColor = isDark ? 
                'rgba(150, 200, 255, 0.8)' : 
                'rgba(50, 50, 50, 0.8)';
            const shadowColor = isDark ? 
                'rgba(150, 200, 255, 0.6)' : 
                'rgba(50, 50, 50, 0.6)';
            
            particle.style.position = 'fixed';
            particle.style.left = (x + (Math.random() - 0.5) * 8) + 'px';
            particle.style.top = (y + (Math.random() - 0.5) * 8) + 'px';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.background = particleColor;
            particle.style.borderRadius = '50%';
            particle.style.opacity = '1';
            particle.style.zIndex = '9999';
            particle.style.pointerEvents = 'none';
            particle.style.transform = 'translate(-50%, -50%)';
            particle.style.boxShadow = `0 0 8px ${shadowColor}`;
            
            document.body.appendChild(particle);
            this.particles.push(particle);
            
            let opacity = 1;
            let scale = 1;
            const fadeOut = setInterval(() => {
                opacity -= 0.12;
                scale -= 0.08;
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
            }, 35);
        }
    }

    animate() {
        const updateTrail = () => {
            this.trailX += (this.mouseX - this.trailX) * 0.08;
            this.trailY += (this.mouseY - this.trailY) * 0.08;
            
            if (this.trail) {
                this.trail.style.transform = `translate3d(${this.trailX}px, ${this.trailY}px, 0)`;
            }
            
            requestAnimationFrame(updateTrail);
        };
        
        updateTrail();
    }

    addFloatAnimationStyles() {
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
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = introStyles;
        document.head.appendChild(styleSheet);
    }

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
    }

    destroy() {
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        this.particles = [];
    }
}
