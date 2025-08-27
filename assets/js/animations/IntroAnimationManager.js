/**
 * ================================
 * INTRO ANIMATION MANAGER
 * ================================
 * Handles the intro logo animation
 */

export class IntroAnimationManager {
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
            this.skipIntro();
        } else {
            this.playIntro();
        }
    }

    playIntro() {
        document.body.classList.add('intro-playing');
        
        if (this.introOverlay) {
            this.introOverlay.classList.remove('hidden');
        }
        if (this.mainContent) {
            this.mainContent.classList.remove('show');
        }

        setTimeout(() => {
            this.calculateFinalPosition();
        }, 100);

        setTimeout(() => {
            this.startLogoAnimation();
        }, 800);

        setTimeout(() => {
            this.animateToNormalState();
        }, 2500);

        setTimeout(() => {
            this.completeIntro();
        }, 2500);

        sessionStorage.setItem('introPlayed', 'true');
    }

    calculateFinalPosition() {
        requestAnimationFrame(() => {
            if (this.normalLogo) {
                const rect = this.normalLogo.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                const finalLeft = ((rect.left + rect.width / 2) / viewportWidth) * 100;
                const finalTop = ((rect.top + rect.height / 2) / viewportHeight) * 100;
                
                document.documentElement.style.setProperty('--logo-final-left', `${finalLeft}%`);
                document.documentElement.style.setProperty('--logo-final-top', `${finalTop}%`);
            }
        });
    }

    startLogoAnimation() {
        if (this.introLogo) {
            this.introLogo.style.animation = 'introFloat 1.5s ease-in-out infinite';
        }
    }

    animateToNormalState() {
        if (this.introLogo) {
            this.introLogo.classList.add('animate-out');
        }

        setTimeout(() => {
            if (this.mainContent) {
                this.mainContent.classList.add('show');
            }
        }, 1200);
    }

    completeIntro() {
        setTimeout(() => {
            document.body.classList.remove('intro-playing');
            document.body.classList.add('intro-complete');
            
            if (this.introOverlay) {
                this.introOverlay.classList.add('hidden');
            }
        }, 2000);

        setTimeout(() => {
            if (this.introOverlay && this.introOverlay.parentNode) {
                this.introOverlay.parentNode.removeChild(this.introOverlay);
            }
        }, 2800);
    }

    skipIntro() {
        document.body.classList.add('intro-complete');
        if (this.introOverlay) {
            this.introOverlay.style.display = 'none';
        }
        if (this.mainContent) {
            this.mainContent.classList.add('show');
        }
    }
}
