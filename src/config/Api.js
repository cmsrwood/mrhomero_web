import axios from "axios";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4400";

const API = axios.create({
    baseURL: BACKEND_URL,
    timeout: 10000,
});

API.interceptors.request.use(async (config) => {
    try {
        const token = await localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    } catch (error) {
        return null;
    }

});

export default API;