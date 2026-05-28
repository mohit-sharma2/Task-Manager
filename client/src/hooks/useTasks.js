import { useState, useCallback } from 'react';
import api from '../api/axios';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/tasks', { params });
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    const { data } = await api.post('/tasks', taskData);
    return data.task;
  }, []);

  const updateTask = useCallback(async (id, taskData) => {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    return data.task;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await api.delete(`/tasks/${id}`);
  }, []);

  return { tasks, pagination, loading, error, fetchTasks, createTask, updateTask, deleteTask };
}
