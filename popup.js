

document.addEventListener("DOMContentLoaded", function () {
    
    // Elements
    const setButton = document.getElementById("set_button");
    const resetButton = document.getElementById("reset_button");
    const title = document.getElementById("automic_name");
    const send_focus = document.getElementById("send_focus");

    setButton.addEventListener("click", function () {
        // console.log("clicked set button", title.value);
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "set", title: title.value, send_focus: send_focus.checked });
            }
        );
    });


    // testing 
    resetButton.addEventListener("click", function () {
        // console.log("clicked reset button");
        title.value = '';
        send_focus.checked = false;
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "reset" });
            }
        );
    });
});
