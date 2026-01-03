import React from 'react';

const DataTable = ({ 
    title, 
    icon: Icon, 
    iconColor = 'blue-600',
    count, 
    isLoading, 
    emptyState, 
    columns, 
    data, 
    renderRow 
}) => {
    // Map iconColor to actual Tailwind classes
    const getColorClass = (color) => {
        const colorMap = {
            'blue-600': 'text-blue-600',
            'green-600': 'text-green-600',
            'purple-600': 'text-purple-600',
        };
        return colorMap[color] || 'text-blue-600';
    };

    const titleColorClass = getColorClass(iconColor);

    return (
        <div>
            {title && (
                <h4 className={`text-lg font-bold mb-3 flex items-center ${titleColorClass}`}>
                    {Icon && <Icon className={`h-5 w-5 mr-2 ${titleColorClass}`} />}
                    {title} {count !== undefined && `(${count})`}
                </h4>
            )}
            {isLoading ? (
                <div className="bg-white p-8 border border-gray-200 rounded-lg text-center text-gray-500">
                    Loading...
                </div>
            ) : data.length === 0 ? (
                emptyState
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th 
                                            key={idx}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.map((item, idx) => renderRow(item, idx))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;

