import axios from "axios";

const api = axios.create({
    baseURL: "https://uniportal-utehy.site/api/api/",
    // baseURL: "https://uniportal.site/api/api/",
});

export default api;
