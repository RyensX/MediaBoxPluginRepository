### 媒体盒子([MediaBox](https://github.com/RyensX/MediaBox))官方插件仓库

[官方网站](https://ryensx.github.io/MediaBoxPluginRepository/)

#### 👏如何提交插件？

1. 拉取[插件API](https://github.com/RyensX/MediaBoxPlugin)编写插件
2. 上传源码到Github（官方插件仓库里的插件都必须开源）并发布一个包含插件包的release
3. fork本仓库并在[plugin_release_list.json](https://github.com/RyensX/MediaBoxPluginRepository/blob/main/plugin_release_list.json)填写插件信息
   注意，提交版本的commit.messages请使用"[plugin_submit]插件名称"，否则不会审核通过
4. 对本仓库发起PR，等待审核。

成功合并后CI会自动解析提交版本插件的信息并生成数据，此后可在官方网站和APP上查看到。

生成的插件信息对应关系如下

| version                     | packageName             | iconBase64          | sourcePath           | name          | apiVersion  | repoDesc                  | repoUr l              |
| ----------------------------- | ------------------------- | --------------------- | ---------------------- | --------------- | ------------- | --------------------------- | ----------------------- |
| AndroidManifest.versionName | AndroidManifest.package | 插件apk图标的base64 | releaseAsset下载地址 | 插件apk应用名 | 插件API版本 | 插件对应仓库的Description | 目前是版本release链接 |

#### 🚀如何提交新版本？

与上述操作一致，修改[plugin_release_list.json](https://github.com/RyensX/MediaBoxPluginRepository/blob/main/plugin_release_list.json)中对应的release链接成新版本链接即可。

注意，提交新版本的commit.messages请使用"[plugin_update]插件名称"，否则不会审核通过

#### 🧩仓库改进贡献

请遵循本项目的commit风格（commit.messages类型使用Angular Git Commit）

#### 许可证

[**GNU General Public License v3.0**](LICENSE)

