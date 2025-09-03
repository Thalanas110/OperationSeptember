class FavoriteManager {
    static STORAGE_KEY = 'poetry-app-favorites';

    static getFavorites() {
        try {
            const favorites = localStorage.getItem(this.STORAGE_KEY);
            return favorites ? JSON.parse(favorites) : [];
        } catch (error) {
            console.error('Error reading favorites from localStorage:', error);
            return [];
        }
    }

    static addFavorite(poemId) {
        try {
            const favorites = this.getFavorites();
            if (!favorites.includes(poemId)) {
                favorites.push(poemId);
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
            }
        } catch (error) {
            console.error('Error adding favorite to localStorage:', error);
        }
    }

    static removeFavorite(poemId) {
        try {
            const favorites = this.getFavorites();
            const filteredFavorites = favorites.filter(id => id !== poemId);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredFavorites));
        } catch (error) {
            console.error('Error removing favorite from localStorage:', error);
        }
    }

    static isFavorited(poemId) {
        return this.getFavorites().includes(poemId);
    }

    static clearAllFavorites() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing favorites from localStorage:', error);
        }
    }
}

class Poem {

    // id
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.author = data.author;
        this.stanzas = data.stanzas;
        this.isExpanded = false;
        this.isFavorited = FavoriteManager.isFavorited(this.id);
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

    toggleFavorite() {
        this.isFavorited = !this.isFavorited;
        if (this.isFavorited) {
            FavoriteManager.addFavorite(this.id);
        } else {
            FavoriteManager.removeFavorite(this.id);
        }
    }
}

// more oop
class PoemCard {
    constructor(poem, onToggle, onFavoriteToggle = null) {
        this.poem = poem;
        this.onToggle = onToggle;
        this.onFavoriteToggle = onFavoriteToggle;
        this.element = this.createElement();
    }

    createElement() {
        const card = document.createElement('div');
        card.className = 'poem-card';
        card.setAttribute('data-poem-id', this.poem.id);
        
        card.innerHTML = `
            <button class="favorite-btn" aria-label="Toggle favorite">♥</button>
            <button class="close-btn" aria-label="Close poem">&times;</button>
            <h2 class="poem-title">${this.poem.title}</h2>
            <p class="poem-author">by ${this.poem.author}</p>
            <div class="poem-preview">${this.poem.getPreview()}</div>
            <div class="poem-full">${this.poem.getFullText()}</div>
        `;

        // Update favorite button appearance
        this.updateFavoriteButton(card);

        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('close-btn') && !e.target.classList.contains('favorite-btn')) {
                this.toggleExpanded();
            }
        });

        card.querySelector('.close-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.collapse();
        });

        card.querySelector('.favorite-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite();
        });

        return card;
    }

    toggleFavorite() {
        this.poem.toggleFavorite();
        this.updateFavoriteButton(this.element);
        
        // Trigger any callback if needed
        if (this.onFavoriteToggle) {
            this.onFavoriteToggle(this.poem);
        }
    }

    updateFavoriteButton(cardElement) {
        const favoriteBtn = cardElement.querySelector('.favorite-btn');
        if (favoriteBtn) {
            if (this.poem.isFavorited) {
                favoriteBtn.classList.add('favorited');
                favoriteBtn.setAttribute('aria-label', 'Remove from favorites');
            } else {
                favoriteBtn.classList.remove('favorited');
                favoriteBtn.setAttribute('aria-label', 'Add to favorites');
            }
        }
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
        try {
            if (this.isDark) {
                document.body.setAttribute('data-theme', 'dark');
                this.button.textContent = '☀️';
            } 
            else {
                document.body.removeAttribute('data-theme');
                this.button.textContent = '🌙';
            }
        } 
        catch (error) {
            console.error('Error applying theme:', error);
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
        } 
        else {
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
        }, 
        1000);
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
        this.favoritesFilter = document.getElementById('favoritesFilter');
        this.showingFavoritesOnly = false;
        
        this.init();
    }

    init() {
        this.createPoemCards();
        this.renderPoems();
        this.setupEventListeners();
    }

    createPoemCards() {
        this.poemCards = this.poems.map(poem => 
            new PoemCard(
                poem, 
                (toggledPoem) => this.handlePoemToggle(toggledPoem),
                (toggledPoem) => this.handleFavoriteToggle(toggledPoem)
            )
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

    handleFavoriteToggle(toggledPoem) {
        // If we're showing favorites only and this poem was unfavorited, re-filter
        if (this.showingFavoritesOnly) {
            this.applyCurrentFilters();
        }
    }

    setupEventListeners() {
        this.searchInput.addEventListener('input', (e) => {
            this.applyCurrentFilters();
        });

        this.sortSelect.addEventListener('change', (e) => {
            this.sortPoems(e.target.value);
        });

        this.favoritesFilter.addEventListener('click', () => {
            this.toggleFavoritesFilter();
        });
    }

    toggleFavoritesFilter() {
        this.showingFavoritesOnly = !this.showingFavoritesOnly;
        
        if (this.showingFavoritesOnly) {
            this.favoritesFilter.classList.add('active');
            this.favoritesFilter.textContent = '🏠 Show All';
        } else {
            this.favoritesFilter.classList.remove('active');
            this.favoritesFilter.textContent = '❤️ Show Favorites';
        }
        
        this.applyCurrentFilters();
    }

    applyCurrentFilters() {
        const query = this.searchInput.value;
        let cards = [...this.poemCards];

        // Apply search filter
        if (query.trim()) {
            cards = cards.filter(card => card.matchesSearch(query));
        }

        // Apply favorites filter
        if (this.showingFavoritesOnly) {
            cards = cards.filter(card => card.poem.isFavorited);
        }

        this.filteredCards = cards;
        this.renderPoems();
    }

    filterPoems(query) {
        this.applyCurrentFilters();
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