/**
 * Created by zxf on 2017/9/6.
 * 封装统一的ajax请求，统一拦截请求，对不同的请求状态封装
 * 通常说, ajax 请求错误有两种, 一种是网络问题或者代码问题所造成的 400, 500错误等,需要checkStatus方法拦截
 * 另外一种是请求参数后端通不过验证, 由后端抛出的错误，需要checkCode拦截处理
 *第二种根据不同的后端框架或者程序猿又可以分成两种, 一种是直接返回 json, 用一个 特别的 code 来区别正常请求返回的数据, 如:
 */
const axios = require('axios')
const qs = require('qs')
var baseUrl=process.env.NODE_ENV=='develop'?'localhost:3000':'localhost:3000';

/**
 * axios请求拦截器
 * @param {object} config axios请求配置对象
 * @return {object} 请求成功或失败时返回的配置对象或者promise error对象
 **/
axios.interceptors.request.use(config => {
    return config
}, error => {
    return Promise.reject(error)
})

/**
 * axios 响应拦截器
 * @param {object} response 从服务端响应的数据对象或者error对象
 * @return {object} 响应成功或失败时返回的响应对象或者promise error对象
 **/
axios.interceptors.response.use(response => {
    return checkStatus(response)
}, error => {
    return Promise.resolve(error)
})

/**
 * 请求发出后检查返回的状态码,统一捕获正确和错误的状态码，正确就直接返回response,错误就自定义一个返回对象
 * @param {object} response 响应对象
 * @return {object} 响应正常就返回响应数据否则返回错误信息
 **/
function checkStatus (response) {
    // 如果状态码正常就直接返回数据,这里的状态码是htttp响应状态码有400，500等，不是后端自定义的状态码
    if (response && ((response.status === 200 || response.status === 304 || response.status === 400))) {
        return response.data // 直接返回http response响应的data,此data会后端返回的数据数据对象，包含后端自定义的code,message,data属性
    }
    return { // 自定义网络异常对象
        code: '404',
        message: '网络异常'
    }
}

/**
 * 检查完状态码后需要检查后如果成功了就需要检查后端的状态码处理网络正常时后台语言返回的响应
 * @param {object} res 是后台返回的对象或者自定义的网络异常对象，不是http 响应对象
 * @return {object} 返回后台传过来的数据对象，包含code,message,data等属性，
 **/
module.exports= {
    post (url, data) {
        return axios({
            method: 'post',
            baseURL: baseUrl,
            url: url,
            data: qs.stringify(data),
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            timeout: 10000
        })
    },
    get (url, params) {
        return axios({
            method: 'get',
            baseURL: baseUrl,
            url,
            params,
            timeout: 10000,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
    }
}
