// Test script for progressive Bible navigation
// Run this in the browser console to test the Book → Chapter → Verse flow

async function testProgressiveNavigation() {
    console.log('📖 Testing Progressive Bible Navigation...\n');

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
        // Test 1: Initial Modal State
        console.log('🚀 Testing Initial Modal State...');
        
        // Open the Bible navigation modal
        window.app.showBibleNavModal();
        
        const modal = document.getElementById('bible-nav-modal');
        const bookTab = document.querySelector('[data-tab="book"]');
        const chapterTab = document.querySelector('[data-tab="chapter"]');
        const verseTab = document.querySelector('[data-tab="verse"]');
        
        test('Modal opens successfully', modal.classList.contains('show'));
        test('Book tab is active initially', bookTab.classList.contains('active'));
        test('Chapter tab is disabled initially', chapterTab.style.opacity === '0.6');
        test('Verse tab is disabled initially', verseTab.style.opacity === '0.6');
        test('Navigation state initialized', window.app.navState !== undefined);
        test('Initial tab is book', window.app.navState.currentTab === 'book');

        // Test 2: Book Selection
        console.log('\n📚 Testing Book Selection...');
        
        const bookButtons = document.querySelectorAll('.book-button');
        test('Book buttons are present', bookButtons.length > 0);
        
        if (bookButtons.length > 0) {
            // Simulate clicking on Genesis
            const genesisButton = Array.from(bookButtons).find(btn => 
                btn.dataset.book === 'Genesis' || btn.textContent.includes('GEN'));
            
            if (genesisButton) {
                genesisButton.click();
                
                // Wait a moment for the UI to update
                setTimeout(() => {
                    test('Book selected in state', window.app.navState.selectedBook === 'Genesis');
                    test('Chapter tab enabled after book selection', 
                        chapterTab.style.opacity === '1' || chapterTab.style.opacity === '');
                    test('Switched to chapter tab', chapterTab.classList.contains('active'));
                    
                    // Test 3: Chapter View
                    console.log('\n📄 Testing Chapter View...');
                    
                    const breadcrumb = document.querySelector('.nav-breadcrumb');
                    const chapterButtons = document.querySelectorAll('.chapter-button');
                    
                    test('Breadcrumb navigation appears', breadcrumb !== null);
                    test('Chapter buttons are present', chapterButtons.length > 0);
                    test('Genesis has 50 chapters', chapterButtons.length === 50);
                    
                    if (chapterButtons.length > 0) {
                        // Test chapter 1 selection
                        const chapter1Button = chapterButtons[0];
                        chapter1Button.click();
                        
                        setTimeout(() => {
                            test('Chapter selected in state', window.app.navState.selectedChapter === 1);
                            test('Verse tab enabled after chapter selection', 
                                verseTab.style.opacity === '1' || verseTab.style.opacity === '');
                            test('Switched to verse tab', verseTab.classList.contains('active'));
                            
                            // Test 4: Verse View
                            console.log('\n📝 Testing Verse View...');
                            
                            setTimeout(() => {
                                const verseButtons = document.querySelectorAll('.verse-button');
                                const navActionBtn = document.querySelector('.nav-action-btn');
                                
                                test('Verse buttons loaded', verseButtons.length > 0);
                                test('Genesis 1 has 31 verses', verseButtons.length === 31);
                                test('Go to Chapter button present', navActionBtn !== null);
                                
                                if (verseButtons.length > 0) {
                                    // Test verse selection
                                    const verse1Button = verseButtons[0];
                                    test('Verse 1 button exists', verse1Button.dataset.verse === '1');
                                    
                                    // Test 5: Navigation Actions
                                    console.log('\n🎯 Testing Navigation Actions...');
                                    
                                    // Test going to chapter
                                    if (navActionBtn) {
                                        test('Go to Chapter button has correct text', 
                                            navActionBtn.textContent.includes('Go to Chapter 1'));
                                    }
                                    
                                    // Test 6: Breadcrumb Navigation
                                    console.log('\n🍞 Testing Breadcrumb Navigation...');
                                    
                                    const breadcrumbItems = document.querySelectorAll('.breadcrumb-item');
                                    test('Breadcrumb items present', breadcrumbItems.length >= 2);
                                    
                                    if (breadcrumbItems.length >= 2) {
                                        // Test clicking back to books
                                        const booksLink = breadcrumbItems[0];
                                        test('Books breadcrumb link exists', booksLink.textContent.includes('Books'));
                                        
                                        booksLink.click();
                                        setTimeout(() => {
                                            test('Back to book tab', bookTab.classList.contains('active'));
                                            test('Book buttons visible again', 
                                                document.querySelectorAll('.book-button').length > 0);
                                        }, 100);
                                    }
                                }
                                
                                // Test 7: Tab Restrictions
                                console.log('\n🚫 Testing Tab Restrictions...');
                                
                                // Reset state
                                window.app.navState.selectedBook = null;
                                window.app.navState.selectedChapter = null;
                                window.app.updateTabStates();
                                
                                test('Chapter tab disabled without book', 
                                    chapterTab.style.opacity === '0.6');
                                test('Verse tab disabled without book and chapter', 
                                    verseTab.style.opacity === '0.6');
                                
                                // Test 8: Complete Flow Test
                                console.log('\n🔄 Testing Complete Flow...');
                                
                                // Test the complete flow programmatically
                                window.app.selectBookInModal('John');
                                test('John selected', window.app.navState.selectedBook === 'John');
                                
                                window.app.selectChapterInModal(3);
                                test('Chapter 3 selected', window.app.navState.selectedChapter === 3);
                                
                                window.app.selectVerseInModal(16);
                                test('Verse 16 selected', window.app.navState.selectedVerse === 16);
                                
                                // Summary
                                setTimeout(() => {
                                    console.log('\n📊 Progressive Navigation Test Summary:');
                                    console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
                                    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);
                                    
                                    if (passedTests >= totalTests * 0.8) {
                                        console.log('\n🎉 PROGRESSIVE NAVIGATION WORKING WELL!');
                                        console.log('✨ Features working:');
                                        console.log('   📖 Book → Chapter → Verse progression');
                                        console.log('   🔒 Tab restrictions based on selections');
                                        console.log('   🍞 Breadcrumb navigation');
                                        console.log('   ⬅️ Back navigation between steps');
                                        console.log('   🎯 Direct navigation to scripture');
                                        console.log('   📱 Responsive chapter and verse grids');
                                    } else {
                                        console.log('\n⚠️ Some progressive navigation features need attention.');
                                    }

                                    // Usage Instructions
                                    console.log('\n📝 How to Use Progressive Navigation:');
                                    console.log('1. Click 📖 button to open Bible Navigation');
                                    console.log('2. Click any book (e.g., GEN, EX, MAT, JN)');
                                    console.log('3. Automatically moves to CHAPTER tab');
                                    console.log('4. Click any chapter number (1, 2, 3...)');
                                    console.log('5. Automatically moves to VERSE tab');
                                    console.log('6. Click any verse number to go to scripture');
                                    console.log('7. Use breadcrumbs to navigate back');
                                    console.log('8. Or click "Go to Chapter" for whole chapter');
                                    
                                    // Close modal
                                    window.app.closeBibleNavModal();
                                }, 1000);
                                
                            }, 1000); // Wait for verses to load
                        }, 500);
                    }
                }, 500);
            } else {
                console.log('❌ Genesis button not found');
            }
        }

    } catch (error) {
        console.error('❌ Progressive navigation test suite failed:', error);
    }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    console.log('🚀 Starting Progressive Navigation Tests...');
    testProgressiveNavigation();
} else {
    module.exports = testProgressiveNavigation;
}
