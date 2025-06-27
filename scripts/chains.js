// Thompson Chain Reference Bible - Chain Reference System

class ChainReferenceManager {
    constructor() {
        this.chainData = {};
        this.topicalChains = {};
        this.init();
    }

    init() {
        this.loadChainData();
        this.loadTopicalChains();
    }

    loadChainData() {
        // Thompson Chain Reference data structure
        // In a real app, this would be loaded from a comprehensive database
        this.chainData = {
            // Numerical chains (Thompson's system uses numbers)
            1: {
                title: "God's Love",
                description: "The love of God demonstrated throughout Scripture",
                verses: [
                    { reference: "John 3:16", text: "For God so loved the world..." },
                    { reference: "Romans 5:8", text: "But God demonstrates his own love for us..." },
                    { reference: "1 John 4:8", text: "Whoever does not love does not know God, because God is love." },
                    { reference: "1 John 4:19", text: "We love because he first loved us." },
                    { reference: "Ephesians 2:4-5", text: "But because of his great love for us..." }
                ]
            },
            2: {
                title: "Faith",
                description: "Biblical teaching on faith and trust in God",
                verses: [
                    { reference: "Hebrews 11:1", text: "Now faith is confidence in what we hope for..." },
                    { reference: "Romans 10:17", text: "Consequently, faith comes from hearing the message..." },
                    { reference: "Ephesians 2:8", text: "For it is by grace you have been saved, through faith..." },
                    { reference: "James 2:17", text: "In the same way, faith by itself, if it is not accompanied by action, is dead." }
                ]
            },
            3: {
                title: "Prayer",
                description: "Instructions and examples of prayer in Scripture",
                verses: [
                    { reference: "Matthew 6:9", text: "This, then, is how you should pray: 'Our Father in heaven...'" },
                    { reference: "1 Thessalonians 5:17", text: "Pray continually" },
                    { reference: "Philippians 4:6", text: "Do not be anxious about anything, but in every situation..." },
                    { reference: "James 5:16", text: "The prayer of a righteous person is powerful and effective." }
                ]
            },
            4: {
                title: "Salvation",
                description: "God's plan of salvation through Jesus Christ",
                verses: [
                    { reference: "Romans 3:23", text: "For all have sinned and fall short of the glory of God" },
                    { reference: "Romans 6:23", text: "For the wages of sin is death, but the gift of God is eternal life..." },
                    { reference: "Romans 10:9", text: "If you declare with your mouth, 'Jesus is Lord,' and believe..." },
                    { reference: "Ephesians 2:8-9", text: "For it is by grace you have been saved..." }
                ]
            },
            5: {
                title: "Peace",
                description: "God's peace and peace with others",
                verses: [
                    { reference: "John 14:27", text: "Peace I leave with you; my peace I give you..." },
                    { reference: "Philippians 4:7", text: "And the peace of God, which transcends all understanding..." },
                    { reference: "Romans 5:1", text: "Therefore, since we have been justified through faith..." },
                    { reference: "Isaiah 26:3", text: "You will keep in perfect peace those whose minds are steadfast..." }
                ]
            }
        };
    }

    loadTopicalChains() {
        // Topical organization of chains
        this.topicalChains = {
            "Attributes of God": [1, 5], // God's Love, Peace
            "Christian Life": [2, 3],    // Faith, Prayer
            "Doctrine": [4],             // Salvation
            "Promises": [1, 5],          // God's Love, Peace
            "Commands": [3],             // Prayer
        };
    }

    getChain(chainId) {
        return this.chainData[chainId] || null;
    }

    getChainsByTopic(topic) {
        const chainIds = this.topicalChains[topic] || [];
        return chainIds.map(id => this.chainData[id]).filter(chain => chain);
    }

    getAllTopics() {
        return Object.keys(this.topicalChains);
    }

    getAllChains() {
        return Object.values(this.chainData);
    }

    searchChains(query) {
        const results = [];
        const searchTerm = query.toLowerCase();

        Object.values(this.chainData).forEach(chain => {
            // Search in chain title and description
            if (chain.title.toLowerCase().includes(searchTerm) ||
                chain.description.toLowerCase().includes(searchTerm)) {
                results.push({
                    type: 'chain',
                    chain: chain,
                    matchType: 'title'
                });
            }

            // Search in verses
            chain.verses.forEach(verse => {
                if (verse.text.toLowerCase().includes(searchTerm)) {
                    results.push({
                        type: 'verse',
                        chain: chain,
                        verse: verse,
                        matchType: 'verse'
                    });
                }
            });
        });

        return results;
    }

