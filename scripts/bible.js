// Thompson Chain Reference Bible - Bible Text Management

class BibleManager {
    constructor() {
        this.currentTranslation = 'KJV';
        this.availableTranslations = ['KJV', 'NIV', 'ESV', 'NASB'];
        this.bookData = {};
        this.init();
    }

    init() {
        this.loadBibleData();
    }

    async loadBibleData() {
        // In a real application, this would load from a database or API
        // For now, we'll use sample data
        this.bookData = {
            'Genesis': {
                chapters: 50,
                verses: {
                    1: [
                        "In the beginning God created the heaven and the earth.",
                        "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
                        "And God said, Let there be light: and there was light.",
                        "And God saw the light, that it was good: and God divided the light from the darkness.",
                        "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day."
                    ]
                }
            },
            'John': {
                chapters: 21,
                verses: {
                    3: [
                        "There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:",
                        "The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him.",
                        "Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.",
                        // ... more verses would be here
                        "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
                    ]
                }
            }
        };
    }

    getBookChapters(bookName) {
        const book = this.bookData[bookName];
        return book ? book.chapters : 0;
    }

    getChapterVerses(bookName, chapter) {
        const book = this.bookData[bookName];
        if (!book || !book.verses[chapter]) {
            return [];
        }
        
        return book.verses[chapter].map((text, index) => ({
            number: index + 1,
            text: text,
            reference: `${bookName} ${chapter}:${index + 1}`
        }));
    }

    searchBible(query, options = {}) {
        const results = [];
        const searchTerm = query.toLowerCase();
        
        // Search through all loaded books
        Object.keys(this.bookData).forEach(bookName => {
            const book = this.bookData[bookName];
            
            Object.keys(book.verses).forEach(chapter => {
                book.verses[chapter].forEach((verseText, verseIndex) => {
                    if (verseText.toLowerCase().includes(searchTerm)) {
                        results.push({
                            book: bookName,
                            chapter: parseInt(chapter),
                            verse: verseIndex + 1,
                            text: verseText,
                            reference: `${bookName} ${chapter}:${verseIndex + 1}`
                        });
                    }
                });
            });
        });

        return results;
    }

    getVerseByReference(reference) {
        // Parse reference like "John 3:16"
        const parts = reference.match(/^(\d?\s?\w+)\s+(\d+):(\d+)$/);
        if (!parts) return null;

        const [, book, chapter, verse] = parts;
        const bookData = this.bookData[book];
        
        if (!bookData || !bookData.verses[chapter]) {
            return null;
        }

        const verseText = bookData.verses[chapter][verse - 1];
        if (!verseText) return null;

        return {
            book,
            chapter: parseInt(chapter),
            verse: parseInt(verse),
            text: verseText,
            reference
        };
    }

    getCrossReferences(reference) {
        // Sample cross-references (in real app, would be from database)
        const crossRefs = {
            'John 3:16': [
                'Romans 5:8',
                '1 John 4:9',
                'John 1:14',
                'Romans 6:23'
            ],
            'Genesis 1:1': [
                'John 1:1',
                'Hebrews 11:3',
                'Psalm 33:6'
            ]
        };

        return crossRefs[reference] || [];
    }

    getParallelPassages(reference) {
        // Sample parallel passages (in real app, would be from database)
        const parallels = {
            'Matthew 5:3': ['Luke 6:20'],
            'Matthew 6:9': ['Luke 11:2'],
            'Mark 1:9': ['Matthew 3:13', 'Luke 3:21']
        };

        return parallels[reference] || [];
    }

    highlightText(text, searchTerm) {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    formatVerseForDisplay(verse, options = {}) {
        const { showReference = true, highlightTerm = null } = options;
        
        let text = verse.text;
        if (highlightTerm) {
            text = this.highlightText(text, highlightTerm);
        }

        return {
            html: `
                <div class="verse" data-reference="${verse.reference}">
                    ${showReference ? `<span class="verse-number">${verse.verse}</span>` : ''}
                    <span class="verse-text">${text}</span>
                </div>
            `,
            reference: verse.reference,
            text: verse.text
        };
    }

    getBookInfo(bookName) {
        // Sample book information (in real app, would be from database)
        const bookInfo = {
            'Genesis': {
                testament: 'Old',
                author: 'Moses',
                theme: 'Beginnings',
                keyVerse: 'Genesis 1:1',
                summary: 'The book of beginnings - creation, fall, flood, and the patriarchs.'
            },
            'John': {
                testament: 'New',
                author: 'John the Apostle',
                theme: 'Jesus as the Son of God',
                keyVerse: 'John 20:31',
                summary: 'Written to prove that Jesus is the Christ, the Son of God.'
            }
        };

        return bookInfo[bookName] || null;
    }

    getChapterSummary(bookName, chapter) {
        // Sample chapter summaries (in real app, would be from database)
        const summaries = {
            'Genesis': {
                1: 'God creates the heavens and the earth in six days and rests on the seventh.'
            },
            'John': {
                3: 'Jesus teaches Nicodemus about being born again and speaks of God\'s love for the world.'
            }
        };

        return summaries[bookName] && summaries[bookName][chapter] || null;
    }

    exportVerses(verses, format = 'text') {
        switch (format) {
            case 'text':
                return verses.map(v => `${v.reference} ${v.text}`).join('\n\n');
            
            case 'json':
                return JSON.stringify(verses, null, 2);
            
            case 'csv':
                const headers = 'Reference,Text\n';
                const rows = verses.map(v => `"${v.reference}","${v.text}"`).join('\n');
                return headers + rows;
            
            default:
                return verses.map(v => `${v.reference} ${v.text}`).join('\n\n');
        }
    }

    compareTranslations(reference, translations = ['KJV', 'NIV']) {
        // Sample comparison (in real app, would load different translations)
        const comparisons = {
            'John 3:16': {
                'KJV': 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
                'NIV': 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.'
            }
        };

        const result = {};
        translations.forEach(translation => {
            if (comparisons[reference] && comparisons[reference][translation]) {
                result[translation] = comparisons[reference][translation];
            }
        });

        return result;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BibleManager;
} else {
    window.BibleManager = BibleManager;
}
