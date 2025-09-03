class FavoriteManager {
    static STORAGE_KEY = 'poetry-app-favorites';

    static getFavorites() {
        try {
            const favorites = localStorage.getItem(this.STORAGE_KEY);
            return favorites ? JSON.parse(favorites) : [];
        } 
        catch (error) {
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
        } 
        catch (error) {
            console.error('Error adding favorite to localStorage:', error);
        }
    }

    static removeFavorite(poemId) {
        try {
            const favorites = this.getFavorites();
            const filteredFavorites = favorites.filter(id => id !== poemId);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredFavorites));
        } 
        catch (error) {
            console.error('Error removing favorite from localStorage:', error);
        }
    }

    static isFavorited(poemId) {
        return this.getFavorites().includes(poemId);
    }

    static clearAllFavorites() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } 
        catch (error) {
            console.error('Error clearing favorites from localStorage:', error);
        }
    }
}

class ReadingProgressManager {
    static STORAGE_KEY = 'poetry-app-progress';

    static getProgress() {
        try {
            const progress = localStorage.getItem(this.STORAGE_KEY);
            return progress ? JSON.parse(progress) : {};
        } 
        catch (error) {
            console.error('Error reading progress from localStorage:', error);
            return {};
        }
    }

    static updateProgress(poemId, progress) {
        try {
            const allProgress = this.getProgress();
            allProgress[poemId] = {
                progress: Math.min(100, Math.max(0, progress)),
                lastRead: new Date().toISOString(),
                status: progress >= 100 ? 'read' : progress > 0 ? 'reading' : 'new'
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allProgress));
        } 
        catch (error) {
            console.error('Error updating progress:', error);
        }
    }

    static getProgressForPoem(poemId) {
        const progress = this.getProgress();
        return progress[poemId] || { progress: 0, status: 'new' };
    }
}

class RatingManager {
    static STORAGE_KEY = 'poetry-app-ratings';

    static getRatings() {
        try {
            const ratings = localStorage.getItem(this.STORAGE_KEY);
            return ratings ? JSON.parse(ratings) : {};
        } 
        catch (error) {
            console.error('Error reading ratings from localStorage:', error);
            return {};
        }
    }

    static setRating(poemId, rating) {
        try {
            const ratings = this.getRatings();
            ratings[poemId] = Math.min(5, Math.max(1, rating));
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ratings));
        } 
        catch (error) {
            console.error('Error saving rating:', error);
        }
    }

    static getRating(poemId) {
        const ratings = this.getRatings();
        return ratings[poemId] || 0;
    }
}

class TextToSpeechManager {
    constructor() {
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.isPlaying = false;
        this.currentPoem = null;
    }

    speak(text, poemId) {
        if (this.isPlaying && this.currentPoem === poemId) {
            this.stop();
            return;
        }

        this.stop(); // Stop any current speech
        
        this.utterance = new SpeechSynthesisUtterance(text);
        this.utterance.rate = 0.8;
        this.utterance.pitch = 1;
        this.utterance.volume = 0.8;
        
        this.utterance.onstart = () => {
            this.isPlaying = true;
            this.currentPoem = poemId;
        };
        
        this.utterance.onend = () => {
            this.isPlaying = false;
            this.currentPoem = null;
        };
        
        this.synth.speak(this.utterance);
    }

    stop() {
        if (this.synth.speaking) {
            this.synth.cancel();
        }
        this.isPlaying = false;
        this.currentPoem = null;
    }

    isCurrentlyPlaying(poemId) {
        return this.isPlaying && this.currentPoem === poemId;
    }
}

