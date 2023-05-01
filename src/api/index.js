import axios_instance from "../utils/request"
import path from "../api/path"
import axios from "axios"
import qs from 'qs'



const jsonPostConfig = {
    headers: {
    'Content-Type': 'application/json'
    }
};


const api = {
    // bing每日一图
    getBackground(){
        let url = "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1";
        let data = axios_instance.get(url);
        return data.images[0].url;
    },
    async getTextMsgResponse(data){
        let result = await axios({
            method: 'post',
            url: path.baseUrl+path.mgptTextMsg,
            data: data,
            headers: {
              'Content-Type': 'application/json',
            },
        });
        return result.data
    },
    async getAudioMsgResponse(data){
        // let result = await axios_instance.post(
        //     path.baseUrl+path.mgptAudioMsg,
        //     data,
        // );
        let result = await axios_instance({
            method: 'post',
            url: path.baseUrl+path.mgptAudioMsg,
            data: data,
            responseType: 'blob',
        });
        return result.data 
    },
    async AudioToTextResponse(data){
        let result = await axios({
            method: 'post',
            url: path.baseUrl+path.audioToText,
            data: data,
            headers: {
              'Content-Type': 'multipart/form-data', // 关键
            },
        });
        return result.data
    }
}

export default api;