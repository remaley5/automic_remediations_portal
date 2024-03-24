
// HELPERS 
// ------- SEND FOCUS -------------------------------------------------------------------------------
//  Click "Create" in "New Manual Remediation" modal - send focus and scroll to the new file
// ---------------------------------------------------------------------------------------------------
const sendFocus = function (manualRemsLength) {
    let manualRemsLength = document.querySelectorAll('table[data-cy="manualRemTable"] tr').length;
    document.querySelector('[data-cy="createManualRemModal"] button[data-cy="submitButton"]').addEventListener("click", function () {
        let cnt = 0;
        let interval = setInterval(function () {
            let newRem = document.querySelectorAll('table[data-cy="manualRemTable"] tr')[manualRemsLength];
            
            if (newRem != undefined) {
                console.log('Found new Rem!')
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
    // Run on click "Add Manual Remediation" button 
    let openManualRem = function () {
        setTimeout(function () {
            // Set the title in modal textbox
            document.querySelector('[data-cy="createManualRemModal"] input#field-name')
                .value = request.title;
            // Focus the textbox
            document.querySelector('[data-cy="createManualRemModal"] input#field-name').focus();
            // "Send Focus to New Remediation" is checked
            if (request.send_focus === true) {
                sendFocus();
            }
        }, 500);
    }

    if (request.action === "set") {
        // click event for adding click event
        document
            .querySelector('button[data-cy="createManualRemButton"]')
            .addEventListener("click", openManualRem);
        sendResponse({ message: "That's setting something" });
    } else if (request.action === "reset") {
        document
            .querySelector('button[data-cy="createManualRemButton"]')
            .removeEventListener("click", openManualRem);
        sendResponse({ message: "That's resetting something" });
    }
});
