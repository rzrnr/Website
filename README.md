# Gugli Studios Website

## 🚀 Struktur

Die Website ist jetzt modular aufgebaut für einfache Erweiterung und Wartung:

```
Website/
├── index-modular.html        # Neue Hauptseite (modular)
├── index.html               # Original-Backup
├── assets/
│   ├── css/
│   │   └── main.css         # Alle Styles (kopiert von styles.css)
│   └── js/
│       ├── main.js          # Hauptfunktionalität (kopiert von script.js)
│       └── design-system.js # Wiederverwendbare Komponenten
├── pages/
│   ├── portfolio/
│   │   └── index.html       # Portfolio-Seite
│   └── about/
│       └── index.html       # Über uns-Seite
└── README.md               # Diese Datei
```

## 🎨 Design System

Das `design-system.js` stellt wiederverwendbare Komponenten und Utilities bereit:

- **DesignSystem.config**: Zentrale Konfiguration für Farben, Spacing, etc.
- **DesignSystem.components**: Vorgefertigte HTML-Komponenten
- **DesignSystem.animations**: Wiederverwendbare Animationen
- **DesignSystem.utils**: Hilfs-Funktionen

## 📁 Neue Seiten hinzufügen

1. Neuen Ordner unter `pages/` erstellen
2. `index.html` mit folgendem Template erstellen:

```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seitentitel - Gugli Studios</title>
    <link rel="stylesheet" href="../assets/css/main.css">
</head>
<body>
    <main class="main">
        <section class="hero">
            <!-- Header mit Navigation -->
            <div class="hero-header">
                <nav class="hero-nav">
                    <div class="nav-left">
                        <a href="../index-modular.html" class="logo">Gugli Studios</a>
                    </div>
                    <div class="nav-right">
                        <button class="theme-toggle" id="theme-toggle">...</button>
                    </div>
                </nav>
            </div>
            
            <!-- Dein Content hier -->
            <div class="hero-content">
                <div class="hero-main">
                    <h1 class="hero-title">Dein <span class="highlight">Titel</span></h1>
                    <!-- Weitere Inhalte -->
                </div>
            </div>
        </section>
    </main>
    
    <script src="../assets/js/design-system.js"></script>
</body>
</html>
```

3. Link zur neuen Seite in der Hauptnavigation hinzufügen

## 🔄 Funktionalität

- **index-modular.html**: Vollständig funktionsfähige Hauptseite mit intro-Animation
- **Alle Animationen**: Mouse-Trail, Theme-Toggle, Logo-Animationen funktionieren
- **Theme-System**: Dark/Light Mode wird gespeichert
- **Responsive Design**: Funktioniert auf allen Geräten

## 🎯 Vorteile der neuen Struktur

- **Wiederverwendbare Komponenten**: Einmal definiert, überall nutzbar
- **Konsistentes Design**: Alle Seiten nutzen das gleiche Design System
- **Einfache Erweiterung**: Neue Seiten in wenigen Minuten erstellt
- **Zentrale Wartung**: Änderungen an einem Ort wirken sich überall aus
- **Performance**: Optimierte Assets und modularer Code

## 🚀 Nächste Schritte

