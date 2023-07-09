const allReleaseApi = "https://api.github.com/repos/{user}/{repo}/releases"
const repoApi = "https://api.github.com/repos/{user}/{repo}"
const github = "github.com/"
const publishDir = "../pages/data"
const tmpDir = "./tmp"
const dataManifestFile = "data_manifest.json"
const dataFileFormat = "data_{page}.json"
const dataPageSize = 2

let op = {
    headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36"
    }
}

let releaseMap = {}
let repoMap = {}

const fs = require("fs")
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
const format = require('string-format')
const AppInfoParser = require('app-info-parser')

fs.checkDir = (dirPath, callback) => {
    fs.access(dirPath, (err) => {
        if (err)
            fs.mkdir(dirPath, callback || (() => { }))
        else
            callback()
    })
}

let infos = []

console.log("#开始解析插件Release列表\n")

//读取release列表开始解析
//TODO 校验数据集文件去除不需要再次解析的插件
fs.readFile("../plugin_release_list.json", (err, data) => {
    if (err) {
        console.log("插件Release信息错误 解析结束")
    } else {
        let json = data.toString()
        //console.log(json)

        plugins = JSON.parse(json)["plugins"]
        let previewPluginInfo = []
        //console.log(plugins)
        plugins.forEach((plugin, index) => {

            let releaseUrl = plugin.release
            console.log(`${index + 1}.插件:${releaseUrl}`)
            let info = releaseUrl.substring(releaseUrl.indexOf(github) + github.length).split("/")
            let user = info[0], repo = info[1]
            let repoUrl = format(repoApi, { user: user, repo: repo })
            console.log(`作者：${user} 仓库：${repo}\n`)

            infos.push(
                //获取release信息
                getReleaseInfo(releaseUrl, user, repo)
                    //获取release assets信息
                    .then(releaseInfo => getReleaseAssetsInfo(releaseInfo.assets_url))
                    //获取apk信息
                    .then(releaseAssetsInfo => getApkInfo(releaseAssetsInfo.name, releaseAssetsInfo.browser_download_url))
                    //获取仓库信息
                    .then(previewPluginInfo => getRepoInfo(previewPluginInfo, repoUrl))
                    //添加额外信息
                    .then(previewPluginInfo => {
                        //添加链接，可选realase和repo链接
                        previewPluginInfo.repoUrl = releaseUrl
                        //添加作者
                        previewPluginInfo.author = user
                        return previewPluginInfo
                    })
            )
        })

        Promise.all(infos).then((datas) => {
            //console.log(datas)
            //console.log(`数据数量：${datas.length}`)
            storePreviewPluginInfo(datas)
        })
    }
});

/**
 * 持久化数据
 * @param {Array} infoArray 
 */
function storePreviewPluginInfo(infoArray) {
    let validData = infoArray.filter((v) => {
        return Object.keys(v).length != 0
    })
    console.log(`#总数据量：${infoArray.length} 有效数据量：${validData.length}`)
    console.log(validData)

    fs.checkDir(publishDir, () => {
        try {
            //分页存储
            for (let i = 0, page = 1; i < validData.length; i += dataPageSize, page++) {
                let pageData = validData.slice(i, i + dataPageSize)
                let pageDataFile = format(dataFileFormat, { page: page })
                fs.writeFileSync(`${publishDir}/${pageDataFile}`, JSON.stringify(pageData, null, 4), "utf8")
            }
            //兼容处理：完整存储
            fs.writeFileSync(`${publishDir}/data.json`, JSON.stringify(validData, null, 4), "utf8")
            //写入Manifest
            fs.writeFileSync(`${publishDir}/${dataManifestFile}`, JSON.stringify({ dataLength: validData.length }, null, 4), "utf8")
            console.log("#数据生成完毕")
        } catch (err) {
            console.log(`写入数据失败：${err}`)
        }
    })

}

function getReleaseInfo(releaseUrl, user, repo) {
    let url = format(allReleaseApi, { user: user, repo: repo })
    //console.log(`获取ReleaseInfo: ${url}\n`)

    return new Promise((resolve, reject) => {

        let info = releaseMap[repo]
        if (info) {
            resolve(info)
            return
        }

        fetch(url, op).then((resp) => resp.json()).then(data => {
            //console.log(data)
            for (k in data) {
                let release = data[k]
                //console.log(release)
                if (release.html_url == releaseUrl) {
                    //做缓存
                    releaseMap[repo] = release
                    resolve(release)
                    return
                }
            }
            console.log(data)
            console.log(`仓库:${releaseUrl} 获取失败`)
            resolve(null)
        })

    });

}

function getReleaseAssetsInfo(assetsUrl) {
    return new Promise((resolve, reject) => {

        fetch(assetsUrl, op).then((resp) => resp.json()).then(data => {
            data = data[0]
            //console.log("资源")
            //console.log(data)
            console.log(`成功获取资源: ${data.browser_download_url}`)
            resolve(data)
        })

    })
}

function getApkInfo(apkName, apkDownloadUrl) {
    let apkFile = `${tmpDir}/${apkName}.apk`//统一加上apk以支持任意后缀
    return new Promise((resolve, reject) => {
        //resolve({ sourcePath: apkDownloadUrl })
        //下载apk文件
        fetch(apkDownloadUrl, op).then(res => res.buffer()).then(data => {

            fs.checkDir(tmpDir, () => {
                fs.writeFile(apkFile, data, "binary", function (err) {
                    console.log(err || `apk下载完成：${apkFile}`);
                    resolve(apkFile)
                })
            })

        }, () => resolve(null));
    }).then((apk) => new Promise((resolve, reject) => {
        if (!apk) {
            console.log(`下载apk失败:${apkDownloadUrl}`)
            return {}
        }
        console.log(`解析apk信息:${apk}`)
        const parser = new AppInfoParser(apk)
        parser.parse().then(result => {
            result = Object.setPrototypeOf(result, new Object())
            //console.log(result)
            let previewPluginInfo = {}
            previewPluginInfo.version = result["versionName"]
            previewPluginInfo.packageName = result["package"]
            previewPluginInfo.iconBase64 = result["icon"]
            previewPluginInfo.sourcePath = apkDownloadUrl
            let application = Object.setPrototypeOf(result["application"], new Object())
            //console.log(application)
            previewPluginInfo.name = application["label"][0]
            let metaData = Object.setPrototypeOf(application["metaData"], new Object())
            //console.log(metaData)
            for (k in metaData) {
                let element = metaData[k]
                if (element["name"] == "media_plugin_api_version") {
                    previewPluginInfo.apiVersion = element["value"]
                    break
                }
            }
            //console.log(previewPluginInfo)
            resolve(previewPluginInfo)
        }).catch(err => {
            console.log('err ----> ', err)
        })
    }))
}

function getRepoInfo(previewPluginInfo, repoUrl) {
    return new Promise((resolve, reject) => {
        let info = repoMap[repoUrl]
        let addInfo = (data) => {
            if (!info) {
                repoMap[repoUrl] = data
            }
            //console.log(data)
            previewPluginInfo.repoDesc = data.description
            resolve(previewPluginInfo)
        }

        if (info) {
            addInfo(info)
        } else {
            fetch(repoUrl, op).then((resp) => resp.json()).then(addInfo)
        }
    })
}