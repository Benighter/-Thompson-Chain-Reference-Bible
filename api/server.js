// Thompson Chain Reference Bible API Server
const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// External Bible API configurations
const BIBLE_APIS = {
    bolls: {
        baseUrl: 'https://bolls.life',
        translations: null, // Will be loaded dynamically
        books: null // Will be loaded dynamically
    },
    bibleApi: {
        baseUrl: 'https://bible-api.com',
        defaultTranslation: 'web'
    }
};

// Helper function to make HTTP requests
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    resolve(data); // Return raw data if not JSON
                }
            });
        }).on('error', reject);
    });
}

// Initialize external Bible APIs
async function initializeBibleAPIs() {
    try {
        console.log('Loading Bible translations and books...');

        // Load Bolls.life translations
        const translations = await makeRequest('https://bolls.life/static/bolls/app/views/languages.json');
        BIBLE_APIS.bolls.translations = translations;

        // Load books for KJV translation (most complete)
        const books = await makeRequest('https://bolls.life/get-books/KJV/');
        BIBLE_APIS.bolls.books = books;

        console.log(`Loaded ${translations.length} translations and ${books.length} books`);
    } catch (error) {
        console.error('Failed to initialize Bible APIs:', error);
    }
}

// Bible book mapping (Bolls.life uses numeric IDs)
const BOOK_NAME_TO_ID = {
    'Genesis': 1, 'Exodus': 2, 'Leviticus': 3, 'Numbers': 4, 'Deuteronomy': 5,
    'Joshua': 6, 'Judges': 7, 'Ruth': 8, '1 Samuel': 9, '2 Samuel': 10,
    '1 Kings': 11, '2 Kings': 12, '1 Chronicles': 13, '2 Chronicles': 14,
    'Ezra': 15, 'Nehemiah': 16, 'Esther': 17, 'Job': 18, 'Psalms': 19, 'Proverbs': 20,
    'Ecclesiastes': 21, 'Song of Solomon': 22, 'Isaiah': 23, 'Jeremiah': 24,
    'Lamentations': 25, 'Ezekiel': 26, 'Daniel': 27, 'Hosea': 28, 'Joel': 29,
    'Amos': 30, 'Obadiah': 31, 'Jonah': 32, 'Micah': 33, 'Nahum': 34, 'Habakkuk': 35,
    'Zephaniah': 36, 'Haggai': 37, 'Zechariah': 38, 'Malachi': 39,
    'Matthew': 40, 'Mark': 41, 'Luke': 42, 'John': 43, 'Acts': 44, 'Romans': 45,
    '1 Corinthians': 46, '2 Corinthians': 47, 'Galatians': 48, 'Ephesians': 49,
    'Philippians': 50, 'Colossians': 51, '1 Thessalonians': 52, '2 Thessalonians': 53,
    '1 Timothy': 54, '2 Timothy': 55, 'Titus': 56, 'Philemon': 57, 'Hebrews': 58,
    'James': 59, '1 Peter': 60, '2 Peter': 61, '1 John': 62, '2 John': 63, '3 John': 64,
    'Jude': 65, 'Revelation': 66
};

const BOOK_ID_TO_NAME = Object.fromEntries(
    Object.entries(BOOK_NAME_TO_ID).map(([name, id]) => [id, name])
);

// Helper function to get Bible books
function getBibleBooks() {
    if (BIBLE_APIS.bolls.books) {
        return BIBLE_APIS.bolls.books.map(book => book.name);
    }
    // Fallback to hardcoded list
    return Object.keys(BOOK_NAME_TO_ID);
}

