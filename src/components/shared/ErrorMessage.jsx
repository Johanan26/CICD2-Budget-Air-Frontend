import React from 'react';

const ErrorMessage = ({ error }) => {
    if (!error) return null;
    
    return (
        <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg">
            {error}
        </div>
    );
};

export default ErrorMessage;

