import axios from "axios";
import querystring from "querystring"


const errorHandle = (status, info) => {
    switch(status){
        case 400:
            console.log("400:语义有误");
            break;
        case 500:
            console.log("500:服务器遇到意外");
            break;
        default:
            console.log(info);
            break;
    }
}

const axios_instance = axios.create({
    // 公共配置
    timeout: 5000
})


// 拦截器
// 发送数据之前
axios_instance.interceptors.request.use(
    // 成功函数
    config =>{
        if(config.method === "post"){
            config.data = querystring.stringify(config.data)
        }
        // config: 包含网络请求的所有信息
        return config;
    },
    // 失败函数
    error =>{
        return Promise.reject(error)
    }
)


// 获取数据之前
axios_instance.interceptors.response.use(
    // 成功函数
    response =>{
        return response.status === 200 ? Promise.resolve(response) : Promise.reject(response);
    },
    // 失败函数
    error =>{
        const {response} = error;
        errorHandle(response.status, response.info);
    }
)


export default axios_instance;
