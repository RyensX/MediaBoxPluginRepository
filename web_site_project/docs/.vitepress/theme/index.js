import DefaultTheme from 'vitepress/theme'
import PluginList from './components/PluginList.vue'

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.component('PluginList', PluginList)
    }
}