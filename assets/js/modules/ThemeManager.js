/**
 * ================================
 * THEME MANAGER
 * ================================
 * Handles dark/light theme switching
 */

export class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }

    bindEvents() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update toggle button state
        if (this.themeToggle) {
            this.themeToggle.setAttribute('aria-label', 
                theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
            );
        }

        // Dispatch theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme }
        }));
    }

    getTheme() {
        return this.currentTheme;
    }

    destroy() {
        // Cleanup if needed
    }
}
