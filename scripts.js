
let currentLanguage = 'zh';
let currentFunction = 'index';
let preloadedFunction = false;


// Function to determine the current language
function getCurrentLanguage() {
    // Try to detect browser language, fallback to default if unsuccessful
    const detectedLanguage = (navigator.language || navigator.userLanguage).toLowerCase();
    return detectedLanguage.startsWith('en') ? 'en' : 'zh';
}

// Function to load content based on function name
function loadFunction(functionName, anchor) {
    currentFunction = functionName; // Update the current function
    const languageFolder = currentLanguage === 'en' ? 'en/' : 'tch/';

    fetch(`${languageFolder}${currentLanguage === 'en' ? `${functionName}_${currentLanguage}` : functionName}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error loading content: ${response.status} - ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            const contentContainer = document.getElementById('content');
            contentContainer.innerHTML = ''; // Clear previous content
            const newContent = document.createElement('div');
            newContent.innerHTML = data;
            contentContainer.appendChild(newContent);
            // Check if an anchor is provided
            if (anchor) {
                const targetAnchor = document.querySelector(`a[name="${anchor}"]`);
                if (targetAnchor) {
                    targetAnchor.scrollIntoView({ behavior: 'smooth' });
                }
            }
        })
        .catch(error => {
            console.error(error.message);
            const contentContainer = document.getElementById('content');
            contentContainer.innerHTML = '<p>404 Not Found</p>'; // Display a 404 message
        });
    updateHeaderElements();
}

// Function to dynamically generate navigation links from JSON data
function generateNavigationLinks(navDataFile) {
    fetch(navDataFile)
        .then(response => response.json())
        .then(data => {
            const navigationUl = document.getElementById('functionList');
            navigationUl.innerHTML = ''; // Clear previous navigation links
            data.forEach(entry => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#';
                a.textContent = entry.name;
                a.onclick = () => loadFunction(entry.file);
                li.appendChild(a);
                navigationUl.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading navigation data:', error));
    updateHeaderElements();
}

function toggleNavigationBar() {
    const navigation = document.getElementById('navigation');
    const screenWidth = window.innerWidth;

    if (screenWidth <= 600) {
        navigation.style.display = (navigation.style.display !== 'block') ? 'block' : 'none';
    } else {
        navigation.style.display = 'block';
    }
}
// Update the updateHeaderElements function
function updateHeaderElements() {
    const logoElement = document.getElementById('logo');
    const headerTextElement = document.getElementById('header-text');
    const languageSwitchButton = document.getElementById('languageSwitchButton');
    const languageSwitchButtonNav = document.getElementById('languageSwitchButtonNav');

    // Clear previous content
    logoElement.innerHTML = '';
    headerTextElement.innerHTML = '';

    // Set new content based on the current language
    const logoText = currentLanguage === 'en' ? 'Reasonable Spread' : 'Spread推廣';
    const headerText = currentLanguage === 'en' ? 'User Manual' : '使用手冊';
    const buttonText = currentLanguage === 'en' ? '中文' : 'English';

    const logoTextElement = document.createElement('h1');
    logoTextElement.textContent = logoText;

    const headerTextElementContent = document.createElement('h2');
    headerTextElementContent.textContent = headerText;

    logoElement.appendChild(logoTextElement);
    headerTextElement.appendChild(headerTextElementContent);
    languageSwitchButton.querySelector('h2').textContent = buttonText;
    languageSwitchButtonNav.textContent = buttonText; // Update the text for languageSwitchButtonNav
}

window.addEventListener('scroll', function() {
    const toggleButton = document.getElementById('toggleButton');
    const header = document.querySelector('header');
    const headerHeight = header.offsetHeight;

    // Calculate the position to stick the button
    const stickPosition = 20;

    // Get the current scroll position
    const scrollPosition = window.scrollY;

    // Check if the scroll position is below the header
    if (scrollPosition > headerHeight) {
        // Stick the button to the top
        toggleButton.style.top = stickPosition + 'px';
    } else {
        // Move the button below the header
        toggleButton.style.top = (headerHeight + stickPosition) + 'px';
    }
});
// Call the function to generate navigation links when the page loads
document.addEventListener('DOMContentLoaded', function () {
    const detectedLanguage = getCurrentLanguage();
    currentLanguage = detectedLanguage;
    const navDataFile = detectedLanguage === 'en' ? 'navData_en.json' : 'navData.json';
    generateNavigationLinks(navDataFile);
    if(preloadedFunction == false){
        preloadedFunction = true;
        loadFunction('userManagement'); // Preload userManagement.html
    }
    updateHeaderElements(); // Update header elements when the page loads
});
function toggleFunctionButton() {
    console.log('Toggle Function Button Clicked');
}

function switchFunction() {
    console.log('Switch Function Clicked');
}

// Call this function when switching language
function switchLanguage() {
    console.log('Switch Language Clicked');
    // Set the default language to English if needed
    const defaultLanguage = 'zh';

    // Use the default language if currentLanguage is not set or invalid
    if (!currentLanguage || (currentLanguage !== 'en' && currentLanguage !== 'zh')) {
        currentLanguage = defaultLanguage;
    }

    // Toggle the language
    currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';

    const navDataFile = currentLanguage === 'en' ? 'navData_en.json' : 'navData.json';
    generateNavigationLinks(navDataFile);

    // Reload content based on the current function name
    loadFunction(currentFunction);
    
    updateHeaderElements(); // Update header elements when switching language
}
