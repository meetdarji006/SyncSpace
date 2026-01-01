import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5001/api"
})

api.interceptors.request.use(async (config) => {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
});

export default api;
