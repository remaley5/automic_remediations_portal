

document.addEventListener("DOMContentLoaded", function () {
    // Elements
    const setButton = document.getElementById("set_button");
    const resetButton = document.getElementById("reset_button");
    const title = document.getElementById("automic_name");
    const send_focus = document.getElementById("send_focus");
    const shortcut = document.getElementById("shortcut");
    const toggle_instructions = document.getElementById("instructions");
    
    toggle_instructions.addEventListener("click", function() {
        console.log('Clicked!!')
        if(toggle_instructions.checked === true) {
            document.querySelectorAll('.description').forEach(function(ele) {
                ele.classList.remove('hidden')
            });
        } else {
            document.querySelectorAll('.description').forEach(function(ele) {
                ele.classList.add('hidden')
            });
        }
    });
    
    // SET & RESET
    setButton.addEventListener("click", function () {
        console.log('Set: Clicked!');
        // Apply setting to page
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { 
                    action: "set", 
                    title: title.value, 
                    send_focus: send_focus.checked, 
                    shortcut: shortcut.checked
                });
            }
        );

    });


    resetButton.addEventListener("click", function () {
        console.log('Reset: Clicked!');
        // Reset settings
        title.value = '';
        send_focus.checked = false;
        shortcut.checked = false;

        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "reset", shortcut: false });
            }
        );
    });
});
