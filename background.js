chrome.runtime.onMessage.addListener(function (message, sender, f) {
    chrome.tabs.query({ active: true }, (tab) => {
        chrome.storage.local.get(["YII"], function (result) {
            chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 0] })
            chrome.action.setBadgeText({ tabId: tab.id, text: result.YII })
        })
    })
})

function updateBadage() {
    let msg = Math.random().toString().substring(2, 6)
    chrome.runtime.sendMessage(msg)
}

chrome.runtime.onInstalled.addListener(function () {
    chrome.action.onClicked.addListener(tab => {
        chrome.scripting.executeScript(
            {
                target: {
                    tabId: tab.id
                },
                function: updateBadage
            })
    })
})