class ShareManager {
    static sharePoem(poem, quote = null) {
        const text = quote || poem.getPreview();
        const shareText = `"${text}"\n\n- ${poem.title} by ${poem.author}`;
        
        if (navigator.share) {
            navigator.share({
                title: poem.title,
                text: shareText,
                url: window.location.href
            });
        } 
        else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Poem copied to clipboard!');
            }).catch(() => {
                // Final fallback: show in alert
                alert(`Share this poem:\n\n${shareText}`);
            });
        }
    }

    static generateQuoteImage(poem, quote) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 800;
        canvas.height = 600;
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#7BA7D1');
        gradient.addColorStop(1, '#8B6F47');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Text styling
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.font = '24px Georgia, serif';
        
        // Quote text (wrapped)
        const words = quote.split(' ');
        const lines = [];
        let currentLine = '';
        
        for (const word of words) {
            const testLine = currentLine + word + ' ';
            if (ctx.measureText(testLine).width > canvas.width - 100 && currentLine !== '') {
                lines.push(currentLine);
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);
        
        // Draw quote
        const startY = canvas.height / 2 - (lines.length * 30) / 2;
        lines.forEach((line, index) => {
            ctx.fillText(`"${line}"`, canvas.width / 2, startY + index * 35);
        });
        
        // Attribution
        ctx.font = '18px Georgia, serif';
        ctx.fillText(`- ${poem.title} by ${poem.author}`, canvas.width / 2, startY + lines.length * 35 + 50);
        
        // Download
        const link = document.createElement('a');
        link.download = `${poem.title.replace(/\s+/g, '_')}_quote.png`;
        link.href = canvas.toDataURL();
        link.click();
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
        this.readingProgress = ReadingProgressManager.getProgressForPoem(this.id);
        this.rating = RatingManager.getRating(this.id);
    }

    getPreview() {
        return this.stanzas.slice(0, 1).join('\n');
    }

    getFullText() {
        return this.stanzas.join('\n\n');
    }

    getReadingTime() {
        const wordsPerMinute = 200;
        const wordCount = this.getFullText().split(/\s+/).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return minutes;
    }

    updateProgress(progress) {
        this.readingProgress.progress = progress;
        this.readingProgress.status = progress >= 100 ? 'read' : progress > 0 ? 'reading' : 'new';
        ReadingProgressManager.updateProgress(this.id, progress);
    }

    setRating(rating) {
        this.rating = rating;
        RatingManager.setRating(this.id, rating);
    }

    toggle() {
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded) {
            // Mark as reading when expanded
            if (this.readingProgress.progress === 0) {
                this.updateProgress(25);
            }
        }
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
        
        const readingTime = this.poem.getReadingTime();
        const progress = this.poem.readingProgress;
        
        card.innerHTML = `
            <div class="poem-status ${progress.status}">${progress.status}</div>
            <button class="favorite-btn" aria-label="Toggle favorite">♥</button>
            <button class="close-btn" aria-label="Close poem">&times;</button>
            
            <div class="poem-meta">
                <span class="reading-time">${readingTime} min read</span>
                <div class="rating-container">
                    ${this.createStarRating()}
                </div>
            </div>
            
            <h2 class="poem-title">${this.poem.title}</h2>
            <p class="poem-author">by ${this.poem.author}</p>
            
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress.progress}%"></div>
            </div>
            
            <div class="poem-preview">${this.poem.getPreview()}</div>
            <div class="poem-full">${this.poem.getFullText()}</div>
            
            <div class="poem-actions">
                <button class="action-btn tts-btn" data-action="tts">
                    <span class="tts-icon">🔊</span> Listen
                </button>
                <button class="action-btn share-btn" data-action="share">
                    📤 Share
                </button>
                <button class="action-btn quote-btn" data-action="quote">
                    🖼️ Quote Image
                </button>
                <button class="action-btn progress-btn" data-action="progress">
                    ✅ Mark as Read
                </button>
            </div>
        `;

        // Update favorite button appearance
        this.updateFavoriteButton(card);
        this.setupEventListeners(card);

        return card;
    }

    createStarRating() {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            const filled = i <= this.poem.rating ? 'filled' : '';
            stars += `<span class="star ${filled}" data-rating="${i}">★</span>`;
        }
        return stars;
    }

    setupEventListeners(card) {
        // Main card click
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.close-btn, .favorite-btn, .action-btn, .star')) {
                this.toggleExpanded();
            }
        });

        // Close button
        card.querySelector('.close-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.collapse();
        });

        // Favorite button
        card.querySelector('.favorite-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite();
        });

        // Star rating
        card.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', (e) => {
                e.stopPropagation();
                const rating = parseInt(e.target.dataset.rating);
                this.poem.setRating(rating);
                this.updateStarRating(card);
            });
        });

        // Action buttons
        card.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleAction(e.target.dataset.action || e.target.closest('.action-btn').dataset.action);
            });
        });
    }

    handleAction(action) {
        switch (action) {
            case 'tts':
                this.handleTextToSpeech();
                break;
            case 'share':
                ShareManager.sharePoem(this.poem);
                break;
            case 'quote':
                ShareManager.generateQuoteImage(this.poem, this.poem.getPreview());
                break;
            case 'progress':
                this.poem.updateProgress(100);
                this.updateProgress();
                break;
        }
    }

    handleTextToSpeech() {
        const ttsBtn = this.element.querySelector('.tts-btn');
        const text = this.poem.isExpanded ? this.poem.getFullText() : this.poem.getPreview();
        
        if (window.app && window.app.ttsManager) {
            const isPlaying = window.app.ttsManager.isCurrentlyPlaying(this.poem.id);
            
            if (isPlaying) {
                ttsBtn.innerHTML = '<span class="tts-icon">🔊</span> Listen';
            } else {
                ttsBtn.innerHTML = '<span class="tts-icon">⏸️</span> Stop';
            }
            
            window.app.ttsManager.speak(text, this.poem.id);
        }
    }

    updateStarRating(card) {
        const stars = card.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < this.poem.rating) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });
    }

    updateProgress() {
        const progressFill = this.element.querySelector('.progress-fill');
        const statusEl = this.element.querySelector('.poem-status');
        const progressBtn = this.element.querySelector('.progress-btn');
        
        if (progressFill) {
            progressFill.style.width = `${this.poem.readingProgress.progress}%`;
        }
        
        if (statusEl) {
            statusEl.className = `poem-status ${this.poem.readingProgress.status}`;
            statusEl.textContent = this.poem.readingProgress.status;
        }
        
        if (progressBtn && this.poem.readingProgress.progress >= 100) {
            progressBtn.innerHTML = '✅ Read';
            progressBtn.disabled = true;
        }
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
        this.ttsManager = new TextToSpeechManager();
        this.poemCollection = new PoemCollection();
        
        // Make TTS manager globally accessible
        window.app = this;
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