## 目录结构描述

├── .vscode                    // git 规范、vue 规范、js 规范
├──  public
│   └── index.html                 // CDN、打包输出口
├── src
│   ├── assets                     // 静态资源
│   ├── components             // 全局组件文件夹：除了几个必要组件全局挂载，其它按需引入
│   │   ├── Page.vue               // 页面外框，包含边距，页面标题
│   │   ├── PageDrag.vue           // 可以左右分屏，滑动分配左右内容宽度
│   │   ├── PageEmpty.vue          // 空页面展示
│   │   ├── PageSearch.vue         // 列表页面，table 上面筛选条件
│   │   ├── PageHandle.vue         // 详情页面，返回上一页，保存等操作 footer
│   │   └── PageTable.vue          // elementUI-table 封装，常用功能配置可在 Example.vue 中查看
│   ├── layout                 // 全局样式，导航条、侧边栏、换肤等操作
│   ├── mixins                 // 全局 mixin
│   ├── plugins                // 所有外部引入插件，组件等配置统一入口
│   ├── request                    // 请求相关
│   │   ├── api.js                     // 暴露请求接口名字
│   │   ├── index.js                   // 对 axios.js 封装，请求拦截
│   │   └── urls                       // 所有请求接口对应地址，为判断权限做准备
│   ├── styles                    //  所有全局样式，相关内容
│   │   ├── atom.scss                  // 短 css 样式：下边框，字体大小等
│   │   ├── colors.scss                // 颜色相关文件：主题色，成功失败等
│   │   ├── config.scss                // 配置样式：导航条高度，菜单栏宽度等
│   │   ├── element-ui.scss        // 样式自定义，替换组件原有样式
│   │   └── transition.scss            // 过度动画
│   ├── utils                     //   代码工具
│   │   ├── auth.js                    // 权限验证
│   │   ├── bus.js                     // 兄弟传值专用
│   │   ├── enum.js                    // 全局枚举值，跟后端接口需求对应
│   │   ├── login.js                   // 登录相关内容
│   │   └── validate.js                // 验证相关
│   ├── config.js                  // 全局项目工程配置
│   └── directives.js              // vue 全局指令