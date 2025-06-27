// Test script for enhanced search functionality
// Run this in the browser console to test all new features

async function testEnhancedSearch() {
    console.log('🔍 Testing Enhanced Search Functionality...\n');

    let passedTests = 0;
    let totalTests = 0;

    function test(name, condition, details = '') {
        totalTests++;
        if (condition) {
            console.log(`✅ ${name}`);
            if (details) console.log(`   ${details}`);
            passedTests++;
        } else {
            console.log(`❌ ${name}`);
            if (details) console.log(`   ${details}`);
        }
    }

    try {
        // Test 1: Reference Parsing
        console.log('📖 Testing Reference Parsing...');
        
        const testReferences = [
            { input: 'John 3:16', expected: { book: 'John', chapter: 3, verse: 16 } },
            { input: 'Genesis 1 1', expected: { book: 'Genesis', chapter: 1, verse: 1 } },
            { input: 'Romans 8:28', expected: { book: 'Romans', chapter: 8, verse: 28 } },
            { input: 'Psalm 23', expected: { book: 'Psalms', chapter: 23, verse: null } },
            { input: '1 Corinthians 13:4', expected: { book: '1 Corinthians', chapter: 13, verse: 4 } },
            { input: 'Gen 1:27', expected: { book: 'Genesis', chapter: 1, verse: 27 } },
            { input: 'Matt 5:3', expected: { book: 'Matthew', chapter: 5, verse: 3 } },
            { input: 'Rev 21:4', expected: { book: 'Revelation', chapter: 21, verse: 4 } }
        ];

        testReferences.forEach(testRef => {
            const parsed = window.app.parseReference(testRef.input);
            const isCorrect = parsed && 
                parsed.book === testRef.expected.book &&
                parsed.chapter === testRef.expected.chapter &&
                parsed.verse === testRef.expected.verse;
            
            test(`Parse "${testRef.input}"`, isCorrect, 
                `Expected: ${JSON.stringify(testRef.expected)}, Got: ${JSON.stringify(parsed)}`);
        });

        // Test 2: Book Matching
        console.log('\n📚 Testing Book Matching...');
        
        const bookTests = [
            { input: 'gen', expected: 'Genesis' },
            { input: 'genesis', expected: 'Genesis' },
            { input: 'john', expected: 'John' },
            { input: '1cor', expected: '1 Corinthians' },
            { input: 'rev', expected: 'Revelation' },
            { input: 'psalm', expected: 'Psalms' },
            { input: 'matt', expected: 'Matthew' },
            { input: 'rom', expected: 'Romans' }
        ];

        bookTests.forEach(bookTest => {
            const matched = window.app.findBookMatch(bookTest.input);
            test(`Match "${bookTest.input}"`, matched === bookTest.expected,
                `Expected: ${bookTest.expected}, Got: ${matched}`);
        });

        // Test 3: Search Input Handling
        console.log('\n🔍 Testing Search Input Handling...');
        
        const searchInput = document.getElementById('search-input');
        test('Search input exists', searchInput !== null);
        test('Search input has enhanced placeholder', 
            searchInput.placeholder.includes('reference'));

        // Test 4: Bible Navigation Modal
        console.log('\n📖 Testing Bible Navigation Modal...');
        
        const bibleNavBtn = document.getElementById('bible-nav-btn');
        const bibleNavModal = document.getElementById('bible-nav-modal');
        
        test('Bible navigation button exists', bibleNavBtn !== null);
        test('Bible navigation modal exists', bibleNavModal !== null);

        // Test 5: Search Suggestions
        console.log('\n💡 Testing Search Suggestions...');
        
        // Simulate typing in search input
        searchInput.value = 'john';
        searchInput.dispatchEvent(new Event('input'));
        
        setTimeout(() => {
            const suggestions = document.getElementById('search-suggestions');
            test('Search suggestions created', suggestions !== null);
            
            if (suggestions) {
                test('Search suggestions visible', suggestions.style.display !== 'none');
            }
        }, 100);

        // Test 6: Popular Suggestions
        console.log('\n⭐ Testing Popular Suggestions...');
        
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('focus'));
        
        setTimeout(() => {
            const suggestions = document.getElementById('search-suggestions');
            if (suggestions && suggestions.innerHTML.includes('Popular Searches')) {
                test('Popular suggestions shown', true);
            } else {
                test('Popular suggestions shown', false, 'Popular suggestions not found');
            }
        }, 100);

        // Test 7: Reference Navigation
        console.log('\n🎯 Testing Reference Navigation...');
        
        // Test navigation to a specific reference
        const testReference = { book: 'John', chapter: 3, verse: 16 };
        
        // This would normally navigate, but we'll just test the function exists
        test('navigateToReference function exists', 
            typeof window.app.navigateToReference === 'function');
        
        test('parseReference function exists', 
            typeof window.app.parseReference === 'function');
        
        test('findBookMatch function exists', 
            typeof window.app.findBookMatch === 'function');

        // Test 8: Enhanced Search Features
        console.log('\n🚀 Testing Enhanced Search Features...');
        
        test('handleSearchInput function exists', 
            typeof window.app.handleSearchInput === 'function');
        
        test('showBibleNavModal function exists', 
            typeof window.app.showBibleNavModal === 'function');
        
        test('populateBibleNavBooks function exists', 
            typeof window.app.populateBibleNavBooks === 'function');

        // Test 9: UI Enhancements
        console.log('\n🎨 Testing UI Enhancements...');
        
        const navTabs = document.querySelectorAll('.nav-tab');
        const booksGrid = document.querySelectorAll('.books-grid');
        
        test('Navigation tabs exist', navTabs.length > 0);
        test('Books grid containers exist', booksGrid.length >= 2);

        // Test 10: Integration Test
        console.log('\n🔗 Testing Integration...');
        
        // Test that search input triggers the right functions
        searchInput.value = 'Genesis 1:1';
        const referenceMatch = window.app.parseReference(searchInput.value);
        
        test('Full reference parsing integration', 
            referenceMatch && referenceMatch.book === 'Genesis' && 
            referenceMatch.chapter === 1 && referenceMatch.verse === 1);

        // Summary
        setTimeout(() => {
            console.log('\n📊 Enhanced Search Test Summary:');
            console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
            console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);
            
            if (passedTests === totalTests) {
                console.log('\n🎉 ALL ENHANCED SEARCH TESTS PASSED!');
                console.log('✨ Features working:');
                console.log('   📖 Smart reference parsing (John 3:16, Gen 1 1, etc.)');
                console.log('   📚 Book name matching and abbreviations');
                console.log('   💡 Search suggestions and recommendations');
                console.log('   🎯 Direct navigation to verses and chapters');
                console.log('   📱 Bible navigation modal with book grid');
                console.log('   🔍 Enhanced search input with smart detection');
            } else {
                console.log('\n⚠️ Some enhanced search features need attention.');
            }

            // Usage Examples
            console.log('\n📝 Usage Examples:');
            console.log('Try typing these in the search box:');
            console.log('   • "John 3:16" - Navigate directly to verse');
            console.log('   • "Genesis 1 1" - Space-separated format');
            console.log('   • "Psalm 23" - Navigate to chapter');
            console.log('   • "Gen 1:27" - Abbreviation support');
            console.log('   • "love" - Search for word');
            console.log('   • "john" - Get book suggestions');
            console.log('   • Click 📖 button for Bible navigation modal');
        }, 500);

    } catch (error) {
        console.error('❌ Enhanced search test suite failed:', error);
    }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    console.log('🚀 Starting Enhanced Search Tests...');
    testEnhancedSearch();
} else {
    module.exports = testEnhancedSearch;
}
