function shuffle(arr) {
    // Fisher–Yates algorithm
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

function range(a, b) {
    if (a > b) [a, b] = [b, a];

    const arr = [];
    for (let i = a; i <= b; i++) {
        arr.push(i);
    }

    return arr;
}

function shuffledRange(a, b) {
    return shuffle(range(a,b));
}
const urlParams = new URLSearchParams(window.location.search);

let shuffedWords = shuffledRange(0, words.length-1);

let currentWordIndex = -1;

let state = 1;

let mode = 2;

let failed = [];
/*
function updateInterval() {
    let start = parseInt(document.getElementById('wordStart').value);
    let end = parseInt(document.getElementById('wordEnd').value);

    if (isNaN(start) || start <= 0 || start > words.length) start = 1;
    if (isNaN(end) || end <= 0 || end > words.length) end = 231;

    shuffedWords = shuffledRange(start-1, end-1);

    reset();
}

document.getElementById('wordStart').addEventListener('input', updateInterval);
document.getElementById('wordEnd').addEventListener('input', updateInterval);

*/

/*
console.log(words);
*/
/*
words.forEach(w => {
    console.log(w.word);
});
*/
function customRange(e) {
    e.preventDefault();

    let start = parseInt(document.getElementById('wordStart').value);
    let end = parseInt(document.getElementById('wordEnd').value);

    const mode = document.getElementById('mode').value;

    if (isNaN(start) || start <= 0 || start > words.length) start = 1;
    if (isNaN(end) || end <= 0 || end > words.length) end = 231;

    window.open(window.location.href.split('?')[0] + '?' + ((end != 231 || start != 1) ? 'indices=' + range(start-1, end-1).join(',') : '') + '&mode=' + mode, '_blank');
}

function reset() {
    currentWordIndex = -1;
    state = 1;

    failed = [];

    checkAnswer(new Event('init'));
}

function checkAnswer(e) {
    e.preventDefault();
    if (state === 0) {
        state = 1;
        document.getElementById('button').innerText = 'Next';
        const userAnswer = document.getElementById('wordInput').value.trim().toLowerCase();
        const correctAnswer = words[shuffedWords[currentWordIndex]].word.toLowerCase();

        if (userAnswer === correctAnswer) {
            document.getElementById('result').innerHTML = '<span style="color: #17A589;">Correct!</span>';
        } else {
            const partiallyOk = (userAnswer === correctAnswer.split('(')[0].trim());
            document.getElementById('result').innerHTML = `<span style="color: ${partiallyOk ? '#17A589' : 'white'};">The correct word is: ` + words[shuffedWords[currentWordIndex]].word + '</span>';
            if (!partiallyOk) {
                failed.push(shuffedWords[currentWordIndex]);
                console.log("Failed words:", failed.join(','));
            }
        }
    } else {
        document.getElementById('button').innerText = 'Check';
        document.getElementById('result').innerText = '';
        
        currentWordIndex++;
        if (currentWordIndex < shuffedWords.length) {
            let def = words[shuffedWords[currentWordIndex]].definition;
            if (mode == 0) {
                def = def.split('e.g. - ')[0];
            }
            if (mode == 1) {
                def = def.split('e.g. - ')[1];
            }
            document.getElementById('output').innerText = def;
            document.getElementById('wordInput').value = '';

            console.log(words[shuffedWords[currentWordIndex]].word);
            
            state = 0;
        } else {
            document.getElementById('output').innerHTML = `<span style="color: #17A589;">Quiz completed!</span> <a href="${window.location.href.split('?')[0]}?mode=${mode}">Restart with all words</a>.${urlParams.has('indices') ? ` <a href="${window.location.href}">Restart with the same subset</a>.`: ''}${failed.length > 0 ? ` <a href="${window.location.href.split('?')[0]}?indices=${failed.join(',')}&mode=${mode}">Restart with failed words only</a>.` : ''}`;
        }
    }
}

if (urlParams.has('indices')) {
    shuffedWords = shuffle(urlParams.get('indices').split(','));
}

if (urlParams.has('mode')) {
    mode = urlParams.get('mode');
    document.getElementById('mode').value = mode;
}

reset();