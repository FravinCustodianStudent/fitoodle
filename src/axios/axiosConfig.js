
import axios from 'axios';

const customAxios = axios.create({
    baseURL: 'http://localhost:8010',
    headers: {
        'Content-Type': 'application/json',
        // Add any other default headers you need
    },
});

// You can add interceptors or any other configurations here if needed

export default customAxios;