const urlParams = new URLSearchParams(window.location.search);
const listInput = document.getElementById("listInput");
const modeInput = document.getElementById("mode");
const wordStartInput = document.getElementById("wordStart");
const wordEndInput = document.getElementById("wordEnd");
const intervalInput = document.getElementById("intervalOptionsInput");
const customWordInput = document.getElementById("customWords");
const startButton = document.getElementById("startButton");
const copyButton = document.getElementById("copyLinkButton");
const listButton = document.getElementById("listButton");

function range(a, b) {
    if (a > b) [a, b] = [b, a];

    const arr = [];
    for (let i = a; i <= b; i++) {
        arr.push(i);
    }

    return arr;
}

function generateParams() {
    const isRange = intervalInput.querySelector("input[name='interval']:checked").value === "interval";

    let params = [];

    const selectedList = listInput.value;
    params.push("list=" + selectedList);

    const selectedMode = parseInt(modeInput.value);
    params.push("mode=" + selectedMode);

    let indices = [];

    if (isRange) {
        let start = parseInt(document.getElementById("wordStart").value);
        let end = parseInt(document.getElementById("wordEnd").value);

        if (isNaN(start) || start <= 0 || start > data[listInput.value].length) start = 1;
        if (isNaN(end) || end <= 0 || end > data[listInput.value].length) end = data[listInput.value].length;

        if (start != 1 || end != data[listInput.value].length) indices = range(start, end);
    } else {
        indices = Array.from(customWordInput.selectedOptions).map(x => parseInt(x.value));
    }

    if (indices.length > 0) params.push("indices=" + indices.join(","));

    return params.length > 0 ? "?" + params.join("&") : "";
}

function toggleIntervalOptions(value) {
    intervalInput.querySelectorAll("input[type='radio']").forEach(input => {
        input.checked = false;
    });

    intervalInput.querySelector("input[name='interval'][value='" + value + "']").checked = true;
}

function setupCustomIndices() {
    customWordInput.innerHTML = '';

    data[listInput.value].forEach((word, i) => {
        const option = document.createElement("option");
        option.value = i+1;
        option.innerText = i+1 + ' - ' + word.word;
        customWordInput.appendChild(option);
    });
}

function selectCustomWords(indices) {
    customWordInput.querySelectorAll("option").forEach(option => {
        option.selected = false;
    });

    indices.forEach(index => {
        const option = customWordInput.querySelector("option[value='" + index + "']");
        if (option) option.selected = true;
    });
}

function setupIntervalOptions() {
    setupCustomIndices();

    let indices = range(1, data[listInput.value].length);

    let isRange = true;
    if (urlParams.has("indices")) {
        isRange = false;
        indices = urlParams.get("indices").split(",").map(x => parseInt(x)).filter(x => (x >= 1 && x <= data[listInput.value].length)).sort((a, b) => a - b);
    }

    if (!isRange) {
        isRange = true;
        for (let i = 1; i < indices.length; i++) {
            if (indices[i] != indices[i-1]+1) {
                isRange = false;
                break;
            }
        }
    }

    wordStartInput.max = data[listInput.value].length;
    wordEndInput.max = data[listInput.value].length;
    wordEndInput.placeholder = data[listInput.value].length;
    
    if (isRange) {
        toggleIntervalOptions("interval");

        wordStartInput.value = indices[0];
        wordEndInput.value = indices[indices.length - 1];
    } else {
        toggleIntervalOptions("custom");
    }

    selectCustomWords(indices);
}

function setupListSelection() {
    const keys = Object.keys(data);

    keys.forEach(key => {
        const option = document.createElement("option");
        option.value = key;
        option.innerText = key;
        listInput.appendChild(option);
    });

    if (urlParams.has("list")) {
        listInput.value = urlParams.get("list");
    } else {
        listInput.value = keys[keys.length - 1];
    }
}

function start() {
    const params = generateParams();
    window.location.href = "test.html" + params;
}

function copyConfig() {
    const params = generateParams();
    navigator.clipboard.writeText(window.location.href.split("?")[0] + params);
    const copy = document.getElementById("copyText");
    const copied = document.getElementById("copiedText");
    copy.style.opacity = 0;
    copied.style.opacity = 1;

    setTimeout(() => {
        copy.style.opacity = 1;
        copied.style.opacity = 0;
    }, 1000);
}

function loadWordList() {
    const params = generateParams();
    window.location.href = "list.html" + params;
}

function main() {
    setupListSelection();

    setupIntervalOptions();

    if (urlParams.has("mode")) {
        modeInput.value = urlParams.get("mode");
    }

    listInput.addEventListener('change', setupIntervalOptions);

    wordStartInput.addEventListener('input', () => {
        toggleIntervalOptions("interval");
    });

    wordEndInput.addEventListener('input', () => {
        toggleIntervalOptions("interval");
    });

    wordStartInput.addEventListener('change', () => {
        selectCustomWords(range(wordStartInput.value, wordEndInput.value));
    });

    wordEndInput.addEventListener('change', () => {
        selectCustomWords(range(wordStartInput.value, wordEndInput.value));
    });

    customWordInput.addEventListener('change', () => {
        toggleIntervalOptions("custom");
    });

    startButton.addEventListener('click', start);
    copyButton.addEventListener('click', copyConfig);
    listButton.addEventListener('click', loadWordList);

    document.getElementById("copiedText").style.opacity = 0;
}

main();