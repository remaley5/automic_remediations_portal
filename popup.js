// import {getSessionStorage} from './popup.js'

const toggleInactiveClass = function (elem, active) {
    if (active) {
        elem.classList.remove('inactive');
    } else {
        elem.classList.add('inactive');
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
    const dark_mode_toggle = document.getElementById('dark_mode_toggle');
    let last_saved = {
        title: '',
        send_focus: false,
        shortcut: false, 
        dark_mode: false
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
    chrome.storage.session.get(['sophie', 'dark_mode']).then((result) => {
        console.log('getting session storage', result.sophie);
        // unpack
        if (!!result.sophie) {
            // --~~ SAVE FOR REVERT
            last_saved = result.sophie;

            let { send_focus, title, shortcut } = result.sophie;

            console.log('setting: ', send_focus, title, shortcut);
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
        
        // ----~~ RESET DARK MODE
        if(!!result.dark_mode) {
            dark_mode_toggle.checked = true;
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

        last_saved.action_store = "set";
        last_saved.title = title_input.value;
        last_saved.send_focus = focus_toggle.checked;
        last_saved.shortcut = shortcut_toggle.checked;

        // ------~~ SAVE DATA TO SESSION STORAGE
        console.log('setting session storage', last_saved);
        chrome.storage.session.set({ sophie: last_saved });
        
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
        reset_button.setAttribute('disabled', '');
        save_button.setAttribute('disabled', '');
        toggleInactiveClass(title_input, false);

        // -------~~ RESET EXTENSION FORM FIELDS
        title_input.value = '';
        focus_toggle.checked = false;
        shortcut_toggle.checked = false;

        // ------~~ RESET DATA IN SESSION STORAGE
        last_saved.action_store = "reset";
        last_saved.title = '';
        last_saved.send_focus = false
        last_saved.shortcut = false

        chrome.storage.session.set({ sophie: last_saved });

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
    });

     // ---------------------------------------------------------
    // CLICK 'Dark Mode'
    // ---------------------------------------------------------
    dark_mode_toggle.addEventListener("click", function () {
        // -------~~ RESET LAST SAVED 
        chrome.storage.session.set({ dark_mode: dark_mode_toggle.checked });
        
        console.log('sending dark mode');
        // ------~~ APPLY TO WEBPAGE 
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "dark-mode", dark_mode: dark_mode_toggle.checked });
            }
        );
    });
});