// Chain reference data
const chainData = {
    1: {
        id: 1,
        title: "God's Love",
        description: "The love of God demonstrated throughout Scripture",
        verses: [
            { reference: "John 3:16", text: "For God so loved the world..." },
            { reference: "Romans 5:8", text: "But God demonstrates his own love for us..." },
            { reference: "1 John 4:8", text: "God is love." },
            { reference: "1 John 4:19", text: "We love because he first loved us." }
        ]
    },
    2: {
        id: 2,
        title: "Faith",
        description: "Biblical teaching on faith and trust in God",
        verses: [
            { reference: "Hebrews 11:1", text: "Now faith is confidence in what we hope for..." },
            { reference: "Romans 10:17", text: "Faith comes from hearing the message..." },
            { reference: "Ephesians 2:8", text: "For it is by grace you have been saved, through faith..." }
        ]
    },
    3: {
        id: 3,
        title: "Prayer",
        description: "Instructions and examples of prayer in Scripture",
        verses: [
            { reference: "Matthew 6:9", text: "This, then, is how you should pray..." },
            { reference: "1 Thessalonians 5:17", text: "Pray continually" },
            { reference: "Philippians 4:6", text: "Do not be anxious about anything..." }
        ]
    }
};

// API Routes

// Get API information
app.get('/api', (req, res) => {
    res.json({
        name: 'Thompson Chain Reference Bible API',
        version: '1.0.0',
        description: 'RESTful API for Thompson Chain Reference Bible data',
        endpoints: {
            books: '/api/books',
            search: '/api/search?q={query}',
            chains: '/api/chains',
            chain: '/api/chains/{id}',
            verse: '/api/verse/{book}/{chapter}/{verse}',
            chapter: '/api/chapter/{book}/{chapter}'
        }
    });
});

// Get all Bible books
app.get('/api/books', (req, res) => {
    const books = getBibleBooks();
    res.json({
        success: true,
        data: books,
        count: books.length
    });
});

// Get available translations
app.get('/api/translations', (req, res) => {
    const translations = [];

    if (BIBLE_APIS.bolls.translations) {
        BIBLE_APIS.bolls.translations.forEach(trans => {
            translations.push({
                id: trans.short_name,
                name: trans.full_name,
                language: trans.language || 'Unknown',
                source: 'bolls.life'
            });
        });
    }

    // Add bible-api.com translations
    const bibleApiTranslations = [
        { id: 'web', name: 'World English Bible', language: 'English' },
        { id: 'kjv', name: 'King James Version', language: 'English' },
        { id: 'asv', name: 'American Standard Version', language: 'English' },
        { id: 'ylt', name: 'Young\'s Literal Translation', language: 'English' },
        { id: 'darby', name: 'Darby Bible', language: 'English' }
    ];

    bibleApiTranslations.forEach(trans => {
        if (!translations.find(t => t.id === trans.id)) {
            translations.push({
                ...trans,
                source: 'bible-api.com'
            });
        }
    });

    res.json({
        success: true,
        data: translations,
        count: translations.length
    });
});

