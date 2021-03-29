$(document).ready(() => {
    $("#auto_move_btn").click(() => {

        console.log("Start ...")
        backgroundPageConnection.postMessage({ type: "auto_move" })

        let btn = $("#auto_move_btn_txt")
        if (btn.text() == "启动") {
            btn.removeClass("stop")
            btn.addClass("run")
            btn.text("停止")
        }
        else {
            btn.removeClass("run")
            btn.addClass("stop")
            btn.text("启动")
        }
    })

    chrome.devtools.inspectedWindow.eval(
        "[window.SYS_CONF,document.URL,CUR_USER.mgr_gids[0]]",
        result => {
            let CSRF_TOKEN = result[0].csrf_token
            let GID = new RegExp("gid=(\\d+)").exec(result[1])[1].toString()
            let DEFAULT_GID = result[2]
            backgroundPageConnection.postMessage({ type: "init_system", GID, CSRF_TOKEN, DEFAULT_GID })
        }
    )

    $("#msg").text('')
})

// 创建连接至后台网页
var backgroundPageConnection = chrome.runtime.connect({
    name: "panel"
})

backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
})
