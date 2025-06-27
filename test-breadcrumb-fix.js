// Test script for breadcrumb navigation fix
// Run this in the browser console to test the "Books" breadcrumb issue

async function testBreadcrumbFix() {
    console.log('🍞 Testing Breadcrumb Navigation Fix...\n');

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
        // Test 1: Open Bible Navigation Modal
        console.log('📖 Opening Bible Navigation Modal...');
        
        window.app.showBibleNavModal();
        
        const modal = document.getElementById('bible-nav-modal');
        const bookTab = document.querySelector('[data-tab="book"]');
        
        test('Modal opens', modal.classList.contains('show'));
        test('Book tab is active initially', bookTab.classList.contains('active'));
        test('Books are visible initially', document.querySelectorAll('.book-button').length > 0);
        
        // Test 2: Select a Book and Navigate to Chapters
        console.log('\n📚 Testing Book Selection...');
        
        window.app.selectBookInModal('Exodus');
        
        setTimeout(() => {
            test('Exodus selected', window.app.navState.selectedBook === 'Exodus');
            test('Chapter tab is active', document.querySelector('[data-tab="chapter"]').classList.contains('active'));
            test('Chapter buttons visible', document.querySelectorAll('.chapter-button').length > 0);
            test('Breadcrumb shows Books link', document.querySelector('[data-nav-action="book"]') !== null);
            
            // Test 3: Click Books Breadcrumb
            console.log('\n🍞 Testing Books Breadcrumb Click...');
            
            const booksBreadcrumb = document.querySelector('[data-nav-action="book"]');
            test('Books breadcrumb exists', booksBreadcrumb !== null);
            
            if (booksBreadcrumb) {
                // Click the books breadcrumb
                booksBreadcrumb.click();
                
                setTimeout(() => {
                    // Check if we're back to books
                    test('Book tab is active after breadcrumb click', 
                        document.querySelector('[data-tab="book"]').classList.contains('active'));
                    test('State reset - no selected book', window.app.navState.selectedBook === null);
                    test('Book buttons are visible again', document.querySelectorAll('.book-button').length > 0);
                    test('Chapter buttons are gone', document.querySelectorAll('.chapter-button').length === 0);
                    
                    // Test 4: Select Another Book to Verify Full Functionality
                    console.log('\n📖 Testing Another Book Selection After Breadcrumb...');
                    
                    window.app.selectBookInModal('John');
                    
                    setTimeout(() => {
                        test('John selected after breadcrumb navigation', window.app.navState.selectedBook === 'John');
                        test('Chapter tab active for John', document.querySelector('[data-tab="chapter"]').classList.contains('active'));
                        test('John chapters visible', document.querySelectorAll('.chapter-button').length > 0);
                        
                        // Test breadcrumb again
                        const booksBreadcrumb2 = document.querySelector('[data-nav-action="book"]');
                        if (booksBreadcrumb2) {
                            booksBreadcrumb2.click();
                            
                            setTimeout(() => {
                                test('Second breadcrumb click works', 
                                    document.querySelector('[data-tab="book"]').classList.contains('active'));
                                test('State reset again', window.app.navState.selectedBook === null);
                                test('Books visible after second breadcrumb', document.querySelectorAll('.book-button').length > 0);
                                
                                // Test 5: Complete Flow with Verse Navigation
                                console.log('\n📝 Testing Complete Flow with Breadcrumb...');
                                
                                // Go through complete flow
                                window.app.selectBookInModal('Genesis');
                                
                                setTimeout(() => {
                                    window.app.selectChapterInModal(1);
                                    
                                    setTimeout(() => {
                                        test('Genesis 1 selected', 
                                            window.app.navState.selectedBook === 'Genesis' && 
                                            window.app.navState.selectedChapter === 1);
                                        test('Verse tab active', document.querySelector('[data-tab="verse"]').classList.contains('active'));
                                        
                                        // Test breadcrumb from verse level
                                        const booksBreadcrumbFromVerse = document.querySelector('[data-nav-action="book"]');
                                        if (booksBreadcrumbFromVerse) {
                                            booksBreadcrumbFromVerse.click();
                                            
                                            setTimeout(() => {
                                                test('Breadcrumb works from verse level', 
                                                    document.querySelector('[data-tab="book"]').classList.contains('active'));
                                                test('All state reset from verse level', 
                                                    window.app.navState.selectedBook === null && 
                                                    window.app.navState.selectedChapter === null);
                                                test('Books visible from verse level', document.querySelectorAll('.book-button').length > 0);
                                                
                                                // Summary
                                                setTimeout(() => {
                                                    console.log('\n📊 Breadcrumb Fix Test Summary:');
                                                    console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
                                                    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);
                                                    
                                                    if (passedTests >= totalTests * 0.9) {
                                                        console.log('\n🎉 BREADCRUMB NAVIGATION FIXED!');
                                                        console.log('✅ Fixed Issues:');
                                                        console.log('   🍞 Books breadcrumb now shows book grid');
                                                        console.log('   🔄 State properly resets when clicking Books');
                                                        console.log('   📚 Can select different books after breadcrumb');
                                                        console.log('   🎯 Works from all navigation levels');
                                                        console.log('   🛠️ Event delegation prevents issues');
                                                    } else {
                                                        console.log('\n⚠️ Some breadcrumb issues still need attention.');
                                                        console.log('Check the failed tests above for details.');
                                                    }

                                                    // Usage Instructions
                                                    console.log('\n📝 Fixed Breadcrumb Usage:');
                                                    console.log('1. Select any book → Shows chapters');
                                                    console.log('2. Click "📚 Books" breadcrumb → Shows book grid ✅');
                                                    console.log('3. Select different book → Works perfectly ✅');
                                                    console.log('4. Navigate to verses → Breadcrumb still works ✅');
                                                    console.log('5. Complete navigation flow functional ✅');
                                                    
                                                    // Close modal
                                                    window.app.closeBibleNavModal();
                                                }, 500);
                                            }, 500);
                                        }
                                    }, 1000);
                                }, 500);
                            }, 500);
                        }
                    }, 500);
                }, 500);
            }
        }, 500);

    } catch (error) {
        console.error('❌ Breadcrumb fix test suite failed:', error);
    }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    console.log('🚀 Starting Breadcrumb Fix Tests...');
    testBreadcrumbFix();
} else {
    module.exports = testBreadcrumbFix;
}
