import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

export const createTask = async (service, route, params, method = 'POST') => {
    const response = await axios.post(`${API_BASE_URL}/create-task`, {
        service,
        route,
        params,
        method: method.toUpperCase(),
    });
    return response.data;
};

export const getTaskStatus = async (taskId) => {
    const response = await axios.get(`${API_BASE_URL}/tasks/${taskId}`);
    return response.data;
};

export const pollTask = async (taskId, interval = 1000, maxRetries = 30) => {
    let retries = 0;
    while (retries < maxRetries) {
        const data = await getTaskStatus(taskId);
        if (data.status === 'success' || data.status === 'failed') {
            return data;
        }
        await new Promise(resolve => setTimeout(resolve, interval));
        retries++;
    }
    throw new Error('Task polling timed out');
};
