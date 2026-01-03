import { useState, useCallback } from 'react';
import { createTask, pollTask } from './api';

export const useTask = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const executeTask = useCallback(async (service, route, params, method = 'POST') => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const taskId = await createTask(service, route, params, method);
            const finalStatus = await pollTask(taskId);
            if (finalStatus.status === 'success') {
                setResult(finalStatus.result);
                return finalStatus.result;
            } else if (finalStatus.status === 'failed') {
                let errorMessage = 'Task failed';
                if (finalStatus.result) {
                    if (typeof finalStatus.result === 'string') {
                        errorMessage = finalStatus.result;
                    } else if (finalStatus.result.detail) {
                        if (Array.isArray(finalStatus.result.detail)) {
                            const errors = finalStatus.result.detail.map(err => 
                                `${err.loc?.join('.') || 'field'}: ${err.msg}`
                            ).join(', ');
                            errorMessage = errors;
                        } else {
                            errorMessage = finalStatus.result.detail;
                        }
                    } else if (finalStatus.result.message) {
                        errorMessage = finalStatus.result.message;
                    }
                }
                setError(errorMessage);
                throw new Error(errorMessage);
            } else {
                throw new Error('Task failed');
            }
        } catch (err) {
            const errorMsg = err.message || 'An error occurred';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { executeTask, loading, error, result };
};
