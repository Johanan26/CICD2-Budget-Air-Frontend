import React, { useEffect, useState } from 'react';
import FlightsList from '../components/FlightsList';
import { useFlightBooking } from '../hooks/useFlightBooking';
import { createTask, pollTask } from '../api';

const Flights = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const [searchFlights, setSearchFlights] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const [allFlights, setAllFlights] = useState([]);
  const [allLoading, setAllLoading] = useState(false);

  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { bookFlight } = useFlightBooking(bookings, setBookings);

  const loadAllFlights = async () => {
    setAllLoading(true);
    try {
      const taskId = await createTask('flight', 'api/flights', {}, 'GET');
      const result = await pollTask(taskId);

      if (result.status === 'success') {
        const data = result.result ?? result.data ?? [];
        setAllFlights(Array.isArray(data) ? data : []);
      } else {
        setAllFlights([]);
      }
    } catch {
      setAllFlights([]);
    } finally {
      setAllLoading(false);
    }
  };

  useEffect(() => {
    loadAllFlights();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    const o = origin.trim().toUpperCase();
    const d = destination.trim().toUpperCase();

    setSearchPerformed(true);
    setSearchLoading(true);

    try {
      const taskId = await createTask(
        'flight',
        `api/flights?origin=${encodeURIComponent(o)}&destination=${encodeURIComponent(d)}`,
        {},
        'GET'
      );

      const result = await pollTask(taskId);

      if (result.status === 'success') {
        const data = result.result ?? result.data ?? [];
        setSearchFlights(Array.isArray(data) ? data : []);
      } else {
        setSearchFlights([]);
      }
    } catch {
      setSearchFlights([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleBook = (flight, selection) => {
    bookFlight(flight, selection);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-2xl shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Find Flights</h1>

        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            id="origin"
            name="origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Origin (e.g. DUB)"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            id="destination"
            name="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destination (e.g. LHR)"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
            disabled={searchLoading}
          >
            Search
          </button>
        </form>
      </div>

      <FlightsList
        flights={searchFlights}
        loading={searchLoading}
        searchPerformed={searchPerformed}
        onBook={handleBook}
      />

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">All Flights</h2>
        <FlightsList
          flights={allFlights}
          loading={allLoading}
          searchPerformed={true}
          onBook={handleBook}
        />
      </div>
    </div>
  );
};

export default Flights;
