
const sendFocus = function () {
    document.querySelector('button[data-cy="createManualRemButton"]').addEventListener("click", function () {

    });
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    let openManualRem = function () {
        setTimeout(function () {
            const manualRemsLength = document.querySelectorAll('table[data-cy="manualRemTable"] tr').length;
            
            
            console.log('before before focus', document.querySelectorAll('table[data-cy="manualRemTable"] tr')[manualRemsLength]);
            document.querySelector('[data-cy="createManualRemModal"] input#field-name')
                .value = request.title;
            document.querySelector('[data-cy="createManualRemModal"] input#field-name').focus();
            console.log('ae send focus?', request.send_focus);
            
            
            // If focus is checked then send focus to the new input when manual remediation is saved
            if (request.send_focus === true) {
                document.querySelector('[data-cy="createManualRemModal"] button[data-cy="submitButton"]').addEventListener("click", function () {
                    console.log('before focus', document.querySelectorAll('table[data-cy="manualRemTable"] tr')[manualRemsLength]);
                    
                    setTimeout(function () {
                        let newRem = document.querySelectorAll('table[data-cy="manualRemTable"] tr')[manualRemsLength];
                        newRem.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
                        newRem.setAttribute('tabindex', '0');
                        newRem.focus();
                    }, 1200);
                });
            }
        }, 500);
    }

    if (request.action === "set") {
        // click event for adding click event
        console.log('send focus?', request.send_focus);
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
