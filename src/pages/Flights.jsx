import React, { useEffect, useState } from 'react';
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

  const loadFlights = async (o, d) => {
    const originVal = (o ?? '').trim().toUpperCase();
    const destVal = (d ?? '').trim().toUpperCase();

    const hasSearch = originVal !== '' || destVal !== '';
    setSearchPerformed(hasSearch);
    setLoading(true);

    try {
      const route =
        originVal && destVal
          ? `api/flights?origin=${encodeURIComponent(originVal)}&destination=${encodeURIComponent(destVal)}`
          : 'api/flights';

      const taskId = await createTask('flight', route, {}, 'GET');
      const result = await pollTask(taskId);

      if (result.status === 'success') {
        const data = result.result ?? result.data ?? [];
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

  useEffect(() => {
    loadFlights('', '');
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    await loadFlights(origin, destination);
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
