import axios from 'axios';

const API_BASE_URL = 'http://task:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

export const createTask = async (service, route, params, method = 'POST') => {
  const response = await client.post('/create-task', {
    service,
    route,
    params,
    method: method.toUpperCase(),
  });
  return response.data;
};

export const getTaskStatus = async (taskId) => {
  const response = await client.get(`/tasks/${taskId}`);
  return response.data;
};

export const pollTask = async (taskId, interval = 1000, maxRetries = 30) => {
  let retries = 0;

  while (retries < maxRetries) {
    const data = await getTaskStatus(taskId);

    if (data && (data.status === 'success' || data.status === 'failed')) {
      return data;
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
    retries++;
  }

  throw new Error('Task polling timed out');
};
