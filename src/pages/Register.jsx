import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTask } from '../useTask';
 
const Register = () => {
    const { executeTask, loading, error, result } = useTask();
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        email: '',
        age: 18,
        number: ''
    });
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;
       
        if (name === 'age') {
            const ageValue = parseInt(value) || 18;
            processedValue = ageValue;
        } else if (name === 'number') {
            processedValue = value.replace(/\D/g, '').slice(0, 10);
        }
       
        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
       
        if (formData.number.length !== 10) {
            alert('Phone number must be exactly 10 digits');
            return;
        }
       
        const submitData = {
            ...formData,
            age: parseInt(formData.age) || 18
        };
       
        try {
            await executeTask('user', 'api/users', submitData, 'POST');
        } catch (err) {
            console.error(err);
        }
    };
 
    return (
        <div className="max-w-md mx-auto bg-white p-8 border border-gray-200 shadow-sm rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Create Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        value={formData.firstname}
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="lastname"
                        placeholder="Last Name"
                        value={formData.lastname}
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={handleChange}
                        required
                    />
                </div>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    className="w-full p-2 border border-gray-300 rounded"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password (5-12 characters)"
                    value={formData.password}
                    className="w-full p-2 border border-gray-300 rounded"
                    onChange={handleChange}
                    required
                    minLength="5"
                    maxLength="12"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    className="w-full p-2 border border-gray-300 rounded"
                    onChange={handleChange}
                    required
                />
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        min="0"
                        max="150"
                        value={formData.age}
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="tel"
                        name="number"
                        placeholder="Phone (10 digits)"
                        value={formData.number}
                        maxLength="10"
                        pattern="[0-9]{10}"
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={handleChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                >
                    {loading ? 'Processing...' : 'Register'}
                </button>
            </form>
 
            {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">{error}</div>}
            {result && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded border border-green-200">User created successfully!</div>}
           
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};
 
export default Register;
 