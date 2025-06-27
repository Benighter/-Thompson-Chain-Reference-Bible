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

        // Enhanced search functionality with robust event handling
        const searchBtn = document.getElementById('search-btn');

        // Remove any existing listeners and add fresh one
        searchBtn.replaceWith(searchBtn.cloneNode(true));
        const newSearchBtn = document.getElementById('search-btn');

        newSearchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Search button clicked'); // Debug log
            this.performSearch();
        });

        // Also add event delegation for search button
        document.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'search-btn') {
                e.preventDefault();
                e.stopPropagation();
                console.log('Search button clicked via delegation'); // Debug log
                this.performSearch();
            }
        });

        const searchInput = document.getElementById('search-input');

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Smart search with suggestions
        searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });

        searchInput.addEventListener('focus', () => {
            this.showSearchSuggestions();
        });

        // Click outside to hide suggestions
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSearchSuggestions();
            }
        });

        // Bible Navigation button
        document.getElementById('bible-nav-btn').addEventListener('click', () => {
            this.showBibleNavModal();
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

        // Hide suggestions
        this.hideSearchSuggestions();

        // Check if it's a Bible reference (e.g., "Genesis 1:27", "John 3 16", "Romans 8:28")
        const referenceMatch = this.parseReference(query);
        if (referenceMatch) {
            return this.navigateToReference(referenceMatch);
        }

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

    // Function to reinitialize search button (call this if search button stops working)
    reinitializeSearchButton() {
        const searchBtn = document.getElementById('search-btn');
        if (searchBtn) {
            // Remove existing listeners
            searchBtn.replaceWith(searchBtn.cloneNode(true));
            const newSearchBtn = document.getElementById('search-btn');

            // Add fresh event listener
            newSearchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Search button reinitialized and clicked');
                this.performSearch();
            });
        }
    }

    parseReference(input) {
        // Remove extra spaces and normalize
        const normalized = input.trim().replace(/\s+/g, ' ');

        // Pattern for various reference formats:
        // "Genesis 1:27", "Gen 1:27", "Genesis 1 27", "1 Kings 2:3", "2 Corinthians 5:17"
        const patterns = [
            // Full book name with colon: "Genesis 1:27"
            /^(\d?\s*[a-zA-Z]+(?:\s+[a-zA-Z]+)*)\s+(\d+):(\d+)$/i,
            // Full book name with space: "Genesis 1 27"
            /^(\d?\s*[a-zA-Z]+(?:\s+[a-zA-Z]+)*)\s+(\d+)\s+(\d+)$/i,
            // Chapter only: "Genesis 1"
            /^(\d?\s*[a-zA-Z]+(?:\s+[a-zA-Z]+)*)\s+(\d+)$/i
        ];

        for (const pattern of patterns) {
            const match = normalized.match(pattern);
            if (match) {
                const bookName = match[1].trim();
                const chapter = parseInt(match[2]);
                const verse = match[3] ? parseInt(match[3]) : null;

                // Find matching book
                const matchedBook = this.findBookMatch(bookName);
                if (matchedBook) {
                    return {
                        book: matchedBook,
                        chapter: chapter,
                        verse: verse
                    };
                }
            }
        }

        return null;
    }

    findBookMatch(input) {
        const inputLower = input.toLowerCase().replace(/\s+/g, '');

        // Book abbreviations mapping
        const abbreviations = {
            'gen': 'Genesis', 'genesis': 'Genesis',
            'ex': 'Exodus', 'exo': 'Exodus', 'exodus': 'Exodus',
            'lev': 'Leviticus', 'leviticus': 'Leviticus',
            'num': 'Numbers', 'numbers': 'Numbers',
            'deut': 'Deuteronomy', 'deu': 'Deuteronomy', 'deuteronomy': 'Deuteronomy',
            'josh': 'Joshua', 'jos': 'Joshua', 'joshua': 'Joshua',
            'judg': 'Judges', 'jdg': 'Judges', 'judges': 'Judges',
            'ruth': 'Ruth',
            '1sam': '1 Samuel', '1samuel': '1 Samuel', 'isamuel': '1 Samuel',
            '2sam': '2 Samuel', '2samuel': '2 Samuel', 'iisamuel': '2 Samuel',
            '1kings': '1 Kings', '1ki': '1 Kings', '1kgs': '1 Kings', 'ikings': '1 Kings',
            '2kings': '2 Kings', '2ki': '2 Kings', '2kgs': '2 Kings', 'iikings': '2 Kings',
            '1chron': '1 Chronicles', '1chr': '1 Chronicles', '1chronicles': '1 Chronicles',
            '2chron': '2 Chronicles', '2chr': '2 Chronicles', '2chronicles': '2 Chronicles',
            'ezra': 'Ezra',
            'neh': 'Nehemiah', 'nehemiah': 'Nehemiah',
            'esth': 'Esther', 'esther': 'Esther',
            'job': 'Job',
            'ps': 'Psalms', 'psa': 'Psalms', 'psalm': 'Psalms', 'psalms': 'Psalms',
            'prov': 'Proverbs', 'pro': 'Proverbs', 'proverbs': 'Proverbs',
            'eccl': 'Ecclesiastes', 'ecc': 'Ecclesiastes', 'ecclesiastes': 'Ecclesiastes',
            'song': 'Song of Solomon', 'sos': 'Song of Solomon', 'songofsolomon': 'Song of Solomon',
            'isa': 'Isaiah', 'isaiah': 'Isaiah',
            'jer': 'Jeremiah', 'jeremiah': 'Jeremiah',
            'lam': 'Lamentations', 'lamentations': 'Lamentations',
            'ezek': 'Ezekiel', 'eze': 'Ezekiel', 'ezekiel': 'Ezekiel',
            'dan': 'Daniel', 'daniel': 'Daniel',
            'hos': 'Hosea', 'hosea': 'Hosea',
            'joel': 'Joel',
            'amos': 'Amos',
            'obad': 'Obadiah', 'obadiah': 'Obadiah',
            'jonah': 'Jonah',
            'mic': 'Micah', 'micah': 'Micah',
            'nah': 'Nahum', 'nahum': 'Nahum',
            'hab': 'Habakkuk', 'habakkuk': 'Habakkuk',
            'zeph': 'Zephaniah', 'zep': 'Zephaniah', 'zephaniah': 'Zephaniah',
            'hag': 'Haggai', 'haggai': 'Haggai',
            'zech': 'Zechariah', 'zec': 'Zechariah', 'zechariah': 'Zechariah',
            'mal': 'Malachi', 'malachi': 'Malachi',
            'matt': 'Matthew', 'mat': 'Matthew', 'matthew': 'Matthew',
            'mark': 'Mark', 'mk': 'Mark', 'mar': 'Mark',
            'luke': 'Luke', 'luk': 'Luke', 'lk': 'Luke',
            'john': 'John', 'jn': 'John', 'joh': 'John',
            'acts': 'Acts', 'act': 'Acts',
            'rom': 'Romans', 'romans': 'Romans',
            '1cor': '1 Corinthians', '1corinthians': '1 Corinthians', 'icorinthians': '1 Corinthians',
            '2cor': '2 Corinthians', '2corinthians': '2 Corinthians', 'iicorinthians': '2 Corinthians',
            'gal': 'Galatians', 'galatians': 'Galatians',
            'eph': 'Ephesians', 'ephesians': 'Ephesians',
            'phil': 'Philippians', 'php': 'Philippians', 'philippians': 'Philippians',
            'col': 'Colossians', 'colossians': 'Colossians',
            '1thess': '1 Thessalonians', '1th': '1 Thessalonians', '1thessalonians': '1 Thessalonians',
            '2thess': '2 Thessalonians', '2th': '2 Thessalonians', '2thessalonians': '2 Thessalonians',
            '1tim': '1 Timothy', '1ti': '1 Timothy', '1timothy': '1 Timothy',
            '2tim': '2 Timothy', '2ti': '2 Timothy', '2timothy': '2 Timothy',
            'titus': 'Titus', 'tit': 'Titus',
            'philem': 'Philemon', 'phm': 'Philemon', 'philemon': 'Philemon',
            'heb': 'Hebrews', 'hebrews': 'Hebrews',
            'james': 'James', 'jas': 'James', 'jam': 'James',
            '1pet': '1 Peter', '1pe': '1 Peter', '1peter': '1 Peter', 'ipeter': '1 Peter',
            '2pet': '2 Peter', '2pe': '2 Peter', '2peter': '2 Peter', 'iipeter': '2 Peter',
            '1john': '1 John', '1jn': '1 John', '1jo': '1 John', 'ijohn': '1 John',
            '2john': '2 John', '2jn': '2 John', '2jo': '2 John', 'iijohn': '2 John',
            '3john': '3 John', '3jn': '3 John', '3jo': '3 John', 'iiijohn': '3 John',
            'jude': 'Jude', 'jud': 'Jude',
            'rev': 'Revelation', 'revelation': 'Revelation', 'revelations': 'Revelation'
        };

        // Direct match
        if (abbreviations[inputLower]) {
            return abbreviations[inputLower];
        }

        // Partial match for full names
        for (const book of this.bibleBooks) {
            if (book.toLowerCase().replace(/\s+/g, '').includes(inputLower) ||
                inputLower.includes(book.toLowerCase().replace(/\s+/g, ''))) {
                return book;
            }
        }

        return null;
    }

    async navigateToReference(reference) {
        console.log('Navigating to reference:', reference);

        // Close search modal if open
        this.closeModal();

        // Switch to Bible view
        this.showView('bible');

        // Set the book and chapter
        document.getElementById('book-select').value = reference.book;
        this.selectBook(reference.book);
        document.getElementById('chapter-select').value = reference.chapter;

        try {
            // Load the chapter
            await this.loadChapter();

            // If specific verse requested, highlight it
            if (reference.verse) {
                setTimeout(() => {
                    const verseElement = document.querySelector(`[data-verse="${reference.verse}"]`);
                    if (verseElement) {
                        verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        verseElement.style.backgroundColor = '#fff3cd';
                        verseElement.style.border = '2px solid #ffc107';
                        verseElement.style.borderRadius = '4px';
                        setTimeout(() => {
                            verseElement.style.backgroundColor = '';
                            verseElement.style.border = '';
                            verseElement.style.borderRadius = '';
                        }, 3000);
                    }
                }, 500);
            }

            // Clear search input
            document.getElementById('search-input').value = '';

        } catch (error) {
            console.error('Error navigating to reference:', error);
            alert(`Could not navigate to ${reference.book} ${reference.chapter}${reference.verse ? ':' + reference.verse : ''}`);
        }
    }

    handleSearchInput(value) {
        const trimmed = value.trim();

        if (trimmed.length === 0) {
            this.hideSearchSuggestions();
            return;
        }

        // Check if it looks like a reference
        const referenceMatch = this.parseReference(trimmed);
        if (referenceMatch) {
            this.showReferenceSuggestion(referenceMatch, trimmed);
            return;
        }

        // Show book suggestions
        this.showBookSuggestions(trimmed);
    }

    showReferenceSuggestion(reference, originalInput) {
        const suggestions = this.getOrCreateSuggestions();
        const referenceText = `${reference.book} ${reference.chapter}${reference.verse ? ':' + reference.verse : ''}`;

        suggestions.innerHTML = `
            <div class="search-suggestion-header">📖 Bible Reference</div>
            <div class="search-suggestion reference-suggestion" data-type="reference" data-reference='${JSON.stringify(reference)}'>
                <div class="suggestion-icon">📍</div>
                <div class="suggestion-content">
                    <div class="suggestion-title">${referenceText}</div>
                    <div class="suggestion-subtitle">Go to ${reference.verse ? 'verse' : 'chapter'}</div>
                </div>
            </div>
        `;

        this.addSuggestionClickHandlers();
        suggestions.style.display = 'block';
    }

    showBookSuggestions(input) {
        const inputLower = input.toLowerCase();
        const matchingBooks = this.bibleBooks.filter(book =>
            book.toLowerCase().includes(inputLower)
        ).slice(0, 8);

        if (matchingBooks.length === 0) {
            this.hideSearchSuggestions();
            return;
        }

        const suggestions = this.getOrCreateSuggestions();
        let html = '<div class="search-suggestion-header">📚 Bible Books</div>';

        matchingBooks.forEach(book => {
            html += `
                <div class="search-suggestion book-suggestion" data-type="book" data-book="${book}">
                    <div class="suggestion-icon">📖</div>
                    <div class="suggestion-content">
                        <div class="suggestion-title">${book}</div>
                        <div class="suggestion-subtitle">Browse chapters</div>
                    </div>
                </div>
            `;
        });

        suggestions.innerHTML = html;
        this.addSuggestionClickHandlers();
        suggestions.style.display = 'block';
    }

    showSearchSuggestions() {
        const input = document.getElementById('search-input').value.trim();
        if (input) {
            this.handleSearchInput(input);
        } else {
            // Show popular searches or recent searches
            this.showPopularSuggestions();
        }
    }

    showPopularSuggestions() {
        const suggestions = this.getOrCreateSuggestions();
        const popularSearches = [
            { type: 'reference', text: 'John 3:16', icon: '❤️' },
            { type: 'reference', text: 'Psalm 23', icon: '🙏' },
            { type: 'reference', text: 'Romans 8:28', icon: '✨' },
            { type: 'search', text: 'love', icon: '💕' },
            { type: 'search', text: 'faith', icon: '🙌' },
            { type: 'search', text: 'hope', icon: '🌟' },
            { type: 'reference', text: 'Genesis 1:1', icon: '🌍' },
            { type: 'reference', text: 'Matthew 5:3', icon: '⛰️' }
        ];

        let html = '<div class="search-suggestion-header">💡 Popular Searches</div>';

        popularSearches.forEach(item => {
            html += `
                <div class="search-suggestion popular-suggestion" data-type="${item.type}" data-text="${item.text}">
                    <div class="suggestion-icon">${item.icon}</div>
                    <div class="suggestion-content">
                        <div class="suggestion-title">${item.text}</div>
                        <div class="suggestion-subtitle">${item.type === 'reference' ? 'Bible Reference' : 'Search Term'}</div>
                    </div>
                </div>
            `;
        });

        suggestions.innerHTML = html;
        this.addSuggestionClickHandlers();
        suggestions.style.display = 'block';
    }

    getOrCreateSuggestions() {
        let suggestions = document.getElementById('search-suggestions');
        if (!suggestions) {
            suggestions = document.createElement('div');
            suggestions.id = 'search-suggestions';
            suggestions.className = 'search-suggestions';
            document.querySelector('.search-container').appendChild(suggestions);
        }
        return suggestions;
    }

    addSuggestionClickHandlers() {
        document.querySelectorAll('.search-suggestion').forEach(suggestion => {
            suggestion.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;

                if (type === 'reference') {
                    const referenceData = e.currentTarget.dataset.reference;
                    if (referenceData) {
                        const reference = JSON.parse(referenceData);
                        this.navigateToReference(reference);
                    } else {
                        // Handle popular reference suggestions
                        const text = e.currentTarget.dataset.text;
                        document.getElementById('search-input').value = text;
                        this.performSearch();
                    }
                } else if (type === 'book') {
                    const book = e.currentTarget.dataset.book;
                    this.navigateToBook(book);
                } else if (type === 'search') {
                    const text = e.currentTarget.dataset.text;
                    document.getElementById('search-input').value = text;
                    this.performSearch();
                }
            });
        });
    }

    navigateToBook(book) {
        this.hideSearchSuggestions();
        this.showView('bible');
        document.getElementById('book-select').value = book;
        this.selectBook(book);
        document.getElementById('chapter-select').value = '1';
        this.loadChapter();
        document.getElementById('search-input').value = '';
    }

    hideSearchSuggestions() {
        const suggestions = document.getElementById('search-suggestions');
        if (suggestions) {
            suggestions.style.display = 'none';
        }
    }

    showBibleNavModal() {
        // Initialize navigation state
        this.navState = {
            currentTab: 'book',
            selectedBook: null,
            selectedChapter: null,
            selectedVerse: null
        };

        this.populateBibleNavBooks();
        document.getElementById('bible-nav-modal').classList.add('show');

        // Initialize tab states
        this.updateTabStates();

        // Ensure book tab is always clickable
        this.ensureBookTabClickable();

        // Add tab switching functionality with event delegation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabType = e.target.dataset.tab;
                console.log('Tab clicked:', tabType); // Debug log
                this.switchNavTab(tabType);
            });
        });

        // Also add event delegation for tabs to ensure they always work
        document.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('nav-tab')) {
                const tabType = e.target.dataset.tab;
                console.log('Tab clicked via delegation:', tabType); // Debug log

                // Only allow book tab to be clicked freely, others need prerequisites
                if (tabType === 'book' ||
                    (tabType === 'chapter' && this.navState.selectedBook) ||
                    (tabType === 'verse' && this.navState.selectedBook && this.navState.selectedChapter)) {
                    this.switchNavTab(tabType);
                }
            }
        });
    }

    switchNavTab(tabType) {
        // Check if tab is accessible based on current state
        if (tabType === 'chapter' && !this.navState.selectedBook) {
            // Can't go to chapter without selecting book first
            return;
        }
        if (tabType === 'verse' && (!this.navState.selectedBook || !this.navState.selectedChapter)) {
            // Can't go to verse without selecting book and chapter first
            return;
        }

        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tabType}"]`).classList.add('active');

        this.navState.currentTab = tabType;
        this.updateTabStates();

        // Show appropriate content based on tab and state
        if (tabType === 'book') {
            this.populateBibleNavBooks();
        } else if (tabType === 'chapter') {
            this.populateBibleNavChapters(this.navState.selectedBook);
        } else if (tabType === 'verse') {
            this.populateBibleNavVerses(this.navState.selectedBook, this.navState.selectedChapter);
        }
    }

    updateTabStates() {
        const bookTab = document.querySelector('[data-tab="book"]');
        const chapterTab = document.querySelector('[data-tab="chapter"]');
        const verseTab = document.querySelector('[data-tab="verse"]');

        // Book tab should always be enabled and clickable
        if (bookTab) {
            bookTab.classList.remove('disabled');
            bookTab.style.opacity = '1';
            bookTab.style.cursor = 'pointer';
            bookTab.style.pointerEvents = 'auto';
        }

        // Enable/disable chapter tab based on book selection
        if (this.navState.selectedBook) {
            chapterTab.classList.remove('disabled');
            chapterTab.style.opacity = '1';
            chapterTab.style.cursor = 'pointer';
            chapterTab.style.pointerEvents = 'auto';
        } else {
            chapterTab.classList.add('disabled');
            chapterTab.style.opacity = '0.6';
            chapterTab.style.cursor = 'not-allowed';
            chapterTab.style.pointerEvents = 'none';
        }

        // Enable/disable verse tab based on chapter selection
        if (this.navState.selectedBook && this.navState.selectedChapter) {
            verseTab.classList.remove('disabled');
            verseTab.style.opacity = '1';
            verseTab.style.cursor = 'pointer';
            verseTab.style.pointerEvents = 'auto';
        } else {
            verseTab.classList.add('disabled');
            verseTab.style.opacity = '0.6';
            verseTab.style.cursor = 'not-allowed';
            verseTab.style.pointerEvents = 'none';
        }
    }

    closeBibleNavModal() {
        document.getElementById('bible-nav-modal').classList.remove('show');
    }

    populateBibleNavBooks() {
        const oldTestamentBooks = [
            { name: 'Genesis', abbr: 'GEN' },
            { name: 'Exodus', abbr: 'EX' },
            { name: 'Leviticus', abbr: 'LEV' },
            { name: 'Numbers', abbr: 'NUM' },
            { name: 'Deuteronomy', abbr: 'DEU' },
            { name: 'Joshua', abbr: 'JOS' },
            { name: 'Judges', abbr: 'JDG' },
            { name: 'Ruth', abbr: 'RTH' },
            { name: '1 Samuel', abbr: '1SA' },
            { name: '2 Samuel', abbr: '2SA' },
            { name: '1 Kings', abbr: '1KI' },
            { name: '2 Kings', abbr: '2KI' },
            { name: '1 Chronicles', abbr: '1CH' },
            { name: '2 Chronicles', abbr: '2CH' },
            { name: 'Ezra', abbr: 'EZR' },
            { name: 'Nehemiah', abbr: 'NEH' },
            { name: 'Esther', abbr: 'EST' },
            { name: 'Job', abbr: 'JOB' },
            { name: 'Psalms', abbr: 'PSA' },
            { name: 'Proverbs', abbr: 'PRV' },
            { name: 'Ecclesiastes', abbr: 'ECC' },
            { name: 'Song of Solomon', abbr: 'SOS' },
            { name: 'Isaiah', abbr: 'ISA' },
            { name: 'Jeremiah', abbr: 'JER' },
            { name: 'Lamentations', abbr: 'LAM' },
            { name: 'Ezekiel', abbr: 'EZE' },
            { name: 'Daniel', abbr: 'DAN' },
            { name: 'Hosea', abbr: 'HOS' },
            { name: 'Joel', abbr: 'JOE' },
            { name: 'Amos', abbr: 'AMO' },
            { name: 'Obadiah', abbr: 'OBD' },
            { name: 'Jonah', abbr: 'JON' },
            { name: 'Micah', abbr: 'MIC' },
            { name: 'Nahum', abbr: 'NAH' },
            { name: 'Habakkuk', abbr: 'HAB' },
            { name: 'Zephaniah', abbr: 'ZEP' },
            { name: 'Haggai', abbr: 'HAG' },
            { name: 'Zechariah', abbr: 'ZEC' },
            { name: 'Malachi', abbr: 'MAL' }
        ];

        const newTestamentBooks = [
            { name: 'Matthew', abbr: 'MAT' },
            { name: 'Mark', abbr: 'MRK' },
            { name: 'Luke', abbr: 'LUK' },
            { name: 'John', abbr: 'JN' },
            { name: 'Acts', abbr: 'ACT' },
            { name: 'Romans', abbr: 'ROM' },
            { name: '1 Corinthians', abbr: '1CO' },
            { name: '2 Corinthians', abbr: '2CO' },
            { name: 'Galatians', abbr: 'GAL' },
            { name: 'Ephesians', abbr: 'EPH' },
            { name: 'Philippians', abbr: 'PHP' },
            { name: 'Colossians', abbr: 'COL' },
            { name: '1 Thessalonians', abbr: '1TH' },
            { name: '2 Thessalonians', abbr: '2TH' },
            { name: '1 Timothy', abbr: '1TI' },
            { name: '2 Timothy', abbr: '2TI' },
            { name: 'Titus', abbr: 'TIT' },
            { name: 'Philemon', abbr: 'PHM' },
            { name: 'Hebrews', abbr: 'HEB' },
            { name: 'James', abbr: 'JAM' },
            { name: '1 Peter', abbr: '1PE' },
            { name: '2 Peter', abbr: '2PE' },
            { name: '1 John', abbr: '1JN' },
            { name: '2 John', abbr: '2JN' },
            { name: '3 John', abbr: '3JN' },
            { name: 'Jude', abbr: 'JUD' },
            { name: 'Revelation', abbr: 'REV' }
        ];

        // Populate Old Testament
        const otContainer = document.getElementById('old-testament-books');
        otContainer.innerHTML = oldTestamentBooks.map(book => `
            <button class="book-button" data-book="${book.name}" title="${book.name}">
                ${book.abbr}
            </button>
        `).join('');

        // Populate New Testament
        const ntContainer = document.getElementById('new-testament-books');
        ntContainer.innerHTML = newTestamentBooks.map(book => `
            <button class="book-button" data-book="${book.name}" title="${book.name}">
                ${book.abbr}
            </button>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.book-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const bookName = e.target.dataset.book;
                this.selectBookInModal(bookName);
            });
        });

        // Add breadcrumb navigation handlers (in case there are any)
        this.addBreadcrumbHandlers();
    }

    selectBookInModal(book) {
        this.navState.selectedBook = book;
        this.navState.selectedChapter = null;
        this.navState.selectedVerse = null;

        // Update tab states and switch to chapters
        this.updateTabStates();
        this.switchNavTab('chapter');
    }

    populateBibleNavChapters(book) {
        const content = document.querySelector('.bible-nav-content');

        // Get chapter count for the book
        const chapterCount = this.getChapterCount(book);

        let chaptersHtml = `
            <div class="nav-breadcrumb">
                <button class="breadcrumb-item" data-nav-action="book">📚 Books</button>
                <span class="breadcrumb-separator">›</span>
                <span class="breadcrumb-current">📖 ${book}</span>
            </div>
            <div class="nav-section">
                <h3 class="nav-section-title">Select Chapter in ${book}</h3>
                <div class="chapters-grid">
        `;

        for (let i = 1; i <= chapterCount; i++) {
            chaptersHtml += `
                <button class="chapter-button" data-chapter="${i}">
                    ${i}
                </button>
            `;
        }

        chaptersHtml += `
                </div>
            </div>
        `;

        content.innerHTML = chaptersHtml;

        // Add click handlers for chapters
        document.querySelectorAll('.chapter-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const chapter = parseInt(e.target.dataset.chapter);
                this.selectChapterInModal(chapter);
            });
        });

        // Add breadcrumb navigation handlers
        this.addBreadcrumbHandlers();
    }

    selectChapterInModal(chapter) {
        this.navState.selectedChapter = chapter;
        this.navState.selectedVerse = null;

        // Update tab states and switch to verses
        this.updateTabStates();
        this.switchNavTab('verse');
    }

    async populateBibleNavVerses(book, chapter) {
        const content = document.querySelector('.bible-nav-content');

        // Show loading
        content.innerHTML = `
            <div class="nav-breadcrumb">
                <button class="breadcrumb-item" data-nav-action="book">📚 Books</button>
                <span class="breadcrumb-separator">›</span>
                <button class="breadcrumb-item" data-nav-action="chapter">📖 ${book}</button>
                <span class="breadcrumb-separator">›</span>
                <span class="breadcrumb-current">📝 Chapter ${chapter}</span>
            </div>
            <div class="loading-spinner"><div class="spinner"></div></div>
        `;

        try {
            // Get verses for the chapter using the correct API endpoint
            const response = await fetch(`http://localhost:3001/api/chapter/${encodeURIComponent(book)}/${chapter}`);
            const data = await response.json();

            if (data.success && data.data && data.data.verses) {
                const verses = data.data.verses;

                let versesHtml = `
                    <div class="nav-breadcrumb">
                        <button class="breadcrumb-item" data-nav-action="book">📚 Books</button>
                        <span class="breadcrumb-separator">›</span>
                        <button class="breadcrumb-item" data-nav-action="chapter">📖 ${book}</button>
                        <span class="breadcrumb-separator">›</span>
                        <span class="breadcrumb-current">📝 Chapter ${chapter}</span>
                    </div>
                    <div class="nav-section">
                        <h3 class="nav-section-title">Select Verse in ${book} ${chapter}</h3>
                        <div class="verses-grid">
                `;

                verses.forEach(verse => {
                    versesHtml += `
                        <button class="verse-button" data-verse="${verse.verse}" title="${verse.text.substring(0, 100)}...">
                            ${verse.verse}
                        </button>
                    `;
                });

                versesHtml += `
                        </div>
                        <div class="nav-actions">
                            <button class="nav-action-btn" onclick="app.navigateToChapterFromModal()">
                                📖 Go to Chapter ${chapter}
                            </button>
                        </div>
                    </div>
                `;

                content.innerHTML = versesHtml;

                // Add click handlers for verses
                document.querySelectorAll('.verse-button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const verse = parseInt(e.target.dataset.verse);
                        this.selectVerseInModal(verse);
                    });
                });

                // Add breadcrumb navigation handlers
                this.addBreadcrumbHandlers();

            } else {
                throw new Error('Could not load verses');
            }

        } catch (error) {
            console.error('Error loading verses:', error);
            content.innerHTML = `
                <div class="nav-breadcrumb">
                    <button class="breadcrumb-item" data-nav-action="book">📚 Books</button>
                    <span class="breadcrumb-separator">›</span>
                    <button class="breadcrumb-item" data-nav-action="chapter">📖 ${book}</button>
                    <span class="breadcrumb-separator">›</span>
                    <span class="breadcrumb-current">📝 Chapter ${chapter}</span>
                </div>
                <div class="error-message">
                    <h3>Error Loading Verses</h3>
                    <p>Could not load verses for ${book} ${chapter}</p>
                    <button class="btn-primary" data-nav-action="chapter">← Back to Chapters</button>
                </div>
            `;

            // Add breadcrumb navigation handlers
            this.addBreadcrumbHandlers();
        }
    }

    ensureBookTabClickable() {
        const bookTab = document.querySelector('[data-tab="book"]');
        if (bookTab) {
            // Make sure book tab is always clickable
            bookTab.classList.remove('disabled');
            bookTab.style.opacity = '1';
            bookTab.style.cursor = 'pointer';
            bookTab.style.pointerEvents = 'auto';

            // Add a specific click handler for the book tab
            bookTab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Book tab clicked directly');
                this.switchNavTab('book');
            });
        }
    }

    addBreadcrumbHandlers() {
        // Add click handlers for breadcrumb navigation
        document.querySelectorAll('[data-nav-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.navAction;
                if (action === 'book') {
                    // Reset state and go to book selection
                    this.navState.selectedBook = null;
                    this.navState.selectedChapter = null;
                    this.navState.selectedVerse = null;
                    this.switchNavTab('book');
                } else if (action === 'chapter') {
                    // Keep book, reset chapter and verse, go to chapter selection
                    this.navState.selectedChapter = null;
                    this.navState.selectedVerse = null;
                    this.switchNavTab('chapter');
                }
            });
        });
    }

    selectVerseInModal(verse) {
        this.navState.selectedVerse = verse;
        this.navigateToVerseFromModal();
    }

    navigateToChapterFromModal() {
        this.closeBibleNavModal();
        this.navigateToReference({
            book: this.navState.selectedBook,
            chapter: this.navState.selectedChapter,
            verse: null
        });
    }

    navigateToVerseFromModal() {
        this.closeBibleNavModal();
        this.navigateToReference({
            book: this.navState.selectedBook,
            chapter: this.navState.selectedChapter,
            verse: this.navState.selectedVerse
        });
    }

    updateNavBreadcrumb() {
        // This will be called when breadcrumb needs updating
        // Implementation depends on current state
    }

    getChapterCount(book) {
        // Chapter counts for each book of the Bible
        const chapterCounts = {
            'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34,
            'Joshua': 24, 'Judges': 21, 'Ruth': 4, '1 Samuel': 31, '2 Samuel': 24,
            '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36, 'Ezra': 10,
            'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150, 'Proverbs': 31,
            'Ecclesiastes': 12, 'Song of Solomon': 8, 'Isaiah': 66, 'Jeremiah': 52, 'Lamentations': 5,
            'Ezekiel': 48, 'Daniel': 12, 'Hosea': 14, 'Joel': 3, 'Amos': 9,
            'Obadiah': 1, 'Jonah': 4, 'Micah': 7, 'Nahum': 3, 'Habakkuk': 3,
            'Zephaniah': 3, 'Haggai': 2, 'Zechariah': 14, 'Malachi': 4,
            'Matthew': 28, 'Mark': 16, 'Luke': 24, 'John': 21, 'Acts': 28,
            'Romans': 16, '1 Corinthians': 16, '2 Corinthians': 13, 'Galatians': 6, 'Ephesians': 6,
            'Philippians': 4, 'Colossians': 4, '1 Thessalonians': 5, '2 Thessalonians': 3, '1 Timothy': 6,
            '2 Timothy': 4, 'Titus': 3, 'Philemon': 1, 'Hebrews': 13, 'James': 5,
            '1 Peter': 5, '2 Peter': 3, '1 John': 5, '2 John': 1, '3 John': 1,
            'Jude': 1, 'Revelation': 22
        };

        return chapterCounts[book] || 1;
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
