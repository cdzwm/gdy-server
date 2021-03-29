var connections = {}

chrome.runtime.onConnect.addListener(function (port) {

    let tabId
    var extensionListener = function (message, sender, sendResponse) {
        // 原始的连接事件不包含开发者工具网页的标签页标识符，
        // 所以我们需要显式发送它。
        if (message.name == "init") {
            connections[message.tabId] = port;
            tabId = message.tabId
            return;
        }

        // 其他消息的处理
        switch (message.type) {
            case "auto_move":
                chrome.alarms.create("auto_remove", {
                    periodInMinutes: 1
                })
                break
            default:
                chrome.tabs.sendMessage(tabId, message)
                break
        }
    }

    // 监听开发者工具网页发来的消息
    port.onMessage.addListener(extensionListener);

    port.onDisconnect.addListener(function (port) {
        port.onMessage.removeListener(extensionListener);

        var tabs = Object.keys(connections);
        for (var i = 0, len = tabs.length; i < len; i++) {
            if (connections[tabs[i]] == port) {
                delete connections[tabs[i]]
                break;
            }
        }
    })
})

// 从内容脚本接收消息，并转发至当前
// 标签页对应的开发者工具网页
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log(message)
    if( message.type && message.type == "init_data"){
        
    }

    // 来自内容脚本的消息应该已经设置 sender.tab
    if (sender.tab) {
        var tabId = sender.tab.id;
        if (tabId in connections) {
            connections[tabId].postMessage(message);
        }
    }
    return true;
})

chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm == "auto_move")
        chrome.tabs.sendMessage(tabId, "check")
})