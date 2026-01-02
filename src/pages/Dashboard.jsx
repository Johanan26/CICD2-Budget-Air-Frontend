import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, User, ShoppingBag, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    return (
        <div className="space-y-8">
            <div className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome to Budget Air</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    A distributed airline management system built with microservices.
                    Search flights, manage accounts, and process payments all from one place.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/flights" className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm hover:border-blue-500 transition-colors group">
                    <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Plane className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 flex items-center">
                        Book Flights <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-gray-500 text-sm">Find the best deals on flights across our partners.</p>
                </Link>

                <Link to="/register" className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm hover:border-green-500 transition-colors group">
                    <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <User className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 flex items-center">
                        User Portal <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-gray-500 text-sm">Create an account to manage your bookings and profile.</p>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
