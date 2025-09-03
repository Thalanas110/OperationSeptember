class Poem {

    // id
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.author = data.author;
        this.stanzas = data.stanzas;
        this.isExpanded = false;
    }

    getPreview() {
        return this.stanzas.slice(0, 1).join('\n');
    }

    getFullText() {
        return this.stanzas.join('\n\n');
    }

    toggle() {
        this.isExpanded = !this.isExpanded;
    }
}

// more oop
class PoemCard {
    constructor(poem, onToggle) {
        this.poem = poem;
        this.onToggle = onToggle;
        this.element = this.createElement();
    }

    createElement() {
        const card = document.createElement('div');
        card.className = 'poem-card';
        card.setAttribute('data-poem-id', this.poem.id);
        
        card.innerHTML = `
            <button class="close-btn" aria-label="Close poem">&times;</button>
            <h2 class="poem-title">${this.poem.title}</h2>
            <p class="poem-author">by ${this.poem.author}</p>
            <div class="poem-preview">${this.poem.getPreview()}</div>
            <div class="poem-full">${this.poem.getFullText()}</div>
        `;

        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('close-btn')) {
                this.toggleExpanded();
            }
        });

        card.querySelector('.close-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.collapse();
        });

        return card;
    }

    toggleExpanded() {
        this.poem.toggle();
        this.updateDisplay();
        this.onToggle(this.poem);
    }

    collapse() {
        if (this.poem.isExpanded) {
            this.poem.isExpanded = false;
            this.updateDisplay();
            this.onToggle(this.poem);
        }
    }

    updateDisplay() {
        if (this.poem.isExpanded) {
            this.element.classList.add('expanded');
            this.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            this.element.classList.remove('expanded');
        }
    }

    matchesSearch(query) {
        const searchText = `${this.poem.title} ${this.poem.author} ${this.poem.getFullText()}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
    }

    show() {
        this.element.style.display = 'block';
        setTimeout(() => {
            this.element.style.opacity = '1';
            this.element.style.transform = 'translateY(0)';
        }, 10);
    }

    hide() {
        this.element.style.opacity = '0';
        this.element.style.transform = 'translateY(20px)';
        setTimeout(() => {
            this.element.style.display = 'none';
        }, 300);
    }
}

class ThemeManager {
    constructor() {
        this.isDark = localStorage.getItem('theme') !== 'light'; // Default to dark mode
        this.button = document.getElementById('themeToggle');
        this.init();
    }

    init() {
        this.applyTheme();
        this.button.addEventListener('click', () => this.toggle());
    }

    toggle() {
        this.isDark = !this.isDark;
        this.applyTheme();
        localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    }

    applyTheme() {
        if (this.isDark) {
            document.body.setAttribute('data-theme', 'dark');
            this.button.textContent = '☀️';
        } else {
            document.body.removeAttribute('data-theme');
            this.button.textContent = '🌙';
        }
    }
}

class ScrollManager {
    constructor() {
        this.button = document.getElementById('scrollToTop');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        this.button.addEventListener('click', () => this.scrollToTop());
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const threshold = window.innerHeight * 2;
        
        if (scrolled > threshold) {
            this.button.classList.remove('hidden');
        } else {
            this.button.classList.add('hidden');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

class PDFExporter {
    constructor() {
        this.button = document.getElementById('exportPdf');
        this.init();
    }

    init() {
        this.button.addEventListener('click', () => this.exportToPDF());
    }

    exportToPDF() {
        // Temporarily hide controls and show all poems
        const controls = document.querySelector('.controls');
        const originalDisplay = controls.style.display;
        controls.style.display = 'none';

        // Show all poem cards and expand them for printing
        const poemCards = document.querySelectorAll('.poem-card');
        const originalStates = [];

        poemCards.forEach((card, index) => {
            originalStates[index] = {
                display: card.style.display,
                expanded: card.classList.contains('expanded')
            };
            card.style.display = 'block';
            card.classList.add('expanded');
        });

        // Trigger print
        window.print();

        // Restore original states
        setTimeout(() => {
            controls.style.display = originalDisplay;
            poemCards.forEach((card, index) => {
                card.style.display = originalStates[index].display;
                if (!originalStates[index].expanded) {
                    card.classList.remove('expanded');
                }
            });
        }, 1000);
    }
}

class PoemCollection {
    constructor() {
        this.poems = poemsData.map(data => new Poem(data));
        this.poemCards = [];
        this.filteredCards = [];
        this.container = document.getElementById('poemContainer');
        this.searchInput = document.getElementById('searchInput');
        this.sortSelect = document.getElementById('sortSelect');
        
        this.init();
    }

    init() {
        this.createPoemCards();
        this.renderPoems();
        this.setupEventListeners();
    }

    createPoemCards() {
        this.poemCards = this.poems.map(poem => 
            new PoemCard(poem, (toggledPoem) => this.handlePoemToggle(toggledPoem))
        );
        this.filteredCards = [...this.poemCards];
    }

    handlePoemToggle(toggledPoem) {
        // Close other expanded poems
        this.poems.forEach(poem => {
            if (poem.id !== toggledPoem.id && poem.isExpanded) {
                poem.isExpanded = false;
            }
        });
        
        this.poemCards.forEach(card => {
            if (card.poem.id !== toggledPoem.id) {
                card.updateDisplay();
            }
        });
    }

    setupEventListeners() {
        this.searchInput.addEventListener('input', (e) => {
            this.filterPoems(e.target.value);
        });

        this.sortSelect.addEventListener('change', (e) => {
            this.sortPoems(e.target.value);
        });
    }

    filterPoems(query) {
        if (!query.trim()) {
            this.filteredCards = [...this.poemCards];
        } else {
            this.filteredCards = this.poemCards.filter(card => 
                card.matchesSearch(query)
            );
        }
        this.renderPoems();
    }

    sortPoems(criteria) {
        this.filteredCards.sort((a, b) => {
            const valueA = criteria === 'title' ? a.poem.title : a.poem.author;
            const valueB = criteria === 'title' ? b.poem.title : b.poem.author;
            return valueA.localeCompare(valueB);
        });
        this.renderPoems();
    }

    renderPoems() {
        // Hide all cards first
        this.poemCards.forEach(card => card.hide());
        
        // Clear container
        setTimeout(() => {
            this.container.innerHTML = '';
            
            // Add filtered cards with animation
            this.filteredCards.forEach((card, index) => {
                setTimeout(() => {
                    this.container.appendChild(card.element);
                    card.show();
                }, index * 100);
            });
        }, 300);
    }
}

// Application Initialization
class PoetryApp {
    constructor() {
        this.themeManager = new ThemeManager();
        this.scrollManager = new ScrollManager();
        this.pdfExporter = new PDFExporter();
        this.poemCollection = new PoemCollection();
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PoetryApp();
});

// Add some additional utility functions
const Utils = {
    debounce(func, wait) {
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

    smoothScrollTo(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
};

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any expanded poems
        const expandedCards = document.querySelectorAll('.poem-card.expanded');
        expandedCards.forEach(card => {
            const closeBtn = card.querySelector('.close-btn');
            if (closeBtn) closeBtn.click();
        });
    }
});