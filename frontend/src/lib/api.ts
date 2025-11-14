// Set base URL for axios
import axios from "axios";
import Router from "next/router";
import * as process from "process";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 9000,
});

// 🔹 Request interceptor → attach token if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// 🔹 Response interceptor → handle errors globally
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;

        // 🧩 Retry once if rate-limited (429)
        if (status === 429 && !error.config._retry) {
            console.warn("Rate limit hit. Retrying after 3 seconds...");
            error.config._retry = true;
            await new Promise((r) => setTimeout(r, 3000));
            return api.request(error.config);
        }

        // 🧩 Handle expired auth (401)
        if (status === 401) {
            localStorage.removeItem("token");
            Router.push("/login");
        }

        return Promise.reject(error);
    }
);

export default api;
