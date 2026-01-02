import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTask } from '../useTask';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const { executeTask, loading, error } = useTask();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await executeTask('user', 'api/users/login', formData);
            if (result) {
                login(result);
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 border border-gray-200 shadow-sm rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="w-full p-2 border border-gray-300 rounded"
                    onChange={handleChange}
                    value={formData.username}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full p-2 border border-gray-300 rounded"
                    onChange={handleChange}
                    value={formData.password}
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">{error}</div>}
            
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

