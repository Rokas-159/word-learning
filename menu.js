const urlParams = new URLSearchParams(window.location.search);
const listInput = document.getElementById("listInput");
const modeInput = document.getElementById("mode");
const wordStartInput = document.getElementById("wordStart");
const wordEndInput = document.getElementById("wordEnd");
const intervalInput = document.getElementById("intervalOptionsInput");
const customWordInput = document.getElementById("customWords");

let mode = 2;

function range(a, b) {
    if (a > b) [a, b] = [b, a];

    const arr = [];
    for (let i = a; i <= b; i++) {
        arr.push(i);
    }

    return arr;
}

function customRange(e) {
    e.preventDefault();

    let start = parseInt(document.getElementById("wordStart").value);
    let end = parseInt(document.getElementById("wordEnd").value);

    const mode = document.getElementById("mode").value;

    if (isNaN(start) || start <= 0 || start > words.length) start = 1;
    if (isNaN(end) || end <= 0 || end > words.length) end = 231;

    window.open(
        window.location.href.split("?")[0] +
        "?" +
        (end != 231 || start != 1
            ? "indices=" + range(start - 1, end - 1).join(",")
            : "") +
        "&mode=" +
        mode,
        "_blank"
    );
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
                console.log(indices[i], indices[i-1]);
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
    setupIntervalOptions();
}


if (urlParams.has("mode")) {
    mode = urlParams.get("mode");
    document.getElementById("mode").value = mode;
}

main();