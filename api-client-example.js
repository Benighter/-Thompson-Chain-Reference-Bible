// Thompson Chain Reference Bible API Client Example
// This demonstrates how to use the API from JavaScript

class ThompsonBibleAPI {
    constructor(baseUrl = 'http://localhost:3001/api') {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Get API information
    async getApiInfo() {
        return this.request('');
    }

    // Get all Bible books
    async getBooks() {
        const response = await this.request('/books');
        return response.data;
    }

    // Get specific verse
    async getVerse(book, chapter, verse) {
        const response = await this.request(`/verse/${book}/${chapter}/${verse}`);
        return response.data;
    }

    // Get chapter
    async getChapter(book, chapter) {
        const response = await this.request(`/chapter/${book}/${chapter}`);
        return response.data;
    }

    // Search Bible
    async searchBible(query, limit = 50) {
        const params = new URLSearchParams({ q: query, limit: limit.toString() });
        const response = await this.request(`/search?${params}`);
        return response.data;
    }

    // Get all chains
    async getChains() {
        const response = await this.request('/chains');
        return response.data;
    }

    // Get specific chain
    async getChain(id) {
        const response = await this.request(`/chains/${id}`);
        return response.data;
    }

    // Search chains
    async searchChains(query) {
        const params = new URLSearchParams({ q: query });
        const response = await this.request(`/chains/search?${params}`);
        return response.data;
    }
}

// Usage Examples
async function demonstrateAPI() {
    const api = new ThompsonBibleAPI();

    try {
        console.log('=== Thompson Chain Reference Bible API Demo ===\n');

        // 1. Get API information
        console.log('1. API Information:');
        const apiInfo = await api.getApiInfo();
        console.log(JSON.stringify(apiInfo, null, 2));
        console.log('\n');

        // 2. Get all books
        console.log('2. Bible Books:');
        const books = await api.getBooks();
        console.log(`Found ${books.length} books:`, books.slice(0, 5), '...');
        console.log('\n');

        // 3. Get specific verse
        console.log('3. Get John 3:16:');
        const verse = await api.getVerse('John', 3, 16);
        console.log(JSON.stringify(verse, null, 2));
        console.log('\n');

        // 4. Search Bible
        console.log('4. Search for "love":');
        const searchResults = await api.searchBible('love', 3);
        console.log(`Found ${searchResults.length} results:`);
        searchResults.forEach(result => {
            console.log(`- ${result.reference}: ${result.text.substring(0, 50)}...`);
        });
        console.log('\n');

        // 5. Get all chains
        console.log('5. Chain References:');
        const chains = await api.getChains();
        console.log(`Found ${chains.length} chains:`);
        chains.forEach(chain => {
            console.log(`- Chain ${chain.id}: ${chain.title} (${chain.verseCount} verses)`);
        });
        console.log('\n');

        // 6. Get specific chain
        console.log('6. Get Chain 1 (God\'s Love):');
        const chain = await api.getChain(1);
        console.log(`Title: ${chain.title}`);
        console.log(`Description: ${chain.description}`);
        console.log('Verses:');
        chain.verses.forEach((verse, index) => {
            console.log(`  ${index + 1}. ${verse.reference}: ${verse.text.substring(0, 50)}...`);
        });
        console.log('\n');

        // 7. Search chains
        console.log('7. Search chains for "faith":');
        const chainSearchResults = await api.searchChains('faith');
        console.log(`Found ${chainSearchResults.length} results:`);
        chainSearchResults.forEach(result => {
            console.log(`- ${result.title} (${result.matchType})`);
        });

    } catch (error) {
        console.error('Demo failed:', error);
    }
}

// Integration with existing web app
class APIIntegratedBibleApp extends ThompsonChainBible {
    constructor() {
        super();
        this.api = new ThompsonBibleAPI();
    }

    // Override search to use API
    async performSearch() {
        const query = document.getElementById('search-input').value.trim();
        if (!query) return;

        const searchResults = document.getElementById('search-results');
        searchResults.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
        document.getElementById('search-modal').classList.add('show');

        try {
            const results = await this.api.searchBible(query, 20);
            this.displaySearchResults(results, query);
        } catch (error) {
            console.error('Search failed:', error);
            searchResults.innerHTML = '<p>Search failed. Please try again.</p>';
        }
    }

    // Override chain loading to use API
    async loadChainReferences(topic) {
        const chainResults = document.getElementById('chain-results');
        chainResults.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';

        try {
            // Map topic names to chain IDs (in a real app, this would be more sophisticated)
            const topicToChainId = {
                'love': 1,
                'faith': 2,
                'prayer': 3
            };

            const chainId = topicToChainId[topic];
            if (!chainId) {
                chainResults.innerHTML = '<p>Chain references not available for this topic.</p>';
                return;
            }

            const chainData = await this.api.getChain(chainId);
            this.displayChainData(chainData);
        } catch (error) {
            console.error('Failed to load chain:', error);
            chainResults.innerHTML = '<p>Failed to load chain references.</p>';
        }
    }

    displayChainData(data) {
        const chainResults = document.getElementById('chain-results');
        
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

    // Load Bible books from API
    async loadBibleBooks() {
        try {
            this.bibleBooks = await this.api.getBooks();
        } catch (error) {
            console.error('Failed to load Bible books:', error);
            // Fallback to hardcoded list
            super.loadBibleBooks();
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThompsonBibleAPI, APIIntegratedBibleApp };
} else {
    window.ThompsonBibleAPI = ThompsonBibleAPI;
    window.APIIntegratedBibleApp = APIIntegratedBibleApp;
}

// Run demo if this file is executed directly
if (typeof window === 'undefined') {
    demonstrateAPI();
}
