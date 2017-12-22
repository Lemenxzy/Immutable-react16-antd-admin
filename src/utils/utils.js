import {hex_sha1} from './sha1'
import * as apiConfig from './apiConfig'
import { browserHistory } from 'react-router'
//判断图片是否加载完成，
// 图片的地址数组：mulitImg:[],
// 图片加载完成回调：callback:function(){}
export const loadingImg = (mulitImg,callback)=>{

    let promiseAll = [], img = [], imgTotal = mulitImg.length;
    for(let i = 0 ; i < imgTotal ; i++){
        promiseAll[i] = new Promise((resolve)=>{
            img[i] = new Image();
            img[i].src = mulitImg[i];
            img[i].onload = function(){
                //第i张加载完成
                resolve(img[i])
            }
        })
    }
    Promise.all(promiseAll).then(()=>{
        callback()
    });
};


export const NotSigAsyncPost=(name,body,successCallback,failCallback)=>{
    if (typeof(body) == "string" && body != null) {

    } else {
        body = JSON.stringify(body);
    }
    let url = apiConfig.HOST+ name;

    //设置公用请求头
    let headers = new Headers();
    headers.set('Content-Type', 'application/json');


    let requestbody;
    //设置空body的请求及有参数的请求
    if (body === "{}"){
        requestbody = {
            headers,
            method: "post",
        }
    }else{
        let formData = new URLSearchParams();//带token的api
        let bodyjson = JSON.parse(body);
        for (var Key in bodyjson){
            formData.append(Key,bodyjson[Key]);
        }

        headers.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        requestbody = {
            method: "post",
            headers,
            body:formData
         }
    };
    let request = new Request(url, requestbody);

    return fetch(request).then(response => {
        if (response.ok) {
            response.json().then(json => {
                if (json.code == 1 && successCallback){
                    successCallback(json.result)
                }else {
                    if (failCallback){
                        failCallback(json)
                    }
                }
            })
        } else {
            if (failCallback)
                failCallback()
        }
    })
        .catch(error =>{
                console.log('请求失败');
                if (failCallback)
                    failCallback()
            }
        )

};


/*
* 代签名的请求post请求
*
* url:请求路径，必传
* body:请求body，必传，空传 空对象 {}
*successCallback:成功回调函数
* failCallback：失败回调函数 可不传
* */
export const AsyncPost=(name,body,successCallback,failCallback)=>{
    if(process.env.NODE_ENV === 'production'){
        if (typeof(body) != "string" && body != null) {
            body = JSON.stringify(body);
        }
        let url = apiConfig.HOST+ name;

        //设置公用请求头
        let headers = new Headers();
        headers.set('Content-Type', 'application/json');

        //设置登录和cookie不存在的时候跳转
        if (fGetCookieMes(apiConfig.TOKEN)){
            headers.append('sig',fGetSig(name,body));
            headers.append('Authorization',fGetCookieMes(apiConfig.TOKEN));
        }else{
            if (window.location.href.indexOf("login")<0){
                browserHistory.replace('/login');
                return false;
            }
        }

        let requestbody;
        //设置空body的请求及有参数的请求
        if (body === "{}"){
            requestbody = {
                headers,
                method: "post",
            }
        }else{
            if (!fGetCookieMes(apiConfig.TOKEN)){//登录的请求
                requestbody = {
                    method: "post",
                    headers,
                    body
                }
            }else{
                let formData = new URLSearchParams();//带token的api
                let bodyjson = JSON.parse(body);
                for (var Key in bodyjson){
                    if (typeof bodyjson[Key] === 'string'){
                        //去除空格
                        bodyjson[Key] = bodyjson[Key].trim()
                    }
                    formData.append(Key,bodyjson[Key]);
                }

                headers.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                requestbody = {
                    method: "post",
                    headers,
                    body:formData
                }
            }

        }
        let request = new Request(url, requestbody);

        return fetch(request).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    if (json.code == 1 && successCallback){
                        successCallback(json.result)
                    }else {
                        if (failCallback){
                            failCallback(json)
                        }
                    }
                })
            } else {
                if (failCallback)
                    failCallback()
            }
        }).catch(error =>{
                console.log('请求失败');
                if (failCallback)
                    failCallback()
            }
        )
    }else{
        fetch(name).then(function(response) {
            return response.json().then((data)=>{
                successCallback(data)
            });
        });
    }
};


