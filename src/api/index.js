import axios_instance from "../utils/request"
import path from "../api/path"

const api = {
    // bing每日一图
    getBackground(){
        let url = "http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1";
        let data = axios_instance.get(url);
        return data.images[0].url;
    },
}

export default api;