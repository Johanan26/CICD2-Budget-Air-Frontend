import React from 'react';
import FlightCard from './FlightCard';

const FlightsList = ({ flights, isLoadingFlights, onBookFlight }) => {
    if (isLoadingFlights) {
        return <p className="text-center text-gray-500">Loading flights...</p>;
    }

    if (flights.length === 0) {
        return <p className="text-center text-gray-500">No flights found.</p>;
    }

    return (
        <div className="space-y-4">
            {flights.map((flight) => (
                <FlightCard 
                    key={flight.id || flight.flight_id} 
                    flight={flight} 
                    onBookFlight={onBookFlight}
                />
            ))}
        </div>
    );
};

export default FlightsList;

