import axios from 'axios';

const API_BASE_URL = '/api';

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

const normalizeTaskId = (data) => {
  if (!data) return null;
  if (typeof data === 'string') return data;
  if (typeof data === 'object' && data.task_id) return data.task_id;
  if (typeof data === 'object' && data.id) return data.id;
  return null;
};

export const createTask = async (service, route, params, method = 'POST') => {
  const response = await axios.post(`${API_BASE_URL}/create-task`, {
    service,
    route,
    params,
    method: method.toUpperCase(),
  });

  const taskId = normalizeTaskId(response.data);
  if (!taskId) throw new Error('Invalid create-task response');

  return { task_id: taskId };
};

export const getTaskStatus = async (taskId) => {
  const response = await axios.get(`${API_BASE_URL}/tasks/${taskId}`);
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
