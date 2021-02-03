chrome.devtools.network.onRequestFinished.addListener(
    res => {
        let req = res.request
        let url = req.url
        if (url.search(/\/client\/group\/online$/) >= 0) {
            let method = req.method
            let YII = ""
            chrome.storage.local.set({ YII: YII })
            try {
                let postData = req.postData
                for (let p of postData.params) {
                    if (p.name == "YII_CSRF_TOKEN") {
                        YII = p.value
                        break
                    }
                }
                chrome.storage.local.set({ YII: YII })
            }
            catch (e) {
            }
        }
    }
)