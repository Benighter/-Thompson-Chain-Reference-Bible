// Test script to verify Bible API integration
// Run this in the browser console to test all functionality

async function testBibleAPIIntegration() {
    console.log('🧪 Testing Thompson Chain Reference Bible API Integration...\n');

    const baseUrl = 'http://localhost:3001/api';
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
        // Test 1: API Info
        console.log('📋 Testing API Info...');
        const apiInfo = await fetch(`${baseUrl}`).then(r => r.json());
        test('API Info endpoint', apiInfo.name === 'Thompson Chain Reference Bible API');

        // Test 2: Books endpoint
        console.log('\n📚 Testing Books endpoint...');
        const booksResponse = await fetch(`${baseUrl}/books`).then(r => r.json());
        test('Books endpoint success', booksResponse.success === true);
        test('Books data exists', Array.isArray(booksResponse.data) && booksResponse.data.length > 0);
        test('Contains Genesis', booksResponse.data.includes('Genesis'));
        test('Contains Revelation', booksResponse.data.includes('Revelation'));

        // Test 3: Translations endpoint
        console.log('\n🌐 Testing Translations endpoint...');
        const translationsResponse = await fetch(`${baseUrl}/translations`).then(r => r.json());
        test('Translations endpoint success', translationsResponse.success === true);
        test('Translations data exists', Array.isArray(translationsResponse.data) && translationsResponse.data.length > 0);

        // Test 4: Specific verse (John 3:16)
        console.log('\n📖 Testing Verse endpoint (John 3:16)...');
        const verseResponse = await fetch(`${baseUrl}/verse/John/3/16`).then(r => r.json());
        test('John 3:16 endpoint success', verseResponse.success === true);
        test('John 3:16 has text', verseResponse.data && verseResponse.data.text && verseResponse.data.text.length > 0);
        test('John 3:16 contains "God"', verseResponse.data.text.toLowerCase().includes('god'));
        test('John 3:16 contains "loved"', verseResponse.data.text.toLowerCase().includes('loved'));

        // Test 5: Chapter (John 3)
        console.log('\n📄 Testing Chapter endpoint (John 3)...');
        const chapterResponse = await fetch(`${baseUrl}/chapter/John/3`).then(r => r.json());
        test('John 3 endpoint success', chapterResponse.success === true);
        test('John 3 has verses', chapterResponse.data && Array.isArray(chapterResponse.data.verses));
        test('John 3 has multiple verses', chapterResponse.data.verses.length > 10);
        test('John 3:16 exists in chapter', chapterResponse.data.verses.some(v => v.verse === 16));

        // Test 6: Search functionality
        console.log('\n🔍 Testing Search endpoint...');
        const searchResponse = await fetch(`${baseUrl}/search?q=love&limit=5`).then(r => r.json());
        test('Search endpoint success', searchResponse.success === true);
        test('Search returns results', Array.isArray(searchResponse.data) && searchResponse.data.length > 0);
        test('Search results contain "love"', searchResponse.data.every(result => 
            result.text.toLowerCase().includes('love')));

        // Test 7: Chain references
        console.log('\n🔗 Testing Chain References...');
        const chainsResponse = await fetch(`${baseUrl}/chains`).then(r => r.json());
        test('Chains endpoint success', chainsResponse.success === true);
        test('Chains data exists', Array.isArray(chainsResponse.data) && chainsResponse.data.length > 0);

        const chainResponse = await fetch(`${baseUrl}/chains/1`).then(r => r.json());
        test('Specific chain success', chainResponse.success === true);
        test('Chain has verses', chainResponse.data && Array.isArray(chainResponse.data.verses));

        // Test 8: Different translations
        console.log('\n🔄 Testing Different Translations...');
        const kjvVerse = await fetch(`${baseUrl}/verse/John/3/16?translation=KJV`).then(r => r.json());
        const webVerse = await fetch(`${baseUrl}/verse/John/3/16?translation=WEB`).then(r => r.json());
        
        test('KJV translation works', kjvVerse.success === true);
        test('WEB translation works', webVerse.success === true);
        test('Translations differ', kjvVerse.data.text !== webVerse.data.text);

        // Test 9: Error handling
        console.log('\n⚠️ Testing Error Handling...');
        const invalidBook = await fetch(`${baseUrl}/verse/InvalidBook/1/1`).then(r => r.json());
        test('Invalid book returns error', invalidBook.success === false);

        const invalidVerse = await fetch(`${baseUrl}/verse/John/999/999`).then(r => r.json());
        test('Invalid verse returns error', invalidVerse.success === false);

        // Test 10: Frontend integration
        console.log('\n🖥️ Testing Frontend Integration...');
        test('App object exists', typeof window.app !== 'undefined');
        test('Bible books loaded', window.app && Array.isArray(window.app.bibleBooks) && window.app.bibleBooks.length > 0);

        // Summary
        console.log('\n📊 Test Summary:');
        console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
        console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);
        
        if (passedTests === totalTests) {
            console.log('\n🎉 ALL TESTS PASSED! Bible API integration is working perfectly!');
        } else {
            console.log('\n⚠️ Some tests failed. Check the API server and try again.');
        }

        // Performance test
        console.log('\n⚡ Performance Test...');
        const startTime = performance.now();
        await Promise.all([
            fetch(`${baseUrl}/verse/Genesis/1/1`),
            fetch(`${baseUrl}/verse/Psalm/23/1`),
            fetch(`${baseUrl}/verse/Matthew/5/3`),
            fetch(`${baseUrl}/search?q=faith&limit=3`)
        ]);
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        console.log(`⏱️ 4 concurrent API calls completed in ${duration}ms`);
        test('Performance acceptable', duration < 5000, `${duration}ms < 5000ms`);

    } catch (error) {
        console.error('❌ Test suite failed with error:', error);
    }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    console.log('🚀 Starting Bible API Integration Tests...');
    testBibleAPIIntegration();
} else {
    module.exports = testBibleAPIIntegration;
}
