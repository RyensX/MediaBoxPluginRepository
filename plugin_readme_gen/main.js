const fs = require("fs")

const readmeFileName = "README.md"
const github = "github.com/"
let pluginInfoList = []//[{name,auther,url}]

function addPluginInfo(name, auther, url) {
    if (name && auther && url)
        pluginInfoList.push({ name, auther, url })
}

function pluginScan() {
    let reslut = fs.readFileSync("../plugin_release_list.json","utf-8")

    if (reslut) {
        let json = reslut.toString()
        plugins = JSON.parse(json)["plugins"]
        plugins.forEach((plugin, index) => {
            let releaseUrl = plugin.release
            let info = releaseUrl.substring(releaseUrl.indexOf(github) + github.length).split("/")
            let user = info[0], repo = info[1]
            console.log(`名称：${repo} 作者：${user} release：${releaseUrl}\n`)
            addPluginInfo(repo, user, releaseUrl)
        })
    }

}

function docGen() {
    if (pluginInfoList.length == 0) {
        console.log("插件信息为空 停止构建说明")
        return
    }
    console.log("#开始构建插件README说明\n")
    let doc = `
# 媒体盒子插件列表
    
|序号|名称|作者|提交地址| 
| - | - | - | - |\n`
    pluginInfoList.forEach((it, index) => {
        doc += `| ${index + 1} | ${it["name"]} | ${it["auther"]} | [${it["url"]}](${it["url"]}) |\n`
    })

    fs.writeFileSync(`../pages/${readmeFileName}`, doc)
}

function main() {
    pluginScan()
    docGen()
}

main()