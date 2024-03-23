document.addEventListener("DOMContentLoaded", function () {
    var setButton = document.getElementById("setButton");
    var resetButton = document.getElementById("resetButton");

    setButton.addEventListener("click", function () {
        console.log("clicked set button");
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "set" });
            }
        );
    });


    // testing 
    resetButton.addEventListener("click", function () {
        console.log("clicked reset button");
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "reset" });
            }
        );
    });
});