1. Teste `index-modular.html` - sollte identisch zu original funktionieren
2. Besuche die Beispiel-Seiten: `/pages/portfolio/` und `/pages/about/`
3. Erstelle weitere Seiten nach Bedarf
4. Erweitere das Design System bei neuen wiederkehrenden Elementen
│   │   │   ├── cards.css
│   │   │   ├── modal.css
│   │   │   └── forms.css
│   │   ├── layout/                 # Layout-spezifische Styles
│   │   │   ├── intro.css
│   │   │   └── mouse-effects.css
│   │   └── pages/                  # Seiten-spezifische Styles
│   │       ├── home.css
│   │       ├── portfolio.css
│   │       ├── blog.css
│   │       └── about.css
│   ├── js/                         # Modulares JavaScript
│   │   ├── app.js                  # Haupt-App Entry Point
│   │   ├── modules/                # Core Module
│   │   │   ├── PageTransitionManager.js
│   │   │   ├── AnimationController.js
│   │   │   ├── ComponentSystem.js
│   │   │   └── ThemeManager.js
│   │   ├── animations/             # Animation-spezifische Module
│   │   │   ├── IntroAnimationManager.js
│   │   │   └── MouseTrailManager.js
│   │   └── pages/                  # Seiten-spezifische Module
│   │       ├── home.js
│   │       ├── portfolio.js
│   │       └── blog.js
│   ├── images/                     # Bilder & Grafiken
│   └── icons/                      # Icons & SVGs
├── pages/                          # Einzelne Seiten
│   ├── portfolio/
│   │   └── index.html
│   ├── blog/
│   │   └── index.html
│   ├── about/
│   │   └── index.html
│   └── contact/
│       └── index.html
├── components/                     # Wiederverwendbare HTML-Komponenten
├── data/                          # JSON/Data Files
├── index.html                     # Hauptseite
└── README.md                      # Diese Dokumentation
```

## 🏗️ Architektur-Prinzipien

### 1. **Modularität**
- Jede Funktionalität ist in eigene Module aufgeteilt
- CSS und JavaScript sind komponentenbasiert organisiert
- Wiederverwendbare Komponenten für konsistente UI

### 2. **Skalierbarkeit**
- Einfaches Hinzufügen neuer Seiten und Komponenten
- Modulares System erlaubt schrittweise Erweiterung
- Klare Trennung von Zuständigkeiten

### 3. **Performance**
- Lazy Loading für Module
- CSS und JS werden nur geladen wenn benötigt
- Optimierte Animations- und Effekt-System

### 4. **Wartbarkeit**
- Klare Ordnerstruktur und Namenskonventionen
- Dokumentierter Code mit JSDoc
- Einheitliche Code-Standards

## 🎨 CSS-System

### Variables (Custom Properties)
Alle Design-Token sind in `variables.css` zentralisiert:
- Farben (Light/Dark Theme)
- Spacing (xs, sm, md, lg, xl, 2xl, 3xl)
- Typography (Font-Familien, Größen)
- Transitions & Animations
- Z-Index Scale
- Border Radius
- Shadows

### Utility Classes
Atomare CSS-Klassen für schnelle Layouts:
```css
.flex-center     /* display: flex; align-items: center; justify-content: center; */
.grid-cols-3     /* grid-template-columns: repeat(3, 1fr); */
.mt-lg          /* margin-top: var(--space-lg); */
.text-center    /* text-align: center; */
```

### Animation System
Vorgefertigte Animationsklassen und Keyframes:
```css
.animate-fade-in     /* Einblend-Animation */
.animate-slide-up    /* Von unten einsliden */
.hover-lift         /* Hover-Effekt mit Lift */
.animate-delay-200  /* Animation verzögern */
```

## 🚀 JavaScript-Module

### Core Module

#### App.js
- Haupt-Entry-Point der Anwendung
- Initialisiert alle anderen Module
- Bietet globale Utility-Funktionen

#### PageTransitionManager
- Smooth Page Transitions für SPA-ähnliche Erfahrung
- Browser History Management
- Meta-Tag Updates

#### AnimationController
- Zentrale Steuerung aller Animationen
- Intersection Observer für Scroll-Animationen
- Stagger-Animationen und Sequenzen
- Reduced Motion Support

#### ComponentSystem
- Einfaches Komponenten-System
- Auto-Initialisierung über data-Attribute
- Built-in Komponenten (Modal, Dropdown, Tabs)

#### ThemeManager
- Dark/Light Theme Switching
- System-Präferenz Detection
- LocalStorage Persistierung

### Animation Module

#### IntroAnimationManager
- Logo-Intro Animation wie Browser Company
- Session-based Replay-Prevention
- Smooth Übergang zur Hauptseite

#### MouseTrailManager
- Mouse Trail Effekte
- Partikel-System
- Performance-optimiert mit Throttling

## 🔧 Verwendung & Erweiterung

### Neue Seite hinzufügen

1. **HTML erstellen:**
```bash
mkdir pages/neue-seite
touch pages/neue-seite/index.html
```

2. **CSS erstellen:**
```bash
touch assets/css/pages/neue-seite.css
```

3. **In main.css importieren:**
```css
@import url('./pages/neue-seite.css');
```

4. **Optional: JavaScript-Modul:**
```bash
touch assets/js/pages/neue-seite.js
```

### Neue Komponente erstellen

1. **CSS-Komponente:**
```bash
touch assets/css/components/neue-komponente.css
```

2. **In main.css importieren:**
```css
@import url('./components/neue-komponente.css');
```

3. **JavaScript-Komponente registrieren:**
```javascript
// In app.js oder eigenes Modul
componentSystem.register('neue-komponente', class NeueKomponente {
    constructor(element, options) {
        this.element = element;
        this.options = options;
        this.init();
    }
    
    init() {
        // Initialisierung
    }
    
    destroy() {
        // Cleanup
    }
});
```

4. **HTML verwenden:**
```html
<div data-component="neue-komponente" data-component-options='{"option": "value"}'>
    <!-- Komponenten-Inhalt -->
