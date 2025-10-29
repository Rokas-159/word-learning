const urlParams = new URLSearchParams(window.location.search);
const listInput = document.getElementById("listInput");
const modeInput = document.getElementById("mode");
const wordStartInput = document.getElementById("wordStart");
const wordEndInput = document.getElementById("wordEnd");
const intervalInput = document.getElementById("intervalOptionsInput");
const customWordInput = document.getElementById("customWords");
const startButton = document.getElementById("startButton");

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

        if (isNaN(start) || start <= 0 || start > words.length) start = 1;
        if (isNaN(end) || end <= 0 || end > words.length) end = words.length;

        if (start != 1 || end != words.length) indices = range(start, end);
    } else {
        indices = Array.from(customWordInput.selectedOptions).map(x => parseInt(x.value));
    }

    if (indices.length > 0) params.push("indices=" + indices.join(","));

    return params.length > 0 ? "?" + params.join("&") : "";
}

function updateStartLink() {
    console.log(generateParams());
}

function toggleIntervalOptions(value) {
    intervalInput.querySelectorAll("input[type='radio']").forEach(input => {
        input.checked = false;
    });

    intervalInput.querySelector("input[name='interval'][value='" + value + "']").checked = true;
}

function setupCustomIndices() {
    words.forEach((word, i) => {
        const option = document.createElement("option");
        option.value = i+1;
        option.innerText = i+1 + ' - ' + word.word;
        customWordInput.appendChild(option);
    });
}

function setupIntervalOptions() {
    setupCustomIndices();

    let indices = range(1, words.length);

    let isRange = true;
    if (urlParams.has("indices")) {
        isRange = false;
        indices = urlParams.get("indices").split(",").map(x => parseInt(x)).sort((a, b) => a - b);
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
    
    if (isRange) {
        toggleIntervalOptions("interval");

        wordStartInput.value = indices[0];
        wordEndInput.value = indices[indices.length - 1];
    } else {
        toggleIntervalOptions("custom");

        customWordInput.querySelectorAll("option").forEach(option => {
            option.selected = false;
        });

        indices.forEach(index => {
            const option = customWordInput.querySelector("option[value='" + index + "']");
            if (option) option.selected = true;
        })
    }
}

function main() {
    if (urlParams.has("list")) {
        listInput.value = urlParams.get("list");
    }

    setupIntervalOptions();

    if (urlParams.has("mode")) {
        modeInput.value = urlParams.get("mode");
    }

    modeInput.addEventListener('change', updateStartLink);
    wordStartInput.addEventListener('change', updateStartLink);
    wordEndInput.addEventListener('change', updateStartLink);
    intervalInput.querySelectorAll("input[type='radio']").forEach(el => el.addEventListener('change', updateStartLink));
    customWordInput.addEventListener('change', updateStartLink);
}

main();