import axios, { AxiosInstance } from 'axios';

const clienteAxios : AxiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers:{
        'Accept': 'application/json',
        'x-Requested-With': 'XMLHttpRequest',
    },
})

export default clienteAxios;