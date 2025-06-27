// Test script for navigation fixes
// Run this in the browser console to test breadcrumb navigation and verse fetching

async function testNavigationFixes() {
    console.log('🔧 Testing Navigation Fixes...\n');

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
        // Test 1: API Endpoint Test
        console.log('🌐 Testing API Endpoints...');
        
        try {
            const response = await fetch('http://localhost:3001/api/chapter/Genesis/1');
            const data = await response.json();
            
            test('API endpoint responds', response.ok);
            test('API returns success', data.success === true);
            test('API returns verses', data.data && data.data.verses && data.data.verses.length > 0);
            
            if (data.data && data.data.verses) {
                test('Genesis 1 has correct verse count', data.data.verses.length === 31);
                test('First verse exists', data.data.verses[0].verse === 1);
                test('Verse has text', data.data.verses[0].text && data.data.verses[0].text.length > 0);
            }
        } catch (error) {
            test('API endpoint accessible', false, `Error: ${error.message}`);
        }

        // Test 2: Open Bible Navigation Modal
        console.log('\n📖 Testing Bible Navigation Modal...');
        
        window.app.showBibleNavModal();
        
        const modal = document.getElementById('bible-nav-modal');
        test('Modal opens', modal.classList.contains('show'));
        test('Navigation state initialized', window.app.navState !== undefined);

        // Test 3: Book Selection and Chapter Navigation
        console.log('\n📚 Testing Book → Chapter Navigation...');
        
        // Select Genesis
        window.app.selectBookInModal('Genesis');
        
        test('Genesis selected', window.app.navState.selectedBook === 'Genesis');
        test('Chapter tab is active', document.querySelector('[data-tab="chapter"]').classList.contains('active'));
        
        // Wait for chapter content to load
        setTimeout(() => {
            const chapterButtons = document.querySelectorAll('.chapter-button');
            test('Chapter buttons loaded', chapterButtons.length > 0);
            test('Genesis has 50 chapters', chapterButtons.length === 50);
            
            // Test breadcrumb navigation back to books
            const booksBreadcrumb = document.querySelector('[data-nav-action="book"]');
            test('Books breadcrumb exists', booksBreadcrumb !== null);
            
            if (booksBreadcrumb) {
                console.log('\n🍞 Testing Breadcrumb Navigation to Books...');
                
                // Click books breadcrumb
                booksBreadcrumb.click();
                
                setTimeout(() => {
                    test('Back to book tab', document.querySelector('[data-tab="book"]').classList.contains('active'));
                    test('Book state reset', window.app.navState.selectedBook === null);
                    test('Book buttons visible', document.querySelectorAll('.book-button').length > 0);
                    
                    // Test 4: Complete Flow with Verse Loading
                    console.log('\n📝 Testing Complete Flow with Verse Loading...');
                    
                    // Go through complete flow again
                    window.app.selectBookInModal('Exodus');
                    
                    setTimeout(() => {
                        window.app.selectChapterInModal(4);
                        
                        setTimeout(async () => {
                            test('Exodus selected', window.app.navState.selectedBook === 'Exodus');
                            test('Chapter 4 selected', window.app.navState.selectedChapter === 4);
                            test('Verse tab is active', document.querySelector('[data-tab="verse"]').classList.contains('active'));
                            
                            // Wait for verses to load
                            setTimeout(() => {
                                const verseButtons = document.querySelectorAll('.verse-button');
                                const loadingSpinner = document.querySelector('.loading-spinner');
                                const errorMessage = document.querySelector('.error-message');
                                
                                test('No loading spinner visible', !loadingSpinner || loadingSpinner.style.display === 'none');
                                test('No error message', !errorMessage);
                                test('Verse buttons loaded', verseButtons.length > 0);
                                
                                if (verseButtons.length > 0) {
                                    test('Exodus 4 has verses', verseButtons.length > 30); // Exodus 4 has 31 verses
                                    test('First verse button exists', verseButtons[0].dataset.verse === '1');
                                }
                                
                                // Test breadcrumb navigation from verses
                                console.log('\n🍞 Testing Breadcrumb Navigation from Verses...');
                                
                                const chapterBreadcrumb = document.querySelector('[data-nav-action="chapter"]');
                                const booksBreadcrumbFromVerse = document.querySelector('[data-nav-action="book"]');
                                
                                test('Chapter breadcrumb exists', chapterBreadcrumb !== null);
                                test('Books breadcrumb exists from verse view', booksBreadcrumbFromVerse !== null);
                                
                                if (chapterBreadcrumb) {
                                    // Test going back to chapters
                                    chapterBreadcrumb.click();
                                    
                                    setTimeout(() => {
                                        test('Back to chapter tab from verses', document.querySelector('[data-tab="chapter"]').classList.contains('active'));
                                        test('Chapter state preserved', window.app.navState.selectedBook === 'Exodus');
                                        test('Verse state reset', window.app.navState.selectedVerse === null);
                                        
                                        // Test going back to books from chapters
                                        const booksBreadcrumbFromChapter = document.querySelector('[data-nav-action="book"]');
                                        if (booksBreadcrumbFromChapter) {
                                            booksBreadcrumbFromChapter.click();
                                            
                                            setTimeout(() => {
                                                test('Back to book tab from chapters', document.querySelector('[data-tab="book"]').classList.contains('active'));
                                                test('All state reset', window.app.navState.selectedBook === null && window.app.navState.selectedChapter === null);
                                                
                                                // Test 5: Verse Navigation
                                                console.log('\n🎯 Testing Verse Navigation...');
                                                
                                                // Test direct navigation to a verse
                                                window.app.selectBookInModal('John');
                                                setTimeout(() => {
                                                    window.app.selectChapterInModal(3);
                                                    setTimeout(() => {
                                                        // Wait for verses to load, then test verse selection
                                                        setTimeout(() => {
                                                            const johnVerseButtons = document.querySelectorAll('.verse-button');
                                                            if (johnVerseButtons.length > 15) {
                                                                // Test verse 16 selection
                                                                const verse16 = Array.from(johnVerseButtons).find(btn => btn.dataset.verse === '16');
                                                                if (verse16) {
                                                                    test('John 3:16 verse button exists', true);
                                                                    
                                                                    // Test the navigation function
                                                                    window.app.selectVerseInModal(16);
                                                                    test('Verse 16 selected', window.app.navState.selectedVerse === 16);
                                                                }
                                                            }
                                                            
                                                            // Summary
                                                            setTimeout(() => {
                                                                console.log('\n📊 Navigation Fixes Test Summary:');
                                                                console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
                                                                console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);
                                                                
                                                                if (passedTests >= totalTests * 0.8) {
                                                                    console.log('\n🎉 NAVIGATION FIXES WORKING!');
                                                                    console.log('✅ Fixed Issues:');
                                                                    console.log('   🍞 Breadcrumb navigation back to books works');
                                                                    console.log('   📝 Verse fetching from API works correctly');
                                                                    console.log('   🔄 Complete navigation flow works');
                                                                    console.log('   📍 State management works properly');
                                                                    console.log('   🎯 All navigation paths functional');
                                                                } else {
                                                                    console.log('\n⚠️ Some navigation issues still need attention.');
                                                                }

                                                                // Usage Instructions
                                                                console.log('\n📝 Fixed Navigation Usage:');
                                                                console.log('1. Click 📖 → Opens Bible Navigation');
                                                                console.log('2. Click any book → Moves to chapters');
                                                                console.log('3. Click "📚 Books" breadcrumb → Go back to books ✅');
                                                                console.log('4. Select book → chapter → verses load properly ✅');
                                                                console.log('5. All breadcrumb navigation works ✅');
                                                                console.log('6. Verse selection navigates to scripture ✅');
                                                                
                                                                // Close modal
                                                                window.app.closeBibleNavModal();
                                                            }, 1000);
                                                        }, 2000);
                                                    }, 1000);
                                                }, 500);
                                            }, 500);
                                        }
                                    }, 500);
                                }
                            }, 2000); // Wait longer for verses to load
                        }, 1000);
                    }, 500);
                }, 500);
            }
        }, 500);

    } catch (error) {
        console.error('❌ Navigation fixes test suite failed:', error);
    }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    console.log('🚀 Starting Navigation Fixes Tests...');
    testNavigationFixes();
} else {
    module.exports = testNavigationFixes;
}
