import React, { useState } from 'react';
import FlightsList from '../components/FlightsList';
import { useFlightBooking } from '../hooks/useFlightBooking';
import { createTask, pollTask } from '../api';

const Flights = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { bookFlight } = useFlightBooking(bookings, setBookings);

  const handleSearch = async (e) => {
    e.preventDefault();

    const o = origin.trim().toUpperCase();
    const d = destination.trim().toUpperCase();

    if (!o || !d) return;

    setLoading(true);
    setSearchPerformed(true);

    try {
      const task = await createTask('flight', 'api/flights/search', { origin: o, destination: d }, 'POST');
      const result = await pollTask(task.task_id);

      if (result.status === 'success') {
        const data = result.data ?? result.result ?? [];
        setFlights(Array.isArray(data) ? data : []);
      } else {
        setFlights([]);
      }
    } catch {
      setFlights([]);
    } finally {
      setLoading(false);
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
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Origin (e.g. DUB)"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destination (e.g. LHR)"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
            disabled={loading}
          >
            Search
          </button>
        </form>
      </div>

      <FlightsList flights={flights} loading={loading} searchPerformed={searchPerformed} onBook={handleBook} />
    </div>
  );
};

export default Flights;
