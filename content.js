
// ------- Add Shortcut --------------------------------------------------------------------
// Click "Add Manual Remediation" button with shortcut cntr + opt + n
// ---------------------------------------------------------------------------------------------------
const shortcut = function (e) {
    if (e.key === "Dead") {
        document.querySelector('button[data-cy="createManualRemButton"]').click();
    }
}


// ------- "Send Focus & Scroll" -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
const sendFocus = function () {
    let manualRemsLength = document.querySelectorAll('table[data-cy="manualRemTable"] tr').length;

    // ----~~ "Create" button click listener ~~--------------
    document.querySelector('[data-cy="createManualRemModal"] button[data-cy="submitButton"]').addEventListener("click", function () {
        // console.log('Sending Focus: New file created');
        let cnt = 0;
        let findNewRem = setInterval(function () {
            // EDIT NOTE: Change this to the button 
            //-------~~ New Remediation 
            let newRem = document.querySelectorAll('table[data-cy="manualRemTable"] tr')[manualRemsLength];
            if (newRem != undefined) {
                clearInterval(findNewRem);
                newRem.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
                newRem.setAttribute('tabindex', '0');
                newRem.focus();
            }

            if (cnt > 20) {
                console.log("Couldn't send focus :(");
                clearInterval(findNewRem);
            }
            cnt++;
        }, 100)
    });
}


// ------ INITIAL CALL ---------------------------------------------------------------------------------
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // ------- OPEN MANUAL REMEDIATION MODAL/ APPLY SETTINGS  -------------------------------------------------------------------------------
    // -----~~ "Add Manual Remediation" Modal opens ~~---------
    let openManualRem = function () {
        // console.log('Open manual Remediation');
        let cnt;
        let findModal = setInterval(function () {
            let input = document.querySelector('[data-cy="createManualRemModal"] input#field-name');
            if (input != undefined) {
                clearInterval(findModal);
                // ------~~ "Filename Prefix"
                if (request.title !== '') {
                    input.value = request.title;
                    input.focus();
                }

                // -------~~ "Auto-Scroll & Focus"
                if (request.send_focus === true) {
                    sendFocus();
                }
            }
            if (cnt > 20) {
                clearInterval(findModal);
            }
            cnt++;
        }, 100);

    }

    let manualRemButton = document.querySelector('button[data-cy="createManualRemButton"]');

    if (manualRemButton != undefined) {
        // ----~~ "Shortcut Key for New Remediation" ~~--------------
        if (request.shortcut === true) {
            document.addEventListener("keydown", shortcut);
        } else {
            document.removeEventListener("keydown", shortcut);
        }

        // ------- HANDLE SET AND RESET  ----------------------------------------------------------------------------
        // ----------------------------------------------------------------------------------------------------------
        if (request.action === "set") {
            manualRemButton.removeEventListener("click", openManualRem);
            manualRemButton.addEventListener("click", openManualRem);
        } else if (request.action === "reset") {
            manualRemButton.removeEventListener("click", openManualRem);
        }
    }
});
