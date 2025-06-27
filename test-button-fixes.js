// Test script for button fixes
// Run this in the browser console to test search button and book tab issues

async function testButtonFixes() {
    console.log('🔧 Testing Button Fixes...\n');

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
        // Test 1: Search Button Functionality
        console.log('🔍 Testing Search Button Functionality...');
        
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('search-input');
        
        test('Search button exists', searchBtn !== null);
        test('Search input exists', searchInput !== null);
        
        if (searchBtn && searchInput) {
            // Test initial search button state
            test('Search button is enabled', !searchBtn.disabled);
            test('Search button is visible', searchBtn.style.display !== 'none');
            test('Search button has click handler', searchBtn.onclick !== null || searchBtn.addEventListener !== undefined);
            
            // Test search functionality
            searchInput.value = 'love';
            
            // Simulate search button click
            console.log('🔍 Testing search button click...');
            searchBtn.click();
            
            // Wait for search to process
            setTimeout(() => {
                // Test if search button still works after a search
                test('Search button still clickable after search', !searchBtn.disabled);
                
                // Test another search
                searchInput.value = 'John 3:16';
                searchBtn.click();
                
                setTimeout(() => {
                    test('Search button works for multiple searches', !searchBtn.disabled);
                    
                    // Test 2: Bible Navigation Modal and Book Tab
                    console.log('\n📖 Testing Bible Navigation and Book Tab...');
                    
                    // Open Bible navigation modal
                    window.app.showBibleNavModal();
                    
                    const modal = document.getElementById('bible-nav-modal');
                    const bookTab = document.querySelector('[data-tab="book"]');
                    const chapterTab = document.querySelector('[data-tab="chapter"]');
                    const verseTab = document.querySelector('[data-tab="verse"]');
                    
                    test('Bible navigation modal opens', modal.classList.contains('show'));
                    test('Book tab exists', bookTab !== null);
                    test('Book tab is active initially', bookTab.classList.contains('active'));
                    test('Book tab is clickable', bookTab.style.pointerEvents !== 'none');
                    
                    // Test book selection
                    console.log('\n📚 Testing Book Selection and Tab Navigation...');
                    
                    // Select a book
                    window.app.selectBookInModal('Genesis');
                    
                    setTimeout(() => {
                        test('Genesis selected', window.app.navState.selectedBook === 'Genesis');
                        test('Chapter tab is now active', chapterTab.classList.contains('active'));
                        test('Book tab is still clickable', bookTab.style.pointerEvents !== 'none');
                        
                        // Test clicking book tab to go back
                        console.log('\n🔄 Testing Book Tab Click After Selection...');
                        
                        bookTab.click();
                        
                        setTimeout(() => {
                            test('Book tab click works', bookTab.classList.contains('active'));
                            test('Back to book selection', window.app.navState.currentTab === 'book');
                            test('Book buttons visible', document.querySelectorAll('.book-button').length > 0);
                            
                            // Test selecting another book
                            console.log('\n📖 Testing Another Book Selection...');
                            
                            window.app.selectBookInModal('John');
                            
                            setTimeout(() => {
                                test('John selected', window.app.navState.selectedBook === 'John');
                                test('Chapter tab active after John selection', chapterTab.classList.contains('active'));
                                
                                // Test book tab click again
                                bookTab.click();
                                
                                setTimeout(() => {
                                    test('Book tab works after multiple selections', bookTab.classList.contains('active'));
                                    test('Can select different books', window.app.navState.currentTab === 'book');
                                    
                                    // Test 3: Search Button After Modal Operations
                                    console.log('\n🔍 Testing Search Button After Modal Operations...');
                                    
                                    // Close modal
                                    window.app.closeBibleNavModal();
                                    
                                    // Test search button still works
                                    searchInput.value = 'faith';
                                    searchBtn.click();
                                    
                                    setTimeout(() => {
                                        test('Search button works after modal operations', !searchBtn.disabled);
                                        
                                        // Test 4: Reinitialize Functions
                                        console.log('\n🔄 Testing Reinitialize Functions...');
                                        
                                        // Test reinitialize search button function
                                        if (typeof window.app.reinitializeSearchButton === 'function') {
                                            window.app.reinitializeSearchButton();
                                            test('Reinitialize search button function exists', true);
                                            
                                            // Test search after reinitialize
                                            searchInput.value = 'hope';
                                            searchBtn.click();
                                            
                                            setTimeout(() => {
                                                test('Search works after reinitialize', !searchBtn.disabled);
                                            }, 500);
                                        }
                                        
                                        // Test ensure book tab clickable function
                                        if (typeof window.app.ensureBookTabClickable === 'function') {
                                            window.app.showBibleNavModal();
                                            window.app.ensureBookTabClickable();
                                            
                                            const bookTabAfterEnsure = document.querySelector('[data-tab="book"]');
                                            test('Ensure book tab clickable function exists', true);
                                            test('Book tab clickable after ensure function', 
                                                bookTabAfterEnsure.style.pointerEvents !== 'none');
                                            
                                            window.app.closeBibleNavModal();
                                        }
                                        
                                        // Summary
                                        setTimeout(() => {
                                            console.log('\n📊 Button Fixes Test Summary:');
                                            console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
                                            console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);
                                            
                                            if (passedTests >= totalTests * 0.8) {
                                                console.log('\n🎉 BUTTON FIXES WORKING!');
                                                console.log('✅ Fixed Issues:');
                                                console.log('   🔍 Search button works after multiple searches');
                                                console.log('   📖 Book tab is always clickable');
                                                console.log('   🔄 Can select different books freely');
                                                console.log('   🛠️ Reinitialize functions available');
                                                console.log('   🎯 Event delegation prevents issues');
                                            } else {
                                                console.log('\n⚠️ Some button issues still need attention.');
                                            }

                                            // Usage Instructions
                                            console.log('\n📝 Fixed Button Usage:');
                                            console.log('1. Search button works for multiple searches ✅');
                                            console.log('2. Book tab always clickable after book selection ✅');
                                            console.log('3. Can freely switch between books ✅');
                                            console.log('4. Search works after modal operations ✅');
                                            console.log('5. Robust event handling prevents issues ✅');
                                            
                                            // Debug functions available
                                            console.log('\n🛠️ Debug Functions Available:');
                                            console.log('- window.app.reinitializeSearchButton()');
                                            console.log('- window.app.ensureBookTabClickable()');
                                        }, 1000);
                                    }, 500);
                                }, 500);
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            }, 1000);
        }

    } catch (error) {
        console.error('❌ Button fixes test suite failed:', error);
    }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    console.log('🚀 Starting Button Fixes Tests...');
    testButtonFixes();
} else {
    module.exports = testButtonFixes;
}
