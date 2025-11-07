const urlParams = new URLSearchParams(window.location.search);

function setupMainMenuLink() {
    const mainMenuButton = document.getElementById("menuButton");
    mainMenuButton.href = "index.html" + window.location.search;
}

function main() {
    setupMainMenuLink();

    if (urlParams.has("list")) {
        const table = document.getElementById('output');

        document.getElementById('output').innerHTML = data[urlParams.get("list")].map((word, i) => {
            return `<tr><td>${i + 1}</td><td>${word.word}</td><td>${word.definition}</td><td>${word.example}</td></tr>`;
        }).join('\n');
    }
}

main();