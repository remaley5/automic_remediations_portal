const btnToggleActive = function(button, active) {
    if(active) {
        button.classList.remove('inactive');
    } else {
       button.classList.add('inactive');
    }
}

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

    // ---------------------------------------------------------
    // Toggle class for active styling
    // ---------------------------------------------------------
    title.addEventListener("input", function() {
        console.log('title: ', title);
        console.log('title class: ', title.classList);
        if(title.value !== '' && document.getElementById("automic_name").classList.contains('inactive')) {
            btnToggleActive(title, true);
            btnToggleActive(setButton, true);
            btnToggleActive(resetButton, true);
        } else {
            btnToggleActive(title, false);
        }
    });

    shortcut.addEventListener("click", function(ele) {
        btnToggleActive(setButton, true);
        console.log('clicked shortcut opt', ele.checked);
        if(shortcut.checked === true) {
            btnToggleActive(resetButton, true);
        }
    });
    send_focus.addEventListener("click", function(ele) {
        btnToggleActive(setButton, true);
        console.log('clicked focus opt', ele.checked);
        if(send_focus.checked === true) {
            btnToggleActive(resetButton, true);
        }
    });
    
    // SET & RESET
    setButton.addEventListener("click", function () {
        // Set Button Styling
        btnToggleActive(setButton, false);
        btnToggleActive(resetButton, true);
        
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


    resetButton.addEventListener("click", function (ele) {
        btnToggleActive(resetButton, false);
        btnToggleActive(setButton, false);
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
