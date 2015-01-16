# simple-res
---
    简化同时需要应付 ajax和http的请求, 例如删除一个记录，如果是http请求，返回用户删除成功信息，并跳转到一个页面，或者ajax请求，直接返回删除成功

###### 依赖模块
---
    1. simple-res依赖express和session

###### 安装
---
    npm install simple-res

###### 使用
---

```
    var app = require('express')();
    app.use(require('simple-res'));

    app.get('/delte/:id', function(req, res, next) {
       var ret = 0;
       var msg = '';
       //如果successDone是字符串，当ret =0,是将执行 res.redirect(successDone),并将msg放入到 req.session.crossPageSuccess,res.locals.success 中
       var successDone = function() {
        console.info("成功时执行");
       }
       //如果failDone是字符串，当ret !=0,是将执行 res.redirect(failDone)，并将msg放入到 req.session.crossPageError,res.locals.error 中
       var failDone = function() {
        console.info("失败时执行");
       }
       var otherMsg = 'wangdana';
        if (id === 1) {
            //删除成功
            res.simpleResponse(ret, successDone, failDone, {errMsg: msg, otherMsg: otherMsg), req);
        } else {
            ret = -1;
            msg = '删除失败';
            res.simpleResponse(ret, successDone, failDone, {errMsg: msg, otherMsg: otherMsg), req);
        }
    });
```

    ajax 请求返回格式 {"ret":0,"code":0,"errMsg":"操作成功","redirectUrl":"http://localhost:3000/line/self","otherMsg":1}
    http　请求将直接执行　successDone,或者failDone