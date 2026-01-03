import React from 'react';
import { Search, MapPin, Calendar } from 'lucide-react';

const FlightSearchForm = ({ searchParams, onSearch, onChange, loading }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Search Flights</h2>
            <form onSubmit={onSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="h-4 w-4 inline mr-1" />
                            Origin
                        </label>
                        <input
                            type="text"
                            name="origin"
                            value={searchParams.origin || ''}
                            onChange={onChange}
                            placeholder="e.g., Dublin"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="h-4 w-4 inline mr-1" />
                            Destination
                        </label>
                        <input
                            type="text"
                            name="destination"
                            value={searchParams.destination || ''}
                            onChange={onChange}
                            placeholder="e.g., London"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            Departure Date
                        </label>
                        <input
                            type="date"
                            name="departure_date"
                            value={searchParams.departure_date || ''}
                            onChange={onChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center justify-center"
                >
                    <Search className="h-5 w-5 mr-2" />
                    {loading ? 'Searching...' : 'Search Flights'}
                </button>
            </form>
        </div>
    );
};

export default FlightSearchForm;