    getRelatedChains(chainId) {
        const currentChain = this.chainData[chainId];
        if (!currentChain) return [];

        const related = [];
        
        // Find chains that share verses or topics
        Object.keys(this.chainData).forEach(id => {
            if (id === chainId.toString()) return;
            
            const chain = this.chainData[id];
            const sharedVerses = this.findSharedVerses(currentChain, chain);
            
            if (sharedVerses.length > 0) {
                related.push({
                    chain: chain,
                    sharedVerses: sharedVerses,
                    id: id
                });
            }
        });

        return related;
    }

    findSharedVerses(chain1, chain2) {
        const refs1 = chain1.verses.map(v => v.reference);
        const refs2 = chain2.verses.map(v => v.reference);
        
        return refs1.filter(ref => refs2.includes(ref));
    }

    getChainPath(startChainId, endChainId) {
        // Find a path between two chains through shared verses
        // This is a simplified implementation
        const visited = new Set();
        const queue = [{ chainId: startChainId, path: [startChainId] }];

        while (queue.length > 0) {
            const { chainId, path } = queue.shift();
            
            if (chainId === endChainId) {
                return path;
            }

            if (visited.has(chainId)) continue;
            visited.add(chainId);

            const related = this.getRelatedChains(chainId);
            related.forEach(({ id }) => {
                if (!visited.has(id)) {
                    queue.push({ chainId: id, path: [...path, id] });
                }
            });
        }

        return null; // No path found
    }

    exportChain(chainId, format = 'text') {
        const chain = this.getChain(chainId);
        if (!chain) return null;

        switch (format) {
            case 'text':
                let text = `${chain.title}\n${chain.description}\n\n`;
                chain.verses.forEach((verse, index) => {
                    text += `${index + 1}. ${verse.reference}\n   ${verse.text}\n\n`;
                });
                return text;

            case 'json':
                return JSON.stringify(chain, null, 2);

            case 'html':
                let html = `<h2>${chain.title}</h2><p><em>${chain.description}</em></p><ol>`;
                chain.verses.forEach(verse => {
                    html += `<li><strong>${verse.reference}</strong><br>${verse.text}</li>`;
                });
                html += '</ol>';
                return html;

            default:
                return this.exportChain(chainId, 'text');
        }
    }

    createCustomChain(title, description, verses) {
        // Allow users to create their own chains
        const newId = Math.max(...Object.keys(this.chainData).map(Number)) + 1;
        
        this.chainData[newId] = {
            title,
            description,
            verses,
            custom: true,
            created: new Date().toISOString()
        };

        return newId;
    }

    updateChain(chainId, updates) {
        const chain = this.chainData[chainId];
        if (!chain || !chain.custom) {
            throw new Error('Cannot update built-in chains');
        }

        Object.assign(chain, updates, {
            modified: new Date().toISOString()
        });

        return chain;
    }

    deleteCustomChain(chainId) {
        const chain = this.chainData[chainId];
        if (!chain || !chain.custom) {
            throw new Error('Cannot delete built-in chains');
        }

        delete this.chainData[chainId];
        return true;
    }

    getChainStatistics() {
        const stats = {
            totalChains: Object.keys(this.chainData).length,
            customChains: 0,
            totalVerses: 0,
            topicCoverage: Object.keys(this.topicalChains).length
        };

        Object.values(this.chainData).forEach(chain => {
            if (chain.custom) stats.customChains++;
            stats.totalVerses += chain.verses.length;
        });

        return stats;
    }

    generateChainReport(chainId) {
        const chain = this.getChain(chainId);
        if (!chain) return null;

        const related = this.getRelatedChains(chainId);
        const stats = {
            verseCount: chain.verses.length,
            relatedChains: related.length,
            topics: []
        };

        // Find which topics this chain belongs to
        Object.entries(this.topicalChains).forEach(([topic, chainIds]) => {
            if (chainIds.includes(parseInt(chainId))) {
                stats.topics.push(topic);
            }
        });

        return {
            chain,
            statistics: stats,
            relatedChains: related
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChainReferenceManager;
} else {
    window.ChainReferenceManager = ChainReferenceManager;
}
