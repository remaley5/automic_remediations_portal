// import {getSessionStorage} from './popup.js'

const toggleInactiveClass = function (elem, active) {
    if (active) {
        elem.classList.remove('inactive');
    } else {
        elem.classList.add('inactive');
    }
}

const toggleDisabled = function (button, disabled) {
    if (disabled) {
        button.setAttribute('disabled', '');
    } else {
        button.removeAttribute('disabled');
    }
}


document.addEventListener("DOMContentLoaded", function () {
    // Elements
    const save_button = document.getElementById("save_button");
    const reset_button = document.getElementById("reset_button");
    const title_input = document.getElementById("automic_name");
    const focus_toggle = document.getElementById("focus_toggle");
    const shortcut_toggle = document.getElementById("shortcut_toggle");
    const instructions_toggle = document.getElementById("instructions_toggle");
    const status_text = document.getElementById('status_text');
    const revert_button = document.getElementById('revert_button');
    let last_saved = {
        title: '',
        send_focus: false,
        shortcut: false
    };


    
    // ---------~~ DISABLE "RESET" BUTTON IF FORM IS EMPTY
    const checkEmptyForm = function () {
        if (title_input.value !== '' || focus_toggle.checked || shortcut_toggle.checked) {
            reset_button.removeAttribute('disabled');
        } else {
            reset_button.setAttribute('disabled', '');
        }
    }

    const changeOnInput = function () {
        revert_button.removeAttribute('disabled');
        if (save_button.hasAttribute('disabled')) {
            save_button.removeAttribute('disabled');
        }
        if(!(status_text.classList.contains('hidden'))) {
            status_text.classList.add('hidden');
        }
    }

    // ---------------------------------------------------------
    // CHECK SESSION STORAGE ON EXTENSION LOAD
    // ---------------------------------------------------------
    chrome.storage.session.get(['sophie']).then((result) => {
        // unpack
        if (result.sophie != undefined) {
            // --~~ SAVE FOR REVERT
            last_saved = result.sophie;

            let { send_focus, title, shortcut } = result.sophie;

            if (!!result.sophie) {
                // --~~ RESET EXTENSION FORM FIELDS
                title_input.value = title;
                focus_toggle.checked = send_focus;
                shortcut_toggle.checked = shortcut;

                // --~~ SET STYLING / DISABLED 
                if (title !== '') {
                    toggleInactiveClass(title_input, true);
                }
                if (title !== '' || shortcut || send_focus) {
                    reset_button.removeAttribute('disabled');
                }
            }
        }
    });

    // ---------------------------------------------------------
    // "Instructions" TOGGLE
    // ---------------------------------------------------------
    instructions_toggle.addEventListener("click", function () {
        if (instructions_toggle.checked === true) {
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
    // TOGGLE STYLING ON FORM INPUT
    // ---------------------------------------------------------
    // --~~ "Filename Prefix"
    title_input.addEventListener("input", function () {
        changeOnInput();

        if (title_input.value === '') {
            toggleInactiveClass(title_input, false);
            checkEmptyForm();
        } else if (title_input.classList.contains('inactive')) {
            toggleInactiveClass(title_input, true);
            reset_button.removeAttribute('disabled');
        }
    });

    // --~~ "Shortcut"
    shortcut_toggle.addEventListener("click", function (ele) {
        changeOnInput();

        if (shortcut_toggle.checked === true) {
            reset_button.removeAttribute('disabled');
            save_button.removeAttribute('disabled');
        } else {
            checkEmptyForm();
        }
    });

    // --~~ "Send Focus & Scroll"
    focus_toggle.addEventListener("click", function (ele) {
        changeOnInput();

        save_button.removeAttribute('disabled');
        if (focus_toggle.checked === true) {
            reset_button.removeAttribute('disabled');
        } else {
            checkEmptyForm();
        }
    });

    // ---------------------------------------------------------
    // CLICK 'Save'
    // ---------------------------------------------------------
    save_button.addEventListener("click", function () {
        status_text.innerHTML = 'Settings Saved!';
        status_text.classList.remove('hidden');
        
        // -------~~ TOGGLE STYLING AND DISABLED
        save_button.setAttribute('disabled', '');
        revert_button.setAttribute('disabled', '');
        checkEmptyForm();


        const data = {
            action_store: "set",
            title: title_input.value,
            send_focus: focus_toggle.checked,
            shortcut: shortcut_toggle.checked
        };

        // ------~~ SAVE DATA TO SESSION STORAGE
        chrome.storage.session.set({ sophie: data });
        // -------~~ SAVE FOR REVERT
        last_saved = data;


        // ------~~ APPLY SETTINGS TO WEBPAGE
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "set",
                    title: title_input.value,
                    send_focus: focus_toggle.checked,
                    shortcut: shortcut_toggle.checked
                });
            }
        );

    });

    // ---------------------------------------------------------
    // CLICK 'Reset'
    // ---------------------------------------------------------
    reset_button.addEventListener("click", function () {
        status_text.innerHTML = 'All Reset!';
        status_text.classList.remove('hidden');

        // -------~~ RESET LAST SAVED 
        last_saved = {
            title: '',
            send_focus: false,
            shortcut: false
        };

        // -------~~ RESET STYLING AND DISABLED
        revert_button.setAttribute('disabled', '');
        toggleDisabled(reset_button, true);
        toggleDisabled(save_button, true);
        toggleInactiveClass(title_input, false);

        // -------~~ RESET EXTENSION FORM FIELDS
        title_input.value = '';
        focus_toggle.checked = false;
        shortcut_toggle.checked = false;

        // ------~~ REMOVE DATA FROM SESSION STORAGE
        chrome.storage.session.remove(["sophie"]);

        // ------~~ APPLY TO WEBPAGE 
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "reset", shortcut: false });
            }
        );
    });


    // ---------------------------------------------------------
    // CLICK 'Revert'
    // ---------------------------------------------------------
    revert_button.addEventListener("click", function () {
        status_text.innerHTML = 'Reverted to last settings!';
        status_text.classList.remove('hidden');

        let { send_focus, title, shortcut } = last_saved;

        // -------~~ RESET EXTENSION FORM FIELDS
        title_input.value = title;
        focus_toggle.checked = send_focus;
        shortcut_toggle.checked = shortcut;

        // -------~~ TOGGLE STYLE/ DISABLED
        if (title !== '') {
            toggleInactiveClass(title_input, true);
        }
        if (title !== '' || shortcut || send_focus) {
            reset_button.removeAttribute('disabled');
        } else {
            reset_button.setAttribute('disabled', '');
        }
        save_button.setAttribute('disabled', '');
        revert_button.setAttribute('disabled', '');

        // -------~~ APPLY TO WEBPAGE
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "set",
                    title: title,
                    send_focus: send_focus,
                    shortcut: shortcut
                });
            }
        );
    });

});
