export default {
    base: '/MediaBoxPluginRepository/',
    title: '媒体盒子',
    lang: 'zh-CN',
    description: '插件化网罗天下媒体',
    lastUpdated: true,

    head: [
        ['link', { rel: 'icon', href: '/MediaBoxPluginRepository/logo.png' }],
        ['script', { src: 'https://www.googletagmanager.com/gtag/js?id=G-47730WPJWW' }],
        ['script', , `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-47730WPJWW');
        `]
    ],

    themeConfig: {
        logo: '/logo.png',
        outlineTitle: '大纲',
        //这里的更新时间是git最后更新时间而不是文档时间，有点问题
        lastUpdatedText: "最后更新时间",
        nav: nav(),
        socialLinks: [
            { icon: 'github', link: 'https://github.com/RyensX/MediaBoxPluginRepository' },
            {
                icon: {
                    //https://github.com/vuejs/vitepress/issues/1053
                    svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Telegram</title><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>'
                },
                link: 'https://t.me/MediaBoxGithub'
            }
        ],
        algolia: {
            //TODO
            indexName: 'mediabox',
            appId: '',
            apiKey: '',
        },
        footer: {
            message: 'Released under the GPL-3.0 License.',
            copyright: 'Copyright © 2022 Ryens'
        }
    }
}

function nav() {
    return [
        { text: "下载", link: '/download' },
        { text: '插件仓库', link: '/plugin-repo/plugin-browser' },
        { text: '贡献插件', link: 'https://github.com/RyensX/MediaBoxPluginRepository' },
        { text: '插件开发指南', link: 'https://github.com/RyensX/MediaBox/wiki' },
    ]
}