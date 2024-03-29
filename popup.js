const toggleInactiveClass = function (elem, active) {
    if (active) {
        elem.classList.remove('inactive');
    } else {
        elem.classList.add('inactive');
    }
}

const toggleDisabled = function (button, disabled) {
    // console.log('setting disabled: ', disabled);
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
    const title_el = document.getElementById("automic_name");
    const send_focus_el = document.getElementById("send_focus");
    const shortcut_el = document.getElementById("shortcut");
    const toggle_instructions = document.getElementById("instructions");

    // ---------------------------------------------------------
    // SESSION STORAGE: Look for previously saved settings - reset 
    // ---------------------------------------------------------
    chrome.storage.session.get(['sophie']).then((result) => {
        // unpack
        let { send_focus, title, shortcut } = result.sophie;
        if (!!result.sophie) {
            title_el.value = title;
            send_focus_el.checked = send_focus;
            shortcut_el.checked = shortcut;
        }
        // add styling if title exists
        if (title !== '') {
            toggleInactiveClass(title_el, true);
        }
        // enable "reset" button if settings exist
        if (title !== '' || shortcut || send_focus) {
            toggleDisabled(resetButton, false);
        }

    });

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
    title_el.addEventListener("input", function () {
        //console.log('title value: ', title.value != '');
        toggleDisabled(saveButton, false);
        if (title_el.value === '') {
            toggleInactiveClass(title_el, false);
        } else if (title_el.classList.contains('inactive')) {
            toggleInactiveClass(title_el, true);
            toggleDisabled(resetButton, false);
        }
    });

    // Style: Shortcut toggle
    shortcut_el.addEventListener("click", function (ele) {
        toggleDisabled(saveButton, false);
        // console.log('clicked shortcut opt', ele.checked);
        if (shortcut_el.checked === true) {
            toggleDisabled(resetButton, false);
            //toggleDisabled(saveButton, false);
        }
    });

    // Style: Send focus toggle
    send_focus_el.addEventListener("click", function (ele) {
        toggleDisabled(saveButton, false);
        // console.log('clicked focus opt', ele.checked);
        if (send_focus_el.checked === true) {
            toggleDisabled(resetButton, false);
        }
    });

    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // Click 'Save'
    // ---------------------------------------------------------
    saveButton.addEventListener("click", function () {
        // --------~~ TOGGLE DISABLED: 'Save' and 'Reset'
        toggleDisabled(saveButton, true);
        if (title_el.value === '' || send_focus_el.checked || shortcut_el.checked) {
            toggleDisabled(resetButton, true);
        } else {
            toggleDisabled(resetButton, false);
        }

        // ------~~ SAVE DATA TO SESSION STORAGE
        const data = {
            action_store: "set",
            title: title_el.value,
            send_focus: send_focus_el.checked,
            shortcut: shortcut_el.checked
        };
        chrome.storage.session.set({ sophie: data });

        // ------~~ APPLY SETTINGS TO WEBPAGE
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "set",
                    title: title_el.value,
                    send_focus: send_focus_el.checked,
                    shortcut: shortcut_el.checked
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
        toggleInactiveClass(title_el, false);

        // Reset settings
        title_el.value = '';
        send_focus_el.checked = false;
        shortcut_el.checked = false;

        // ------~~ REMOVE DATA FROM CHROME
        chrome.storage.session.remove(["sophie"]);

        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "reset", shortcut: false });
            }
        );
    });
});