// Get specific verse
app.get('/api/verse/:book/:chapter/:verse', async (req, res) => {
    const { book, chapter, verse } = req.params;
    const translation = req.query.translation || 'KJV';

    try {
        const bookId = BOOK_NAME_TO_ID[book];
        if (!bookId) {
            return res.status(404).json({
                success: false,
                error: 'Book not found',
                message: `Book "${book}" not found`
            });
        }

        // Try Bolls.life API first
        try {
            const url = `https://bolls.life/get-text/${translation}/${bookId}/${chapter}/${verse}/`;
            const verseData = await makeRequest(url);

            if (verseData && verseData.length > 0) {
                const verseObj = verseData[0];
                return res.json({
                    success: true,
                    data: {
                        reference: `${book} ${chapter}:${verse}`,
                        book,
                        chapter: parseInt(chapter),
                        verse: parseInt(verse),
                        text: verseObj.text.replace(/<[^>]*>/g, ''), // Remove HTML tags
                        translation: translation.toUpperCase()
                    }
                });
            }
        } catch (bollsError) {
            console.log('Bolls.life API failed, trying bible-api.com...');
        }

        // Fallback to bible-api.com
        try {
            const url = `https://bible-api.com/${book} ${chapter}:${verse}?translation=${translation.toLowerCase()}`;
            const verseData = await makeRequest(url);

            if (verseData && verseData.text) {
                return res.json({
                    success: true,
                    data: {
                        reference: verseData.reference,
                        book,
                        chapter: parseInt(chapter),
                        verse: parseInt(verse),
                        text: verseData.text,
                        translation: verseData.translation_name || translation.toUpperCase()
                    }
                });
            }
        } catch (bibleApiError) {
            console.log('bible-api.com also failed');
        }

        return res.status(404).json({
            success: false,
            error: 'Verse not found',
            message: `${book} ${chapter}:${verse} not available`
        });

    } catch (error) {
        console.error('Error fetching verse:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Get chapter
app.get('/api/chapter/:book/:chapter', async (req, res) => {
    const { book, chapter } = req.params;
    const translation = req.query.translation || 'KJV';

    try {
        const bookId = BOOK_NAME_TO_ID[book];
        if (!bookId) {
            return res.status(404).json({
                success: false,
                error: 'Book not found',
                message: `Book "${book}" not found`
            });
        }

        // Try Bolls.life API first
        try {
            const url = `https://bolls.life/get-text/${translation}/${bookId}/${chapter}/`;
            const chapterData = await makeRequest(url);

            if (chapterData && Array.isArray(chapterData) && chapterData.length > 0) {
                return res.json({
                    success: true,
                    data: {
                        book,
                        chapter: parseInt(chapter),
                        translation: translation.toUpperCase(),
                        verses: chapterData.map(v => ({
                            verse: v.verse,
                            text: v.text.replace(/<[^>]*>/g, ''), // Remove HTML tags
                            reference: `${book} ${chapter}:${v.verse}`
                        }))
                    }
                });
            }
        } catch (bollsError) {
            console.log('Bolls.life API failed, trying bible-api.com...');
        }

        // Fallback to bible-api.com
        try {
            const url = `https://bible-api.com/${book} ${chapter}?translation=${translation.toLowerCase()}`;
            const chapterData = await makeRequest(url);

            if (chapterData && chapterData.verses) {
                return res.json({
                    success: true,
                    data: {
                        book,
                        chapter: parseInt(chapter),
                        translation: chapterData.translation_name || translation.toUpperCase(),
                        verses: chapterData.verses.map(v => ({
                            verse: v.verse,
                            text: v.text,
                            reference: `${book} ${chapter}:${v.verse}`
                        }))
                    }
                });
            }
        } catch (bibleApiError) {
            console.log('bible-api.com also failed');
        }

        return res.status(404).json({
            success: false,
            error: 'Chapter not found',
            message: `${book} ${chapter} not available`
        });

    } catch (error) {
        console.error('Error fetching chapter:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Search Bible
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    const limit = parseInt(req.query.limit) || 50;
    const translation = req.query.translation || 'KJV';

    if (!query) {
        return res.status(400).json({
            success: false,
            error: 'Query parameter required',
            message: 'Use ?q=your_search_term'
        });
    }

    try {
        let results = [];

        // Try Bolls.life API first
        try {
            const url = `https://bolls.life/v2/find/${translation}?search=${encodeURIComponent(query)}&limit=${limit}`;
            const searchData = await makeRequest(url);

            if (searchData && searchData.results) {
                results = searchData.results.map(result => ({
                    reference: `${BOOK_ID_TO_NAME[result.book] || result.book} ${result.chapter}:${result.verse}`,
                    book: BOOK_ID_TO_NAME[result.book] || result.book,
                    chapter: result.chapter,
                    verse: result.verse,
                    text: result.text.replace(/<[^>]*>/g, ''), // Remove HTML tags
                    translation: result.translation || translation.toUpperCase(),
                    relevance: calculateRelevance(result.text, query)
                }));

                return res.json({
                    success: true,
                    data: results,
                    query,
                    total: searchData.total || results.length,
                    returned: results.length,
                    source: 'bolls.life'
                });
            }
        } catch (bollsError) {
            console.log('Bolls.life search failed, trying fallback...');
        }

        // Fallback: search through a few key chapters using bible-api.com
        const keyVerses = [
            'John 3:16', 'Romans 3:23', 'Romans 6:23', 'Romans 10:9', 'Ephesians 2:8-9',
            'John 14:6', '1 John 1:9', 'Acts 16:31', 'John 1:12', 'Romans 5:8'
        ];

        for (const verseRef of keyVerses) {
            try {
                const url = `https://bible-api.com/${verseRef}?translation=${translation.toLowerCase()}`;
                const verseData = await makeRequest(url);

                if (verseData && verseData.text &&
                    verseData.text.toLowerCase().includes(query.toLowerCase())) {

                    const [book, chapterVerse] = verseRef.split(' ');
                    const [chapter, verse] = chapterVerse.split(':');

                    results.push({
                        reference: verseData.reference,
                        book,
                        chapter: parseInt(chapter),
                        verse: parseInt(verse),
                        text: verseData.text,
                        translation: verseData.translation_name || translation.toUpperCase(),
                        relevance: calculateRelevance(verseData.text, query)
                    });
                }
            } catch (error) {
                // Continue with next verse
            }
        }

        // Sort by relevance
        results.sort((a, b) => b.relevance - a.relevance);
        const limitedResults = results.slice(0, limit);

        res.json({
            success: true,
            data: limitedResults,
            query,
            total: results.length,
            returned: limitedResults.length,
            source: 'bible-api.com (limited)'
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            error: 'Search failed',
            message: 'Unable to perform search at this time'
        });
    }
});

// Get all chains
app.get('/api/chains', (req, res) => {
    const chains = Object.values(chainData).map(chain => ({
        id: chain.id,
        title: chain.title,
        description: chain.description,
        verseCount: chain.verses.length
    }));
    
    res.json({
        success: true,
        data: chains,
        count: chains.length
    });
});

// Get specific chain
app.get('/api/chains/:id', (req, res) => {
    const chainId = req.params.id;
    const chain = chainData[chainId];
    
    if (!chain) {
        return res.status(404).json({
            success: false,
            error: 'Chain not found'
        });
    }
    
    res.json({
        success: true,
        data: chain
    });
});

// Search chains
app.get('/api/chains/search', (req, res) => {
    const query = req.query.q;
    
    if (!query) {
        return res.status(400).json({
            success: false,
            error: 'Query parameter required'
        });
    }
    
    const results = [];
    const searchTerm = query.toLowerCase();
    
    Object.values(chainData).forEach(chain => {
        if (chain.title.toLowerCase().includes(searchTerm) ||
            chain.description.toLowerCase().includes(searchTerm)) {
            results.push({
                id: chain.id,
                title: chain.title,
                description: chain.description,
                matchType: 'title'
            });
        }
        
        chain.verses.forEach(verse => {
            if (verse.text.toLowerCase().includes(searchTerm)) {
                results.push({
                    id: chain.id,
                    title: chain.title,
                    verse: verse,
                    matchType: 'verse'
                });
            }
        });
    });
    
    res.json({
        success: true,
        data: results,
        query,
        count: results.length
    });
});

// Helper function to calculate relevance
function calculateRelevance(text, query) {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    
    let score = 0;
    if (lowerText.includes(lowerQuery)) score += 10;
    
    const queryWords = lowerQuery.split(/\s+/);
    const textWords = lowerText.split(/\s+/);
    
    queryWords.forEach(queryWord => {
        textWords.forEach(textWord => {
            if (textWord === queryWord) score += 5;
            else if (textWord.includes(queryWord)) score += 2;
        });
    });
    
    return score;
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        message: 'Check /api for available endpoints'
    });
});

// Start server
app.listen(PORT, async () => {
    console.log(`Thompson Chain Reference Bible API running on port ${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/api`);

    // Initialize Bible APIs
    await initializeBibleAPIs();
    console.log('Bible APIs initialized successfully!');
});

module.exports = app;
