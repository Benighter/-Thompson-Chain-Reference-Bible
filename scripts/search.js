// Thompson Chain Reference Bible - Advanced Search System

class SearchManager {
    constructor() {
        this.searchHistory = [];
        this.savedSearches = [];
        this.searchFilters = {
            books: [],
            testament: 'both', // 'old', 'new', 'both'
            searchType: 'contains', // 'contains', 'exact', 'starts', 'ends'
            caseSensitive: false
        };
        this.init();
    }

    init() {
        this.loadSearchHistory();
        this.loadSavedSearches();
    }

    loadSearchHistory() {
        // In a real app, this would load from local storage or database
        this.searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    }

    loadSavedSearches() {
        // In a real app, this would load from local storage or database
        this.savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]');
    }

    saveSearchHistory() {
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    saveSavedSearches() {
        localStorage.setItem('savedSearches', JSON.stringify(this.savedSearches));
    }

    async performSearch(query, options = {}) {
        const searchOptions = { ...this.searchFilters, ...options };
        
        // Add to search history
        this.addToHistory(query, searchOptions);

        // Perform the actual search
        const results = await this.executeSearch(query, searchOptions);

        return {
            query,
            options: searchOptions,
            results,
            timestamp: new Date().toISOString(),
            resultCount: results.length
        };
    }

    async executeSearch(query, options) {
        // Simulate database search (in real app, would query actual Bible database)
        const mockResults = await this.mockBibleSearch(query, options);
        
        // Apply filters
        let filteredResults = this.applyFilters(mockResults, options);
        
        // Sort results
        filteredResults = this.sortResults(filteredResults, options.sortBy || 'relevance');

        return filteredResults;
    }

    async mockBibleSearch(query, options) {
        // Mock Bible data for demonstration
        const mockVerses = [
            { book: 'John', chapter: 3, verse: 16, text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
            { book: 'Romans', chapter: 5, verse: 8, text: 'But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.' },
            { book: '1 John', chapter: 4, verse: 8, text: 'Whoever does not love does not know God, because God is love.' },
            { book: '1 John', chapter: 4, verse: 19, text: 'We love because he first loved us.' },
            { book: 'Ephesians', chapter: 2, verse: 4, text: 'But because of his great love for us, God, who is rich in mercy,' },
            { book: 'Jeremiah', chapter: 31, verse: 3, text: 'The LORD appeared to us in the past, saying: "I have loved you with an everlasting love; I have drawn you with unfailing kindness."' },
            { book: 'Psalm', chapter: 136, verse: 1, text: 'Give thanks to the LORD, for he is good. His love endures forever.' },
            { book: 'Genesis', chapter: 1, verse: 1, text: 'In the beginning God created the heavens and the earth.' },
            { book: 'Hebrews', chapter: 11, verse: 1, text: 'Now faith is confidence in what we hope for and assurance about what we do not see.' },
            { book: 'Matthew', chapter: 6, verse: 9, text: 'This, then, is how you should pray: Our Father in heaven, hallowed be your name,' }
        ];

        // Filter based on search query
        const searchTerm = options.caseSensitive ? query : query.toLowerCase();
        
        return mockVerses.filter(verse => {
            const text = options.caseSensitive ? verse.text : verse.text.toLowerCase();
            
            switch (options.searchType) {
                case 'exact':
                    return text === searchTerm;
                case 'starts':
                    return text.startsWith(searchTerm);
                case 'ends':
                    return text.endsWith(searchTerm);
                case 'contains':
                default:
                    return text.includes(searchTerm);
            }
        }).map(verse => ({
            ...verse,
            reference: `${verse.book} ${verse.chapter}:${verse.verse}`,
            relevanceScore: this.calculateRelevance(verse.text, query)
        }));
    }

    applyFilters(results, options) {
        let filtered = [...results];

        // Filter by books
        if (options.books && options.books.length > 0) {
            filtered = filtered.filter(result => options.books.includes(result.book));
        }

        // Filter by testament
        if (options.testament !== 'both') {
            const oldTestamentBooks = [
                'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
                'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
                '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
                'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
                'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
                'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
                'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
                'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
            ];

            filtered = filtered.filter(result => {
                const isOldTestament = oldTestamentBooks.includes(result.book);
                return options.testament === 'old' ? isOldTestament : !isOldTestament;
            });
        }

        return filtered;
    }

    sortResults(results, sortBy) {
        switch (sortBy) {
            case 'relevance':
                return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
            case 'biblical':
                return results.sort((a, b) => {
                    // Sort by biblical order (simplified)
                    const bookOrder = { 'Genesis': 1, 'Exodus': 2, 'Matthew': 40, 'John': 43, 'Romans': 45 };
                    const aOrder = bookOrder[a.book] || 999;
                    const bOrder = bookOrder[b.book] || 999;
                    
                    if (aOrder !== bOrder) return aOrder - bOrder;
                    if (a.chapter !== b.chapter) return a.chapter - b.chapter;
                    return a.verse - b.verse;
                });
            case 'alphabetical':
                return results.sort((a, b) => a.reference.localeCompare(b.reference));
            default:
                return results;
        }
    }

    calculateRelevance(text, query) {
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        
        let score = 0;
        
        // Exact match gets highest score
        if (lowerText.includes(lowerQuery)) {
            score += 10;
        }
        
        // Word matches
        const queryWords = lowerQuery.split(/\s+/);
        const textWords = lowerText.split(/\s+/);
        
        queryWords.forEach(queryWord => {
            textWords.forEach(textWord => {
                if (textWord === queryWord) {
                    score += 5;
                } else if (textWord.includes(queryWord)) {
                    score += 2;
                }
            });
        });
        
        return score;
    }

    addToHistory(query, options) {
        const historyItem = {
            query,
            options,
            timestamp: new Date().toISOString()
        };

        // Remove duplicate if exists
        this.searchHistory = this.searchHistory.filter(item => item.query !== query);
        
        // Add to beginning
        this.searchHistory.unshift(historyItem);
        
        // Keep only last 50 searches
        this.searchHistory = this.searchHistory.slice(0, 50);
        
        this.saveSearchHistory();
    }

    saveSearch(name, query, options) {
        const savedSearch = {
            id: Date.now().toString(),
            name,
            query,
            options,
            created: new Date().toISOString()
        };

        this.savedSearches.push(savedSearch);
        this.saveSavedSearches();
        
        return savedSearch;
    }

    deleteSavedSearch(id) {
        this.savedSearches = this.savedSearches.filter(search => search.id !== id);
        this.saveSavedSearches();
    }

    getSavedSearch(id) {
        return this.savedSearches.find(search => search.id === id);
    }

    clearHistory() {
        this.searchHistory = [];
        this.saveSearchHistory();
    }

    getSearchSuggestions(partialQuery) {
        // Generate search suggestions based on history and common terms
        const suggestions = [];
        
        // From history
        this.searchHistory.forEach(item => {
            if (item.query.toLowerCase().includes(partialQuery.toLowerCase())) {
                suggestions.push({
                    type: 'history',
                    text: item.query,
                    icon: 'fas fa-history'
                });
            }
        });

        // Common Bible terms
        const commonTerms = [
            'love', 'faith', 'hope', 'peace', 'joy', 'salvation', 'grace',
            'prayer', 'forgiveness', 'eternal life', 'kingdom of God',
            'Jesus Christ', 'Holy Spirit', 'righteousness', 'wisdom'
        ];

        commonTerms.forEach(term => {
            if (term.toLowerCase().includes(partialQuery.toLowerCase())) {
                suggestions.push({
                    type: 'suggestion',
                    text: term,
                    icon: 'fas fa-lightbulb'
                });
            }
        });

        // Remove duplicates and limit
        const uniqueSuggestions = suggestions.filter((item, index, self) => 
            index === self.findIndex(t => t.text === item.text)
        );

        return uniqueSuggestions.slice(0, 10);
    }

    exportSearchResults(results, format = 'text') {
        switch (format) {
            case 'text':
                return results.map(result => 
                    `${result.reference}\n${result.text}\n`
                ).join('\n');

            case 'json':
                return JSON.stringify(results, null, 2);

            case 'csv':
                const headers = 'Reference,Book,Chapter,Verse,Text\n';
                const rows = results.map(result => 
                    `"${result.reference}","${result.book}","${result.chapter}","${result.verse}","${result.text}"`
                ).join('\n');
                return headers + rows;

            case 'html':
                let html = '<div class="search-results">';
                results.forEach(result => {
                    html += `
                        <div class="search-result">
                            <h4>${result.reference}</h4>
                            <p>${result.text}</p>
                        </div>
                    `;
                });
                html += '</div>';
                return html;

            default:
                return this.exportSearchResults(results, 'text');
        }
    }

    getSearchStatistics() {
        const stats = {
            totalSearches: this.searchHistory.length,
            savedSearches: this.savedSearches.length,
            mostSearchedTerms: {},
            recentActivity: this.searchHistory.slice(0, 10)
        };

        // Count search terms
        this.searchHistory.forEach(item => {
            const term = item.query.toLowerCase();
            stats.mostSearchedTerms[term] = (stats.mostSearchedTerms[term] || 0) + 1;
        });

        return stats;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchManager;
} else {
    window.SearchManager = SearchManager;
}
