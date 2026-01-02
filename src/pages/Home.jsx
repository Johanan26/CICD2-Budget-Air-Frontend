import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, ArrowRight } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12 sm:py-24">
            <div className="text-center max-w-2xl px-4">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-blue-50 rounded-full">
                        <Plane className="h-12 w-12 text-blue-600" />
                    </div>
                </div>
                <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                    Fly <span className="text-blue-600">Budget</span>. Fly Smart.
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Experience the future of airline management. Built on a robust microservices architecture for speed, reliability, and scale.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        to="/flights"
                        className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Book a Flight <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                        to="/register"
                        className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-700 font-bold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Create Account
                    </Link>
                </div>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl px-4">
                <div className="text-center p-6 border border-gray-100 rounded-xl shadow-sm bg-white">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Task Orchestration</h3>
                    <p className="text-gray-500">All actions are handled asynchronously via our centralized Task Service.</p>
                </div>
                <div className="text-center p-6 border border-gray-100 rounded-xl shadow-sm bg-white">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Microservices</h3>
                    <p className="text-gray-500">Separate services for Users, Flights, and Payments for maximum isolation.</p>
                </div>
                <div className="text-center p-6 border border-gray-100 rounded-xl shadow-sm bg-white">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Payments</h3>
                    <p className="text-gray-500">Encrypted transaction processing with real-time status updates.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
