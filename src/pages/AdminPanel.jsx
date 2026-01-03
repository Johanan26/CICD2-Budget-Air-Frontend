import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Users, Plane, Building2, AlertCircle } from 'lucide-react';
import AdminUsers from '../components/admin/AdminUsers';
import AdminFlights from '../components/admin/AdminFlights';
import AdminCompanies from '../components/admin/AdminCompanies';

const AdminPanel = () => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('users');

    if (!user) {
        navigate('/login');
        return null;
    }

    if (!isAdmin()) {
        navigate('/dashboard');
        return null;
    }

    const menuItems = [
        { id: 'users', label: 'Users', icon: Users },
        { id: 'companies', label: 'Companies', icon: Building2 },
        { id: 'flights', label: 'Flights', icon: Plane },
    ];

    return (
        <div className="flex min-h-[600px] bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
                            <p className="text-xs text-gray-500">Management</p>
                        </div>
                    </div>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <Shield className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {activeSection === 'users' && <AdminUsers />}
                    {activeSection === 'companies' && <AdminCompanies />}
                    {activeSection === 'flights' && <AdminFlights />}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
