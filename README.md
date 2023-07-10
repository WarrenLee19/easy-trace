<div align="center">
  <h2>easy-tracing 埋点性能监控插件</h1>
  <p>一个基于 TypeScript 的跨平台插件，包括  路由采集， 行为埋点， 性能采集 ，异常采集， 请求采集 </p>
</div>

```
npm i easy-trace
pnpm i easy-trace
yarn add easy-trace

```

### Usage
```
    const tracker = require('easy-trace') 
    new tracker({
      requestUrl:'http://localhost:9000/tracker',
      historyTracker:true,
      domTracker:true,
      jsError:true
    })
```

### 目前功能
+ 自动埋点上报和暴露api给用户手动埋点上报
+ 埋点上报功能：【用户事件采集、页面路由跳转采集、请求采集、错误采集】
+ 埋点上报上传方法：只提供 sendBeacon
