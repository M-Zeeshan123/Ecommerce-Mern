import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";

const getToken = () => {
    try {
        const persistRoot = localStorage.getItem("persist:root");
        if (persistRoot) {
            const { user } = JSON.parse(persistRoot);
            if (user) {
                const { currentUser } = JSON.parse(user);
                if (currentUser) {
                    return currentUser.accessToken;
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Error getting token:", error);
        return null;
    }
};

export const publicRequest = axios.create({
    baseURL: BASE_URL,
});

export const userRequest = axios.create({
    baseURL: BASE_URL,
});

// Add an interceptor to dynamically add the token to requests
userRequest.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.token = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

