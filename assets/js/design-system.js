/**
 * ================================
 * DESIGN SYSTEM CONFIGURATION
 * ================================
 * Wiederverwendbare Design-Elemente für neue Seiten
 */

// Design System Export für andere Seiten
window.GuglıStudiosDesignSystem = {
    
    // Color Themes
    themes: {
        light: {
            bgPrimary: '#ffffff',
            bgSecondary: '#f8f9fa',
            textPrimary: '#212529',
            textSecondary: '#6c757d',
            accentPrimary: '#007bff',
            accentSecondary: '#6f42c1'
        },
        dark: {
            bgPrimary: '#0d1117',
            bgSecondary: '#161b22',
            textPrimary: '#f0f6fc',
            textSecondary: '#8b949e',
            accentPrimary: '#58a6ff',
            accentSecondary: '#a5a3ff'
        }
    },

    // Wiederverwendbare Komponenten
    components: {
        // Theme Toggle Button (HTML)
        themeToggle: `
            <button class="theme-toggle" id="theme-toggle" aria-label="Theme umschalten">
                <svg class="theme-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle class="sun" cx="12" cy="12" r="5"/>
                    <path class="sun-rays" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                    <path class="moon" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
            </button>
        `,
        
        // Logo Animation (HTML)
        logoAnimation: `
            <div class="logo-animation">
                <svg class="animated-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle class="logo-circle logo-circle-1" cx="30" cy="50" r="8"/>
                    <circle class="logo-circle logo-circle-2" cx="50" cy="30" r="8"/>
                    <circle class="logo-circle logo-circle-3" cx="70" cy="50" r="8"/>
                    <circle class="logo-circle logo-circle-4" cx="50" cy="70" r="8"/>
                    <path class="logo-path" d="M30,50 Q50,30 70,50 Q50,70 30,50" stroke-width="2" fill="none"/>
                </svg>
            </div>
        `,

        // Navigation (HTML)
        navigation: `
            <nav class="hero-nav">
                <div class="nav-left">
                    <a href="../index.html" class="logo">Gugli Studios</a>
                </div>
                <div class="nav-right">
                    <!-- Theme toggle wird hier eingefügt -->
                </div>
            </nav>
        `
    },

    // Utility Funktionen für neue Seiten
    utils: {
        // Theme Management
        initTheme: function() {
            const themeToggle = document.getElementById('theme-toggle');
            const currentTheme = localStorage.getItem('theme') || 
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            
            document.documentElement.setAttribute('data-theme', currentTheme);
            
            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                    document.documentElement.setAttribute('data-theme', newTheme);
                    localStorage.setItem('theme', newTheme);
                });
            }
        },

        // Simple Animation Helper
        fadeIn: function(element, delay = 0) {
            setTimeout(() => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                });
            }, delay);
        },

        // Page Transition Helper
        transitionTo: function(url) {
            document.body.style.opacity = '0.8';
            document.body.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                window.location.href = url;
            }, 300);
        }
    },

    // Animation Presets
    animations: {
        fadeInUp: 'opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease;',
        scaleIn: 'opacity: 0; transform: scale(0.9); transition: opacity 0.5s ease, transform 0.5s ease;',
        slideLeft: 'opacity: 0; transform: translateX(-30px); transition: opacity 0.6s ease, transform 0.6s ease;'
    }
};

// Auto-initialize für Seiten die das Design System laden
document.addEventListener('DOMContentLoaded', function() {
    if (window.GuglıStudiosDesignSystem && typeof window.GuglıStudiosDesignSystem.utils.initTheme === 'function') {
        window.GuglıStudiosDesignSystem.utils.initTheme();
    }
});
