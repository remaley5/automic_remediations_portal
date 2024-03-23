chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    //console.log("in event listener, request.action", request.action);
    if (request.action === "set") {
        // click event for adding click event
        console.log("setting click event");
        document
            .querySelector('button[data-cy="createManualRemButton"]')
            .setAttribute("testing", "yes");
        document
            .querySelector('button[data-cy="createManualRemButton"]')
            .addEventListener("click", function () {
                console.log("clicked manual rem button");
                // setTimeout(function () {

                // }, 500);
            });

        sendResponse({ message: "That's setting something" });
    } else if (request.action === "reset") {
        // resetting something
        sendResponse({ message: "That's resetting something" });
    }
});
