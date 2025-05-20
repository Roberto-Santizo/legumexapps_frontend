import axios, { AxiosInstance } from 'axios';

const clienteAxios : AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers:{
        'Accept': 'application/json',
        'x-Requested-With': 'XMLHttpRequest',
        "Content-Type": 'apllication/json',
        "Authorization": `Bearer ${localStorage.getItem('AUTH_TOKEN')}`
    },
    withCredentials: true,
})

export default clienteAxios;

