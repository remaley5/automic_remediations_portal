
// ------- Add Shortcut --------------------------------------------------------------------
// Click "Add Manual Remediation" button with shortcut cntr + opt + n
// ---------------------------------------------------------------------------------------------------
const shortcut = function (e) {
    if (e.key === "Dead") {
        $ae('button[data-cy="createManualRemButton"]').click();
    }
}


// ------- Send Focus to Added Remediation -------------------------------------------------------------------------------
// Assign click to "Create" button in modal
// Look for file added, scroll and send focus when added
// ---------------------------------------------------------------------------------------------------
const sendFocus = function () {
    let manualRemsLength = document.querySelectorAll('table[data-cy="manualRemTable"] tr').length;
    document.querySelector('[data-cy="createManualRemModal"] button[data-cy="submitButton"]').addEventListener("click", function () {
        let cnt = 0;
        let findNewRem = setInterval(function () {
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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    // ------- Callback: OPEN MANUAL REMEDIATION MODAL/ APPLY SETTINGS  -------------------------------------------------------------------------------
    // AutoFill text
    // Assign send focus
    // -----------------------------------------x----------------------------------------------------------
    // "Add Manual Remediation" Modal opens
    let openManualRem = function () {
        let cnt;
        let findModal = setInterval(function() {
            let input = document.querySelector('[data-cy="createManualRemModal"] input#field-name');
            if(input != undefined) {
                clearInterval(findModal);
                input.value = request.title;
                if(request.send_focus === true) {
                    sendFocus();
                }
            }
            if(cnt > 20) {
                clearInterval(findModal);
            }
            cnt++;
        }, 100);
        // setTimeout(function () {
        //     document.querySelector('[data-cy="createManualRemModal"] input#field-name')
        //         .value = request.title;
        //     document.querySelector('[data-cy="createManualRemModal"] input#field-name').focus();

        //     if (request.send_focus === true) {
        //         sendFocus();
        //     }
        // }, 500);
    }

    // ------- HANDLE SET AND RESET  ----------------------------------------------------------------------------
    // Assign/Unassign click to "Add Manual Remediation" button
    // Assign/Unassign shortcut to body
    // ---------------------------------------------------------------------------------------------------
    if (request.action === "set") {
        // Click "Add Manual Remediation"
        document
            .querySelector('button[data-cy="createManualRemButton"]')
            .addEventListener("click", openManualRem);
        document.addEventListener("keydown", shortcut);
        //sendResponse({ message: "That's setting something" });
    } else if (request.action === "reset") {
        // Unassign Click
        document
            .querySelector('button[data-cy="createManualRemButton"]')
            .removeEventListener("click", openManualRem);
        document.removeEventListener("keydown", shortcut);
        // sendResponse({ message: "That's resetting something" });
    }
});
