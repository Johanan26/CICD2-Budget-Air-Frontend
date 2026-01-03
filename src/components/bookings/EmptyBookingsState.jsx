import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane } from 'lucide-react';

const EmptyBookingsState = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white p-12 border border-gray-200 rounded-lg shadow-sm text-center">
            <Plane className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Bookings Yet</h3>
            <p className="text-gray-500 mb-6">Start by searching and booking a flight!</p>
            <button
                onClick={() => navigate('/flights')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
                Browse Flights
            </button>
        </div>
    );
};

export default EmptyBookingsState;

