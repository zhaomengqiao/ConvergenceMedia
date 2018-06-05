# 融媒体项目

本项目参考自[花裤衩](https://github.com/PanJiaChen/vue-element-admin)的开源项目

### 即拆即食文档(基于[docsify](https://docsify.js.org/#/zh-cn/))
> 在项目`docs`目录下,使用
```
docsify serve
```
会在本机`3000`端口打开文档，有需求可放在服务器上

-------
** 使用稳定优先，`vue2.5`以及`element-UI2.3.6` **

### 构建和发布
打包上线
```bash
npm run build:prod
```

### 目录
```bash
|- src/
    |- api/ ------------ 各页面请求接口（以一级菜单为一个文件，公共接口写在`commonApi.js`）
    |- assets/ ------------ 静态图片（文件夹名称以页面相关命名）
    |- components/ ------------ 常用组件相关封装
    |- directive/ ------------ vue常用指令封装
    |- filters/ ------------ vue常用过滤器封装
    |- icons/ ------------ 项目使用svg图标（均从iconfont下载）
    |- lang/ ------------ 目录语言文件配置
    |- router/ ------------ 项目路由配置
    |- store/ ------------ 项目vuex配置
    |- styles/ ------------ 公共样式
    |- utils/ ------------ 常用js方法
    |- views/ ------------ 视图层（新增页面在此，尽量按照目录去构建文件夹）
```

项目公共组件、样式、公共方法使用详见 **开箱即用文档**
业务逻辑 详见代码注释
