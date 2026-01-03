import React from 'react';

const AdminPageHeader = ({ title, description, children }) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                {description && (
                    <p className="text-gray-600 mt-1">{description}</p>
                )}
            </div>
            {children && <div className="flex space-x-2">{children}</div>}
        </div>
    );
};

export default AdminPageHeader;

