// Translation using MyMemory API and local storage
const translateButton = document.getElementById('translate-button');
const transcribedTextElement = document.getElementById('transcribed-text');
const languageSelect = document.getElementById('language-select');
const translatedTextElement = document.getElementById('translated-text');

translateButton.addEventListener('click', async () => {
    const text = transcribedTextElement.value.trim(); // Get input text
    const targetLanguage = languageSelect.value; // Get selected language

    if (!text) {
        translatedTextElement.textContent = 'Please enter some text to translate.';
        return;
    }

    // Check if the translation is already in local storage
    const cachedTranslation = localStorage.getItem(`${text}-${targetLanguage}`);
    if (cachedTranslation) {
        translatedTextElement.textContent = cachedTranslation;
        return;
    }

    try {
        // Call MyMemory API to translate the text
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.responseData && data.responseData.translatedText) {
            translatedTextElement.textContent = data.responseData.translatedText;

            // Cache the translation in local storage
            localStorage.setItem(`${text}-${targetLanguage}`, data.responseData.translatedText);
        } else {
            translatedTextElement.textContent = 'Error translating text.';
        }
    } catch (error) {
        console.error('Translation error:', error);
        translatedTextElement.textContent = 'An error occurred during translation. Check the console for details.';
    }
});