import React from 'react';
import { MapPin, Search } from 'lucide-react';

const FlightSearchForm = ({ searchParams, onSearch, onChange, loading }) => {
    return (
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center">
                <Search className="h-5 w-5 mr-2" /> Find Flights
            </h2>
            <form onSubmit={onSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        name="origin"
                        placeholder="Origin (e.g. DUB)"
                        value={searchParams.origin}
                        className="w-full pl-10 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        name="destination"
                        placeholder="Destination (e.g. LHR)"
                        value={searchParams.destination}
                        className="w-full pl-10 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        onChange={onChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>
        </div>
    );
};

export default FlightSearchForm;

