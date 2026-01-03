import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const ActionButtons = ({ onEdit, onDelete, editLabel = 'Edit', deleteLabel = 'Delete' }) => {
    return (
        <div className="flex space-x-2">
            {onEdit && (
                <button
                    onClick={onEdit}
                    className="text-blue-600 hover:text-blue-900 flex items-center"
                >
                    <Edit className="h-4 w-4 mr-1" />
                    {editLabel}
                </button>
            )}
            {onDelete && (
                <button
                    onClick={onDelete}
                    className="text-red-600 hover:text-red-900 flex items-center"
                >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {deleteLabel}
                </button>
            )}
        </div>
    );
};

export default ActionButtons;

