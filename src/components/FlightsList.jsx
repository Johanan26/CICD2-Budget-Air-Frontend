import React from 'react';
import { Plane, MapPin, Clock, Calendar, Euro } from 'lucide-react';
import LoadingState from './shared/LoadingState';
import EmptyState from './shared/EmptyState';

const FlightsList = ({ flights, isLoadingFlights, onBookFlight }) => {
    if (isLoadingFlights) {
        return <LoadingState message="Loading flights..." />;
    }

    if (!flights || flights.length === 0) {
        return (
            <EmptyState 
                icon={Plane} 
                message="No flights found. Try adjusting your search criteria." 
            />
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
                Available Flights ({flights.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flights.map((flight) => (
                    <div
                        key={flight.id || flight.flight_id}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{flight.name}</h3>
                                <p className="text-sm text-gray-500">#{flight.flight_id}</p>
                            </div>
                            <Plane className="h-6 w-6 text-blue-600" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="font-semibold text-gray-900">{flight.origin}</span>
                                <span className="mx-2 text-gray-400">→</span>
                                <span className="font-semibold text-gray-900">{flight.destination}</span>
                            </div>

                            <div className="flex items-center text-sm text-gray-600">
                                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                <span>{flight.departure_time}</span>
                                {flight.arrival_time && (
                                    <>
                                        <span className="mx-2">-</span>
                                        <span>{flight.arrival_time}</span>
                                    </>
                                )}
                            </div>

                            {flight.departure_date && (
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                    <span>{flight.departure_date}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                <div className="flex items-center">
                                    <Euro className="h-5 w-5 mr-1 text-green-600" />
                                    <span className="text-xl font-bold text-green-600">
                                        {flight.price}
                                    </span>
                                </div>
                                <button
                                    onClick={() => onBookFlight(flight)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Book Now
                                </button>
                            </div>

                            {(flight.business_seats !== undefined || flight.economy_seats !== undefined) && (
                                <div className="text-xs text-gray-500 pt-2">
                                    {flight.business_seats > 0 && (
                                        <span>Business: {flight.business_seats} </span>
                                    )}
                                    {flight.economy_seats > 0 && (
                                        <span>Economy: {flight.economy_seats}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlightsList;

