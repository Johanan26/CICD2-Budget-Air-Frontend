import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Plane, User, LayoutDashboard, LogOut, ShoppingBag, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Plane className="h-8 w-8 text-blue-600 mr-2" />
                            <span className="text-xl font-bold tracking-tight">BudgetAir</span>
                        </div>
                        <nav className="flex space-x-8 items-center">
                            <Link to="/dashboard" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                                <LayoutDashboard className="h-4 w-4 mr-1" /> Dashboard
                            </Link>
                            <Link to="/flights" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                                <Plane className="h-4 w-4 mr-1" /> Flights
                            </Link>
                            {user ? (
                                <>
                                    <span className="text-sm text-gray-600">
                                        Welcome, {user.username}!
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                                    >
                                        <LogOut className="h-4 w-4 mr-1" /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                                        <User className="h-4 w-4 mr-1" /> Login
                                    </Link>
                                    <Link to="/register" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                                        <User className="h-4 w-4 mr-1" /> Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
