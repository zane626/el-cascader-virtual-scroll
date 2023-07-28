# el-cascader-virtual-scroll

> 基于element@2.15.13封装的cascader组件,增加虚拟滚动功能,优化级联数据量过大dom节点太多导致页面卡顿.


## Installation
``` bash
yarn add el-cascader-virtual-scroll
```
## Examples
``` bash
<template>
  <div class="demo0">
    <ElCascaderVirtualScroll
      :options="options"
      clearable
      :props="{
        height: 300,
        rowHeight: 50
      }"
    ></ElCascaderVirtualScroll>
  </div>
</template>
```

## Build Setup

``` bash
# 安装依赖
yarn run bootstrap

# serve with hot reload at localhost:9009 启动本地开发调试环境
yarn dev

# build for dev with minification 压缩打包发布生产环境代码
yarn build
```
