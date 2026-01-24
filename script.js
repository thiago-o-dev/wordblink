// DOM stuff
//
const textArea = document.getElementById('textArea');
const readingWords = document.getElementById('readingWords');

// controls
const refreshBtn = document.getElementById('refreshBtn');

const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIcon = document.getElementById('playPauseIcon');

const nextBtn = document.getElementById('nextBtn');
const nextParagraphBtn = document.getElementById('nextParagraphBtn');

const prevBtn = document.getElementById('prevBtn');
const prevParagraphBtn = document.getElementById('prevParagraphBtn');

const wpmRangeSlider = document.getElementById('wpmRange');
const wpmRangeOutput = document.getElementById('wpmRangeValue');

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

    wpmRangeOutput.textContent = wpmRangeSlider.value;

    wpmRangeSlider.addEventListener('input', function() {
        wpmRangeOutput.textContent = this.value;
        maxReadingSpeedWpm = this.value
    });
}

// actual variables
// words[paragraph][word]
let words = [[]];
let paragraphIndex = 0;
let wordIndex = 0;
let rawText = "";

let isPaused = true;
let playTimer = null;

// wpm controls
let startingReadingSpeedWpm = 150;
let maxReadingSpeedWpm = 600;
let currReadingSpeedWpm = startingReadingSpeedWpm;

const rampDurationMs = 10000; 
let playStartTime = 0;

// easing curve
function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function approximateReadingSpeedWpm(progress) {
    const eased = easeInOutCubic(progress);
    return (
        startingReadingSpeedWpm +
        eased * (maxReadingSpeedWpm - startingReadingSpeedWpm)
    );
}



function handleTextChange(){
    rawText = textArea.innerText;

    const paragraphs = rawText.split(/\n{1,}/);

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
        /(\S+)|(\n)|(\s+)/g,
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
    if (isPaused) {
        startPlaying();
    } else {
        pausePlaying();
    }
}
function startPlaying() {
    if (playTimer) return;

    isPaused = false;
    setDisabled(true);
    updatePlayPauseUI();

    playStartTime = performance.now();
    scheduleNextWord();
}

function pausePlaying() {
    isPaused = true;
    setDisabled(false);
    updatePlayPauseUI();

    clearInterval(playTimer);
    playTimer = null;
}

function scheduleNextWord() {
    if (isPaused) return;

    const now = performance.now();
    const elapsed = now - playStartTime;
    const progress = Math.min(elapsed / rampDurationMs, 1);

    currReadingSpeedWpm = approximateReadingSpeedWpm(progress);

    let delayMs = 60000 / currReadingSpeedWpm;

    // punctuation pause
    const word = words[paragraphIndex]?.[wordIndex] ?? "";

    if (/[.!?]$/.test(word)) {
        delayMs *= 1.6;
    }
    else if (/[,;:]$/.test(word)) {
        delayMs *= 1.25;
    }

    playTimer = setTimeout(() => {
        if (!nextWord()) {
            pausePlaying();
            return;
        }
        scheduleNextWord();
    }, delayMs);
}

function nextWord() {
    let changed = false;

    if (wordIndex < words[paragraphIndex].length - 1) {
        wordIndex++;
        changed = true;
    } else if (paragraphIndex < words.length - 1) {
        paragraphIndex++;
        wordIndex = 0;
        changed = true;
    }

    updateReadingWord();
    return changed;
}

function prevWord() {
    if (!isPaused) pausePlaying();

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

// UI

function updatePlayPauseUI() {
    if (isPaused) {
        playPauseIcon.classList.remove("fa-pause");
        playPauseIcon.classList.add("fa-play");
        playPauseBtn.title = "Play";
    } else {
        playPauseIcon.classList.remove("fa-play");
        playPauseIcon.classList.add("fa-pause");
        playPauseBtn.title = "Pause";
    }
}

function setDisabled(isDisabled) {
    textArea.contentEditable = !isDisabled;
    textArea.classList.toggle("disabled-div", isDisabled);
}