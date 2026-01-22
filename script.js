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
    //textArea.addEventListener('input', handleTextChange);
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
let rawText = "";

function handleTextChange(){
    rawText = textArea.innerText;

    const paragraphs = rawText.split(/\n{2,}/);

    words = paragraphs.map(p =>
        p.split(/\s+/).filter(Boolean)
    );

    paragraphIndex = 0;
    wordIndex = 0;

    updateReadingWord();
}


function updateReadingWord() {
    readingWords.textContent = words[paragraphIndex]?.[wordIndex] ?? '';

    renderText();
}

function renderText() {
    let pIndex = 0;
    let wIndex = 0;

    const html = rawText.replace(
        /(\S+)|(\n{2,})|(\s+)/g,
        (match, word, paragraphBreak, space) => {

            // Paragraph break (2+ newlines)
            if (paragraphBreak) {
                pIndex++;
                wIndex = 0;
                return paragraphBreak.replace(/\n/g, '<br>');
            }

            // Word
            if (word) {
                const isActive =
                    pIndex === paragraphIndex &&
                    wIndex === wordIndex;

                const span = `<span class="word${isActive ? ' active' : ''}">
                                ${word}
                              </span>`;
                wIndex++;
                return span;
            }

            // Spaces / single newlines
            return space.replace(/\n/g, '<br>');
        }
    );

    textArea.innerHTML = html;
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