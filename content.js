
// HELPERS 
// ------- Callback: SEND FOCUS TO NEW REMEDIATION -------------------------------------------------------------------------------
// Assign click to "Create" button in modal
// Look for file added, scroll and send focus when added
// ---------------------------------------------------------------------------------------------------
const sendFocus = function () {
    // "Create" button in modal
    let manualRemsLength = document.querySelectorAll('table[data-cy="manualRemTable"] tr').length;
    document.querySelector('[data-cy="createManualRemModal"] button[data-cy="submitButton"]').addEventListener("click", function () {
        let cnt = 0;
        let interval = setInterval(function () {
            let newRem = document.querySelectorAll('table[data-cy="manualRemTable"] tr')[manualRemsLength];
            if (newRem != undefined) {
                newRem.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
                newRem.setAttribute('tabindex', '0');
                newRem.focus();
                clearInterval(interval);
            }

            if (cnt > 20) {
                console.log("Couldn't send focus :(");
                clearInterval(interval);
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
        setTimeout(function () {
            // Autofill textbox
            document.querySelector('[data-cy="createManualRemModal"] input#field-name')
                .value = request.title;
            // Focus textbox
            document.querySelector('[data-cy="createManualRemModal"] input#field-name').focus();
            
            // Check send focus field 
            if (request.send_focus === true) {
                sendFocus();
            }
        }, 500);
    }

    // ------- HANDLE SET AND RESET  ----------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------
    if (request.action === "set") {
        // Click "Add Manual Remediation"
        document
            .querySelector('button[data-cy="createManualRemButton"]')
            .addEventListener("click", openManualRem);
        sendResponse({ message: "That's setting something" });
    } else if (request.action === "reset") {
        // Unassign Click
        document
            .querySelector('button[data-cy="createManualRemButton"]')
            .removeEventListener("click", openManualRem);
        sendResponse({ message: "That's resetting something" });
    }
});
