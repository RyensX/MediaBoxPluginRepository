import DefaultTheme from 'vitepress/theme'
import PluginList from './components/PluginList.vue'
import DownloadInfo from './components/DownloadInfo.vue'

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.component('PluginList', PluginList)
        app.component('DownloadInfo', DownloadInfo)
    }
}