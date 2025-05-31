import axios from "axios";

const api = axios.create({
    // baseURL: "http://3.27.199.170:8080/api/",
    baseURL: "https://uniportal.site/api/api/",
});

export default api;
