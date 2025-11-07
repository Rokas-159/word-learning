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

let shuffedWords = [];

let currentWordIndex = -1;

let state = 1;

let mode = 2;

let failed = [];

let list = '';

function reset() {
    currentWordIndex = -1;
    state = 1;

    failed = [];

    checkAnswer(new Event('init'));
}

function checkAnswer(e) {
    e.preventDefault();
    if (state === -1) return;
    if (state === 0) {
        state = 1;
        document.getElementById('button').innerText = 'Next';
        const userAnswer = document.getElementById('wordInput').value.trim().toLowerCase();
        const correctAnswer = data[list][shuffedWords[currentWordIndex]-1].word.toLowerCase();

        if (userAnswer === correctAnswer) {
            document.getElementById('result').innerHTML = '<span style="color: #17A589;">Correct!</span>';
        } else {
            const partiallyOk = (userAnswer === correctAnswer.split('(')[0].trim());
            document.getElementById('result').innerHTML = `<span style="color: ${partiallyOk ? '#17A589' : 'white'};">The correct word is: ` + data[list][shuffedWords[currentWordIndex]-1].word + '</span>';
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
            let def = data[list][shuffedWords[currentWordIndex]-1].definition;
            if (mode == 1) {
                def = data[list][shuffedWords[currentWordIndex]-1].example;
            }
            if (mode == 2) {
                def = def + ' e.g. - ' + data[list][shuffedWords[currentWordIndex]-1].example;
            }
            document.getElementById('output').innerText = def;
            document.getElementById('wordInput').value = '';

            console.log(data[list][shuffedWords[currentWordIndex]-1].word);
            
            state = 0;
        } else {
            document.getElementById('output').innerHTML = `<span style="color: #17A589;">Quiz completed!</span> <a href="${window.location.href.split('?')[0]}?mode=${mode}&list=${list}">Restart with all words</a>.${urlParams.has('indices') ? ` <a href="${window.location.href}">Restart with the same subset</a>.`: ''}${failed.length > 0 ? ` <a href="${window.location.href.split('?')[0]}?indices=${failed.join(',')}&mode=${mode}&list=${list}">Restart with failed words only</a>.` : ''}`;
        }
    }
}

function setupMainMenuLink() {
    const mainMenuButton = document.getElementById("menuButton");
    mainMenuButton.href = "index.html" + window.location.search;
}

function main() {
    setupMainMenuLink();

    if (!urlParams.has("list")) {
        state = -1;
        document.getElementById("output").innerText = "No word list selected. Please go back to the menu and select one.";
        return;
    }

    list = urlParams.get("list");

    if (!data.hasOwnProperty(list)) {
        state = -1;
        document.getElementById("output").innerText = "Invalid word list selected. Please go back to the menu and select a valid one.";
        return;
    }

    shuffedWords = shuffledRange(1, data[list].length);

    if (urlParams.has("indices")) {
        shuffedWords = shuffle(urlParams.get("indices").split(","));
    }

    if (urlParams.has("mode")) {
        mode = urlParams.get("mode");
    }

    reset();
}

main();