// Thompson Chain Reference Bible - Main Application Logic

class ThompsonChainBible {
    constructor() {
        this.currentView = 'bible';
        this.currentBook = null;
        this.currentChapter = null;
        this.sidebarVisible = true;
        this.bibleBooks = [];
        
        this.init();
    }

    async init() {
        await this.loadBibleBooks();
        this.setupEventListeners();
        this.populateBookLists();
        this.showView('bible');
    }

    async loadBibleBooks() {
        try {
            const response = await fetch('http://localhost:3001/api/books');
            const data = await response.json();

            if (data.success) {
                this.bibleBooks = data.data;
                console.log(`Loaded ${this.bibleBooks.length} Bible books from API`);
            } else {
                throw new Error('Failed to load books from API');
            }
        } catch (error) {
            console.error('Error loading Bible books from API:', error);
            // Fallback to hardcoded list
            this.bibleBooks = [
                'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
                'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
                '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
                'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
                'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
                'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
                'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
                'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
                'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans',
                '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
                'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
                '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
                'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
                'Jude', 'Revelation'
            ];
        }
    }

    setupEventListeners() {
        // Sidebar toggle
        document.getElementById('sidebar-toggle').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.closest('.nav-btn').dataset.view;
                this.showView(view);
            });
        });

        // Search functionality
        document.getElementById('search-btn').addEventListener('click', () => {
            this.performSearch();
        });

        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Bible controls
        document.getElementById('book-select').addEventListener('change', (e) => {
            this.selectBook(e.target.value);
        });

        document.getElementById('load-chapter').addEventListener('click', () => {
            this.loadChapter();
        });

        // Chain topics
        document.querySelectorAll('.topic-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const topic = e.target.dataset.topic;
                this.showChainTopic(topic);
            });
        });

        // Modal close
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        // Click outside modal to close
        document.getElementById('search-modal').addEventListener('click', (e) => {
            if (e.target.id === 'search-modal') {
                this.closeModal();
            }
        });

        // Keyboard shortcuts for web version
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'f':
                        e.preventDefault();
                        document.getElementById('search-input').focus();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.showView('chains');
                        break;
                    case 't':
                        e.preventDefault();
                        this.showView('topics');
                        break;
                    case 'b':
                        e.preventDefault();
                        this.toggleSidebar();
                        break;
                }
            }
        });
    }

    populateBookLists() {
        const otBooks = this.bibleBooks.slice(0, 39); // Old Testament
        const ntBooks = this.bibleBooks.slice(39);    // New Testament

        // Populate sidebar book lists
        const otContainer = document.getElementById('ot-books');
        const ntContainer = document.getElementById('nt-books');

        otBooks.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.className = 'book-item';
            bookElement.textContent = book;
            bookElement.addEventListener('click', () => this.selectBook(book));
            otContainer.appendChild(bookElement);
        });

        ntBooks.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.className = 'book-item';
            bookElement.textContent = book;
            bookElement.addEventListener('click', () => this.selectBook(book));
            ntContainer.appendChild(bookElement);
        });

        // Populate book select dropdown
        const bookSelect = document.getElementById('book-select');
        this.bibleBooks.forEach(book => {
            const option = document.createElement('option');
            option.value = book;
            option.textContent = book;
            bookSelect.appendChild(option);
        });
    }

    showView(viewName) {
        // Hide all views
        document.querySelectorAll('.content-view').forEach(view => {
            view.classList.remove('active');
        });

        // Show selected view
        document.getElementById(`${viewName}-view`).classList.add('active');

        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

        this.currentView = viewName;
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        this.sidebarVisible = !this.sidebarVisible;
        
        if (this.sidebarVisible) {
            sidebar.classList.remove('hidden');
        } else {
            sidebar.classList.add('hidden');
        }
    }

    selectBook(bookName) {
        if (!bookName) return;

        this.currentBook = bookName;
        
        // Update UI
        document.getElementById('book-select').value = bookName;
        
        // Highlight selected book in sidebar
        document.querySelectorAll('.book-item').forEach(item => {
            item.classList.remove('active');
            if (item.textContent === bookName) {
                item.classList.add('active');
            }
        });

        // Populate chapters (simplified - in real app would be dynamic)
        this.populateChapters(bookName);
    }

    populateChapters(bookName) {
        const chapterSelect = document.getElementById('chapter-select');
        chapterSelect.innerHTML = '<option value="">Chapter...</option>';

        // Simplified chapter counts (in real app, this would be from data)
        const chapterCounts = {
            'Genesis': 50, 'Exodus': 40, 'Matthew': 28, 'Mark': 16,
            'Luke': 24, 'John': 21, 'Acts': 28, 'Romans': 16,
            'Psalms': 150, 'Proverbs': 31
        };

        const chapters = chapterCounts[bookName] || 25; // Default to 25 chapters

        for (let i = 1; i <= chapters; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            chapterSelect.appendChild(option);
        }
    }

    async loadChapter() {
        const book = document.getElementById('book-select').value;
        const chapter = document.getElementById('chapter-select').value;

        if (!book || !chapter) {
            alert('Please select both a book and chapter.');
            return;
        }

        this.currentBook = book;
        this.currentChapter = chapter;

        // Show loading indicator
        const bibleText = document.getElementById('bible-text');
        bibleText.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';

        try {
            const response = await fetch(`http://localhost:3001/api/chapter/${book}/${chapter}`);
            const data = await response.json();

            if (data.success) {
                this.displayChapterData(data.data);
            } else {
                throw new Error(data.error || 'Failed to load chapter');
            }
        } catch (error) {
            console.error('Error loading chapter:', error);
            bibleText.innerHTML = `
                <div class="error-message">
                    <h3>Error Loading Chapter</h3>
                    <p>Unable to load ${book} ${chapter}. Please try again.</p>
                    <p class="error-details">${error.message}</p>
                </div>
            `;
        }
    }

    displayChapterData(chapterData) {
        const bibleText = document.getElementById('bible-text');

        let html = `
            <div class="chapter-header">
                <h2>${chapterData.book} ${chapterData.chapter}</h2>
                <p class="translation-info">Translation: ${chapterData.translation}</p>
            </div>
            <div class="verses">
        `;

        chapterData.verses.forEach(verse => {
            html += `
                <div class="verse" data-verse="${verse.verse}" data-reference="${verse.reference}">
                    <span class="verse-number">${verse.verse}</span>
                    <span class="verse-text">${verse.text.trim()}</span>
                </div>
            `;
        });

        html += '</div>';
        bibleText.innerHTML = html;

        // Add click handlers for verses
        document.querySelectorAll('.verse').forEach(verseElement => {
            verseElement.addEventListener('click', (e) => {
                const reference = e.currentTarget.dataset.reference;
                this.showVerseOptions(reference);
            });
        });
    }

    showVerseOptions(reference) {
        // Simple implementation - could be expanded
        const options = [
            'Copy verse',
            'Add to notes',
            'Find cross-references',
            'Search for similar verses'
        ];

        const choice = prompt(`Options for ${reference}:\n${options.map((opt, i) => `${i+1}. ${opt}`).join('\n')}\n\nEnter choice (1-4):`);

        if (choice) {
            const index = parseInt(choice) - 1;
            if (index >= 0 && index < options.length) {
                this.handleVerseAction(reference, options[index]);
            }
        }
    }

    handleVerseAction(reference, action) {
        switch (action) {
            case 'Copy verse':
                navigator.clipboard.writeText(reference).then(() => {
                    alert(`${reference} copied to clipboard!`);
                });
                break;
            case 'Add to notes':
                alert(`Note feature for ${reference} - Coming soon!`);
                break;
            case 'Find cross-references':
                alert(`Cross-references for ${reference} - Coming soon!`);
                break;
            case 'Search for similar verses':
                // Extract key words from the verse and search
                const words = reference.split(' ').slice(0, 3).join(' ');
                document.getElementById('search-input').value = words;
                this.performSearch();
                break;
        }
    }

    async performSearch() {
        const query = document.getElementById('search-input').value.trim();
        if (!query) return;

        // Show loading
        const searchResults = document.getElementById('search-results');
        searchResults.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';

        document.getElementById('search-modal').classList.add('show');

        try {
            const response = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(query)}&limit=20`);
            const data = await response.json();

            if (data.success) {
                this.displaySearchResults(data.data, query, data.source);
            } else {
                throw new Error(data.error || 'Search failed');
            }
        } catch (error) {
            console.error('Search error:', error);
            searchResults.innerHTML = `
                <div class="error-message">
                    <h3>Search Error</h3>
                    <p>Unable to search for "${query}". Please try again.</p>
                    <p class="error-details">${error.message}</p>
                </div>
            `;
        }
    }

    displaySearchResults(results, query, source) {
        const searchResults = document.getElementById('search-results');

        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <h3>No Results Found</h3>
                    <p>No verses found containing "${query}".</p>
                    <p>Try searching for different keywords or check your spelling.</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="search-header">
                <h3>Search Results for "${query}"</h3>
                <p class="search-info">Found ${results.length} verses${source ? ` (via ${source})` : ''}</p>
            </div>
            <div class="search-results">
        `;

        results.forEach(result => {
            const highlightedText = result.text.replace(
                new RegExp(query, 'gi'),
                `<span class="search-highlight">$&</span>`
            );

            html += `
                <div class="search-result" data-reference="${result.reference}">
                    <div class="search-result-header">
                        <div class="search-result-reference">${result.reference}</div>
                        <div class="search-result-translation">${result.translation || 'KJV'}</div>
                    </div>
                    <div class="search-result-text">${highlightedText}</div>
                    <div class="search-result-actions">
                        <button class="btn-small" onclick="app.loadVerseFromSearch('${result.book}', ${result.chapter}, ${result.verse})">
                            Go to Chapter
                        </button>
                        <button class="btn-small" onclick="app.copyVerse('${result.reference}', '${result.text.replace(/'/g, "\\'")}')">
                            Copy Verse
                        </button>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        searchResults.innerHTML = html;
    }

    loadVerseFromSearch(book, chapter, verse) {
        // Close search modal
        this.closeModal();

        // Switch to Bible view
        this.showView('bible');

        // Select the book and chapter
        document.getElementById('book-select').value = book;
        this.selectBook(book);
        document.getElementById('chapter-select').value = chapter;

        // Load the chapter
        this.loadChapter().then(() => {
            // Highlight the specific verse
            setTimeout(() => {
                const verseElement = document.querySelector(`[data-verse="${verse}"]`);
                if (verseElement) {
                    verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    verseElement.style.backgroundColor = '#fff3cd';
                    setTimeout(() => {
                        verseElement.style.backgroundColor = '';
                    }, 3000);
                }
            }, 500);
        });
    }

    copyVerse(reference, text) {
        const verseText = `${reference}\n${text}`;
        navigator.clipboard.writeText(verseText).then(() => {
            alert(`${reference} copied to clipboard!`);
        }).catch(err => {
            console.error('Failed to copy verse:', err);
            alert('Failed to copy verse to clipboard');
        });
    }

    showChainTopic(topic) {
        this.showView('chains');
        
        // Highlight selected topic
        document.querySelectorAll('.topic-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.topic === topic) {
                item.classList.add('active');
            }
        });

        // Load chain references for topic
        this.loadChainReferences(topic);
    }

    loadChainReferences(topic) {
        const chainResults = document.getElementById('chain-results');
        
        // Sample chain data (in real app, would load from database)
        const chainData = {
            love: {
                title: 'Love',
                description: 'God\'s love and our love for others',
                verses: [
                    { reference: 'John 3:16', text: 'For God so loved the world...' },
                    { reference: '1 John 4:8', text: 'God is love.' },
                    { reference: '1 Corinthians 13:4', text: 'Love is patient, love is kind...' }
                ]
            },
            faith: {
                title: 'Faith',
                description: 'Trust and belief in God',
                verses: [
                    { reference: 'Hebrews 11:1', text: 'Faith is confidence in what we hope for...' },
                    { reference: 'Romans 10:17', text: 'Faith comes from hearing the message...' }
                ]
            }
        };

        const data = chainData[topic];
        if (!data) {
            chainResults.innerHTML = '<p>Chain references not available for this topic.</p>';
            return;
        }

        let html = `
            <div class="chain-display">
                <h3 class="chain-title">
                    <i class="fas fa-link"></i>
                    ${data.title}
                </h3>
                <p class="chain-description">${data.description}</p>
                <div class="chain-verses">
        `;

        data.verses.forEach((verse, index) => {
            html += `
                <div class="chain-verse">
                    <div class="chain-verse-reference">${verse.reference}</div>
                    <div class="chain-verse-text">${verse.text}</div>
                </div>
            `;
            
            if (index < data.verses.length - 1) {
                html += '<div class="chain-connection"><i class="fas fa-arrow-down"></i></div>';
            }
        });

        html += '</div></div>';
        chainResults.innerHTML = html;
    }

    closeModal() {
        document.getElementById('search-modal').classList.remove('show');
    }

    showAbout() {
        alert('Thompson Chain Reference Bible v1.0\n\nA modern Bible study application featuring topical chain references and cross-references for deeper Scripture study.');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ThompsonChainBible();
});
