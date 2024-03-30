// BACKGROUND 
let dark_mode_css = [
    `.monaco-editor-background {
        background-color: #0d1117 !important;
    }`,
    `.margin{
        background-color: #0d1117 !important;
    }`,
    `.margin .active-line-number {
        color: #7ee787 !important;
    }  `, 
    `.monaco-scrollable-element .monaco-editor-background {
        background-color: #0d1117 !important;
    }`,
    `.monaco-editor {
        background-color: #0d1117;
    }`,
    // ele.outerFind, $ae, methods (.filter, .find, .attr, etc) 
    `.mtk1 {
        color: #79c0ff;
    }`,
    `.mtk5 {
        color: #cd9178;
    }`,
    // Inner function, THIS, if, else, VAR, CONST 
    `.mtk6 {
    color: #2f81f7;
    }`,
    // bracket text 
    `.mtk7 {
        color: #ff7b72;
    }`,
    // COMMENTS 
    `.mtk8 {
    color: #8b949e;
    }`,
    `.mtk9 {
    color: #dcdcdc;
    }`,
    // SELECTOR 
    `.mtk20 {
    color: #7ee787;
    }`,
    // function variab
    `.mtk22 {
    color: white;
    }`,
    // outer-most parenthesis 
    `.monaco-editor .bracket-highlighting-0 {
    color: white;
    }`,
    // inner parenthesis 
    `.monaco-editor .bracket-highlighting-1 {
    color: white;
    }`,

    // inner-most parenthesis 
    `.monaco-editor .bracket-highlighting-2 {
    color: white;
    }`,
    `.monaco-editor .bracket-highlighting-3 {
    color: white;
    }`,
    `.monaco-editor .bracket-highlighting-4 {
    color: white;
    }`,
    `.monaco-editor .bracket-highlighting-5 {
    color: white;
    }`,
    `.monaco-editor .bracket-highlighting-6 {
    color: white;
    }`,
]

const style2 = `
h1 {
    color: pink!important;
}
`

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
    console.log('sophie getting message', request.action);
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

    if (request.action === "style") {
        console.log('setting style');
        var style = document.createElement('style'),
            css = '';
        css += style;
        dark_mode_css.forEach(function (el) {
            css += `.dark-mode ${el}`;
        });
        style.type = 'text/css';
        style.setAttribute("id", "dma-temp-global-style");
        style.setAttribute("class", "dmn-custom-remove-after-load");
        style.appendChild(document.createTextNode(css));
        const head = document.documentElement || document.head || document.querySelector("head");
        if (head) {
            head.appendChild(style);
        }

        document.querySelector('body').classList.add('dark-mode');
    }
});
