import React from 'react';

const EmptyState = ({ icon: Icon, message }) => {
    return (
        <div className="bg-white p-8 border border-gray-200 rounded-lg text-center">
            {Icon && <Icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />}
            <p className="text-gray-500">{message}</p>
        </div>
    );
};

export default EmptyState;

