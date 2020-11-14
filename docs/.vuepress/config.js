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
    nav: [
      {
      text: 'vue3指南',
      link: '/v3/prepare/'
    },
    {
      text: 'vue3 API',
      link: '/v3Api/API/'
    },{
      text: '随记',
      link: '/mind/canvas/'
    },
   ],
    sidebar: {
      '/v3/': [
        // {
        //   title: 'vue3 流程图',
        //   collapsable: false,
        //   children: [
        //     'prepare/flow',
        //   ]
        // }, 
       
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
      ] ,
      '/mind/': [
        {
          title: 'canvas',
          collapsable: false,
          children: [
            ['canvas/', 'canvas 实现文字流光效果'],
          ]
        }, 
        {
          title: 'touch',
          collapsable: false,
          children: [
            ['toucharmer/', 'vue 手势指令'],
            ['toucharmer/flipBook', 'vue 翻书组件'],
          ]
        }, 
        {
          title: '绘本阅读',
          collapsable: false,
          children: [
            'pictureBook/', 
          ]
        }, 
        {
          title: '浏览器渲染',
          collapsable: false,
          children: [
            'pain/', 
            'pain/event_passive.md', 
          ]
        }, 
        {
          title: 'vue2 优化插件',
          collapsable: false,
          children: [
            'vueConfig/', 
          ]
        }, 
        {
          title: 'css',
          collapsable: false,
          children: [
            'css/', 
            'css/standard.md',
            'css/linkDiffImport.md',
            'css/zIndex.md',
            'css/browserRender.md',
          ]
        }, 
        {
          title: 'js',
          collapsable: false,
          children: [
            'js/', 
            'js/class.md',
            'js/hoisting.md',
            'js/langDiff.md',
            'js/heapDiffStack.md',
            'js/staticScopeDiffdynamicScope.md',
            'js/eventLoop.md',
            'js/browserCache.md',
            'js/evalDiffFunction.md',
          ]
        }, 
        {
          title: 'vue3',
          collapsable: false,
          children: [
            'vue3/', 
            'vue3/keepAlive.md', 
            'vue3/response.md',
          ]
        }, 
      ],
      '/v3Api/':[
        {
          title: 'vue3 API',
          collapsable: false,
          children: [
            'API/',
          ]
        }, 
      ]
    }
  }
}