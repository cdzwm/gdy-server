chrome.devtools.inspectedWindow.eval(
    "window.SYS_CONF",
    result => {
        if (result && result.hasOwnProperty('csrf_token'))
            chrome.devtools.panels.create("奇安信助手", "/images/logo.png", "qax.html", function (panel) {
                chrome.runtime.sendMessage({type: "dev", result})
            })
    }
)
