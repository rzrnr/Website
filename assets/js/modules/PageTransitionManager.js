/**
 * ================================
 * PAGE TRANSITION MANAGER
 * ================================
 * Handles smooth page transitions and routing
 */

class PageTransitionManager {
    constructor() {
        this.isTransitioning = false;
        this.currentPage = window.location.pathname;
        this.transitionDuration = 600;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleInitialLoad();
    }

    bindEvents() {
        // Handle all internal link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="/"], a[href^="./"], a[href^="../"]');
            if (link && !link.hasAttribute('target')) {
                e.preventDefault();
                this.navigateTo(link.href);
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state) {
                this.loadPage(e.state.url, false);
            }
        });
    }

    handleInitialLoad() {
        // Add initial page state
        history.replaceState(
            { url: this.currentPage }, 
            document.title, 
            this.currentPage
        );
        
        // Trigger enter animation for initial page
        this.animatePageEnter();
    }

    async navigateTo(url) {
        if (this.isTransitioning || url === this.currentPage) return;
        
        this.isTransitioning = true;
        
        try {
            // Exit animation
            await this.animatePageExit();
            
            // Load new page
            await this.loadPage(url, true);
            
            // Enter animation
            await this.animatePageEnter();
            
        } catch (error) {
            console.error('Page transition error:', error);
            window.location.href = url; // Fallback to normal navigation
        } finally {
            this.isTransitioning = false;
        }
    }

    async loadPage(url, pushState = true) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const html = await response.text();
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');
            
            // Update page content
            this.updatePageContent(newDoc);
            
            // Update browser history
            if (pushState) {
                history.pushState({ url }, newDoc.title, url);
            }
            
            this.currentPage = url;
            
        } catch (error) {
            throw error;
        }
    }

    updatePageContent(newDoc) {
        // Update title
        document.title = newDoc.title;
        
        // Update meta tags
        this.updateMetaTags(newDoc);
        
        // Update main content
        const currentMain = document.querySelector('main');
        const newMain = newDoc.querySelector('main');
        if (currentMain && newMain) {
            currentMain.innerHTML = newMain.innerHTML;
        }
        
        // Re-initialize page-specific scripts
        this.initializePageScripts();
    }

    updateMetaTags(newDoc) {
        const metaTags = ['description', 'keywords', 'og:title', 'og:description', 'og:image'];
        
        metaTags.forEach(name => {
            const currentMeta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
            const newMeta = newDoc.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
            
            if (newMeta) {
                if (currentMeta) {
                    currentMeta.setAttribute('content', newMeta.getAttribute('content'));
                } else {
                    document.head.appendChild(newMeta.cloneNode(true));
                }
            }
        });
    }

    animatePageExit() {
        return new Promise((resolve) => {
            const main = document.querySelector('main');
            if (!main) {
                resolve();
                return;
            }
            
            main.classList.add('page-exit', 'page-exit-active');
            
            setTimeout(() => {
                resolve();
            }, this.transitionDuration / 2);
        });
    }

    animatePageEnter() {
        return new Promise((resolve) => {
            const main = document.querySelector('main');
            if (!main) {
                resolve();
                return;
            }
            
            // Reset classes
            main.classList.remove('page-exit', 'page-exit-active');
            main.classList.add('page-enter');
            
            // Trigger reflow
            main.offsetHeight;
            
            // Add active class
            main.classList.add('page-enter-active');
            
            setTimeout(() => {
                main.classList.remove('page-enter', 'page-enter-active');
                resolve();
            }, this.transitionDuration);
        });
    }

    initializePageScripts() {
        // Dispatch custom event for page-specific initialization
        document.dispatchEvent(new CustomEvent('pageLoaded', {
            detail: { url: this.currentPage }
        }));
    }
}

// Export for use in other modules
export default PageTransitionManager;
