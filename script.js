// DOM stuff
//
const textArea = document.getElementById('textArea');
const readingWords = document.getElementById('readingWords');

// controls
const refreshBtn = document.getElementById('refreshBtn');

const playPauseBtn = document.getElementById('playPauseBtn');

const nextBtn = document.getElementById('nextBtn');
const nextParagraphBtn = document.getElementById('nextParagraphBtn');

const prevBtn = document.getElementById('prevBtn');
const prevParagraphBtn = document.getElementById('prevParagraphBtn');

//const speedSlider = document.getElementById('speedSlider');
document.addEventListener('DOMContentLoaded', init);

function init() {
    setupEventListeners();
}

function setupEventListeners() {
    textArea.addEventListener('input', handleTextChange);
    refreshBtn.addEventListener('click', handleTextChange);

    // word iteration controls
    playPauseBtn.addEventListener('click', togglePlayPause);

    prevBtn.addEventListener('click', prevWord);
    nextBtn.addEventListener('click', nextWord);

    prevParagraphBtn.addEventListener('click', prevParagraph);
    nextParagraphBtn.addEventListener('click', nextParagraph);
}

// actual variables
// words[paragraph][word]
let words = [[]];
let paragraphIndex = 0;
let wordIndex = 0;

function handleTextChange(){
    const text = textArea.value.trim();

    const paragraphs = text.split(/\n+/);

    words = paragraphs.map(p => p
      .trim()
      .split(/\s+/)          // split words
      .filter(Boolean)
    );

    paragraphIndex = 0;
    wordIndex = 0;

    updateReadingWord();
}

function updateReadingWord() {
    readingWords.textContent = words[paragraphIndex]?.[wordIndex] ?? '';
}


// Word iteration
function togglePlayPause(){

}

function nextWord() {
    if (wordIndex < words[paragraphIndex].length - 1) {
        wordIndex++;
    } else if (paragraphIndex < words.length - 1) {
        paragraphIndex++;
        wordIndex = 0;
    }

    updateReadingWord();
}

function prevWord() {
    if (wordIndex > 0) {
        wordIndex--;
    } else if (paragraphIndex > 0) {
        paragraphIndex--;
        wordIndex = words[paragraphIndex].length - 1;
    }

    updateReadingWord();
}

function nextParagraph() {
    console.log(wordIndex);
    if (paragraphIndex < words.length - 1) {
        paragraphIndex++;
        wordIndex = 0;
    } else {
        wordIndex = words[paragraphIndex].length - 1;
    }
    console.log(wordIndex);
    updateReadingWord();
}

function prevParagraph() {
    if (wordIndex > 0) {
        wordIndex = 0;
    } else if (paragraphIndex > 0) {
        paragraphIndex--;
        wordIndex = 0;
    }
    updateReadingWord();
}