</div>
```

### Animationen hinzufügen

1. **Scroll-Animation:**
```html
<div data-animate="fade-in" data-animate-delay="200">
    Inhalt wird beim Scrollen eingeblendet
</div>
```

2. **Stagger-Animation:**
```html
<div data-stagger-group data-stagger-animation="slide-up" data-stagger-delay="100">
    <div>Element 1</div>
    <div>Element 2</div>
    <div>Element 3</div>
</div>
```

3. **Manuelle Animation:**
```javascript
// Über App-Instance
app.animations.triggerAnimation(element, 'fade-in', {
    delay: 200,
    duration: 600
});
```

## 🎯 Design-System

### Spacing Scale
```css
--space-xs: 0.25rem;    /* 4px */
--space-sm: 0.5rem;     /* 8px */
--space-md: 1rem;       /* 16px */
--space-lg: 1.5rem;     /* 24px */
--space-xl: 2rem;       /* 32px */
--space-2xl: 3rem;      /* 48px */
--space-3xl: 4rem;      /* 64px */
```

### Typography Scale
```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 2rem;      /* 32px */
--font-size-4xl: 2.5rem;    /* 40px */
--font-size-5xl: 3rem;      /* 48px */
```

### Color System
```css
/* Light Theme */
--bg-primary: #ffffff;
--bg-secondary: #f8f9fa;
--text-primary: #212529;
--text-secondary: #6c757d;
--accent-primary: #007bff;

/* Dark Theme automatisch über [data-theme="dark"] */
```

## 📱 Responsive Design

Das System nutzt Mobile-First Design mit Breakpoints:
- Mobile: bis 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

Utility-Klassen sind responsive:
```css
.grid-cols-1        /* Mobile: 1 Spalte */
.grid-cols-2        /* Desktop: 2 Spalten */
```

## ⚡ Performance

### Optimierungen
- CSS ist in logische Module aufgeteilt
- JavaScript Module werden lazy geladen
- Animationen nutzen GPU-Beschleunigung
- Reduced Motion Support
- Mobile-optimierte Mouse-Effekte (deaktiviert)

### Best Practices
- Verwende CSS Custom Properties statt hardcoded Values
- Nutze Utility-Classes für häufige Styles
- Komponenten sind wiederverwendbar und eigenständig
- Animationen sind performance-optimiert

## 🔮 Zukunftssicherheit

Diese Architektur ist designed für:
- **Einfache Erweiterung** um neue Seiten und Features
- **Team-Entwicklung** durch klare Trennung von Zuständigkeiten
- **Maintenance** durch modulare Struktur
- **Performance** durch optimierte Loading-Strategien
- **Accessibility** durch semantisches HTML und ARIA

Die Struktur wächst mit deinen Anforderungen mit und bleibt dabei wartbar und performant.
