import React, { useMemo, useState } from 'react';
import { Plane, MapPin, Clock, Calendar, Euro } from 'lucide-react';
import LoadingState from './shared/LoadingState';
import EmptyState from './shared/EmptyState';

const getEconomyUnitPrice = (flight) => {
  const p = flight?.economy_price ?? flight?.price ?? 0;
  const n = Number(p);
  return Number.isFinite(n) ? n : 0;
};

const getBusinessUnitPrice = (flight) => {
  const explicit = flight?.business_price;
  if (explicit !== undefined && explicit !== null) {
    const n = Number(explicit);
    return Number.isFinite(n) ? n : 0;
  }
  return getEconomyUnitPrice(flight) * 1.8;
};

const formatMoney = (n) => {
  const num = Number(n);
  if (!Number.isFinite(num)) return '€0.00';
  return `€${num.toFixed(2)}`;
};

const FlightsList = ({
  flights,
  loading,
  searchPerformed,
  onBook,
}) => {
  const [seatSelections, setSeatSelections] = useState({});

  const sortedFlights = useMemo(() => {
    if (!Array.isArray(flights)) return [];
    return flights;
  }, [flights]);

  const getSelection = (flightId) => {
    const current = seatSelections[flightId];
    return current || { seatClass: 'economy', seatCount: 1 };
  };

  const setSelection = (flightId, patch) => {
    setSeatSelections((prev) => ({
      ...prev,
      [flightId]: { ...getSelection(flightId), ...patch },
    }));
  };

  const computeUnitPrice = (flight, seatClass) => {
    if (seatClass === 'business') return getBusinessUnitPrice(flight);
    return getEconomyUnitPrice(flight);
  };

  if (loading) {
    return <LoadingState message="Searching flights..." />;
  }

  if (sortedFlights.length === 0) {
    return searchPerformed ? (
      <EmptyState
        title="No flights found"
        description="Try adjusting your search criteria and search again."
      />
    ) : (
      <EmptyState
        title="No flights available"
        description="There are no flights to display right now."
      />
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedFlights.map((flight) => {
          const flightId = flight.flight_id ?? flight.id ?? `${flight.origin}-${flight.destination}-${flight.departure_date}-${flight.departure_time}`;
          const selection = getSelection(flightId);
          const unitPrice = computeUnitPrice(flight, selection.seatClass);
          const seatCount = Number(selection.seatCount || 1);
          const safeSeatCount = Number.isFinite(seatCount) && seatCount >= 1 ? seatCount : 1;
          const totalPrice = unitPrice * safeSeatCount;

          return (
            <div
              key={flightId}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-xl">
                      <Plane className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {flight.origin} → {flight.destination}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Flight ID: {flight.flight_id ?? flight.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-green-700 font-semibold">
                    <Euro className="w-4 h-4" />
                    <span>{formatMoney(totalPrice)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{flight.departure_date}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {flight.departure_time} → {flight.arrival_time}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{flight.origin_airport ?? 'Airport'}</span>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Seat Type
                      </label>
                      <select
                        value={selection.seatClass}
                        onChange={(e) => setSelection(flightId, { seatClass: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="economy">Economy</option>
                        <option value="business">Business</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        How many seats?
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={selection.seatCount}
                        onChange={(e) => setSelection(flightId, { seatCount: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1"
                      />
                    </div>

                    <div className="flex flex-col justify-end">
                      <div className="text-xs text-gray-600">
                        Unit price: <span className="font-semibold">{formatMoney(unitPrice)}</span>
                      </div>
                      <div className="text-sm text-gray-900">
                        Total: <span className="font-semibold">{formatMoney(totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onBook?.(flight, {
                      seatClass: selection.seatClass,
                      seatCount: safeSeatCount,
                      unitPrice,
                      totalPrice,
                    });
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
                >
                  Book Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlightsList;
