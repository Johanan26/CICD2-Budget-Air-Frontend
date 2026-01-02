import React from 'react';
import { Plane } from 'lucide-react';

const FlightCard = ({ flight, onBookFlight }) => {
    return (
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
                <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                    <Plane className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">
                        {flight.name} <span className="text-gray-400 font-normal text-sm">#{flight.flight_id}</span>
                    </h3>
                    <p className="text-gray-500 text-sm">Operated by Company Code: {flight.company_id}</p>
                </div>
            </div>

            <div className="flex items-center space-x-8 text-center">
                <div>
                    <p className="text-2xl font-bold">{flight.departure_time}</p>
                    <p className="text-gray-500 text-xs uppercase tracking-wider">{flight.origin}</p>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{flight.departure_date}</span>
                    <div className="h-px w-16 bg-gray-300 relative my-2">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
                <div>
                    <p className="text-2xl font-bold">{flight.arrival_time}</p>
                    <p className="text-gray-500 text-xs uppercase tracking-wider">{flight.destination}</p>
                </div>
            </div>

            <div className="text-right">
                <p className="text-3xl font-extrabold text-blue-600">€{flight.price}</p>
                <button 
                    onClick={() => onBookFlight(flight)}
                    className="mt-2 bg-gray-900 text-white px-6 py-2 rounded text-sm font-bold hover:bg-black transition-colors"
                >
                    Book Now
                </button>
            </div>
        </div>
    );
};

export default FlightCard;

