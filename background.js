chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type && message.type == "init_data") {
        console.log(message)
    }
})

chrome.action.onClicked.addListener(event => {
    console.log(event)
})