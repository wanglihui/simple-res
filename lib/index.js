/**
 * Created by YCXJ-wanglihui on 2014/12/1.
 */
'use strict';

/**
 * 中间件
 * @param req
 * @param res
 * @param next
 */
function middleware(req, res, next) {
  res.simpleResponse = simpleResponse;
  next();
}

/**
 * 根据req.xhr调用合适的response
 *
 * @param ret   回复码，如果为0表示成功，调用successDone进行处理， 其他表示失败，调用failDone处理
 * @param successDone 如果是字符串，将作跳转，如果是函数直接调用，并把req,res作为参数传递
 * @param failDone 如果是字符串，将作为调转路径，如果是函数直接调用，并把req,res作为参数传递
 * @param options 可选项 errMsg 或者其他附加信息，如要返回paginate, options.paginate = paginate
 * @param req 请求对象
 */
function simpleResponse(ret, successDone, failDone, options, req) {
  var obj = this,
    errMsg = "",
    backUrl = req.headers["referer"];
  if (!successDone) {
    successDone = backUrl;
  }
  if (!failDone) {
    failDone = backUrl;
  }
  if (!options) {
    options = {};
  }
  errMsg = options.errMsg;
  //ajax请求
  if (req.xhr) {
    var redirectUrl = '';
    if (ret === 0 && typeof successDone === 'string') {
      redirectUrl = successDone;
    } else if (ret !== 0 && typeof failDone === 'string') {
      redirectUrl = failDone;
    }
    var keys = Object.keys(options);
    var result  = {};
    result.ret = ret;
    result.code = ret;
    result.errMsg = errMsg;
    result.redirectUrl = redirectUrl;
    for(var i= 0, ii=keys.length; i< ii; i++) {
      result[keys[i]] = options[keys[i]];
    }
    obj.json(result);
    //普通请求
  } else {
    //成功
    if (ret === 0) {
      if (typeof successDone === 'function') {
        res.locals.sucess = errMsg;
        successDone(req, obj);
      } else {
        req.session.crossPageSuccess = errMsg;
        obj.redirect(successDone);
      }
    } else {
      if (typeof failDone === 'function') {
        res.locals.error = errMsg;
        failDone(req, obj);
      } else {
        req.session.crossPageError = errMsg;
        obj.redirect(failDone);
      }
    }
  }
}

module.exports = middleware;