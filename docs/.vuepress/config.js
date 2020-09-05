module.exports = {
  base: '/vue3-analysis/',
  title: 'vue3 源码答疑',
  description: '对答式 博客',
  dest: 'dist',
  markdown: {
    lineNumbers: true
  },
  head: [
    ['link', {
      rel: 'icon',
      href: `/logo.png`
    }],
  ],
  themeConfig: {
    docsDir: 'docs',
    repo: 'chenronghui/vue3-analysis',
    nav: [{
      text: '指南',
      link: '/v3/prepare/'
    }, ],
    sidebar: {
      '/v3/': [
        {
          title: 'vue3 初始化',
          collapsable: false,
          children: [
            ['prepare/', '从第一个入口文件开始'],
            'prepare/app',
            'prepare/createAppAPI',
            'prepare/createVNode',
          ]
        }, 
      ]
    }
  }
}