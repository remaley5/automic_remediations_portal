const toggleInactiveClass = function (elem, active) {
    if (active) {
        elem.classList.remove('inactive');
    } else {
        elem.classList.add('inactive');
    }
}

const toggleDisabled = function (button, disabled) {
    console.log('setting disabled: ', disabled);
    if (disabled) {
        button.setAttribute('disabled', '');
    } else {
        button.removeAttribute('disabled');
    }
}



document.addEventListener("DOMContentLoaded", function () {
    // Elements
    const saveButton = document.getElementById("save_button");
    const resetButton = document.getElementById("reset_button");
    const title = document.getElementById("automic_name");
    const send_focus = document.getElementById("send_focus");
    const shortcut = document.getElementById("shortcut");
    const toggle_instructions = document.getElementById("instructions");

    // ---------------------------------------------------------
    // STYLING: Instructions Toggle: Show/ Hide instructions
    // ---------------------------------------------------------
    toggle_instructions.addEventListener("click", function () {
        if (toggle_instructions.checked === true) {
            document.querySelectorAll('.description').forEach(function (ele) {
                ele.classList.remove('hidden')
            });
        } else {
            document.querySelectorAll('.description').forEach(function (ele) {
                ele.classList.add('hidden')
            });
        }
    });

    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // STYLING: Toggles/ Input: 'On'/ 'off' styling ('inactive' class)
    // ---------------------------------------------------------
    // Style: Title input
    title.addEventListener("input", function () {
        //console.log('title value: ', title.value != '');
        toggleDisabled(saveButton, false);
        if (title.value === '') {
            toggleInactiveClass(title, false);
        } else if (title.classList.contains('inactive')) {
            toggleInactiveClass(title, true);
            toggleDisabled(resetButton, false);
        }
    });

    // Style: Shortcut toggle
    shortcut.addEventListener("click", function (ele) {
        toggleDisabled(saveButton, false);
        console.log('clicked shortcut opt', ele.checked);
        if (shortcut.checked === true) {
            toggleDisabled(resetButton, false);
            //toggleDisabled(saveButton, false);
        }
    });

    // Style: Send focus toggle
    send_focus.addEventListener("click", function (ele) {
        toggleDisabled(saveButton, false);
        console.log('clicked focus opt', ele.checked);
        if (send_focus.checked === true) {
            toggleDisabled(resetButton, false);
        }
    });

    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // Click 'Save'
    // ---------------------------------------------------------
    saveButton.addEventListener("click", function () {
        // Toggle Disabled: 'Save' and 'Reset'
        toggleDisabled(saveButton, true);
        toggleDisabled(resetButton, false);

        // Apply setting on webpage
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

    // ---------------------------------------------------------
    // Click 'Reset'
    // ---------------------------------------------------------
    resetButton.addEventListener("click", function (ele) {
        // Reset active styling
        toggleDisabled(resetButton, true);
        toggleDisabled(saveButton, true);
        toggleInactiveClass(title, false);

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
