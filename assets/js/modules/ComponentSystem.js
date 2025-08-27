/**
 * ================================
 * COMPONENT SYSTEM
 * ================================
 * Simple component system for reusable UI elements
 */

class ComponentSystem {
    constructor() {
        this.components = new Map();
        this.instances = new Map();
        
        this.init();
    }

    init() {
        this.registerBuiltInComponents();
        this.autoInitializeComponents();
    }

    // Register a component class
    register(name, componentClass) {
        this.components.set(name, componentClass);
    }

    // Create component instance
    create(name, element, options = {}) {
        const ComponentClass = this.components.get(name);
        if (!ComponentClass) {
            console.warn(`Component "${name}" not found`);
            return null;
        }

        const instance = new ComponentClass(element, options);
        
        // Store instance for cleanup
        if (!this.instances.has(element)) {
            this.instances.set(element, new Set());
        }
        this.instances.get(element).add(instance);

        return instance;
    }

    // Auto-initialize components based on data attributes
    autoInitializeComponents() {
        document.querySelectorAll('[data-component]').forEach(element => {
            const componentName = element.dataset.component;
            const options = element.dataset.componentOptions ? 
                JSON.parse(element.dataset.componentOptions) : {};
            
            this.create(componentName, element, options);
        });
    }

    // Clean up component instances for an element
    cleanup(element) {
        const instances = this.instances.get(element);
        if (instances) {
            instances.forEach(instance => {
                if (instance.destroy) {
                    instance.destroy();
                }
            });
            this.instances.delete(element);
        }
    }

    registerBuiltInComponents() {
        // Modal Component
        this.register('modal', class Modal {
            constructor(element, options = {}) {
                this.element = element;
                this.options = {
                    closeOnOverlay: true,
                    closeOnEscape: true,
                    ...options
                };
                
                this.init();
            }

            init() {
                this.bindEvents();
            }

            bindEvents() {
                // Close button
                const closeBtn = this.element.querySelector('[data-modal-close]');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => this.close());
                }

                // Overlay click
                if (this.options.closeOnOverlay) {
                    this.element.addEventListener('click', (e) => {
                        if (e.target === this.element) {
                            this.close();
                        }
                    });
                }

                // Escape key
                if (this.options.closeOnEscape) {
                    this.escapeHandler = (e) => {
                        if (e.key === 'Escape') {
                            this.close();
                        }
                    };
                }
            }

            open() {
                this.element.classList.add('active');
                document.body.classList.add('modal-open');
                
                if (this.escapeHandler) {
                    document.addEventListener('keydown', this.escapeHandler);
                }
                
                // Focus trap
                this.trapFocus();
            }

            close() {
                this.element.classList.remove('active');
                document.body.classList.remove('modal-open');
                
                if (this.escapeHandler) {
                    document.removeEventListener('keydown', this.escapeHandler);
                }
            }

            trapFocus() {
                const focusableElements = this.element.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableElements.length > 0) {
                    focusableElements[0].focus();
                }
            }

            destroy() {
                if (this.escapeHandler) {
                    document.removeEventListener('keydown', this.escapeHandler);
                }
            }
        });

        // Dropdown Component
        this.register('dropdown', class Dropdown {
            constructor(element, options = {}) {
                this.element = element;
                this.trigger = element.querySelector('[data-dropdown-trigger]');
                this.menu = element.querySelector('[data-dropdown-menu]');
                this.options = {
                    closeOnClickOutside: true,
                    ...options
                };
                
                this.isOpen = false;
                this.init();
            }

            init() {
                this.bindEvents();
            }

            bindEvents() {
                if (this.trigger) {
                    this.trigger.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.toggle();
                    });
                }

                if (this.options.closeOnClickOutside) {
                    document.addEventListener('click', (e) => {
                        if (!this.element.contains(e.target) && this.isOpen) {
                            this.close();
                        }
                    });
                }
            }

            toggle() {
                this.isOpen ? this.close() : this.open();
            }

            open() {
                this.isOpen = true;
                this.element.classList.add('open');
                this.menu?.classList.add('show');
            }

            close() {
                this.isOpen = false;
                this.element.classList.remove('open');
                this.menu?.classList.remove('show');
            }

            destroy() {
                // Cleanup handled by main system
            }
        });

        // Tab Component
        this.register('tabs', class Tabs {
            constructor(element, options = {}) {
                this.element = element;
                this.tabs = element.querySelectorAll('[data-tab]');
                this.panels = element.querySelectorAll('[data-tab-panel]');
                this.activeTab = element.querySelector('[data-tab].active') || this.tabs[0];
                
                this.init();
            }

            init() {
                this.bindEvents();
                this.setActiveTab(this.activeTab);
            }

            bindEvents() {
                this.tabs.forEach(tab => {
                    tab.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.setActiveTab(tab);
                    });
                });
            }

            setActiveTab(activeTab) {
                const targetId = activeTab.dataset.tab;
                
                // Update tabs
                this.tabs.forEach(tab => {
                    tab.classList.toggle('active', tab === activeTab);
                });

                // Update panels
                this.panels.forEach(panel => {
                    panel.classList.toggle('active', panel.id === targetId);
                });

                this.activeTab = activeTab;
            }

            destroy() {
                // Cleanup handled by main system
            }
        });
    }
}

export default ComponentSystem;
