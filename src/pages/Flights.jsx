import React from 'react';
import { useTask } from '../useTask';
import { useAuth } from '../contexts/AuthContext';
import { useFlights } from '../hooks/useFlights';
import { useBookings } from '../hooks/useBookings';
import { useFlightBooking } from '../hooks/useFlightBooking';
import { useFlightSearch } from '../hooks/useFlightSearch';
import FlightSearchForm from '../components/FlightSearchForm';
import FlightsList from '../components/FlightsList';

const Flights = () => {
    const { loading, error } = useTask();
    const { user } = useAuth();
    const { flights, isLoadingFlights, searchFlights } = useFlights();
    const { bookings, setBookings } = useBookings(user);
    const { bookFlight } = useFlightBooking(bookings, setBookings);
    const { searchParams, handleChange, handleSearch } = useFlightSearch(searchFlights);

    return (
        <div className="space-y-8">
            <FlightSearchForm
                searchParams={searchParams}
                onSearch={handleSearch}
                onChange={handleChange}
                loading={loading}
            />

            {error && (
                <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <FlightsList
                flights={flights}
                isLoadingFlights={isLoadingFlights}
                onBookFlight={bookFlight}
            />
        </div>
    );
};

export default Flights;
