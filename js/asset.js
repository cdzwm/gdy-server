let API_SERVER = 'https://10.48.53.85:8443'
let GID = '', CSRF_TOKEN = '', DEFAULT_GID = ''

chrome.runtime.onMessage.addListener(message => {
    switch (message.type) {
        case "init_system":
            console.clear()
            GID = message.GID
            CSRF_TOKEN = message.CSRF_TOKEN
            DEFAULT_GID = message.DEFAULT_GID
            break
        case "auto_move":
            break
        case "check":
            check(DEFAULT_GID, 1, 2000)
            console.log("check ...")
            break
        default:
            console.log(`unknown message type: ${message}`)
            break
    }
})

function change_group(mids, gid, new_gid) {
    let url = `${API_SERVER}/client/client/move`
    let post_form = {
        gid: gid,
        new_gid: new_gid,
        mids: mids,
        except: '',
        ids: mids,
        limit: 12,
        YII_CSRF_TOKEN: CSRF_TOKEN,
    }
    $.post(url, post_form,
        ret => {
            let dt = new Date().toLocaleString()
            if (ret.result == 0)
                console.log(`${dt}: 操作成功!`)
            else
                console.log(`${dt}: 操作失败! mid = ${mids}`)
        }, 'json')
}

function approve(gid, mids, type) {
    let action_url = `${API_SERVER}/host/pcsummary/approve`
    let approved = 1, the_type = 0
    if (type == 'sp') {
        approved = 0
        the_type = 1
    }
    else if (type == 'qxsp') {
        approved = 1
        the_type = 0
    }
    else {
        console.log(`操作类型错误:" type + '"`)
        return
    }

    let post_form = {
        mids,
        gid,
        approved: approved,
        type: the_type,
        YII_CSRF_TOKEN: CSRF_TOKEN
    }
    $.post(action_url, post_form, function (ret) { if (ret.result == 0) console.log('操作成功!'); else console.log('操作失败! : ' + mids) }, 'json')
}

function term_doc_is_valid(term) {
    let d = term
    if (d['mid'] != null && d['mid'] != ''
        && d['ip'] != null && d['ip'] != ''
        && d['username'] != null && d['username'] != ''
        && d['mobile'] != null && d['mobile'] != ''
        && d['email'] != null
        && (d['email'].search(/@chinaunicom.cn/) >= 0
            || d['email'].search(/@wo.cn$/) >= 0
            || d['email'].search(/@qq.com$/) >= 0
            || d['email'].search(/@sina.com$/) >= 0
            || d['email'].search(/@126.com$/) >= 0
            || d['email'].search(/@163.com$/) >= 0
            || d['email'].search(/.net$/) >= 0)
        && d['location'] != null && d['location'] != '' && d['location'].search(/\s*[\S.]{2,}/) >= 0
    ) {
        let r = `${d['mid']}\t${d['ip']}\t${d['user_number']}\t${d['username']}\t${d['mobile']}\t${d['email']}\t${d['location']}\t${d['update_time']}`
        return r
    }
}

function get_term_brief(gid, approved, limit, fcall) {
    $.get(`${API_SERVER}/security/index/list?gid=${gid}&limit=${limit}&t=${Math.random()}`, {}, fcall ? fcall : function () { })
}

/**
 * 读取终端列表
gid: 分组号, 字符串类型。
approved: 审批标志。0为未审批， 1为已审批。
limit: 返回的最大终端数量。如 100。
cb: 为形如 function(result){...}的回调函数。
**/
function get_term_list(gid, approved, limit, cb) {
    $.get(`${API_SERVER}/host/pcsummary/approvelist?gid=${gid}&approved=${approved}&limit=${limit}&counting=false&t=${Math.random()}`, {}, cb ? cb : function () { })
}

function check_result(result, cb) {
    let lst = result.data.list
    let ret = []
    for (let i = 0; i < lst.length; i++) {
        try {
            let { display_name, mid, email, gid, ip, location, mobile, memo, telephone, username, update_time, user_number } = lst[i]
            cb({ display_name, mid, email, gid, ip, location, mobile, memo, telephone, username, update_time, user_number })
        }
        catch (err) {
            console.log(err)
        }
    }
}

function check(gid, approved, limit) {
    get_term_list_by_query_mobile(GID, 1024, "1").then(list => {
        console.log(list)
        list.forEach(term => {
            if (!(term.ip && term.username && term.mobile && term.email && term.location)) {
                change_group(term.mid, "16777253", "16777284")
            }
        })
    })
}

async function get_term_list_by_query(gid, limit, mac_head) {
    return new Promise(resolve => {
        let url = `${API_SERVER}/security/index/savefilter`
        let post_form = {
            YII_CSRF_TOKEN: CSRF_TOKEN,
            rigin_condition: `[["","mac","headInclude","${mac_head}","","or"]]`,
            custom_filter: `{"or":[{"headInclude":[{"var":"mac"},"${mac_head}"]}]}`,
            isApply: '1'
        }
        $.post(url, post_form, function (ret) {
            if (ret.result == 0)
                $.get(`${API_SERVER}/security/index/list?gid=${gid}&limit=${limit}&custom_filter_id=-1&t=${Math.random()}`,
                    {},
                    function (result) { resolve(result.data.list) })
        }, 'json')
    })
}

async function get_term_list_by_query_mobile(gid, limit, mobile) {
    return new Promise(resolve => {
        let url = `${API_SERVER}/security/index/savefilter`
        let post_form = {
            YII_CSRF_TOKEN: CSRF_TOKEN,
            rigin_condition: `[["","mobile","exclude","${mobile}","","or"]]`,
            custom_filter: `{"or":[{"exclude":[{"var":"mobile"},"${mobile}"]}]}`,
            isApply: '1'
        }
        $.post(url, post_form, function (ret) {
            if (ret.result == 0)
                $.get(`${API_SERVER}/security/index/list?gid=${gid}&limit=${limit}&custom_filter_id=-1&t=${Math.random()}`,
                    {},
                    function (result) { resolve(result.data.list) })
        }, 'json')
    })
}

let script = document.createElement('script');
script.src = chrome.runtime.getURL("./js/helper.js");
(document.head || document.documentElement).appendChild(script);

window.addEventListener("message", msg => {
    if (msg.data.type && msg.data.type == "init_data") {
        chrome.runtime.sendMessage({SYS_CONF: msg.data.SYS_CONF})
    }
})