//获取签名
export const fGetSig = (name , body) => {
    let sig = '';
    body = body.substring(1,body.length-1);
    let sigStr = '';
    if (body.trim() === ''){
        sigStr = name;
    }else{
        let jbody = "{"+body+"}";
        jbody = JSON.parse(jbody);
        let str = '';
        let strarr = [];
        for (let key in jbody) {
            str='"'+key+'"'+':'+'"'+jbody[key]+'"';
            strarr.push(str);
        }

        let key_values = strarr;
        let keys = [];
        let map = {};
        for (let i = 0; i < key_values.length; i++) {
            let k_p = key_values[i].split(':');
            keys[i] = k_p[0];
            map[k_p[0]] = k_p[1];
        }
        keys.sort();

        for (let i = 0; i < keys.length; i++) {
            sigStr = sigStr + keys[i].substring(1,keys[i].length-1) + '=' + map[keys[i]].substring(1,map[keys[i]].length-1) + "&";
        }
        sigStr = sigStr.substring(0,sigStr.length-1);
        sigStr =  sigStr + name;
    }
    sig = hex_sha1(fUtf16to8(sigStr + fGetCookieMes(apiConfig.TOKEN)));

    return sig;

};

//读取cookie
export const fGetCookieMes = (key) => {
    let strCookie = document.cookie;
    strCookie = strCookie.replace(/\s/g, "");
    let arrCookie = strCookie.split(';');
    for (let i = 0; i < arrCookie.length; i++) {
        let arr = arrCookie[i].split("=");
        if (key == arr[0] && arr[1] != '') {
            return arr[1];
        }
    }

    return ""
};

//写入cookie
export const fExportSetCookieMes = (key, val) => {

    var date = new Date();
    //将cookie设置一小时过期
    date.setTime(date.getTime() +  60 * 60 * 1000);
    document.cookie = key + "=" + val + ";expires=" + date.toGMTString()+';path=/;';
};

//删除cookie
export const delCookie = (name)=> {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval= fGetCookieMes(name);
    if(cval!=null){
        document.cookie= name + "="+cval+";expires="+exp.toGMTString()+';path=/;';
    }
};


//16转8进制
const fUtf16to8 = (str) => {
    let out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
};



//时间戳转年月日
//formatStr:希望字符串类型，ctime时间戳

export const dataFormat = (formatStr, ctime) => {

    var now = new Date(parseInt(ctime));

    var dateformat = format(now, formatStr);

    return dateformat;
};


const format = (obj, fmt) => {
    var o = {
        "M+": obj.getMonth() + 1, //月份
        "d+": obj.getDate(), //日
        "h+": obj.getHours(), //小时
        "m+": obj.getMinutes(), //分
        "s+": obj.getSeconds(), //秒
        "q+": Math.floor((obj.getMonth() + 3) / 3), //季度
        "S": obj.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (obj.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

//字符串转dom
export const parseDom = (str)=>{

    var objE = document.createElement("div");

    objE.innerHTML = str;

    return objE;

};
//dom转字符串
export const DomToStirng=(htmlDOM)=>{
    if( document.outerHTML ){
        return htmlDOM.outerHTML;
    } else {
        let div= document.createElement("div");
        if (htmlDOM instanceof HTMLCollection){
            if (htmlDOM.length>0){
                for (let i = 0; i<htmlDOM.length; i++){
                    div.appendChild(htmlDOM[i]);
                }
            }
        }else if(htmlDOM instanceof HTMLHeadingElement){
            div.appendChild(htmlDOM);
        }


        return div.innerHTML
    }
};

