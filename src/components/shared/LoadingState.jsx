import React from 'react';

const LoadingState = ({ message = 'Loading...' }) => {
    return (
        <div className="bg-white p-8 border border-gray-200 rounded-lg text-center text-gray-500">
            {message}
        </div>
    );
};

export default LoadingState;

